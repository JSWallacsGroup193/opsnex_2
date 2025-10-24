import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, WorkOrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class WorkOrderService {
  async findAll(tenantId: string, equipmentId?: string) {
    const where: any = { tenantId };
    if (equipmentId) {
      where.equipmentId = equipmentId;
    }
    return prisma.workOrder.findMany({ where });
  }

  async findOne(id: string, tenantId: string) {
    const workOrder = await prisma.workOrder.findFirst({ where: { id, tenantId } });
    if (!workOrder) throw new NotFoundException(`Work order with ID ${id} not found`);
    return workOrder;
  }

  async create(data: { tenantId: string, title: string, description?: string }) {
    const number = `WO-${Date.now()}`;
    return prisma.workOrder.create({ 
      data: {
        ...data,
        number,
      }
    });
  }

  async updateStatus(id: string, status: WorkOrderStatus, tenantId: string) {
    const workOrder = await prisma.workOrder.findFirst({ where: { id, tenantId } });
    if (!workOrder) throw new NotFoundException(`Work order with ID ${id} not found`);

    return prisma.workOrder.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string, tenantId: string) {
    const workOrder = await prisma.workOrder.findFirst({ where: { id, tenantId } });
    if (!workOrder) throw new NotFoundException(`Work order with ID ${id} not found`);

    await prisma.workOrder.delete({ where: { id } });
    return { deleted: true, id };
  }

  async getStats(tenantId: string) {
    const [total, newOrders, inProgress, completed] = await Promise.all([
      prisma.workOrder.count({ where: { tenantId } }),
      prisma.workOrder.count({ where: { tenantId, status: WorkOrderStatus.NEW } }),
      prisma.workOrder.count({ where: { tenantId, status: WorkOrderStatus.IN_PROGRESS } }),
      prisma.workOrder.count({ where: { tenantId, status: WorkOrderStatus.COMPLETED } }),
    ]);

    return {
      total,
      new: newOrders,
      inProgress,
      completed,
    };
  }
}
