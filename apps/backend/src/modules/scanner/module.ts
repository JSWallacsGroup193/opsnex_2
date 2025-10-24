import { Module } from '@nestjs/common';
import { ScannerController } from './controller';
import { ScannerService } from './service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [ScannerController],
  providers: [ScannerService, PrismaService],
})
export class ScannerModule {}
