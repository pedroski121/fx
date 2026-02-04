import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { OTP } from './entities/otp.entity';
import { PasswordService } from './services/password.service';
import { MailService } from './services/mail.service';
import { OtpService } from './services/otp.service';
import { Wallet } from 'src/wallet/entities/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, OTP, Wallet])],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, MailService, OtpService],
})
export class AuthModule {}
