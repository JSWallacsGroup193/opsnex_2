import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class ForecastService {
  constructor(private readonly prisma: PrismaService) {}

  async runForecastJob(tenantId: string) {
    const skus = await this.prisma.sKU.findMany({ where: { tenantId }, select: { id: true } });
    if (skus.length === 0) return { updated: 0 };

    const skuIds = skus.map(s => s.id);
    const since = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const ledgers = await this.prisma.stockLedger.findMany({
      where: { tenantId, skuId: { in: skuIds }, createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
    });

    const bySku = new Map<string, any[]>();
    for (const row of ledgers) {
      const arr = bySku.get(row.skuId) || [];
      if (arr.length < 30) { arr.push(row); bySku.set(row.skuId, arr); }
    }

    let updated = 0;
    for (const skuId of skuIds) {
      const rows = bySku.get(skuId) || [];
      const dailyConsumption = rows.filter((r:any)=> r.direction === 'OUT').reduce((sum:number, r:any) => sum + r.quantity, 0) / Math.max(1, 30);
      const leadTime = 7;
      const safetyFactor = 1.65;
      const avgDailyDemand = Number(dailyConsumption.toFixed(2));
      const reorderPoint = Number((avgDailyDemand * leadTime * safetyFactor).toFixed(2));
      const suggestedOrderQty = Math.max(0, Math.ceil(reorderPoint));

      await this.prisma.forecast.upsert({
        where: { tenantId_skuId: { tenantId, skuId } },
        update: { avgDailyDemand, leadTimeDays: leadTime, safetyFactor, reorderPoint, suggestedOrderQty },
        create: { tenantId, skuId, avgDailyDemand, leadTimeDays: leadTime, safetyFactor, reorderPoint, suggestedOrderQty },
      });
      updated++;
    }
    return { updated };
  }

  async getForecasts(tenantId: string) {
    return this.prisma.forecast.findMany({ where: { tenantId }, include: { sku: true } });
  }

  async getForecastForSKU(skuId: string, tenantId: string) {
    // Verify SKU belongs to tenant
    const sku = await this.prisma.sKU.findFirst({ where: { id: skuId, tenantId } });
    if (!sku) throw new NotFoundException(`SKU with ID ${skuId} not found`);
    
    const forecast = await this.prisma.forecast.findUnique({
      where: { tenantId_skuId: { tenantId, skuId } },
      include: { sku: true }
    });
    if (!forecast) throw new NotFoundException(`Forecast for SKU ${skuId} not found`);
    return forecast;
  }
}
