import { ApiProperty } from '@nestjs/swagger';

export class ChatbotDto {
  @ApiProperty({
    description: 'Request to chatbot',
    example: '¿How much cost the product?',
  })
  message: string;
}
