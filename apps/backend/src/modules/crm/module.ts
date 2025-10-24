import { Module } from '@nestjs/common';
import { CrmService } from './service';
import { CrmController } from './controller';

@Module({
  controllers: [CrmController],
  providers: [CrmService],
})
export class CrmModule {}
