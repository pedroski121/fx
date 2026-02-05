// dto/convert-currency.dto.ts
import { IsNumber, IsPositive, IsEnum } from 'class-validator';
import { Currency } from 'src/wallet/types';

export class ConvertCurrencyDTO {
  @IsEnum(Currency)
  fromCurrency: Currency;

  @IsEnum(Currency)
  toCurrency: Currency;

  @IsNumber()
  @IsPositive()
  amount: number;
}
