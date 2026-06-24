import { Body, Controller, Post } from '@nestjs/common';
import { ChatbotDto } from './chatbot.dto';
import { ChatbotService } from './chatbot.service';

@Controller('chatBot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  async chat(@Body() dto: ChatbotDto) {
    const response = await this.chatbotService.chat(dto.message);

    return {
      response,
    };
  }
}
