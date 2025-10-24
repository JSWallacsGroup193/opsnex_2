import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateBundleDto } from './dto/create-bundle.dto';
import { CreateLaborRateDto } from './dto/create-labor-rate.dto';

@Injectable()
export class ServiceCatalogService {
  constructor(private prisma: PrismaService) {}

  async getServices(tenantId: string, filters?: { category?: string; active?: boolean }) {
    return this.prisma.serviceCatalog.findMany({
      where: {
        tenantId,
        category: filters?.category,
        isActive: filters?.active,
        deletedAt: null,
      },
      orderBy: [{ displayOrder: 'asc' }, { serviceName: 'asc' }],
    });
  }

  async getServiceById(tenantId: string, id: string) {
    const service = await this.prisma.serviceCatalog.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async createService(tenantId: string, dto: CreateServiceDto) {
    return this.prisma.serviceCatalog.create({
      data: { ...dto, tenantId },
    });
  }

  async updateService(tenantId: string, id: string, dto: UpdateServiceDto) {
    await this.getServiceById(tenantId, id);
    return this.prisma.serviceCatalog.update({
      where: { id },
      data: dto,
    });
  }

  async deleteService(tenantId: string, id: string) {
    await this.getServiceById(tenantId, id);
    return this.prisma.serviceCatalog.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getBundles(tenantId: string, filters?: { active?: boolean }) {
    return this.prisma.serviceBundle.findMany({
      where: {
        tenantId,
        isActive: filters?.active,
        deletedAt: null,
      },
      include: {
        items: {
          include: {
            service: true,
          },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async getBundleById(tenantId: string, id: string) {
    const bundle = await this.prisma.serviceBundle.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        items: {
          include: {
            service: true,
          },
        },
      },
    });
    if (!bundle) throw new NotFoundException('Bundle not found');
    return bundle;
  }

  async createBundle(tenantId: string, dto: CreateBundleDto) {
    const { items, ...bundleData } = dto;
    
    return this.prisma.serviceBundle.create({
      data: {
        ...bundleData,
        tenantId,
        items: {
          create: items.map((item) => ({
            serviceId: item.serviceId,
            quantity: item.quantity,
            displayOrder: item.displayOrder || 0,
          })),
        },
      },
      include: {
        items: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  async updateBundle(tenantId: string, id: string, dto: CreateBundleDto) {
    await this.getBundleById(tenantId, id);
    const { items, ...bundleData } = dto;

    await this.prisma.serviceBundleItem.deleteMany({ where: { bundleId: id } });

    return this.prisma.serviceBundle.update({
      where: { id },
      data: {
        ...bundleData,
        items: {
          create: items.map((item) => ({
            serviceId: item.serviceId,
            quantity: item.quantity,
            displayOrder: item.displayOrder || 0,
          })),
        },
      },
      include: {
        items: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  async deleteBundle(tenantId: string, id: string) {
    await this.getBundleById(tenantId, id);
    return this.prisma.serviceBundle.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getLaborRates(tenantId: string) {
    return this.prisma.laborRate.findMany({
      where: { tenantId, isActive: true },
      orderBy: [{ isDefault: 'desc' }, { hourlyRate: 'asc' }],
    });
  }

  async createLaborRate(tenantId: string, dto: CreateLaborRateDto) {
    if (dto.isDefault) {
      await this.prisma.laborRate.updateMany({
        where: { tenantId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.laborRate.create({
      data: { ...dto, tenantId },
    });
  }

  async updateLaborRate(tenantId: string, id: string, dto: CreateLaborRateDto) {
    if (dto.isDefault) {
      await this.prisma.laborRate.updateMany({
        where: { tenantId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    return this.prisma.laborRate.update({
      where: { id },
      data: dto,
    });
  }

  async deleteLaborRate(tenantId: string, id: string) {
    return this.prisma.laborRate.delete({ where: { id } });
  }
}
