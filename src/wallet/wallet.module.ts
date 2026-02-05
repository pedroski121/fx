import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletService } from './services/wallet.service';
import { WalletController } from './wallet.controller';
import { Transaction } from 'src/transaction/transaction.entity';
import { WalletFundingService } from './services/wallet-funding.service';
import { FxService } from 'src/fx/fx.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Wallet, Transaction])],
  controllers: [WalletController],
  providers: [WalletService, WalletFundingService, FxService],
})
export class WalletModule {}
