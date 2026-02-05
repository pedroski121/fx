import { Controller, Body, Post, Get, Param, Req } from '@nestjs/common';
import { WalletService } from './services/wallet.service';
import { FundWalletDTO } from './dto/fund-wallet.dto';
import { WalletFundingService } from './services/wallet-funding.service';
import { Currency } from './types';
import { ConvertCurrencyDTO } from 'src/fx/dto/convert-currency.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(
    private walletService: WalletService,
    private walletFundingService: WalletFundingService,
  ) {}

  @Get()
  async getWallets(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.walletService.getUserWallets(userId);
  }

  @Get(':currency')
  async getWallet(
    @Req() req: RequestWithUser,
    @Param('currency') currency: Currency,
  ) {
    const userId = req.user.id;
    return this.walletService.getUserWallet(userId, currency);
  }

  @Post('fund')
  async fundWallet(
    @Req() req: RequestWithUser,
    @Body() fundDTO: FundWalletDTO,
  ) {
    const userId = req.user.id;

    return this.walletFundingService.fund(
      userId,
      fundDTO.currency,
      fundDTO.amount,
      fundDTO.reference,
    );
  }

  @Post('convert')
  async convertCurrency(
    @Req() req: RequestWithUser,
    @Body() convertDTO: ConvertCurrencyDTO,
  ) {
    const userId = req.user.id;

    return this.walletService.convert(
      userId,
      convertDTO.fromCurrency,
      convertDTO.toCurrency,
      convertDTO.amount,
    );
  }
}
