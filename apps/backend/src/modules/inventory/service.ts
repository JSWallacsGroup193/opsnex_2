import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getSKUs(tenantId: string, q?: string, page = 1, pageSize = 50) {
    const where: any = { tenantId };
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { barcode: { contains: q, mode: 'insensitive' } },
      ];
    }
    let [items, total] = await this.prisma.$transaction([
      this.prisma.sKU.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.sKU.count({ where }),
    ]);
    
    // compute on-hand per SKU using stock ledger sums
    const skuIds = items.map(i => i.id);
    if (skuIds.length > 0) {
      const ins = await this.prisma.stockLedger.groupBy({
        by: ['skuId'],
        where: { tenantId, skuId: { in: skuIds }, direction: 'IN' },
        _sum: { quantity: true },
      });
      const outs = await this.prisma.stockLedger.groupBy({
        by: ['skuId'],
        where: { tenantId, skuId: { in: skuIds }, direction: 'OUT' },
        _sum: { quantity: true },
      });
      const sumIn = Object.fromEntries(ins.map(r => [r.skuId, r._sum.quantity || 0]));
      const sumOut = Object.fromEntries(outs.map(r => [r.skuId, r._sum.quantity || 0]));
      
      // Get latest bin location for each SKU
      const latestLedgers = await this.prisma.stockLedger.findMany({
        where: { tenantId, skuId: { in: skuIds } },
        include: { 
          bin: { 
            include: { warehouse: true } 
          } 
        },
        orderBy: { createdAt: 'desc' },
        distinct: ['skuId'],
      });
      const locationMap = Object.fromEntries(
        latestLedgers.map(l => [
          l.skuId,
          {
            warehouse: l.bin?.warehouse?.name || 'N/A',
            bin: l.bin?.name || 'N/A',
          }
        ])
      );
      
      items = items.map(i => ({
        ...i,
        onHand: (sumIn[i.id] || 0) - (sumOut[i.id] || 0),
        unitCost: Number(i.cost),
        location: locationMap[i.id] || { warehouse: 'N/A', bin: 'N/A' },
      }));
    } else {
      items = items.map(i => ({
        ...i,
        onHand: 0,
        unitCost: Number(i.cost),
        location: { warehouse: 'N/A', bin: 'N/A' },
      }));
    }
    return { items, total, page, pageSize };
  }

  async getSKU(id: string, tenantId: string) {
    const sku = await this.prisma.sKU.findFirst({ where: { id, tenantId } });
    if (!sku) throw new NotFoundException(`SKU with ID ${id} not found`);
    return sku;
  }

  async createSKU(data: { tenantId: string; name: string; description?: string; barcode?: string }) {
    const sku = `SKU-${Date.now()}`;
    return this.prisma.sKU.create({ 
      data: {
        ...data,
        sku,
      }
    });
  }

  async updateSKU(id: string, data: { name?: string; description?: string; barcode?: string }, tenantId: string) {
    const sku = await this.prisma.sKU.findFirst({ where: { id, tenantId } });
    if (!sku) throw new NotFoundException(`SKU with ID ${id} not found`);
    
    return this.prisma.sKU.update({
      where: { id },
      data,
    });
  }

  async deleteSKU(id: string, tenantId: string) {
    const sku = await this.prisma.sKU.findFirst({ where: { id, tenantId } });
    if (!sku) throw new NotFoundException(`SKU with ID ${id} not found`);
    
    await this.prisma.sKU.delete({ where: { id } });
    return { deleted: true, id };
  }

  async getStockLedger(skuId: string, tenantId: string) {
    // Verify SKU belongs to tenant
    const sku = await this.prisma.sKU.findFirst({ where: { id: skuId, tenantId } });
    if (!sku) throw new NotFoundException(`SKU with ID ${skuId} not found`);
    
    return this.prisma.stockLedger.findMany({
      where: { skuId, tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createStockLedgerEntry(data: {
    tenantId: string;
    skuId: string;
    binId: string;
    direction: 'IN' | 'OUT';
    quantity: number;
    note?: string;
  }) {
    // Verify SKU and Bin belong to same tenant
    const sku = await this.prisma.sKU.findFirst({ where: { id: data.skuId, tenantId: data.tenantId } });
    if (!sku) throw new NotFoundException(`SKU with ID ${data.skuId} not found`);
    
    const bin = await this.prisma.bin.findFirst({ 
      where: { id: data.binId, warehouse: { tenantId: data.tenantId } },
      include: { warehouse: true }
    });
    if (!bin) throw new NotFoundException(`Bin with ID ${data.binId} not found`);
    
    return this.prisma.stockLedger.create({ 
      data: {
        tenantId: data.tenantId,
        skuId: data.skuId,
        binId: data.binId,
        direction: data.direction,
        quantity: data.quantity,
        note: data.note,
      }
    });
  }

  async getWarehouses(tenantId: string) {
    return this.prisma.warehouse.findMany({ where: { tenantId } });
  }

  async createWarehouse(data: { tenantId: string; name: string }) {
    const code = `WH-${Date.now()}`;
    return this.prisma.warehouse.create({ 
      data: {
        ...data,
        code,
      }
    });
  }

  async getBins(tenantId: string) {
    return this.prisma.bin.findMany({ where: { warehouse: { tenantId } }, include: { warehouse: true } });
  }

  async createBin(data: { warehouseId: string; name: string }, tenantId: string) {
    // Verify warehouse belongs to tenant
    const warehouse = await this.prisma.warehouse.findFirst({ where: { id: data.warehouseId, tenantId } });
    if (!warehouse) throw new NotFoundException(`Warehouse with ID ${data.warehouseId} not found`);
    
    return this.prisma.bin.create({ data });
  }

  async getOnHand(tenantId: string, skuId: string) {
    // Verify SKU belongs to tenant
    const sku = await this.prisma.sKU.findFirst({ where: { id: skuId, tenantId } });
    if (!sku) throw new NotFoundException(`SKU with ID ${skuId} not found`);
    
    const [ins, outs] = await Promise.all([
      this.prisma.stockLedger.aggregate({ where: { tenantId, skuId, direction: 'IN' }, _sum: { quantity: true } }),
      this.prisma.stockLedger.aggregate({ where: { tenantId, skuId, direction: 'OUT' }, _sum: { quantity: true } }),
    ]);
    const onHand = (ins._sum.quantity || 0) - (outs._sum.quantity || 0);
    return { onHand };
  }
}
