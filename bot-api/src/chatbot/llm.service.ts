import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class LLMService {
  readonly client: OpenAI;

  constructor(private configService: ConfigService) {
    this.client = new OpenAI({
      baseURL: this.configService.get('LLM_BASE_URL'),
      apiKey: this.configService.get('LLM_API_KEY'),
    });
  }
}
