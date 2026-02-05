// dto/convert-currency.dto.ts
import { IsNumber, IsPositive, IsEnum } from 'class-validator';
import { Currency } from 'src/wallet/types';
import { BaseResponseDTO } from 'src/common/responses/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ConvertCurrencyDTO {
  @ApiProperty({
    description: 'Currency to convert from',
    enum: Currency,
    example: Currency.NGN,
  })
  @IsEnum(Currency)
  fromCurrency: Currency;

  @ApiProperty({
    description: 'Currency to convert to',
    enum: Currency,
    example: Currency.USD,
  })
  @IsEnum(Currency)
  toCurrency: Currency;

  @ApiProperty({
    description: 'Amount to convert in minor units (kobo/cents)',
    example: 27582,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}

export class ConvertCurrencyResponseDTO {
  @ApiProperty({ example: 123, enum: Currency })
  @IsNumber()
  convertedAmount: number;

  @ApiProperty({ example: 12.2, enum: Currency })
  @IsNumber()
  rate: number;
}

export class FxRatesResponseDTO extends BaseResponseDTO<
  Record<string, number>
> {
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'number', example: 1379.1175 },
    description: 'Exchange rates relative to a base currency',
  })
  data: Record<string, number>;
}
