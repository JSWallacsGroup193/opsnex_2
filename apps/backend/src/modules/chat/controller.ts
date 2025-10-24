import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Post()
  async query(@Body() body: { prompt: string; tenantContext?: string }) {
    const result = await this.chat.ask(body.prompt, body.tenantContext);
    return { response: result };
  }

  @Get('logs/:tenantId')
  async getLogs(@Param('tenantId') tenantId: string) {
    return await this.chat.getLogs(tenantId);
  }
}
