import { Controller, Post, Get, Put, Delete, UseGuards, Request, Body, Param, Query } from '@nestjs/common';
import { EstimatorService } from './estimator.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEstimateDto } from './dto/create-estimate.dto';
import { EstimateResponseDto } from './dto/estimate-response.dto';
import { CreateManualEstimateDto } from './dto/create-manual-estimate.dto';
import { UpdateManualEstimateDto } from './dto/update-manual-estimate.dto';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';

@Controller('estimator')
export class EstimatorController {
  constructor(private readonly estimatorService: EstimatorService) {}

  @Post('calculate')
  @UseGuards(JwtAuthGuard)
  async calculateEstimate(
    @Request() req,
    @Body() dto: CreateEstimateDto
  ): Promise<EstimateResponseDto> {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;
    return this.estimatorService.calculate(tenantId, userId, dto);
  }

  @Post('manual')
  @UseGuards(JwtAuthGuard)
  async createManualEstimate(@Request() req, @Body() dto: CreateManualEstimateDto) {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;
    return this.estimatorService.createManualEstimate(tenantId, userId, dto);
  }

  @Put('manual/:id')
  @UseGuards(JwtAuthGuard)
  async updateManualEstimate(
    @Request() req,
    @Param('id') estimateId: string,
    @Body() dto: UpdateManualEstimateDto
  ) {
    const tenantId = req.user.tenantId;
    return this.estimatorService.updateManualEstimate(tenantId, estimateId, dto);
  }

  @Get('estimates')
  @UseGuards(JwtAuthGuard)
  async listEstimates(@Request() req, @Query('type') type?: 'ai' | 'manual') {
    const tenantId = req.user.tenantId;
    return this.estimatorService.listEstimates(tenantId, type);
  }

  @Get('estimates/:id')
  @UseGuards(JwtAuthGuard)
  async getEstimate(@Request() req, @Param('id') estimateId: string) {
    const tenantId = req.user.tenantId;
    return this.estimatorService.getEstimateById(tenantId, estimateId);
  }

  @Delete('estimates/:id')
  @UseGuards(JwtAuthGuard)
  async deleteEstimate(@Request() req, @Param('id') estimateId: string) {
    const tenantId = req.user.tenantId;
    return this.estimatorService.deleteEstimate(tenantId, estimateId);
  }

  @Post('proposals')
  @UseGuards(JwtAuthGuard)
  async createProposal(@Request() req, @Body() dto: CreateProposalDto) {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;
    return this.estimatorService.createProposal(tenantId, userId, dto);
  }

  @Post('proposals/convert/:estimateId')
  @UseGuards(JwtAuthGuard)
  async convertEstimateToProposal(@Request() req, @Param('estimateId') estimateId: string) {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;
    return this.estimatorService.convertEstimateToProposal(tenantId, userId, estimateId);
  }

  @Put('proposals/:id')
  @UseGuards(JwtAuthGuard)
  async updateProposal(
    @Request() req,
    @Param('id') proposalId: string,
    @Body() dto: UpdateProposalDto
  ) {
    const tenantId = req.user.tenantId;
    return this.estimatorService.updateProposal(tenantId, proposalId, dto);
  }

  @Get('proposals')
  @UseGuards(JwtAuthGuard)
  async listProposals(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const tenantId = req.user.tenantId;
    
    // Safely parse pagination parameters, default to valid values if invalid
    const parsedPage = page ? parseInt(page, 10) : 1;
    const parsedLimit = limit ? parseInt(limit, 10) : 20;
    
    const pageNum = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
    const limitNum = Number.isNaN(parsedLimit) || parsedLimit < 1 ? 20 : Math.min(parsedLimit, 100);
    
    return this.estimatorService.listProposals(tenantId, pageNum, limitNum);
  }

  @Get('proposals/:id')
  @UseGuards(JwtAuthGuard)
  async getProposal(@Request() req, @Param('id') proposalId: string) {
    const tenantId = req.user.tenantId;
    return this.estimatorService.getProposalById(tenantId, proposalId);
  }

  @Delete('proposals/:id')
  @UseGuards(JwtAuthGuard)
  async deleteProposal(@Request() req, @Param('id') proposalId: string) {
    const tenantId = req.user.tenantId;
    return this.estimatorService.deleteProposal(tenantId, proposalId);
  }
}
