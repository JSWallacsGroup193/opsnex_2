import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { CreateCustomerPerformanceDto, UpdateCustomerPerformanceDto } from './dto';

@Injectable()
export class CustomerPerformanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateCustomerPerformanceDto) {
    // Verify account belongs to tenant
    const account = await this.prisma.account.findUnique({
      where: { id: dto.accountId },
    });

    if (!account || account.tenantId !== tenantId) {
      throw new ForbiddenException('Account not found or access denied');
    }

    // Check if performance record already exists
    const existing = await this.prisma.customerPerformance.findUnique({
      where: { accountId: dto.accountId },
    });

    if (existing) {
      throw new ConflictException('Performance record already exists for this account');
    }

    return this.prisma.customerPerformance.create({
      data: {
        ...dto,
        tenantId,
      },
      include: {
        account: true,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.customerPerformance.findMany({
      where: { tenantId },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            customerTier: true,
          },
        },
      },
      orderBy: { lifetimeValue: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const performance = await this.prisma.customerPerformance.findUnique({
      where: { id },
      include: {
        account: true,
      },
    });

    if (!performance || performance.tenantId !== tenantId) {
      throw new NotFoundException('Customer performance record not found');
    }

    return performance;
  }

  async findByAccountId(tenantId: string, accountId: string) {
    const performance = await this.prisma.customerPerformance.findUnique({
      where: { accountId },
      include: {
        account: true,
      },
    });

    if (!performance || performance.tenantId !== tenantId) {
      throw new NotFoundException('Customer performance record not found');
    }

    return performance;
  }

  async update(tenantId: string, id: string, dto: UpdateCustomerPerformanceDto) {
    // Verify performance record exists and belongs to tenant
    await this.findOne(tenantId, id);

    return this.prisma.customerPerformance.update({
      where: { id },
      data: {
        ...dto,
        lastCalculated: new Date(),
      },
      include: {
        account: true,
      },
    });
  }

  async remove(tenantId: string, id: string) {
    // Verify performance record exists and belongs to tenant
    await this.findOne(tenantId, id);

    return this.prisma.customerPerformance.delete({
      where: { id },
    });
  }

  // Calculate performance metrics from work orders and invoices
  async recalculate(tenantId: string, accountId: string) {
    // Verify account belongs to tenant
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account || account.tenantId !== tenantId) {
      throw new ForbiddenException('Account not found or access denied');
    }

    // Get work orders
    const workOrders = await this.prisma.workOrder.findMany({
      where: {
        customerId: accountId,
        status: 'COMPLETED',
      },
    });

    // Get invoices
    const invoices = await this.prisma.invoice.findMany({
      where: { accountId },
    });

    const totalJobs = workOrders.length;
    const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
    const avgTicketValue = totalJobs > 0 ? totalRevenue / totalJobs : 0;

    const latePayments = invoices.filter(inv => inv.status === 'overdue').length;
    const reviewsLeft = workOrders.filter(wo => wo.customerSatisfaction !== null).length > 0;

    // Get or create performance record
    let performance = await this.prisma.customerPerformance.findUnique({
      where: { accountId },
    });

    const data = {
      totalJobsCompleted: totalJobs,
      averageTicketValue: avgTicketValue,
      totalRevenueYTD: totalRevenue,
      latePayments,
      reviewLeft: reviewsLeft,
      lifetimeValue: totalRevenue,
      lastCalculated: new Date(),
    };

    if (performance) {
      return this.prisma.customerPerformance.update({
        where: { id: performance.id },
        data,
        include: {
          account: true,
        },
      });
    } else {
      return this.prisma.customerPerformance.create({
        data: {
          ...data,
          tenantId,
          accountId,
        },
        include: {
          account: true,
        },
      });
    }
  }
}
