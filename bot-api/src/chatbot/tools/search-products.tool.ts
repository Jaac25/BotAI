import { Injectable, Logger } from '@nestjs/common';
import { ChatCompletionTool } from 'openai/resources';
import { IProduct } from '../../core/types/products';
import { CsvService } from '../../csv/csv.service';
import { AxiosError } from 'axios';

@Injectable()
export class SearchProductsTool {
  private readonly logger = new Logger(SearchProductsTool.name);

  constructor(private readonly csvService: CsvService) {}

  async execute({ query }: { query: string }): Promise<IProduct[]> {
    try {
      //The products list csv is read
      const products =
        await this.csvService.read<IProduct>('products_list.csv');

      //The product list is filter by the query
      const productsFiltered = products.filter((product) =>
        JSON.stringify(product).toLowerCase().includes(query.toLowerCase()),
      );

      // Only the first two items on the list are provided.
      return productsFiltered.slice(0, 2);
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(`Error searching products: ${axiosError.message}`);
      return [];
    }
  }
}

export const searchProductToolPrompt: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'searchProducts',
    description: `
Searches the product catalog and returns product information.

You MUST use this tool for every request related to products. Never answer product-related questions without calling this tool first, even if you believe you already know the answer.

This tool can retrieve information such as:
- Product name
- Description
- Price
- Product URL
- Product type or category
- Variants (color, size, capacity, etc.)
- Any other product-related information available in the catalog

Use this tool whenever the user:
- Searches for products.
- Asks whether a product exists.
- Requests product recommendations.
- Asks about product prices.
- Asks for product details or specifications.
- Searches by category, color, brand, feature, or any other attribute.
- Compares products.
- Refers to a product without providing its exact name.

Examples:
- "I am looking for a phone."
- "I am looking for a present for my dad."
- "Do you have any white products?"
- "Show me laptops."
- "How much does the iPhone 16 cost?"
- "Do you have running shoes?"
- "I need noise-cancelling headphones."
- "Which laptop is the cheapest?"
`,
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'The product type, such as "Clothing", "Home", or "Technology", the color, size, name or any other product-related search term',
        },
      },
    },
  },
};
