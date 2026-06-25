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
import { AxiosError } from 'axios';

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
      // We need to limit attempts to use LLM to avoid infinite loops due to inconsistent user requests,
      // and a while loop is mandatory to mix tools because there are cases where we need the response
      // from one tool to get the value from another tool.
      while (attempt < MAX_ATTEMPTS) {
        // The connection is established and the messages list is sent to the LLM.
        const response = await this.llm.client.chat.completions.create({
          model: this.model,
          messages,
          tools,
        });

        const assistantMessage = response.choices?.at(0)?.message;

        // The while loop will end when the LLM not longer needs any more tools
        if (!assistantMessage?.tool_calls?.length) {
          return assistantMessage?.content ?? 'No se encontró información';
        }

        // The assistant message is added to the messages list
        messages.push(assistantMessage);

        // The tools are executed depending from the LLM response
        for (const toolCall of assistantMessage.tool_calls as ITool[]) {
          // The LLM choose the tool
          const result = await this.executeTool(toolCall);

          // The tool's response is added to the message list so that LLM has context.
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          });
        }
        attempt++;
      }
    } catch (error: unknown) {
      const err = error as AxiosError;
      throw new Error(`Error in chat method ${err.message}`);
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
      const err = error as AxiosError;
      throw new Error(`Tools error: ${err.response?.status ?? ''}`);
    }
  };
}
