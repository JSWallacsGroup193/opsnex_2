import { Module } from '@nestjs/common';
import { FieldCalculationController } from './controller';
import { FieldCalculationService } from './service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [FieldCalculationController],
  providers: [FieldCalculationService, PrismaService],
  exports: [FieldCalculationService],
})
export class FieldCalculationModule {}
