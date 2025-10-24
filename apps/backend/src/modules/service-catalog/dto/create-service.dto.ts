import { IsString, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateServiceDto {
  @ApiProperty()
  @IsString()
  serviceCode: string;

  @ApiProperty()
  @IsString()
  serviceName: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subcategory?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ default: 'flat_rate' })
  @IsString()
  pricingType: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  basePrice: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  estimatedHours?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  laborRateOverride?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  skillLevelRequired?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  durationMinutes?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  warrantyDays?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  requiresPermit?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isEmergency?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  includedParts?: any;

  @ApiPropertyOptional()
  @IsOptional()
  recommendedParts?: any;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isSeasonalService?: boolean;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  availableSeasons?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  internalNotes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  customerFacingNotes?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  displayOrder?: number;
}
