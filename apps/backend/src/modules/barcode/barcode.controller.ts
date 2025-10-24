import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { BarcodeService } from './barcode.service';

@Controller('barcodes')
export class BarcodeController {
  constructor(private readonly barcodeService: BarcodeService) {}

  @Get(':text')
  async getBarcode(@Param('text') text: string, @Res() res: Response) {
    const png = await this.barcodeService.generateBarcode(text);
    res.setHeader('Content-Type', 'image/png');
    res.send(png);
  }
}
