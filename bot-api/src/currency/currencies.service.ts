import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';

interface ICurrencyResponse {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: string;
  rates: Record<string, number>;
}

@Injectable()
export class CurrencyService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getCurrencies(
    base: string = 'USD',
  ): Promise<ICurrencyResponse | undefined> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<ICurrencyResponse>(
          'https://openexchangerates.org/api/latest.json',
          {
            params: {
              app_id: this.configService.get<string>('CURRENCY_API_KEY') ?? '',
              base: base.toUpperCase(),
            },
          },
        ),
      );
      return data;
    } catch (error: unknown) {
      const err = error as AxiosError;
      throw new Error(`error openexchangerates ${err.message}`);
    }
  }
}
