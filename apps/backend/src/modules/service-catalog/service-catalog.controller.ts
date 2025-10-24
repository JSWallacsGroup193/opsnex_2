import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ServiceCatalogService } from './service-catalog.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateBundleDto } from './dto/create-bundle.dto';
import { CreateLaborRateDto } from './dto/create-labor-rate.dto';

@ApiTags('Service Catalog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('service-catalog')
export class ServiceCatalogController {
  constructor(private readonly serviceCatalogService: ServiceCatalogService) {}

  @Get('services')
  @ApiOperation({ summary: 'Get all services in catalog' })
  async getServices(
    @Req() req: any,
    @Query('category') category?: string,
    @Query('active') active?: boolean,
  ) {
    const tenantId = req.user.tenantId;
    return this.serviceCatalogService.getServices(tenantId, { category, active });
  }

  @Get('services/:id')
  @ApiOperation({ summary: 'Get service by ID' })
  async getService(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.user.tenantId;
    return this.serviceCatalogService.getServiceById(tenantId, id);
  }

  @Post('services')
  @ApiOperation({ summary: 'Create new service' })
  async createService(@Req() req: any, @Body() dto: CreateServiceDto) {
    const tenantId = req.user.tenantId;
    return this.serviceCatalogService.createService(tenantId, dto);
  }

  @Put('services/:id')
  @ApiOperation({ summary: 'Update service' })
  async updateService(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    const tenantId = req.user.tenantId;
    return this.serviceCatalogService.updateService(tenantId, id, dto);
  }

  @Delete('services/:id')
  @ApiOperation({ summary: 'Delete service' })
  async deleteService(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.user.tenantId;
    return this.serviceCatalogService.deleteService(tenantId, id);
  }

  @Get('bundles')
  @ApiOperation({ summary: 'Get all service bundles' })
  async getBundles(@Req() req: any, @Query('active') active?: boolean) {
    const tenantId = req.user.tenantId;
    return this.serviceCatalogService.getBundles(tenantId, { active });
  }

  @Get('bundles/:id')
  @ApiOperation({ summary: 'Get bundle by ID' })
  async getBundle(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.user.tenantId;
    return this.serviceCatalogService.getBundleById(tenantId, id);
  }

  @Post('bundles')
  @ApiOperation({ summary: 'Create service bundle' })
  async createBundle(@Req() req: any, @Body() dto: CreateBundleDto) {
    const tenantId = req.user.tenantId;
    return this.serviceCatalogService.createBundle(tenantId, dto);
  }

  @Put('bundles/:id')
  @ApiOperation({ summary: 'Update service bundle' })
  async updateBundle(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: CreateBundleDto,
  ) {
    const tenantId = req.user.tenantId;
    return this.serviceCatalogService.updateBundle(tenantId, id, dto);
  }

  @Delete('bundles/:id')
  @ApiOperation({ summary: 'Delete service bundle' })
  async deleteBundle(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.user.tenantId;
    return this.serviceCatalogService.deleteBundle(tenantId, id);
  }

  @Get('labor-rates')
  @ApiOperation({ summary: 'Get all labor rates' })
  async getLaborRates(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.serviceCatalogService.getLaborRates(tenantId);
  }

  @Post('labor-rates')
  @ApiOperation({ summary: 'Create labor rate' })
  async createLaborRate(@Req() req: any, @Body() dto: CreateLaborRateDto) {
    const tenantId = req.user.tenantId;
    return this.serviceCatalogService.createLaborRate(tenantId, dto);
  }

  @Put('labor-rates/:id')
  @ApiOperation({ summary: 'Update labor rate' })
  async updateLaborRate(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: CreateLaborRateDto,
  ) {
    const tenantId = req.user.tenantId;
    return this.serviceCatalogService.updateLaborRate(tenantId, id, dto);
  }

  @Delete('labor-rates/:id')
  @ApiOperation({ summary: 'Delete labor rate' })
  async deleteLaborRate(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.user.tenantId;
    return this.serviceCatalogService.deleteLaborRate(tenantId, id);
  }
}
