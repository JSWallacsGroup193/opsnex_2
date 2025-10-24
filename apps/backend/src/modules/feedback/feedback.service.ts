import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateFeedbackDto, UpdateFeedbackDto, QueryFeedbackDto } from './dto/feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, userId: string, dto: CreateFeedbackDto) {
    const feedback = await this.prisma.feedback.create({
      data: {
        tenantId,
        userId,
        category: dto.category,
        rating: dto.rating,
        message: dto.message,
        contactEmail: dto.contactEmail,
        userAgent: dto.userAgent,
        pageUrl: dto.pageUrl,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return feedback;
  }

  async findAll(tenantId: string, query: QueryFeedbackDto) {
    const { page = 1, limit = 50, category, status } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (category) where.category = category;
    if (status) where.status = status;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.feedback.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.feedback.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(tenantId: string, id: string) {
    const feedback = await this.prisma.feedback.findFirst({
      where: { id, tenantId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return feedback;
  }

  async update(
    tenantId: string,
    id: string,
    dto: UpdateFeedbackDto,
    resolvedBy: string,
  ) {
    const feedback = await this.findOne(tenantId, id);

    const updateData: any = {};
    if (dto.status) updateData.status = dto.status;
    if (dto.adminNotes) updateData.adminNotes = dto.adminNotes;

    if (dto.status === 'resolved' && !feedback.resolvedAt) {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = resolvedBy;
    }

    return this.prisma.feedback.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.feedback.delete({ where: { id } });
  }

  async getStats(tenantId: string) {
    const total = await this.prisma.feedback.count({ where: { tenantId } });
    
    const avgRatingResult = await this.prisma.feedback.aggregate({
      where: { tenantId, rating: { not: null } },
      _avg: { rating: true },
    });
    
    const recentCount = await this.prisma.feedback.count({
      where: {
        tenantId,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    const allFeedback = await this.prisma.feedback.findMany({
      where: { tenantId },
      select: { category: true, status: true },
    });

    const byCategory = allFeedback.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = allFeedback.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      byCategory: Object.entries(byCategory).map(([category, count]) => ({
        category,
        count,
      })),
      byStatus: Object.entries(byStatus).map(([status, count]) => ({
        status,
        count,
      })),
      averageRating: avgRatingResult._avg.rating || 0,
      recentCount,
    };
  }
}
