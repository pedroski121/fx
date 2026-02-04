import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletService } from './services/wallet.service';
import { WalletController } from './wallet.controller';
import { Transaction } from 'src/transaction/transaction.entity';
import { WalletFundingService } from './services/wallet-funding.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
  controllers: [WalletController],
  providers: [WalletService, WalletFundingService],
})
export class WalletModule {}
