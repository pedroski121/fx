import { Controller, Body, Request, Post, Get, Param } from '@nestjs/common';
import { WalletService } from './services/wallet.service';
import { FundWalletDTO } from './dto/fund-wallet.dto';
import { WalletFundingService } from './services/wallet-funding.service';
import { Currency } from './types';

@Controller('wallet')
export class WalletController {
  constructor(
    private walletService: WalletService,
    private walletFundingService: WalletFundingService,
  ) {}

  @Get()
  async getWallets() {
    // const userId = req.user.id;
    const userId = '9727a199-b92c-42a7-b03b-94c3e92af258';
    return await this.walletService.getUserWallets(userId);
  }

  @Get(':currency')
  async getWallet(@Request() req, @Param('currency') currency: Currency) {
    // const userId = req.user.id;
    const userId = '9727a199-b92c-42a7-b03b-94c3e92af258';
    return await this.walletService.getUserWallet(userId, currency);
  }

  @Post('fund')
  async fundWallet(@Request() req, @Body() fundDTO: FundWalletDTO) {
    const userId = '9727a199-b92c-42a7-b03b-94c3e92af258';

    return await this.walletFundingService.fund(
      userId,
      fundDTO.currency,
      fundDTO.amount,
      fundDTO.reference,
    );
  }
}
