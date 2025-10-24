import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { CreatePropertyDto, UpdatePropertyDto } from './dto';

@Injectable()
export class PropertyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreatePropertyDto) {
    // Verify account belongs to tenant
    const account = await this.prisma.account.findUnique({
      where: { id: dto.accountId },
    });

    if (!account || account.tenantId !== tenantId) {
      throw new ForbiddenException('Account not found or access denied');
    }

    return this.prisma.property.create({
      data: {
        ...dto,
        tenantId,
      },
      include: {
        account: true,
        address: true,
        equipment: true,
      },
    });
  }

  async findAll(tenantId: string, accountId?: string) {
    return this.prisma.property.findMany({
      where: {
        tenantId,
        ...(accountId && { accountId }),
        deletedAt: null,
      },
      include: {
        account: true,
        address: true,
        equipment: true,
        _count: {
          select: {
            equipment: true,
            serviceRequests: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        account: true,
        address: true,
        equipment: true,
        serviceRequests: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!property || property.tenantId !== tenantId) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  async update(tenantId: string, id: string, dto: UpdatePropertyDto) {
    // Verify property exists and belongs to tenant
    const property = await this.findOne(tenantId, id);

    // If updating accountId, verify new account belongs to tenant
    if (dto.accountId && dto.accountId !== property.accountId) {
      const account = await this.prisma.account.findUnique({
        where: { id: dto.accountId },
      });

      if (!account || account.tenantId !== tenantId) {
        throw new ForbiddenException('Account not found or access denied');
      }
    }

    return this.prisma.property.update({
      where: { id },
      data: dto,
      include: {
        account: true,
        address: true,
        equipment: true,
      },
    });
  }

  async remove(tenantId: string, id: string) {
    // Verify property exists and belongs to tenant
    await this.findOne(tenantId, id);

    // Soft delete
    return this.prisma.property.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
