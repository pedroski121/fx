import { Controller, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { APIResponse } from 'src/common/responses/api-response';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getUserTransactions() {
    const userId = '9727a199-b92c-42a7-b03b-94c3e92af258';

    const transactions = await this.transactionService.getTransactions(userId);

    return APIResponse.success(
      transactions,
      'Transactions fetched successfully',
    );
  }
}
