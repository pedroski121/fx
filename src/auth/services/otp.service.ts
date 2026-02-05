import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OTP } from '../entities/otp.entity';
import { APIResponse } from 'src/common/responses/api-response';
import { User } from 'src/users/user.entity';

@Injectable()
export class OtpService {
  private readonly otpExpiration = 10 * 60 * 1000;

  constructor(
    @InjectRepository(OTP) private readonly otpRepository: Repository<OTP>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createOtp(userId: string, email: string): Promise<string> {
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + this.otpExpiration);

    await this.otpRepository.save(
      this.otpRepository.create({ userId, email, code: otp, expiresAt }),
    );

    return otp;
  }

  async verifyOtp(email: string, code: string) {
    const otpRecord = await this.otpRepository.findOne({
      where: { email, code, isUsed: false },
    });

    if (!otpRecord) {
      throw new BadRequestException(APIResponse.failure('Invalid OTP'));
    }

    if (otpRecord.expiresAt < new Date()) {
      await this.otpRepository.delete(otpRecord.id);
      throw new UnauthorizedException(APIResponse.failure('OTP expired'));
    }
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException(APIResponse.failure('User not found'));
    }

    otpRecord.isUsed = true;
    user.isVerified = true;

    await this.userRepository.save(user);
    await this.otpRepository.save(otpRecord);
    return APIResponse.success('OTP verified successfully');
  }
}
