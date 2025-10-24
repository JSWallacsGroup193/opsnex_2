import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto, UpdatePropertyDto } from './dto';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreatePropertyDto) {
    const tenantId = req.user.tenantId;
    return this.propertyService.create(tenantId, dto);
  }

  @Get()
  findAll(@Request() req: any, @Query('accountId') accountId?: string) {
    const tenantId = req.user.tenantId;
    return this.propertyService.findAll(tenantId, accountId);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    const tenantId = req.user.tenantId;
    return this.propertyService.findOne(tenantId, id);
  }

  @Put(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdatePropertyDto) {
    const tenantId = req.user.tenantId;
    return this.propertyService.update(tenantId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    const tenantId = req.user.tenantId;
    return this.propertyService.remove(tenantId, id);
  }
}
