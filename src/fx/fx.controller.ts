import { Body, Controller, Get, Param, Request } from '@nestjs/common';
import { FxService } from './fx.service';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { FxRatesResponseDTO } from './dto/convert-currency.dto';

@Controller('fx')
export class FXController {
  constructor(private readonly fxService: FxService) {}

  @Get('rates/:currency')
  @ApiOperation({ summary: 'Get currency rates for supported pairs' })
  @ApiResponse({ status: 200, type: FxRatesResponseDTO })
  async getExchangeRates(@Param('currency') currency: string) {
    return await this.fxService.getRates(currency);
  }
}
