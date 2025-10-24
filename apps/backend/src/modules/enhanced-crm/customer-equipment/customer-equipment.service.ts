import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { CreateCustomerEquipmentDto, UpdateCustomerEquipmentDto } from './dto';

@Injectable()
export class CustomerEquipmentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCustomerEquipmentDto, tenantId: string) {
    const property = await this.prisma.property.findFirst({
      where: { id: dto.propertyId, tenantId },
    });

    if (!property) {
      throw new NotFoundException('Property not found or access denied');
    }

    const equipment = await this.prisma.customerEquipment.create({
      data: {
        propertyId: dto.propertyId,
        equipmentType: dto.equipmentType,
        make: dto.make,
        model: dto.model,
        serialNumber: dto.serialNumber,
        capacity: dto.capacity,
        efficiency: dto.efficiency,
        installDate: dto.installDate ? new Date(dto.installDate) : null,
        installedBy: dto.installedBy,
        refrigerantType: dto.refrigerantType,
        warrantyStartDate: dto.warrantyStartDate ? new Date(dto.warrantyStartDate) : null,
        warrantyEndDate: dto.warrantyEndDate ? new Date(dto.warrantyEndDate) : null,
        warrantyProvider: dto.warrantyProvider,
      },
      include: {
        property: {
          select: {
            id: true,
            propertyType: true,
            accountId: true,
          },
        },
      },
    });

    return equipment;
  }

  async findAll(tenantId: string, propertyId?: string) {
    const where: any = {
      property: {
        tenantId,
      },
    };

    if (propertyId) {
      where.propertyId = propertyId;
    }

    return this.prisma.customerEquipment.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            propertyType: true,
            accountId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    const equipment = await this.prisma.customerEquipment.findFirst({
      where: {
        id,
        property: {
          tenantId,
        },
      },
      include: {
        property: {
          select: {
            id: true,
            propertyType: true,
            accountId: true,
          },
        },
      },
    });

    if (!equipment) {
      throw new NotFoundException('Equipment not found or access denied');
    }

    return equipment;
  }

  async update(id: string, dto: UpdateCustomerEquipmentDto, tenantId: string) {
    const existing = await this.findOne(id, tenantId);

    const updateData: any = {};
    if (dto.equipmentType !== undefined) updateData.equipmentType = dto.equipmentType;
    if (dto.make !== undefined) updateData.make = dto.make;
    if (dto.model !== undefined) updateData.model = dto.model;
    if (dto.serialNumber !== undefined) updateData.serialNumber = dto.serialNumber;
    if (dto.capacity !== undefined) updateData.capacity = dto.capacity;
    if (dto.efficiency !== undefined) updateData.efficiency = dto.efficiency;
    if (dto.installDate !== undefined) updateData.installDate = new Date(dto.installDate);
    if (dto.installedBy !== undefined) updateData.installedBy = dto.installedBy;
    if (dto.refrigerantType !== undefined) updateData.refrigerantType = dto.refrigerantType;
    if (dto.warrantyStartDate !== undefined) updateData.warrantyStartDate = new Date(dto.warrantyStartDate);
    if (dto.warrantyEndDate !== undefined) updateData.warrantyEndDate = new Date(dto.warrantyEndDate);
    if (dto.warrantyProvider !== undefined) updateData.warrantyProvider = dto.warrantyProvider;

    const updated = await this.prisma.customerEquipment.update({
      where: { id: existing.id },
      data: updateData,
      include: {
        property: {
          select: {
            id: true,
            propertyType: true,
            accountId: true,
          },
        },
      },
    });

    return updated;
  }

  async delete(id: string, tenantId: string) {
    const existing = await this.findOne(id, tenantId);

    await this.prisma.customerEquipment.delete({
      where: { id: existing.id },
    });

    return { success: true, id };
  }
}
