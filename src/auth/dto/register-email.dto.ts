import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterEmailDTO {
  @IsEmail()
  email: string;

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
