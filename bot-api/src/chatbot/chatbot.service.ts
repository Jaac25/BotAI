import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources';
import { LLMService } from './llm.service';
import {
  ConvertCurrenciesTool,
  convertCurrenciesToolPrompt,
} from './tools/convert-currencies.tool';
import {
  SearchProductsTool,
  searchProductToolPrompt,
} from './tools/search-products.tool';

interface ITool {
  type: 'function';
  index: number;
  id: string;
  function: {
    name: string;
    arguments: string;
  };
}

@Injectable()
export class ChatbotService {
  readonly model = 'gpt-4o-mini';

  constructor(
    private readonly llm: LLMService,
    private readonly searchProductsTool: SearchProductsTool,
    private readonly convertCurrenciesTool: ConvertCurrenciesTool,
    private readonly configService: ConfigService,
  ) {
    this.model = this.configService.get('LLM_MODEL') || this.model;
  }

  async chat(message: string) {
    try {
      const MAX_ATTEMPTS = this.configService.get<number>('MAX_ATTEMPS') ?? 15;

      const tools: ChatCompletionTool[] = [
        searchProductToolPrompt,
        convertCurrenciesToolPrompt,
      ];

      const messages: ChatCompletionMessageParam[] = [
        {
          role: 'user',
          content: message,
        },
      ];

      let attempt = 0;
      while (attempt < MAX_ATTEMPTS) {
        const response = await this.llm.client.chat.completions.create({
          model: this.model,
          messages,
          tools,
        });

        const assistantMessage = response.choices?.at(0)?.message;

        if (!assistantMessage?.tool_calls?.length) {
          return assistantMessage?.content ?? 'No se encontró información';
        }

        messages.push(assistantMessage);

        for (const toolCall of assistantMessage.tool_calls as ITool[]) {
          const result = await this.executeTool(toolCall);

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          });
        }
        attempt++;
      }
    } catch (error) {
      console.error('Error in chat method:', error);
      throw error;
    }
  }

  executeTool = async (toolCall: ITool) => {
    try {
      const args: Record<string, string> = JSON.parse(
        toolCall.function.arguments,
      ) as Record<string, string>;

      switch (toolCall?.function.name) {
        case 'searchProducts':
          if (!args.query)
            return 'No query provided. Please provide a search term to find products.';

          return this.searchProductsTool.execute({ query: args.query });

        case 'convertCurrencies':
          return this.convertCurrenciesTool.execute({
            amount: Number(args.amount),
            from: args.from,
            to: args.to,
          });

        default:
          throw new Error(`Unknown tool: ${toolCall.function.name}`);
      }
    } catch (error) {
      console.error('Tools error:', error);
      throw error;
    }
  };
}
