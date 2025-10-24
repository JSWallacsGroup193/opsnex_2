import { IsString, IsInt, IsOptional, IsBoolean, IsDateString, Min } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  accountId: string;

  @IsOptional()
  @IsString()
  addressId?: string;

  @IsString()
  propertyType: string; // "residential", "commercial", "industrial"

  @IsOptional()
  @IsInt()
  @Min(0)
  squareFootage?: number;

  @IsInt()
  @Min(0)
  hvacUnits: number;

  @IsOptional()
  @IsString()
  accessNotes?: string;

  @IsOptional()
  @IsString()
  gateCode?: string;

  @IsOptional()
  @IsString()
  parkingInstructions?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  buildingAge?: number;

  @IsOptional()
  @IsDateString()
  lastHvacUpgrade?: string;

  @IsOptional()
  @IsString()
  ductworkType?: string; // "metal", "flex", "fiberglass"

  @IsOptional()
  @IsString()
  insulation?: string; // "none", "standard", "high_efficiency"
}
