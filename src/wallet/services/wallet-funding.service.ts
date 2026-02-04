import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { WalletService } from './wallet.service';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from 'src/transaction/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { APIResponse } from 'src/common/responses/api-response';
import { Currency } from '../types';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WalletFundingService {
  constructor(
    private walletService: WalletService,
    private dataSource: DataSource,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async fund(
    userId: string,
    currency: Currency,
    amount: number,
    reference?: string,
  ) {
    if (amount <= 0) return APIResponse.failure('Amount must be positive');

    const wallet = await this.walletService.findOrCreateWallet(
      userId,
      currency,
    );

    const txReference =
      reference ||
      `FUND-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    try {
      return await this.dataSource.transaction(async (manager) => {
        wallet.balance = BigInt(amount) + BigInt(wallet.balance);
        await manager.save(wallet);

        const transaction = new Transaction();
        const user = await manager.findOne(User, { where: { id: userId } });
        transaction.user = user as User;
        transaction.type = TransactionType.FUND;
        transaction.reference = txReference;
        transaction.fromCurrency = null;
        transaction.toCurrency = currency;
        transaction.amount = amount;
        transaction.rate = 1;
        transaction.status = TransactionStatus.SUCCESS;

        await manager.save(transaction);

        return APIResponse.success(
          { balance: wallet.balance.toString(), currency: wallet.currency },
          'Wallet funded!',
        );
      });
    } catch (e) {
      const failedTx = new Transaction();
      failedTx.user = { id: userId } as User;
      failedTx.type = TransactionType.FUND;
      failedTx.reference = txReference;
      failedTx.fromCurrency = null;
      failedTx.toCurrency = currency;
      failedTx.amount = amount;
      failedTx.rate = 1;
      failedTx.status = TransactionStatus.FAILED;

      await this.transactionRepository.save(failedTx);

      console.log(e);
      return APIResponse.failure('transaction could not be completed');
    }
  }
}
