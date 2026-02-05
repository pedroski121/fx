import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDTO,
  VerifyOtpDTO,
  LoginDTO,
  LoginSuccessResponseDTO,
  LoginFailureResponseDTO,
  RegisterSuccessResponseDTO,
  RegisterFailureResponseDTO,
  VerifySuccessResponseDTO,
} from './auth.dto';
import { OtpService } from './services/otp.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Create a new user with email and password' })
  @ApiResponse({
    status: 201,
    description: 'User registed successfully',
    type: RegisterSuccessResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'User registration failed',
    type: RegisterFailureResponseDTO,
  })
  async registerEmail(@Body() dto: RegisterDTO) {
    return this.authService.registerWithEmail(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user with email and password' })
  @ApiResponse({
    status: 201,
    description: 'User logged in successfully.',
    type: LoginSuccessResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'User could not log in',
    type: LoginFailureResponseDTO,
  })
  async login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO.email, loginDTO.password);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify user email address.' })
  @ApiResponse({
    status: 201,
    description: 'Successful Verification',
    type: VerifySuccessResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
    type: LoginFailureResponseDTO,
  })
  async verifyOtp(@Body() dto: VerifyOtpDTO) {
    const { email, otp } = dto;
    return this.otpService.verifyOtp(email, otp);
  }
}
