import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { TransactionResponseDTO } from './transaction.dto';
import { ApiResponse } from '@nestjs/swagger';
import { APIResponse } from 'src/common/responses/api-response';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'User transactions',
    type: TransactionResponseDTO,
  })
  async getTransactions(userId: string) {
    const transactions = await this.transactionRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
    return APIResponse.success(transactions, 'User transactions');
  }
}
