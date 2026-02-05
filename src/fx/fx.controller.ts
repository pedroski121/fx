import { Body, Controller, Get, Param, Request } from '@nestjs/common';
import { FxService } from './fx.service';

@Controller('fx')
export class FXController {
  constructor(private readonly fxService: FxService) {}

  @Get('rates/:currency')
  async getExchangeRates(@Param('currency') currency: string) {
    return await this.fxService.getRates(currency);
  }
}
