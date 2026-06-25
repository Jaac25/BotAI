import { Injectable } from '@nestjs/common';
import { ChatCompletionTool } from 'openai/resources';
import { CurrencyService } from '../../currency/currencies.service';

@Injectable()
export class ConvertCurrenciesTool {
  constructor(private readonly currenciesService: CurrencyService) {}

  async execute({
    amount,
    from,
    to,
  }: {
    amount?: number;
    from?: string;
    to?: string;
  }): Promise<number> {
    try {
      if (!to) {
        throw new Error('The "to" currency is required.');
      }
      if (!amount) {
        throw new Error('The "amount" is required.');
      }

      // The currencies are get from openexchangerates.org
      const currencies = await this.currenciesService.getCurrencies(from);

      // The currency value is got
      const rate = currencies?.rates[to.toUpperCase()];
      if (!rate) {
        throw new Error(`Exchange rate for "${to}" is not available.`);
      }
      // The value is converted to the destination currency.
      return amount * rate;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null
            ? JSON.stringify(error)
            : String(error);

      throw new Error(`ConvertCurrenciesTool error: ${message}`);
    }
  }
}

export const convertCurrenciesToolPrompt: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'convertCurrencies',
    description: `
    Converts amounts from one currency to another using the latest available exchange rates.

You MUST use this tool whenever the user asks to convert a monetary amount from one currency to another.

This tool only performs currency conversion. It does not search for products or determine prices.

Use this tool whenever the user:
- Wants the price of something in a different currency.
- Asks to convert one currency into another.
- Requests the equivalent value of an amount in another currency.
- Refers to a currency conversion explicitly or implicitly.

Examples:
- "How much does this watch cost in euros?"
- "How much is 5 USD in COP?"
- "Convert 100 EUR to GBP."
- "What's the equivalent of 20 dollars in pesos?"
- "Show me the price in Colombian pesos."
- "Convert the total to Japanese yen."

Never estimate exchange rates or perform currency conversions using your own knowledge. Always use this tool.

Before calling this tool, extract the following parameters from the user's request or previous tool results:
- amount → The amount to convert. **Required.**
- from → The source currency. **Default to USD if it is not explicitly provided.**
- to → The target currency. **Required.**

The from and to values MUST always be ISO 4217 currency codes (e.g. USD, COP, EUR, GBP, JPY). Never use currency names such as "US dollars", "Colombian pesos", "euros", or "yen". Always convert currency names mentioned by the user into their corresponding ISO currency codes before calling this tool.
    `,
    parameters: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          description: 'The amount to convert',
        },
        from: {
          type: 'string',
          description: 'The currency to convert from',
        },
        to: {
          type: 'string',
          description: 'The currency to convert to',
        },
      },
      required: ['to', 'amount'],
    },
  },
};
