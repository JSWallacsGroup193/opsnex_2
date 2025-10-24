import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { LabelService } from './label.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('labels')
export class LabelController {
  constructor(private readonly service: LabelService) {}

  @Get(':skuId')
  async printLabel(@Param('skuId') skuId: string, @Res() res: Response) {
    const sku = await prisma.sKU.findUnique({ where: { id: skuId } });
    if (!sku || !sku.barcode) throw new NotFoundException('SKU or barcode missing');
    const zpl = this.service.generateZPL(sku.name, sku.barcode);
    res.setHeader('Content-Type', 'text/plain');
    res.send(zpl);
  }
}
