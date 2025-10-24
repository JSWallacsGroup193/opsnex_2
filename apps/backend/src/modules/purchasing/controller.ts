
import { Controller, Get, Post, Put, Param, Body, Req, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PurchasingService } from './service';
import { CreatePoDto } from './dto/create-po.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('purchasing')
@ApiBearerAuth()
@Controller('purchasing')
@UseGuards(JwtAuthGuard)
export class PurchasingController {
  constructor(private readonly service: PurchasingService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, schema: { default: 1 } })
  @ApiQuery({ name: 'pageSize', required: false, schema: { default: 50 } })
  getAll(
    @Req() req: any,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 50,
  ) {
    const tenantId = req.user.tenantId;
    return this.service.getPOs(tenantId, page, pageSize);
  }

  @Post()
  create(@Body() body: CreatePoDto, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.createPO({ ...body, tenantId });
  }

  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.getPO(id, tenantId);
  }

  @Put(':id/receive')
  receive(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.receivePO(id, tenantId);
  }

  @Put(':id/cancel')
  cancel(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.cancelPO(id, tenantId);
  }
}
