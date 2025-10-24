import { Module } from '@nestjs/common';
import { PurchasingController } from './controller';
import { PurchasingService } from './service';
import { PrismaService } from '../../common/prisma.service';

@Module({ controllers: [PurchasingController], providers: [PurchasingService, PrismaService] })
export class PurchasingModule {}
