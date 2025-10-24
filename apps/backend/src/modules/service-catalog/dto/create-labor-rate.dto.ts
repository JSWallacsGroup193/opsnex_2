import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateLaborRateDto {
  @ApiProperty()
  @IsString()
  rateName: string;

  @ApiProperty()
  @IsString()
  rateType: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  skillLevel?: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  hourlyRate: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  afterHoursMultiplier?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
