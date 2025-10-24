import { Module } from '@nestjs/common';
import { ForecastController } from './controller';
import { ForecastService } from './service';
import { PrismaService } from '../../common/prisma.service';

@Module({ controllers: [ForecastController], providers: [ForecastService, PrismaService] })
export class ForecastModule {}
