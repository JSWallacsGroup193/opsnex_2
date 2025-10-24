import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class FieldCalculationService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    tenantId: string;
    technicianId: string;
    calculatorType: string;
    category: string;
    inputs: any;
    results: any;
    workOrderId?: string;
    notes?: string;
  }) {
    return this.prisma.fieldCalculation.create({
      data: {
        tenantId: data.tenantId,
        technicianId: data.technicianId,
        calculatorType: data.calculatorType,
        category: data.category,
        inputs: data.inputs,
        results: data.results,
        workOrderId: data.workOrderId,
        notes: data.notes,
      },
      include: {
        technician: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        workOrder: {
          select: {
            id: true,
            number: true,
            title: true,
          },
        },
      },
    });
  }

  async findAll(tenantId: string, workOrderId?: string) {
    const where: any = { tenantId };
    if (workOrderId) {
      where.workOrderId = workOrderId;
    }

    return this.prisma.fieldCalculation.findMany({
      where,
      include: {
        technician: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        workOrder: {
          select: {
            id: true,
            number: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    const calculation = await this.prisma.fieldCalculation.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        technician: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        workOrder: {
          select: {
            id: true,
            number: true,
            title: true,
          },
        },
      },
    });

    if (!calculation) {
      throw new NotFoundException(`Field calculation with ID ${id} not found`);
    }

    return calculation;
  }

  async findByTechnician(technicianId: string, tenantId: string) {
    return this.prisma.fieldCalculation.findMany({
      where: {
        technicianId,
        tenantId,
      },
      include: {
        technician: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        workOrder: {
          select: {
            id: true,
            number: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async delete(id: string, tenantId: string) {
    const result = await this.prisma.fieldCalculation.deleteMany({
      where: {
        id,
        tenantId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException(`Field calculation with ID ${id} not found`);
    }

    return { deleted: true, id };
  }

  async attachToWorkOrder(calculationId: string, workOrderId: string, tenantId: string) {
    const calculation = await this.prisma.fieldCalculation.findFirst({
      where: { id: calculationId, tenantId },
    });

    if (!calculation) {
      throw new NotFoundException(`Field calculation with ID ${calculationId} not found`);
    }

    // Verify work order belongs to same tenant
    const workOrder = await this.prisma.workOrder.findFirst({
      where: { id: workOrderId, tenantId },
    });

    if (!workOrder) {
      throw new NotFoundException(`Work order with ID ${workOrderId} not found`);
    }

    return this.prisma.fieldCalculation.update({
      where: { id: calculationId },
      data: { workOrderId },
      include: {
        technician: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        workOrder: {
          select: {
            id: true,
            number: true,
            title: true,
          },
        },
      },
    });
  }
}
