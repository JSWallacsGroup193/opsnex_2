import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class DispatchService {
  async createSlot(data: { workOrderId: string; technicianId: string; startTime: Date; endTime: Date }, tenantId: string) {
    // Verify work order belongs to tenant
    const workOrder = await prisma.workOrder.findFirst({ where: { id: data.workOrderId, tenantId } });
    if (!workOrder) {
      throw new NotFoundException(`Work order with ID ${data.workOrderId} not found`);
    }

    // Verify technician belongs to tenant if provided
    if (data.technicianId) {
      const technician = await prisma.user.findFirst({ where: { id: data.technicianId, tenantId } });
      if (!technician) {
        throw new NotFoundException(`Technician with ID ${data.technicianId} not found`);
      }
    }

    return prisma.dispatchSlot.create({ data });
  }

  async updateSlot(
    id: string,
    data: { technicianId?: string | null; startTime?: Date; endTime?: Date; status?: string },
    tenantId: string
  ) {
    // Verify slot exists and belongs to tenant via workOrder
    const slot = await prisma.dispatchSlot.findUnique({ 
      where: { id },
      include: { workOrder: true }
    });
    if (!slot) {
      throw new NotFoundException(`Dispatch slot with ID ${id} not found`);
    }
    if (slot.workOrder.tenantId !== tenantId) {
      throw new NotFoundException(`Dispatch slot with ID ${id} not found`);
    }

    // Verify technician belongs to tenant if being updated
    if (data.technicianId) {
      const technician = await prisma.user.findFirst({ where: { id: data.technicianId, tenantId } });
      if (!technician) {
        throw new NotFoundException(`Technician with ID ${data.technicianId} not found`);
      }
    }

    return prisma.dispatchSlot.update({
      where: { id },
      data,
      include: { workOrder: true, technician: true },
    });
  }

  async getTechnicianSlots(technicianId: string, tenantId: string) {
    // Verify technician belongs to tenant
    const technician = await prisma.user.findFirst({ where: { id: technicianId, tenantId } });
    if (!technician) {
      throw new NotFoundException(`Technician with ID ${technicianId} not found`);
    }

    return prisma.dispatchSlot.findMany({
      where: { 
        technicianId,
        workOrder: { tenantId }
      },
      include: { workOrder: true },
      orderBy: { startTime: 'asc' },
    });
  }

  async getAllSlots(tenantId: string) {
    return prisma.dispatchSlot.findMany({
      where: {
        workOrder: { tenantId }
      },
      include: { workOrder: true, technician: true },
      orderBy: { startTime: 'asc' },
    });
  }

  async deleteSlot(id: string, tenantId: string) {
    // Verify slot exists and belongs to tenant via workOrder
    const slot = await prisma.dispatchSlot.findUnique({ 
      where: { id },
      include: { workOrder: true }
    });
    if (!slot) {
      throw new NotFoundException(`Dispatch slot with ID ${id} not found`);
    }
    if (slot.workOrder.tenantId !== tenantId) {
      throw new NotFoundException(`Dispatch slot with ID ${id} not found`);
    }

    await prisma.dispatchSlot.delete({ where: { id } });
    return { deleted: true, id };
  }
}
