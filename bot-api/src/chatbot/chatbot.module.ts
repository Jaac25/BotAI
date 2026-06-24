import { Module } from '@nestjs/common';
import { CsvModule } from '../csv/csv.module';
import { CurrencyModule } from '../currency/currency.module';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { LLMService } from './llm.service';
import { ConvertCurrenciesTool } from './tools/convert-currencies.tool';
import { SearchProductsTool } from './tools/search-products.tool';

@Module({
  imports: [CsvModule, CurrencyModule],
  controllers: [ChatbotController],
  providers: [
    ChatbotService,
    LLMService,
    SearchProductsTool,
    ConvertCurrenciesTool,
  ],
})
export class ChatbotModule {}
