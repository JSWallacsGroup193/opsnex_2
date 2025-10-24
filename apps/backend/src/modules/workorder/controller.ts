import { Controller, Get, Post, Body, Param, Put, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { WorkOrderService } from './service';
import { WorkOrderStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('work-orders')
@UseGuards(JwtAuthGuard)
export class WorkOrderController {
  constructor(private readonly service: WorkOrderService) {}

  @Get('stats')
  getStats(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.getStats(tenantId);
  }

  @Get()
  findAll(@Req() req: any, @Query('equipmentId') equipmentId?: string) {
    const tenantId = req.user.tenantId;
    return this.service.findAll(tenantId, equipmentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.findOne(id, tenantId);
  }

  @Post()
  create(@Body() body: { title: string; description?: string }, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.create({ ...body, tenantId });
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: WorkOrderStatus }, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.updateStatus(id, body.status, tenantId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.delete(id, tenantId);
  }
}
