import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterEmailDTO } from './dto/register-email.dto';
import { PasswordService } from './services/password.service';
import { MailService } from './services/mail.service';
import { OtpService } from './services/otp.service';
import { APIResponse } from 'src/common/responses/api-response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly passwordService: PasswordService,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
  ) {}

  async registerWithEmail(dto: RegisterEmailDTO) {
    const { email, password } = dto;

    const existing = await this.userRepository.findOne({ where: { email } });

    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      isVerified: false,
    });

    await this.userRepository.save(user);

    const otp = await this.otpService.createOtp(user.id, email);
    await this.mailService.sendOtp(email, otp);

    return APIResponse.success(`User registered. OTP sent to ${email}`);
  }
}
