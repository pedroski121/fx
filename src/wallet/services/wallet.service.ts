import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { Currency } from '../types';
import { User } from 'src/users/user.entity';
import { APIResponse } from 'src/common/responses/api-response';
import { FxService } from 'src/fx/fx.service';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from 'src/transaction/transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,

    @InjectRepository(Transaction)
    private transaction: Repository<Transaction>,

    private fxService: FxService,
    private dataSource: DataSource,
  ) {}

  async getUserWallets(userId: string) {
    const wallets = await this.walletRepo.find({
      where: { user: { id: userId } },
      select: ['id', 'currency', 'balance'],
    });
    return APIResponse.success(wallets, 'User wallets');
  }

  async getUserWallet(userId: string, currency: Currency) {
    const wallets = await this.walletRepo.findOne({
      where: { user: { id: userId }, currency },
      select: ['id', 'currency', 'balance'],
    });
    return APIResponse.success(wallets, 'User wallet');
  }

  async findOrCreateWallet(userId: string, currency: Currency) {
    let wallet = await this.walletRepo.findOne({
      where: { user: { id: userId }, currency },
    });

    if (!wallet) {
      wallet = this.walletRepo.create({
        user: { id: userId } as User,
        currency,
        balance: BigInt(0),
      });
      await this.walletRepo.save(wallet);
    }
    return wallet;
  }

  async getBalance(userId: string, currency: Currency) {
    const wallet = await this.walletRepo.findOne({
      where: { user: { id: userId } as User, currency },
    });
    return { balance: wallet?.balance.toString() || '0', currency };
  }

  async trade(
    userId: string,
    fromCurrency: Currency,
    toCurrency: Currency,
    amount: number,
  ) {
    if (amount <= 0) {
      throw new ForbiddenException(
        APIResponse.failure('Amount must be positive'),
      );
    }

    if (fromCurrency === toCurrency) {
      throw new ForbiddenException(
        APIResponse.failure('Cannot convert to same currency'),
      );
    }

    // Check sufficient balance
    const sourceWallet = await this.findOrCreateWallet(userId, fromCurrency);
    if (Number(sourceWallet.balance) < amount) {
      throw new ForbiddenException(
        APIResponse.failure(
          `Insufficient ${fromCurrency} balance. Available: ${sourceWallet.balance}`,
        ),
      );
    }

    const { convertedAmount, rate } = await this.fxService.convert(
      amount / 100,
      fromCurrency,
      toCurrency,
    );

    const destWallet = await this.findOrCreateWallet(userId, toCurrency);

    const reference = `CONVERT-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    try {
      return await this.dataSource.transaction(async (manager) => {
        const scale = 2;
        const amountMinor = BigInt(amount); //already in lowest unit
        const convertedAmountMinor = BigInt(
          Math.round(convertedAmount * 10 ** scale),
        );

        // Deduct from source wallet
        sourceWallet.balance = BigInt(sourceWallet.balance) - amountMinor;
        await manager.save(sourceWallet);

        // Add to destination wallet
        destWallet.balance = BigInt(destWallet.balance) + convertedAmountMinor;
        await manager.save(destWallet);

        // Record transaction
        const transaction = new Transaction();
        transaction.user = { id: userId } as User;
        transaction.type = TransactionType.CONVERT;
        transaction.reference = reference;
        transaction.fromCurrency = fromCurrency;
        transaction.toCurrency = toCurrency;
        transaction.amount = amount;
        transaction.rate = rate;
        transaction.status = TransactionStatus.SUCCESS;

        await manager.save(transaction);

        return APIResponse.success(
          {
            fromCurrency,
            toCurrency,
            amountConverted: amount,
            amountReceived: convertedAmount,
            rate,
            sourceBalance: sourceWallet.balance.toString(),
            destBalance: destWallet.balance.toString(),
            transaction,
          },
          'Currency converted successfully',
        );
      });
    } catch (e) {
      console.log(e);
      const failedTx = new Transaction();
      failedTx.user = { id: userId } as User;
      failedTx.type = TransactionType.CONVERT;
      failedTx.reference = reference;
      failedTx.fromCurrency = null;
      failedTx.toCurrency = toCurrency;
      failedTx.fromCurrency = fromCurrency;
      failedTx.amount = amount;
      failedTx.rate = 1;
      failedTx.status = TransactionStatus.FAILED;

      await this.transaction.save(failedTx);

      throw new BadRequestException(
        APIResponse.failure('Transaction could not be completed'),
      );
    }
  }
}
