import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsEnum,
} from 'class-validator';
import { Currency } from '../types';

export class FundWalletDTO {
  @IsString()
  @IsEnum(Currency, {
    message: () =>
      `currency must be one of: ${Object.values(Currency).join(', ')}`,
  })
  currency: Currency;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  reference?: string;
}
