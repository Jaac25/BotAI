import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class LLMService {
  readonly client: OpenAI;

  constructor(private configService: ConfigService) {
    // The connection with the OpenAI Chat Completion API was established
    this.client = new OpenAI({
      baseURL: this.configService.get('LLM_BASE_URL'),
      apiKey: this.configService.get('LLM_API_KEY'),
    });
  }
}
