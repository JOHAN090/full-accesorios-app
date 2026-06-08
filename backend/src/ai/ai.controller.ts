import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body('message') message: string) {
    if (!message) {
      return { reply: 'Por favor, escribe un mensaje.' };
    }
    const reply = await this.aiService.generateChatResponse(message);
    return { reply };
  }
}
