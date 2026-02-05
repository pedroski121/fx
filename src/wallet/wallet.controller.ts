import { Controller, Body, Post, Get, Param, Req } from '@nestjs/common';
import { WalletService } from './services/wallet.service';
import {
  FundWalletDTO,
  FundWalletResponseDTO,
  WalletListResponseDTO,
  WalletResponseDTO,
  WalletTradeResponseDTO,
} from './fund-wallet.dto';
import { WalletFundingService } from './services/wallet-funding.service';
import { Currency } from './types';
import {
  ConvertCurrencyDTO,
  ConvertCurrencyResponseDTO,
} from 'src/fx/dto/convert-currency.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { FailureResponseDTO } from 'src/common/responses/api-response.dto';
import { FxService } from 'src/fx/fx.service';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(
    private walletService: WalletService,
    private walletFundingService: WalletFundingService,
    private fxService: FxService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all user wallets available' })
  @ApiResponse({
    status: 200,
    description: 'User wallets',
    type: WalletListResponseDTO,
  })
  async getWallets(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.walletService.getUserWallets(userId);
  }

  @Post('convert')
  @ApiOperation({ summary: 'Convert between currencies' })
  @ApiResponse({
    status: 200,
    description: 'Converted currencies',
    type: ConvertCurrencyResponseDTO,
  })
  async getConvertedValues(
    @Req() req: RequestWithUser,
    @Body() convertDTO: ConvertCurrencyDTO,
  ) {
    return this.fxService.convert(
      convertDTO.amount,
      convertDTO.fromCurrency,
      convertDTO.toCurrency,
    );
  }

  @Get(':currency')
  @ApiOperation({ summary: 'Get single user wallet' })
  @ApiQuery({
    name: 'currency',
    enum: Currency,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'User wallets',
    type: WalletResponseDTO,
  })
  async getWallet(
    @Req() req: RequestWithUser,
    @Param('currency') currency: Currency,
  ) {
    const userId = req.user.id;
    return this.walletService.getUserWallet(userId, currency);
  }

  @Post('fund')
  @ApiOperation({
    summary:
      'Fund multiple currency wallets in their smallest unit(kobo, cents, etc)',
  })
  @ApiResponse({
    status: 200,
    description: 'Fund wallet response',
    type: FundWalletResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Wallet not funded',
    type: FailureResponseDTO,
  })
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

  @Post('trade')
  @ApiOperation({
    summary: 'Transfer money from one account type to another',
  })
  @ApiResponse({
    status: 200,
    description: 'Transfer response',
    type: WalletTradeResponseDTO,
  })
  async tradeCurrency(
    @Req() req: RequestWithUser,
    @Body() convertDTO: ConvertCurrencyDTO,
  ) {
    const userId = req.user.id;

    return this.walletService.trade(
      userId,
      convertDTO.fromCurrency,
      convertDTO.toCurrency,
      convertDTO.amount,
    );
  }
}
