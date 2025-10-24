import { Module } from '@nestjs/common';
import { WorkOrderService } from './service';
import { WorkOrderController } from './controller';

@Module({
  controllers: [WorkOrderController],
  providers: [WorkOrderService],
})
export class WorkOrderModule {}
