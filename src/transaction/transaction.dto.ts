import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from 'src/wallet/types';
import { TransactionStatus } from './transaction.entity';

export class TransactionDTO {
  @ApiProperty({ example: 'f040e841-abda-4ab2-bc44-183e4786e79c' })
  id: string;

  @ApiProperty({ enum: TransactionType, example: TransactionType.CREDIT })
  type: TransactionType;

  @ApiProperty({ example: 'CONVERT-1770291792162-qjbatq' })
  reference: string;

  @ApiProperty({ example: 'NGN', nullable: true })
  fromCurrency?: string;

  @ApiProperty({ example: 'USD', nullable: true })
  toCurrency?: string;

  @ApiProperty({ example: '27582' })
  amount: string;

  @ApiProperty({ example: '0.000725' })
  rate: string;

  @ApiProperty({ enum: TransactionStatus, example: TransactionStatus.SUCCESS })
  status: TransactionStatus;

  @ApiProperty({ example: '2026-02-05T11:43:12.163Z' })
  createdAt: Date;
}

export class TransactionResponseDTO {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'User transactions' })
  message: string;

  @ApiProperty({ type: [TransactionDTO] })
  data: TransactionDTO[];

  @ApiProperty({ example: '2026-02-05T12:52:37.660Z' })
  timestamp: Date;
}
