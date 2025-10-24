import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class BundleItemDto {
  @ApiProperty()
  @IsString()
  serviceId: string;

  @ApiProperty({ default: 1 })
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  displayOrder?: number;
}

export class CreateBundleDto {
  @ApiProperty()
  @IsString()
  bundleCode: string;

  @ApiProperty()
  @IsString()
  bundleName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  bundlePrice: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  regularPrice: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  savings: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  savingsPercent: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPromotional?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @ApiProperty({ type: [BundleItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BundleItemDto)
  items: BundleItemDto[];
}
