import { BadRequestException, Injectable } from '@nestjs/common';
import { CsvService } from '../../csv/csv.service';

interface Currency {
  currency: string;
  rate: number;
}

@Injectable()
export class ConvertCurrenciesTool {
  constructor(private readonly csvService: CsvService) {}

  async execute(amount: number, from: string, to: string): Promise<number> {
    const currencies =
      await this.csvService.read<Currency>('products_list.csv');

    const rates = new Map(
      currencies.map((currency) => [currency.currency, Number(currency.rate)]),
    );

    if (!rates.has(from)) {
      throw new BadRequestException(`Currency "${from}" is not supported.`);
    }

    if (!rates.has(to)) {
      throw new BadRequestException(`Currency "${to}" is not supported.`);
    }

    const usd = amount / rates.get(from)!;

    return usd * rates.get(to)!;
  }
}
