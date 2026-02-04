import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterEmailDTO } from './dto/register-email.dto';
import { VerifyOtpDTO } from './dto/verify-otp.dto';
import { OtpService } from './services/otp.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Post('register')
  async registerEmail(@Body() dto: RegisterEmailDTO) {
    return this.authService.registerWithEmail(dto);
  }

  @Post('verify')
  async verifyOtp(@Body() dto: VerifyOtpDTO) {
    const { email, otp } = dto;
    return this.otpService.verifyOtp(email, otp);
  }
}
