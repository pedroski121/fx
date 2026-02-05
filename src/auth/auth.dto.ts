import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches, Length } from 'class-validator';

export class LoginDTO {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(6)
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain a lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain an uppercase letter',
  })
  @Matches(/(?=.*\d)/, { message: 'Password must contain a number' })
  @Matches(/(?=.*[\W_])/, {
    message: 'Password must contain a special character',
  })
  password: string;
}

export class RegisterDTO {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(6)
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain a lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain an uppercase letter',
  })
  @Matches(/(?=.*\d)/, { message: 'Password must contain a number' })
  @Matches(/(?=.*[\W_])/, {
    message: 'Password must contain a special character',
  })
  password: string;
}

export class VerifyOtpDTO {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123467', description: 'User password' })
  @IsString()
  @Length(6, 6)
  otp: string;
}

// Logged In User Expected Successful Response
export class LoginUserDTO {
  @ApiProperty({ example: 'e29042c3-abe4-4486-8c7b-35d4cf1f2a2e' })
  id: string;

  @ApiProperty({ example: 'obipedrochinomso@gmail.com' })
  email: string;
}

export class LoginDataDTO {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({ type: LoginUserDTO })
  user: LoginUserDTO;
}

export class LoginSuccessResponseDTO {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Login successful' })
  message: string;

  @ApiProperty({ type: LoginDataDTO })
  data: LoginDataDTO;

  @ApiProperty({
    example: '2026-02-05T09:23:38.719Z',
  })
  timestamp: string;
}

// Logged in User unauthorized

export class LoginFailureResponseDTO {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Invalid Credentials' })
  message: string;

  @ApiProperty({
    example: '2026-02-05T09:23:38.719Z',
  })
  timestamp: string;
}

// Registered User Expected Successful Response

export class RegisterSuccessResponseDTO {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'User registered' })
  data: string;

  @ApiProperty({ example: '2026-02-05T09:23:38.719Z' })
  timestamp: string;
}

// Logged in User unauthorized

export class RegisterFailureResponseDTO {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Invalid Credentials' })
  message: string;

  @ApiProperty({
    example: '2026-02-05T09:23:38.719Z',
  })
  timestamp: string;
}

export class VerifySuccessResponseDTO {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'User verified' })
  data: string;

  @ApiProperty({ example: '2026-02-05T09:23:38.719Z' })
  timestamp: string;
}
