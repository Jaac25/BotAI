import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ChatCompletionCreateParamsStreaming,
  ChatCompletionMessageParam,
} from 'openai/resources';
import { LLMService } from './llm.service';
import { SearchProductsTool } from './tools/search-products.tool';
import { ConvertCurrenciesTool } from './tools/convert-currencies.tool';
import { CsvService } from '../csv/csv.service';

interface ITool {
  type: 'function';
  index: 0;
  id: string;
  function: {
    name: string;
    arguments: string;
  };
}

@Injectable()
export class ChatbotService {
  readonly model = 'gpt-4o-mini';
  private readonly logger = new Logger(ChatbotService.name);
  private csvService = new CsvService();

  constructor(
    private readonly llm: LLMService,
    private readonly configService: ConfigService,
  ) {
    this.model = this.configService.get('LLM_MODEL') || this.model;
  }

  async chat(message: string) {
    try {
      const tools: ChatCompletionCreateParamsStreaming['tools'] = [
        {
          type: 'function',
          function: {
            name: 'searchProducts',
            description: 'Search products from csv',
            parameters: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                },
              },
              required: ['query'],
            },
          },
        },
        {
          type: 'function',
          function: {
            name: 'convertCurrencies',
            description: 'Convert between currencies',
            parameters: {
              type: 'object',
              properties: {
                amount: {
                  type: 'number',
                },
                from: {
                  type: 'string',
                },
                to: {
                  type: 'string',
                },
              },
              required: ['amount', 'from', 'to'],
            },
          },
        },
      ];

      const messages: ChatCompletionMessageParam[] = [
        {
          role: 'user',
          content: message,
        },
      ];

      const response = await this.llm.client.chat.completions.create({
        model: this.model,
        messages,
        tools,
      });

      const toolCall = response?.choices
        ?.at(0)
        ?.message?.tool_calls?.at(0) as ITool;

      if (!toolCall) {
        return response.choices[0].message.content;
      }

      let toolResult;

      this.logger.log(
        { toolCall },
        '===============================================',
      );
      switch (toolCall?.function.name) {
        case 'searchProducts': {
          const args: Record<string, unknown> = JSON.parse(
            toolCall.function.arguments,
          ) as Record<string, unknown>;

          const tool = new SearchProductsTool(this.csvService);
          toolResult = await tool.execute(args.query as string);

          break;
        }

        case 'convertCurrencies': {
          const args: Record<string, unknown> = JSON.parse(
            toolCall.function.arguments,
          ) as Record<string, unknown>;

          const tool = new ConvertCurrenciesTool(this.csvService);
          toolResult = await tool.execute(
            args.amount as number,
            args.from as string,
            args.to as string,
          );

          break;
        }
      }

      messages.push(response.choices[0].message);

      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(toolResult),
      });

      messages.push(response.choices[0].message);

      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(toolResult),
      });

      const finalResponse = await this.llm.client.chat.completions.create({
        model: this.model,
        messages,
      });

      return finalResponse.choices[0].message.content;
    } catch (error) {
      console.error('Error in chat method:', error);
      throw error;
    }
  }
}
