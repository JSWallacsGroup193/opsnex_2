import { Module } from '@nestjs/common';
import { DispatchService } from './service';
import { DispatchController } from './controller';

@Module({
  controllers: [DispatchController],
  providers: [DispatchService],
})
export class DispatchModule {}
