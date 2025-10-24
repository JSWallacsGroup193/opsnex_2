import { IsString, IsNotEmpty, IsOptional, IsObject, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const VALID_CATEGORIES = ['electrical', 'refrigeration', 'airflow', 'gas', 'hydronic', 'utility'] as const;

export class CreateFieldCalculationDto {
  @ApiProperty({ description: 'Calculator type/name', example: 'Ohm\'s Law' })
  @IsString()
  @IsNotEmpty()
  calculatorType: string;

  @ApiProperty({
    description: 'Calculator category',
    enum: VALID_CATEGORIES,
    example: 'electrical',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(VALID_CATEGORIES)
  category: string;

  @ApiProperty({
    description: 'Calculator input data as JSON',
    example: { voltage: 120, current: 10, resistance: 12 },
  })
  @IsObject()
  @IsNotEmpty()
  inputs: Record<string, any>;

  @ApiProperty({
    description: 'Calculator result data as JSON',
    example: { V: 120, I: 10, R: 12, P: 1200 },
  })
  @IsObject()
  @IsNotEmpty()
  results: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Work order ID to attach calculation to',
    example: 'wo-uuid-123',
  })
  @IsString()
  @IsOptional()
  workOrderId?: string;

  @ApiPropertyOptional({
    description: 'Optional notes about the calculation',
    example: 'Measured at main panel',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class FieldCalculationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  technicianId: string;

  @ApiProperty()
  calculatorType: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  inputs: Record<string, any>;

  @ApiProperty()
  results: Record<string, any>;

  @ApiPropertyOptional()
  workOrderId?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  isAttached: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  technician: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };

  @ApiPropertyOptional()
  workOrder?: {
    id: string;
    number: string;
    title: string;
  };
}
