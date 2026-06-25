import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatbotDto } from './chatbot.dto';
import { ChatbotService } from './chatbot.service';

@ApiTags('Chatbot')
@Controller('chatBot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  @ApiOperation({
    summary: 'Send message to chatbot',
    description: 'Send a text to chatbot and get the response',
  })
  async chat(@Body() dto: ChatbotDto) {
    try {
      const response = await this.chatbotService.chat(dto.message);
      return {
        response,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : JSON.stringify(error);
      throw new InternalServerErrorException(
        message || 'Unexpected server error',
      );
    }
  }
}
