import { Controller, Get, Post, Req, Param, UseGuards } from '@nestjs/common';
import { ForecastService } from './service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('forecast')
@UseGuards(JwtAuthGuard)
export class ForecastController {
  constructor(private readonly service: ForecastService) {}

  @Post()
  run(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.runForecastJob(tenantId);
  }

  @Get()
  get(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.getForecasts(tenantId);
  }

  @Get('sku/:skuId')
  getForSKU(@Param('skuId') skuId: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.getForecastForSKU(skuId, tenantId);
  }
}
