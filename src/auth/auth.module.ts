import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { OTP } from './entities/otp.entity';
import { PasswordService } from './services/password.service';
import { MailService } from './services/mail.service';
import { OtpService } from './services/otp.service';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from 'src/users/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OTP, Wallet]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'secret',
        signOptions: {
          expiresIn: configService.get<number>('JWT_EXPIRATION') || 36000,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    MailService,
    OtpService,
    JwtStrategy,
    UserService,
  ],
  exports: [AuthService, JwtModule, JwtStrategy],
})
export class AuthModule {}
