
import { Controller, Get, Post, Put, Delete, Body, Req, Query, ParseIntPipe, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { InventoryService } from './service';
import { CreateSkuDto } from './dto/create-sku.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('inventory')
@ApiBearerAuth()
@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Get('skus')
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'page', required: false, schema: { default: 1 } })
  @ApiQuery({ name: 'pageSize', required: false, schema: { default: 50 } })
  getSKUs(
    @Req() req: any,
    @Query('q') q?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 50,
  ) {
    const tenantId = req.user.tenantId;
    return this.service.getSKUs(tenantId, q, page, pageSize);
  }

  @Get('skus/:id')
  getSKU(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.getSKU(id, tenantId);
  }

  @Post('skus')
  createSKU(@Body() body: CreateSkuDto, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.createSKU({ ...body, tenantId });
  }

  @Put('skus/:id')
  updateSKU(@Param('id') id: string, @Body() body: { name?: string; description?: string; barcode?: string }, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.updateSKU(id, body, tenantId);
  }

  @Delete('skus/:id')
  deleteSKU(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.deleteSKU(id, tenantId);
  }

  @Get('stock-ledger/:skuId')
  getStockLedger(@Param('skuId') skuId: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.getStockLedger(skuId, tenantId);
  }

  @Post('stock-ledger')
  createStockLedgerEntry(@Body() body: {
    skuId: string;
    binId: string;
    direction: 'IN' | 'OUT';
    quantity: number;
    note?: string;
  }, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.createStockLedgerEntry({ ...body, tenantId });
  }

  @Get('warehouses')
  getWarehouses(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.getWarehouses(tenantId);
  }

  @Post('warehouses')
  createWarehouse(@Body() body: { name: string }, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.createWarehouse({ ...body, tenantId });
  }

  @Get('bins')
  getBins(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.getBins(tenantId);
  }

  @Post('bins')
  createBin(@Body() body: { warehouseId: string; name: string }, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.createBin(body, tenantId);
  }

  @Get('skus/:id/onhand')
  @ApiOkResponse({ schema: { example: { onHand: 42 } } })
  getOnHand(@Param('id') skuId: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.service.getOnHand(tenantId, skuId);
  }
}
