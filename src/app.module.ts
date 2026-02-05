import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { OTP } from './auth/entities/otp.entity';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { Wallet } from './wallet/entities/wallet.entity';
import { Transaction } from './transaction/transaction.entity';
import { TransactionModule } from './transaction/transaction.module';
import { FXModule } from './fx/fx.module';
import { UserModule } from './users/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, OTP, Wallet, Transaction],
        synchronize: configService.get('DB_SYNCHRONIZE') || false,
        logging: false,
        ssl:
          configService.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    WalletModule,
    TransactionModule,
    FXModule,
  ],
  providers: [],
})
export class AppModule {}
