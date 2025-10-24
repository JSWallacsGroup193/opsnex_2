import { Module } from '@nestjs/common';
import { ServiceCatalogController } from './service-catalog.controller';
import { ServiceCatalogService } from './service-catalog.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [ServiceCatalogController],
  providers: [ServiceCatalogService, PrismaService],
  exports: [ServiceCatalogService],
})
export class ServiceCatalogModule {}
