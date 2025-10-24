import { Module } from '@nestjs/common';
import { CustomerEquipmentController } from './customer-equipment.controller';
import { CustomerEquipmentService } from './customer-equipment.service';
import { PrismaService } from '../../../common/prisma.service';

@Module({
  controllers: [CustomerEquipmentController],
  providers: [CustomerEquipmentService, PrismaService],
  exports: [CustomerEquipmentService],
})
export class CustomerEquipmentModule {}
