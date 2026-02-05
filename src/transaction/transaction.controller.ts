import { Controller, Get, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionResponseDTO } from './transaction.dto';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user transactions' })
  @ApiResponse({
    status: 200,
    description: 'User transactions',
    type: TransactionResponseDTO,
  })
  async getUserTransactions(@Req() req: RequestWithUser) {
    const userId = req.user.id;

    const transactions = await this.transactionService.getTransactions(userId);

    return transactions;
  }
}
