import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticatedRequest } from '../../common/request.types';
import { FieldCalculationService } from './service';
import { CreateFieldCalculationDto, FieldCalculationResponseDto } from './dto';

@ApiTags('field-calculations')
@ApiBearerAuth()
@Controller('field-calculations')
export class FieldCalculationController {
  constructor(private readonly fieldCalculationService: FieldCalculationService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Save a field calculation' })
  @ApiResponse({ status: 201, description: 'Calculation saved successfully', type: FieldCalculationResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateFieldCalculationDto
  ) {
    const { calculatorType, category, inputs, results, workOrderId, notes } = dto;

    return this.fieldCalculationService.create({
      tenantId: req.user.tenantId,
      technicianId: req.user.id,
      calculatorType,
      category,
      inputs,
      results,
      workOrderId,
      notes,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all field calculations' })
  @ApiResponse({ status: 200, description: 'List of calculations', type: [FieldCalculationResponseDto] })
  async findAll(@Req() req: AuthenticatedRequest, @Query('workOrderId') workOrderId?: string) {
    return this.fieldCalculationService.findAll(req.user.tenantId, workOrderId);
  }

  @Get('technician/:technicianId')
  @ApiOperation({ summary: 'Get calculations by technician' })
  @ApiResponse({ status: 200, description: 'List of calculations by technician', type: [FieldCalculationResponseDto] })
  async findByTechnician(@Req() req: AuthenticatedRequest, @Param('technicianId') technicianId: string) {
    return this.fieldCalculationService.findByTechnician(
      technicianId,
      req.user.tenantId
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific field calculation' })
  @ApiResponse({ status: 200, description: 'Calculation found', type: FieldCalculationResponseDto })
  @ApiResponse({ status: 404, description: 'Calculation not found' })
  async findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.fieldCalculationService.findOne(id, req.user.tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a field calculation' })
  @ApiResponse({ status: 200, description: 'Calculation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Calculation not found' })
  async delete(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.fieldCalculationService.delete(id, req.user.tenantId);
  }

  @Put(':calculationId/attach')
  @ApiOperation({ summary: 'Attach calculation to work order' })
  @ApiResponse({ status: 200, description: 'Calculation attached successfully', type: FieldCalculationResponseDto })
  @ApiResponse({ status: 404, description: 'Calculation not found' })
  async attachToWorkOrder(
    @Req() req: AuthenticatedRequest,
    @Param('calculationId') calculationId: string,
    @Body() body: { workOrderId: string }
  ) {
    return this.fieldCalculationService.attachToWorkOrder(
      calculationId,
      body.workOrderId,
      req.user.tenantId
    );
  }
}
