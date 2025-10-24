import { Controller, Get, Post, Put, Delete, Body, Param, Request } from '@nestjs/common';
import { CustomerPerformanceService } from './customer-performance.service';
import { CreateCustomerPerformanceDto, UpdateCustomerPerformanceDto } from './dto';

@Controller('customer-performance')
export class CustomerPerformanceController {
  constructor(private readonly customerPerformanceService: CustomerPerformanceService) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreateCustomerPerformanceDto) {
    const tenantId = req.user.tenantId;
    return this.customerPerformanceService.create(tenantId, dto);
  }

  @Get()
  findAll(@Request() req: any) {
    const tenantId = req.user.tenantId;
    return this.customerPerformanceService.findAll(tenantId);
  }

  @Get('account/:accountId')
  findByAccountId(@Request() req: any, @Param('accountId') accountId: string) {
    const tenantId = req.user.tenantId;
    return this.customerPerformanceService.findByAccountId(tenantId, accountId);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    const tenantId = req.user.tenantId;
    return this.customerPerformanceService.findOne(tenantId, id);
  }

  @Put(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateCustomerPerformanceDto) {
    const tenantId = req.user.tenantId;
    return this.customerPerformanceService.update(tenantId, id, dto);
  }

  @Post('recalculate/:accountId')
  recalculate(@Request() req: any, @Param('accountId') accountId: string) {
    const tenantId = req.user.tenantId;
    return this.customerPerformanceService.recalculate(tenantId, accountId);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    const tenantId = req.user.tenantId;
    return this.customerPerformanceService.remove(tenantId, id);
  }
}
