import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { 
  CreateVendorDto, 
  UpdateVendorDto, 
  CreateVendorContactDto,
  CreatePriceAgreementDto,
  CreatePerformanceReviewDto,
  VendorQueryDto 
} from './dto';
import { Prisma, VendorStatus } from '@prisma/client';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, userId: string, dto: CreateVendorDto) {
    // Check for duplicate vendor code
    const existing = await this.prisma.vendor.findUnique({
      where: {
        tenantId_vendorCode: {
          tenantId,
          vendorCode: dto.vendorCode,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(`Vendor code ${dto.vendorCode} already exists`);
    }

    const { categories, ...vendorData } = dto;

    return this.prisma.vendor.create({
      data: {
        ...vendorData,
        tenantId,
        createdById: userId,
        categories: categories
          ? {
              create: categories.map((name) => ({
                name,
                tenantId,
              })),
            }
          : undefined,
      },
      include: {
        categories: true,
        contacts: true,
        priceAgreements: {
          include: {
            sku: true,
          },
        },
      },
    });
  }

  async findAll(tenantId: string, query: VendorQueryDto) {
    const { status, type, search, page = 1, limit = 50 } = query;

    const where: Prisma.VendorWhereInput = {
      tenantId,
      ...(status && { status }),
      ...(type && { type }),
      ...(search && {
        OR: [
          { companyName: { contains: search, mode: 'insensitive' } },
          { displayName: { contains: search, mode: 'insensitive' } },
          { vendorCode: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [vendors, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where,
        include: {
          categories: true,
          contacts: {
            where: { isPrimary: true },
            take: 1,
          },
          _count: {
            select: {
              priceAgreements: true,
              performanceReviews: true,
            },
          },
        },
        orderBy: { companyName: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.vendor.count({ where }),
    ]);

    return {
      vendors,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(tenantId: string, id: string) {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id, tenantId },
      include: {
        categories: true,
        contacts: {
          orderBy: [{ isPrimary: 'desc' }, { firstName: 'asc' }],
        },
        priceAgreements: {
          where: { isActive: true },
          include: {
            sku: true,
          },
          orderBy: { effectiveDate: 'desc' },
        },
        performanceReviews: {
          orderBy: { reviewDate: 'desc' },
          take: 5,
          include: {
            reviewedBy: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  async update(tenantId: string, id: string, dto: UpdateVendorDto) {
    await this.findOne(tenantId, id);

    return this.prisma.vendor.update({
      where: { id },
      data: dto,
      include: {
        categories: true,
        contacts: true,
      },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    // Check if vendor has active price agreements
    const activePriceAgreements = await this.prisma.vendorPriceAgreement.count({
      where: {
        vendorId: id,
        isActive: true,
      },
    });

    if (activePriceAgreements > 0) {
      throw new BadRequestException(
        `Cannot delete vendor with ${activePriceAgreements} active price agreements. Deactivate agreements first.`,
      );
    }

    return this.prisma.vendor.delete({
      where: { id },
    });
  }

  // Vendor Contacts
  async createContact(tenantId: string, vendorId: string, dto: CreateVendorContactDto) {
    await this.findOne(tenantId, vendorId);

    // If this is set as primary, unset others
    if (dto.isPrimary) {
      await this.prisma.vendorContact.updateMany({
        where: { vendorId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    return this.prisma.vendorContact.create({
      data: {
        ...dto,
        tenantId,
        vendorId,
      },
    });
  }

  async getContacts(tenantId: string, vendorId: string) {
    await this.findOne(tenantId, vendorId);

    return this.prisma.vendorContact.findMany({
      where: { tenantId, vendorId },
      orderBy: [{ isPrimary: 'desc' }, { firstName: 'asc' }],
    });
  }

  async updateContact(tenantId: string, vendorId: string, contactId: string, dto: Partial<CreateVendorContactDto>) {
    const contact = await this.prisma.vendorContact.findFirst({
      where: { id: contactId, vendorId, tenantId },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    if (dto.isPrimary) {
      await this.prisma.vendorContact.updateMany({
        where: { vendorId, isPrimary: true, id: { not: contactId } },
        data: { isPrimary: false },
      });
    }

    return this.prisma.vendorContact.update({
      where: { id: contactId },
      data: dto,
    });
  }

  async deleteContact(tenantId: string, vendorId: string, contactId: string) {
    const contact = await this.prisma.vendorContact.findFirst({
      where: { id: contactId, vendorId, tenantId },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return this.prisma.vendorContact.delete({
      where: { id: contactId },
    });
  }

  // Price Agreements
  async createPriceAgreement(tenantId: string, vendorId: string, dto: CreatePriceAgreementDto) {
    await this.findOne(tenantId, vendorId);

    // Verify SKU exists
    const sku = await this.prisma.sKU.findFirst({
      where: { id: dto.skuId, tenantId },
    });

    if (!sku) {
      throw new NotFoundException('SKU not found');
    }

    return this.prisma.vendorPriceAgreement.create({
      data: {
        ...dto,
        effectiveDate: new Date(dto.effectiveDate),
        expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : null,
        tenantId,
        vendorId,
      },
      include: {
        sku: true,
      },
    });
  }

  async getPriceAgreements(tenantId: string, vendorId: string, activeOnly = false) {
    await this.findOne(tenantId, vendorId);

    return this.prisma.vendorPriceAgreement.findMany({
      where: {
        tenantId,
        vendorId,
        ...(activeOnly && { isActive: true }),
      },
      include: {
        sku: true,
      },
      orderBy: { effectiveDate: 'desc' },
    });
  }

  async updatePriceAgreement(tenantId: string, vendorId: string, agreementId: string, data: Partial<CreatePriceAgreementDto>) {
    const agreement = await this.prisma.vendorPriceAgreement.findFirst({
      where: { id: agreementId, vendorId, tenantId },
    });

    if (!agreement) {
      throw new NotFoundException('Price agreement not found');
    }

    return this.prisma.vendorPriceAgreement.update({
      where: { id: agreementId },
      data: {
        ...data,
        ...(data.effectiveDate && { effectiveDate: new Date(data.effectiveDate) }),
        ...(data.expirationDate && { expirationDate: new Date(data.expirationDate) }),
      },
      include: {
        sku: true,
      },
    });
  }

  async deactivatePriceAgreement(tenantId: string, vendorId: string, agreementId: string) {
    const agreement = await this.prisma.vendorPriceAgreement.findFirst({
      where: { id: agreementId, vendorId, tenantId },
    });

    if (!agreement) {
      throw new NotFoundException('Price agreement not found');
    }

    return this.prisma.vendorPriceAgreement.update({
      where: { id: agreementId },
      data: { isActive: false },
    });
  }

  // Performance Reviews
  async createPerformanceReview(tenantId: string, userId: string, vendorId: string, dto: CreatePerformanceReviewDto) {
    await this.findOne(tenantId, vendorId);

    const overallRating = (
      (dto.qualityRating + dto.deliveryRating + dto.serviceRating + dto.pricingRating) / 4
    );

    const review = await this.prisma.vendorPerformanceReview.create({
      data: {
        ...dto,
        reviewPeriodStart: new Date(dto.reviewPeriodStart),
        reviewPeriodEnd: new Date(dto.reviewPeriodEnd),
        overallRating,
        tenantId,
        vendorId,
        reviewedById: userId,
      },
      include: {
        reviewedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update vendor's overall rating based on recent reviews
    await this.updateVendorRating(vendorId);

    return review;
  }

  async getPerformanceReviews(tenantId: string, vendorId: string) {
    await this.findOne(tenantId, vendorId);

    return this.prisma.vendorPerformanceReview.findMany({
      where: { tenantId, vendorId },
      include: {
        reviewedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { reviewDate: 'desc' },
    });
  }

  private async updateVendorRating(vendorId: string) {
    const recentReviews = await this.prisma.vendorPerformanceReview.findMany({
      where: { vendorId },
      orderBy: { reviewDate: 'desc' },
      take: 5,
    });

    if (recentReviews.length === 0) return;

    const avgRating = recentReviews.reduce((sum, r) => sum + Number(r.overallRating), 0) / recentReviews.length;

    await this.prisma.vendor.update({
      where: { id: vendorId },
      data: { 
        rating: Math.round(avgRating),
        qualityRating: avgRating,
      },
    });
  }

  // Statistics
  async getStats(tenantId: string) {
    const [total, active, byType, topRated] = await Promise.all([
      this.prisma.vendor.count({ where: { tenantId } }),
      this.prisma.vendor.count({ where: { tenantId, status: VendorStatus.ACTIVE } }),
      this.prisma.vendor.groupBy({
        by: ['type'],
        where: { tenantId },
        _count: true,
      }),
      this.prisma.vendor.findMany({
        where: { 
          tenantId,
          status: VendorStatus.ACTIVE,
          rating: { not: null },
        },
        orderBy: { rating: 'desc' },
        take: 5,
        select: {
          id: true,
          companyName: true,
          vendorCode: true,
          rating: true,
          type: true,
        },
      }),
    ]);

    return {
      total,
      active,
      byType,
      topRated,
    };
  }
}
