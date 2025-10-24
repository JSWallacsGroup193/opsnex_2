import { Module } from '@nestjs/common';
import { EstimatorService } from './estimator.service';
import { EstimatorController } from './estimator.controller';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [EstimatorController],
  providers: [EstimatorService, PrismaService],
})
export class EstimatorModule {}
