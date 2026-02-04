import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { Currency } from '../types';
import { User } from 'src/users/entities/user.entity';
import { APIResponse } from 'src/common/responses/api-response';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
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
}
