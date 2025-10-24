import { Module } from '@nestjs/common';
import { InventoryController } from './controller';
import { InventoryService } from './service';
import { PrismaService } from '../../common/prisma.service';

@Module({ controllers: [InventoryController], providers: [InventoryService, PrismaService] })
export class InventoryModule {}
