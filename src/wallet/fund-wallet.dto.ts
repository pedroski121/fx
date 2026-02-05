import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsEnum,
} from 'class-validator';
import { Currency } from './types';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDTO } from 'src/common/responses/api-response.dto';
import {
  TransactionStatus,
  TransactionType,
} from 'src/transaction/transaction.entity';

export class FundWalletDTO {
  @ApiProperty({ example: 'USD', enum: Currency })
  @IsString()
  @IsEnum(Currency, {
    message: () =>
      `currency must be one of: ${Object.values(Currency).join(', ')}`,
  })
  currency: Currency;

  @ApiProperty({
    example: 12121236,
    description: 'Balance in minor units (kobo, cents)',
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'Unique reference string' })
  @IsOptional()
  @IsString()
  reference?: string;
}

export class WalletDTO {
  @ApiProperty({ example: 'c70362d3-a164-4b26-9e02-9a4454097a10' })
  id: string;

  @ApiProperty({ example: 'NGN', enum: Currency })
  currency: string;

  @ApiProperty({
    example: '12121236',
    description: 'Balance in minor units (kobo, cents)',
  })
  balance: string;
}

export class FundWallet {
  @ApiProperty({ example: '12344' })
  balance: string;

  @ApiProperty({ example: 'NGN', enum: Currency })
  currency: string;
}

export class FundWalletResponseDTO extends BaseResponseDTO<FundWallet> {
  @ApiProperty({ type: FundWallet })
  data: FundWallet;
}

export class WalletListResponseDTO extends BaseResponseDTO<WalletDTO[]> {
  @ApiProperty({ type: [WalletDTO] })
  data: WalletDTO[];
}

export class WalletResponseDTO extends BaseResponseDTO<WalletDTO> {
  @ApiProperty({ type: WalletDTO })
  data: WalletDTO;
}

export class TransactionDTO {
  @ApiProperty({ example: 'e29042c3-abe4-4486-8c7b-35d4cf1f2a2e' })
  id: string;

  @ApiProperty({ type: String, example: 'CONVERT' })
  type: TransactionType;

  @ApiProperty({ example: 'CONVERT-1770291792162-qjbatq' })
  reference: string;

  @ApiProperty({ example: 'NGN' })
  fromCurrency: string;

  @ApiProperty({ example: 'USD' })
  toCurrency: string;

  @ApiProperty({ example: 27582 })
  amount: number;

  @ApiProperty({ example: 0.00072511 })
  rate: number;

  @ApiProperty({ enum: TransactionStatus, example: TransactionStatus.SUCCESS })
  status: TransactionStatus;

  @ApiProperty({
    type: Object,
    example: { id: 'e29042c3-abe4-4486-8c7b-35d4cf1f2a2e' },
  })
  user: { id: string };

  @ApiProperty({ example: '2026-02-05T11:43:12.163Z' })
  createdAt: string;
}

export class ConversionDataDTO {
  @ApiProperty({ example: 'NGN' })
  fromCurrency: string;

  @ApiProperty({ example: 'USD' })
  toCurrency: string;

  @ApiProperty({
    example: 27582,
    description: 'Amount deducted from source wallet (minor units)',
  })
  amountConverted: number;

  @ApiProperty({
    example: 0.2,
    description: 'Amount received in destination currency (major units)',
  })
  amountReceived: number;

  @ApiProperty({ example: 0.00072511 })
  rate: number;

  @ApiProperty({
    example: '12121236',
    description: 'Source wallet balance after conversion',
  })
  sourceBalance: string;

  @ApiProperty({
    example: '10000',
    description: 'Destination wallet balance after conversion',
  })
  destBalance: string;

  @ApiProperty({ type: TransactionDTO })
  transaction: TransactionDTO;
}

export class WalletTradeResponseDTO extends BaseResponseDTO<ConversionDataDTO> {
  @ApiProperty({ type: ConversionDataDTO })
  data: ConversionDataDTO;
}
