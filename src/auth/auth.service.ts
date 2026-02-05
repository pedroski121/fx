import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterDTO } from './auth.dto';
import { PasswordService } from './services/password.service';
import { MailService } from './services/mail.service';
import { OtpService } from './services/otp.service';
import { APIResponse } from 'src/common/responses/api-response';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
  ) {}

  async registerWithEmail(dto: RegisterDTO) {
    const { email, password } = dto;

    const existing = await this.userRepository.findOne({ where: { email } });

    if (existing) {
      throw new BadRequestException(APIResponse.failure('Invalid credentials'));
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

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'isVerified'],
    });

    if (!user) {
      throw new UnauthorizedException(
        APIResponse.failure('Invalid credentials'),
      );
    }
    const hashedPassword = await this.passwordService.hashPassword(password);
    const isPasswordValid = await this.passwordService.comparePassword(
      password,
      hashedPassword,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        APIResponse.failure('Invalid credentials'),
      );
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        APIResponse.failure('Please verify your email before logging in'),
      );
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return APIResponse.success(
      {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
        },
      },
      'Login successful',
    );
  }
}
