import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { FXResponsePairConversion, FXResponseRates } from './types';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Currency } from 'src/wallet/types';
import { APIResponse } from 'src/common/responses/api-response';

@Injectable()
export class FxService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private ratesCache: Map<string, { rate: number; timestamp: Date }> =
    new Map();

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private configService: ConfigService) {
    this.apiUrl = 'https://v6.exchangerate-api.com/v6';
    this.apiKey = this.configService.get('FX_API_KEY') || '';
  }

  async getRate(fromCurrency: string, toCurrency: string): Promise<number> {
    // Same currency = rate is 1
    if (fromCurrency === toCurrency) {
      return 1;
    }

    const cacheKey = `${fromCurrency}_${toCurrency}`;

    // check cache
    const cached = this.ratesCache.get(cacheKey);
    if (
      cached &&
      Date.now() - cached.timestamp.getTime() < this.CACHE_DURATION
    ) {
      return cached.rate;
    }
    try {
      const response = await axios.get<FXResponsePairConversion>(
        `${this.apiUrl}/${this.apiKey}/pair/${fromCurrency}/${toCurrency}`,
      );

      if (response.data.result !== 'success') {
        throw new Error('Failed to fetch exchange rate');
      }

      const rate = response.data.conversion_rate;

      this.ratesCache.set(cacheKey, {
        rate,
        timestamp: new Date(),
      });
      return rate;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Unable to fetch exchange rates. Please try again later',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async convert(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ): Promise<{ convertedAmount: number; rate: number }> {
    const rate = await this.getRate(fromCurrency, toCurrency);
    const convertedAmount = amount * rate;

    return {
      convertedAmount: Math.round(convertedAmount * 100) / 100,
      rate,
    };
  }

  async getRates(
    baseCurrency: string,
  ): Promise<APIResponse<Record<string, number>>> {
    try {
      const response = await axios.get<FXResponseRates>(
        `${this.apiUrl}/${this.apiKey}/latest/${baseCurrency}`,
      );
      if (response.data.result !== 'success') {
        throw new Error('Failed to fetch exchange rates');
      }

      const allRates = response.data.conversion_rates;

      const allowedCurrencies = Object.values(Currency);

      const filteredRates: Partial<Record<Currency, number>> = {};

      for (const currency of allowedCurrencies) {
        if (allRates[currency] !== undefined) {
          filteredRates[currency] = allRates[currency];
        }
      }

      return APIResponse.success(filteredRates);
    } catch (e) {
      console.log(e);
      throw new HttpException(
        APIResponse.failure('Unable to fetch exchange rates'),
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
