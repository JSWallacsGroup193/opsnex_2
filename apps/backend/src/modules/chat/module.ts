import { Module } from '@nestjs/common';
import { ChatService } from './service';
import { ChatController } from './controller';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
