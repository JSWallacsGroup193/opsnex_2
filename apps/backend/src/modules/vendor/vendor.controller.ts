import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VendorService } from './vendor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateVendorDto,
  UpdateVendorDto,
  CreateVendorContactDto,
  CreatePriceAgreementDto,
  CreatePerformanceReviewDto,
  VendorQueryDto,
} from './dto';

@ApiTags('vendors')
@Controller('vendors')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VendorController {
  constructor(private vendorService: VendorService) {}

  @Post()
  @ApiOperation({ summary: 'Create new vendor' })
  async create(@Request() req, @Body() dto: CreateVendorDto) {
    return this.vendorService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vendors' })
  async findAll(@Request() req, @Query() query: VendorQueryDto) {
    return this.vendorService.findAll(req.user.tenantId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get vendor statistics' })
  async getStats(@Request() req) {
    return this.vendorService.getStats(req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vendor by ID' })
  async findOne(@Request() req, @Param('id') id: string) {
    return this.vendorService.findOne(req.user.tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update vendor' })
  async update(@Request() req, @Param('id') id: string, @Body() dto: UpdateVendorDto) {
    return this.vendorService.update(req.user.tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vendor' })
  async delete(@Request() req, @Param('id') id: string) {
    return this.vendorService.delete(req.user.tenantId, id);
  }

  // Vendor Contacts
  @Post(':id/contacts')
  @ApiOperation({ summary: 'Add contact to vendor' })
  async createContact(
    @Request() req,
    @Param('id') vendorId: string,
    @Body() dto: CreateVendorContactDto,
  ) {
    return this.vendorService.createContact(req.user.tenantId, vendorId, dto);
  }

  @Get(':id/contacts')
  @ApiOperation({ summary: 'Get vendor contacts' })
  async getContacts(@Request() req, @Param('id') vendorId: string) {
    return this.vendorService.getContacts(req.user.tenantId, vendorId);
  }

  @Put(':id/contacts/:contactId')
  @ApiOperation({ summary: 'Update vendor contact' })
  async updateContact(
    @Request() req,
    @Param('id') vendorId: string,
    @Param('contactId') contactId: string,
    @Body() dto: Partial<CreateVendorContactDto>,
  ) {
    return this.vendorService.updateContact(req.user.tenantId, vendorId, contactId, dto);
  }

  @Delete(':id/contacts/:contactId')
  @ApiOperation({ summary: 'Delete vendor contact' })
  async deleteContact(
    @Request() req,
    @Param('id') vendorId: string,
    @Param('contactId') contactId: string,
  ) {
    return this.vendorService.deleteContact(req.user.tenantId, vendorId, contactId);
  }

  // Price Agreements
  @Post(':id/price-agreements')
  @ApiOperation({ summary: 'Create price agreement' })
  async createPriceAgreement(
    @Request() req,
    @Param('id') vendorId: string,
    @Body() dto: CreatePriceAgreementDto,
  ) {
    return this.vendorService.createPriceAgreement(req.user.tenantId, vendorId, dto);
  }

  @Get(':id/price-agreements')
  @ApiOperation({ summary: 'Get vendor price agreements' })
  async getPriceAgreements(
    @Request() req,
    @Param('id') vendorId: string,
    @Query('activeOnly') activeOnly?: boolean,
  ) {
    return this.vendorService.getPriceAgreements(req.user.tenantId, vendorId, activeOnly);
  }

  @Put(':id/price-agreements/:agreementId')
  @ApiOperation({ summary: 'Update price agreement' })
  async updatePriceAgreement(
    @Request() req,
    @Param('id') vendorId: string,
    @Param('agreementId') agreementId: string,
    @Body() dto: Partial<CreatePriceAgreementDto>,
  ) {
    return this.vendorService.updatePriceAgreement(req.user.tenantId, vendorId, agreementId, dto);
  }

  @Delete(':id/price-agreements/:agreementId')
  @ApiOperation({ summary: 'Deactivate price agreement' })
  async deactivatePriceAgreement(
    @Request() req,
    @Param('id') vendorId: string,
    @Param('agreementId') agreementId: string,
  ) {
    return this.vendorService.deactivatePriceAgreement(req.user.tenantId, vendorId, agreementId);
  }

  // Performance Reviews
  @Post(':id/performance-reviews')
  @ApiOperation({ summary: 'Create performance review' })
  async createPerformanceReview(
    @Request() req,
    @Param('id') vendorId: string,
    @Body() dto: CreatePerformanceReviewDto,
  ) {
    return this.vendorService.createPerformanceReview(req.user.tenantId, req.user.sub, vendorId, dto);
  }

  @Get(':id/performance-reviews')
  @ApiOperation({ summary: 'Get vendor performance reviews' })
  async getPerformanceReviews(@Request() req, @Param('id') vendorId: string) {
    return this.vendorService.getPerformanceReviews(req.user.tenantId, vendorId);
  }
}
