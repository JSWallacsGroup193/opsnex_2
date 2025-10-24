import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CustomerEquipmentService } from './customer-equipment.service';
import { CreateCustomerEquipmentDto, UpdateCustomerEquipmentDto } from './dto';

@Controller('customer-equipment')
@UseGuards(JwtAuthGuard)
export class CustomerEquipmentController {
  constructor(private readonly service: CustomerEquipmentService) {}

  @Post()
  create(@Body() dto: CreateCustomerEquipmentDto, @Req() req: any) {
    return this.service.create(dto, req.user.tenantId);
  }

  @Get()
  findAll(@Req() req: any, @Query('propertyId') propertyId?: string) {
    return this.service.findAll(req.user.tenantId, propertyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.service.findOne(id, req.user.tenantId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerEquipmentDto, @Req() req: any) {
    return this.service.update(id, dto, req.user.tenantId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    return this.service.delete(id, req.user.tenantId);
  }
}
