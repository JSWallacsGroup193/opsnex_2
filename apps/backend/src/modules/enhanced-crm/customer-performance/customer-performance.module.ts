import { Module } from '@nestjs/common';
import { CustomerPerformanceService } from './customer-performance.service';
import { CustomerPerformanceController } from './customer-performance.controller';
import { PrismaService } from '../../../common/prisma.service';

@Module({
  controllers: [CustomerPerformanceController],
  providers: [CustomerPerformanceService, PrismaService],
  exports: [CustomerPerformanceService],
})
export class CustomerPerformanceModule {}
