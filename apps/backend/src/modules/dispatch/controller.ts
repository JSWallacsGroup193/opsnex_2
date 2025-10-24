import { Controller, Post, Body, Get, Param, Put, Delete, Req, UseGuards } from '@nestjs/common';
import { DispatchService } from './service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dispatch')
@UseGuards(JwtAuthGuard)
export class DispatchController {
  constructor(private readonly service: DispatchService) {}

  @Post()
  create(@Body() body: { workOrderId: string; technicianId: string; startTime: string; endTime: string }, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.createSlot({
      ...body,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
    }, tenantId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { technicianId?: string | null; startTime?: string; endTime?: string; status?: string },
    @Req() req: any
  ) {
    const tenantId = req.user.tenantId;
    return this.service.updateSlot(id, {
      ...body,
      startTime: body.startTime ? new Date(body.startTime) : undefined,
      endTime: body.endTime ? new Date(body.endTime) : undefined,
    }, tenantId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.deleteSlot(id, tenantId);
  }

  @Get('technician/:id')
  getForTechnician(@Param('id') technicianId: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.getTechnicianSlots(technicianId, tenantId);
  }

  @Get('all')
  getAll(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.getAllSlots(tenantId);
  }
}
