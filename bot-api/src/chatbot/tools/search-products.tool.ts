import { Injectable } from '@nestjs/common';
import { CsvService } from '../../csv/csv.service';

interface Product {
  id: string;
  name: string;
  price: number;
}

@Injectable()
export class SearchProductsTool {
  constructor(private readonly csvService: CsvService) {}

  async execute(query: string): Promise<Product[]> {
    const products = await this.csvService.read<Product>('products_list.csv');

    return products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()),
    );
  }
}
