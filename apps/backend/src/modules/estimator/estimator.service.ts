import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../../common/prisma.service';
import { CreateEstimateDto } from './dto/create-estimate.dto';
import { EstimateResponseDto } from './dto/estimate-response.dto';
import { CreateManualEstimateDto } from './dto/create-manual-estimate.dto';
import { UpdateManualEstimateDto } from './dto/update-manual-estimate.dto';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { EstimateResponseSchema } from './aiEstimateValidator';
import * as fs from 'fs';
import * as path from 'path';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class EstimatorService {
  private readonly openai: OpenAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY') || 'sk-dummy-key',
    });
  }

  async calculate(tenantId: string, userId: string, dto: CreateEstimateDto): Promise<EstimateResponseDto> {
    const promptPath = path.join(process.cwd(), 'prompts', 'AI_Cost_Estimator_Prompt.md');
    const systemPrompt = fs.readFileSync(promptPath, 'utf8');

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(dto) },
      ],
      response_format: { type: 'json_object' },
    });

    const aiResponse = response.choices[0].message?.content;
    if (!aiResponse) {
      throw new InternalServerErrorException('AI returned empty response');
    }

    let parsed;
    try {
      const raw = JSON.parse(aiResponse);
      parsed = EstimateResponseSchema.parse(raw);
    } catch (err) {
      if (err instanceof SyntaxError) {
        throw new InternalServerErrorException('AI response not valid JSON');
      }
      if (err.name === 'ZodError') {
        throw new BadRequestException('AI response failed schema validation');
      }
      throw new InternalServerErrorException('Unknown AI parsing error');
    }

    await this.prisma.estimate.create({
      data: {
        tenantId,
        estimateType: 'ai',
        estimateMode: dto.estimateMode,
        inputData: dto as any,
        outputData: parsed as any,
        laborHours: new Decimal(parsed.internal_calculations.laborHours),
        laborCost: new Decimal(parsed.internal_calculations.laborCost),
        materialsCost: new Decimal(parsed.internal_calculations.materialsCost),
        permitsCost: new Decimal(parsed.internal_calculations.permitsCost),
        overheadCost: new Decimal(parsed.internal_calculations.overheadCost),
        totalEstimate: new Decimal(parsed.internal_calculations.totalCost),
        finalPrice: new Decimal(parsed.customer_summary.finalPrice),
        profitMargin: new Decimal(parsed.internal_calculations.profitMargin),
        createdBy: userId,
      },
    });

    return parsed;
  }

  async createManualEstimate(tenantId: string, userId: string, dto: CreateManualEstimateDto) {
    // Validation: Comprehensive mode requires at least one line item
    if (dto.estimateMode === 'comprehensive' && (!dto.lineItems || dto.lineItems.length === 0)) {
      throw new BadRequestException('Comprehensive mode requires at least one line item');
    }

    let subtotal = 0;
    let laborCost = 0;
    let materialsCost = 0;
    let permitsCost = 0;
    let overheadCost = 0;

    if (dto.estimateMode === 'comprehensive' && dto.lineItems && dto.lineItems.length > 0) {
      subtotal = dto.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    } else {
      laborCost = dto.laborCost || 0;
      materialsCost = dto.materialsCost || 0;
      permitsCost = dto.permitsCost || 0;
      overheadCost = dto.overheadCost || 0;
      subtotal = laborCost + materialsCost + permitsCost + overheadCost;
    }

    const profitMarginPct = dto.profitMargin || 0;
    const profitAmount = subtotal * (profitMarginPct / 100);
    const subtotalWithProfit = subtotal + profitAmount;
    
    const taxAmount = subtotalWithProfit * ((dto.taxRate || 0) / 100);
    const finalPrice = subtotalWithProfit + taxAmount;

    // Use transaction to prevent orphaned estimates
    return this.prisma.$transaction(async (tx) => {
      const estimate = await tx.estimate.create({
        data: {
          tenantId,
          estimateType: 'manual',
          estimateMode: dto.estimateMode,
          title: dto.title,
          description: dto.description,
          projectType: dto.projectType,
          location: dto.location,
          workOrderId: dto.workOrderId,
          accountId: dto.accountId,
          laborHours: dto.laborHours ? new Decimal(dto.laborHours) : null,
          laborCost: laborCost > 0 ? new Decimal(laborCost) : null,
          materialsCost: materialsCost > 0 ? new Decimal(materialsCost) : null,
          permitsCost: permitsCost > 0 ? new Decimal(permitsCost) : null,
          overheadCost: overheadCost > 0 ? new Decimal(overheadCost) : null,
          subtotal: new Decimal(subtotal),
          taxRate: dto.taxRate ? new Decimal(dto.taxRate) : null,
          taxAmount: new Decimal(taxAmount),
          finalPrice: new Decimal(finalPrice),
          profitMargin: dto.profitMargin ? new Decimal(dto.profitMargin) : null,
          internalNotes: dto.internalNotes,
          customerNotes: dto.customerNotes,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
          createdBy: userId,
        },
      });

      if (dto.lineItems && dto.lineItems.length > 0) {
        await tx.estimateLineItem.createMany({
          data: dto.lineItems.map((item, index) => ({
            estimateId: estimate.id,
            category: item.category,
            description: item.description,
            quantity: new Decimal(item.quantity),
            unitPrice: new Decimal(item.unitPrice),
            total: new Decimal(item.quantity * item.unitPrice),
            displayOrder: index,
            notes: item.notes,
          })),
        });
      }

      // Fetch complete estimate with line items
      return tx.estimate.findUnique({
        where: { id: estimate.id },
        include: {
          lineItems: true,
          workOrder: true,
          account: true,
          creator: true,
        },
      });
    });
  }

  async updateManualEstimate(tenantId: string, estimateId: string, dto: UpdateManualEstimateDto) {
    const existing = await this.prisma.estimate.findFirst({
      where: { id: estimateId, tenantId, estimateType: 'manual' },
      include: { lineItems: true },
    });

    if (!existing) {
      throw new NotFoundException('Manual estimate not found');
    }

    let subtotal = existing.subtotal ? parseFloat(existing.subtotal.toString()) : 0;

    if (dto.lineItems !== undefined) {
      if (dto.lineItems.length > 0) {
        subtotal = dto.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      } else {
        subtotal = 0;
      }
    } else if (dto.laborCost !== undefined || dto.materialsCost !== undefined || dto.permitsCost !== undefined || dto.overheadCost !== undefined) {
      subtotal = (dto.laborCost ?? 0) + (dto.materialsCost ?? 0) + (dto.permitsCost ?? 0) + (dto.overheadCost ?? 0);
    }

    const profitMarginPct = dto.profitMargin !== undefined ? dto.profitMargin : (existing.profitMargin ? parseFloat(existing.profitMargin.toString()) : 0);
    const profitAmount = subtotal * (profitMarginPct / 100);
    const subtotalWithProfit = subtotal + profitAmount;

    const taxRate = dto.taxRate !== undefined ? dto.taxRate : (existing.taxRate ? parseFloat(existing.taxRate.toString()) : 0);
    const taxAmount = subtotalWithProfit * (taxRate / 100);
    const finalPrice = subtotalWithProfit + taxAmount;

    await this.prisma.estimate.update({
      where: { id: estimateId },
      data: {
        title: dto.title,
        description: dto.description,
        projectType: dto.projectType,
        location: dto.location,
        laborHours: dto.laborHours !== undefined ? new Decimal(dto.laborHours) : undefined,
        laborCost: dto.laborCost !== undefined ? new Decimal(dto.laborCost) : undefined,
        materialsCost: dto.materialsCost !== undefined ? new Decimal(dto.materialsCost) : undefined,
        permitsCost: dto.permitsCost !== undefined ? new Decimal(dto.permitsCost) : undefined,
        overheadCost: dto.overheadCost !== undefined ? new Decimal(dto.overheadCost) : undefined,
        subtotal: new Decimal(subtotal),
        taxRate: dto.taxRate !== undefined ? new Decimal(dto.taxRate) : undefined,
        taxAmount: new Decimal(taxAmount),
        finalPrice: new Decimal(finalPrice),
        profitMargin: dto.profitMargin !== undefined ? new Decimal(dto.profitMargin) : undefined,
        status: dto.status,
        internalNotes: dto.internalNotes,
        customerNotes: dto.customerNotes,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
    });

    if (dto.lineItems !== undefined) {
      await this.prisma.estimateLineItem.deleteMany({ where: { estimateId } });
      if (dto.lineItems.length > 0) {
        await this.prisma.estimateLineItem.createMany({
          data: dto.lineItems.map((item, index) => ({
            estimateId,
            category: item.category,
            description: item.description,
            quantity: new Decimal(item.quantity),
            unitPrice: new Decimal(item.unitPrice),
            total: new Decimal(item.quantity * item.unitPrice),
            displayOrder: index,
            notes: item.notes,
          })),
        });
      }
    }

    return this.getEstimateById(tenantId, estimateId);
  }

  async listEstimates(tenantId: string, type?: 'ai' | 'manual') {
    return this.prisma.estimate.findMany({
      where: {
        tenantId,
        ...(type && { estimateType: type }),
      },
      include: {
        lineItems: true,
        account: true,
        workOrder: true,
        creator: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEstimateById(tenantId: string, estimateId: string) {
    const estimate = await this.prisma.estimate.findFirst({
      where: { id: estimateId, tenantId },
      include: {
        lineItems: { orderBy: { displayOrder: 'asc' } },
        account: true,
        workOrder: true,
        creator: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });

    if (!estimate) {
      throw new NotFoundException('Estimate not found');
    }

    return estimate;
  }

  async deleteEstimate(tenantId: string, estimateId: string) {
    const estimate = await this.prisma.estimate.findFirst({
      where: { id: estimateId, tenantId },
    });

    if (!estimate) {
      throw new NotFoundException('Estimate not found');
    }

    await this.prisma.estimate.delete({ where: { id: estimateId } });
    return { message: 'Estimate deleted successfully' };
  }

  async createProposal(tenantId: string, userId: string, dto: CreateProposalDto) {
    const proposalNumber = await this.generateProposalNumber(tenantId);

    const proposal = await this.prisma.proposal.create({
      data: {
        tenantId,
        proposalNumber,
        estimateId: dto.estimateId,
        accountId: dto.accountId,
        workOrderId: dto.workOrderId,
        title: dto.title,
        description: dto.description,
        subtotal: new Decimal(dto.subtotal),
        taxRate: dto.taxRate ? new Decimal(dto.taxRate) : new Decimal(0),
        taxAmount: dto.taxAmount ? new Decimal(dto.taxAmount) : new Decimal(0),
        totalAmount: new Decimal(dto.totalAmount),
        paymentTerms: dto.paymentTerms,
        validityDays: dto.validityDays || 30,
        termsAndConditions: dto.termsAndConditions,
        internalNotes: dto.internalNotes,
        customerNotes: dto.customerNotes,
        createdBy: userId,
      },
    });

    if (dto.lineItems && dto.lineItems.length > 0) {
      await this.prisma.proposalLineItem.createMany({
        data: dto.lineItems.map((item, index) => ({
          proposalId: proposal.id,
          category: item.category,
          description: item.description,
          quantity: new Decimal(item.quantity),
          unitPrice: new Decimal(item.unitPrice),
          total: new Decimal(item.quantity * item.unitPrice),
          displayOrder: index,
          notes: item.notes,
        })),
      });
    }

    return this.getProposalById(tenantId, proposal.id);
  }

  async convertEstimateToProposal(tenantId: string, userId: string, estimateId: string) {
    const estimate = await this.getEstimateById(tenantId, estimateId);

    const dto: CreateProposalDto = {
      estimateId: estimate.id,
      accountId: estimate.accountId,
      workOrderId: estimate.workOrderId,
      title: estimate.title || estimate.projectType || 'Untitled Proposal',
      description: estimate.description,
      subtotal: parseFloat(estimate.subtotal?.toString() || '0'),
      taxRate: parseFloat(estimate.taxRate?.toString() || '0'),
      taxAmount: parseFloat(estimate.taxAmount?.toString() || '0'),
      totalAmount: parseFloat(estimate.finalPrice?.toString() || '0'),
      customerNotes: estimate.customerNotes,
      lineItems: estimate.lineItems.map(item => ({
        category: item.category,
        description: item.description,
        quantity: parseFloat(item.quantity.toString()),
        unitPrice: parseFloat(item.unitPrice.toString()),
        notes: item.notes,
      })),
    };

    return this.createProposal(tenantId, userId, dto);
  }

  async updateProposal(tenantId: string, proposalId: string, dto: UpdateProposalDto) {
    const existing = await this.prisma.proposal.findFirst({
      where: { id: proposalId, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Proposal not found');
    }

    await this.prisma.proposal.update({
      where: { id: proposalId },
      data: {
        title: dto.title,
        description: dto.description,
        subtotal: dto.subtotal ? new Decimal(dto.subtotal) : undefined,
        taxRate: dto.taxRate ? new Decimal(dto.taxRate) : undefined,
        taxAmount: dto.taxAmount ? new Decimal(dto.taxAmount) : undefined,
        totalAmount: dto.totalAmount ? new Decimal(dto.totalAmount) : undefined,
        status: dto.status,
        paymentTerms: dto.paymentTerms,
        validityDays: dto.validityDays,
        termsAndConditions: dto.termsAndConditions,
        internalNotes: dto.internalNotes,
        customerNotes: dto.customerNotes,
      },
    });

    if (dto.lineItems) {
      await this.prisma.proposalLineItem.deleteMany({ where: { proposalId } });
      if (dto.lineItems.length > 0) {
        await this.prisma.proposalLineItem.createMany({
          data: dto.lineItems.map((item, index) => ({
            proposalId,
            category: item.category,
            description: item.description,
            quantity: new Decimal(item.quantity),
            unitPrice: new Decimal(item.unitPrice),
            total: new Decimal(item.quantity * item.unitPrice),
            displayOrder: index,
            notes: item.notes,
          })),
        });
      }
    }

    return this.getProposalById(tenantId, proposalId);
  }

  async listProposals(tenantId: string, page = 1, limit = 20) {
    // Ensure valid pagination values
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 per page
    const skip = (validPage - 1) * validLimit;

    // Get total count and paginated data in parallel
    const [total, proposals] = await Promise.all([
      this.prisma.proposal.count({
        where: { tenantId },
      }),
      this.prisma.proposal.findMany({
        where: { tenantId },
        include: {
          lineItems: true,
          estimate: true,
          account: true,
          workOrder: true,
          creator: { select: { id: true, email: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: validLimit,
      }),
    ]);

    return {
      data: proposals,
      pagination: {
        total,
        page: validPage,
        limit: validLimit,
        totalPages: Math.ceil(total / validLimit),
        hasMore: skip + proposals.length < total,
      },
    };
  }

  async getProposalById(tenantId: string, proposalId: string) {
    const proposal = await this.prisma.proposal.findFirst({
      where: { id: proposalId, tenantId },
      include: {
        lineItems: { orderBy: { displayOrder: 'asc' } },
        estimate: true,
        account: true,
        workOrder: true,
        creator: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });

    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    return proposal;
  }

  async deleteProposal(tenantId: string, proposalId: string) {
    const proposal = await this.prisma.proposal.findFirst({
      where: { id: proposalId, tenantId },
    });

    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    await this.prisma.proposal.delete({ where: { id: proposalId } });
    return { message: 'Proposal deleted successfully' };
  }

  private async generateProposalNumber(tenantId: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.proposal.count({
      where: {
        tenantId,
        proposalNumber: { startsWith: `PROP-${year}-` },
      },
    });
    return `PROP-${year}-${String(count + 1).padStart(4, '0')}`;
  }
}
