import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateCustomerEquipmentDto {
  @IsString()
  propertyId: string;

  @IsString()
  equipmentType: string;

  @IsString()
  @IsOptional()
  make?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsOptional()
  capacity?: string;

  @IsString()
  @IsOptional()
  efficiency?: string;

  @IsDateString()
  @IsOptional()
  installDate?: string;

  @IsString()
  @IsOptional()
  installedBy?: string;

  @IsString()
  @IsOptional()
  refrigerantType?: string;

  @IsDateString()
  @IsOptional()
  warrantyStartDate?: string;

  @IsDateString()
  @IsOptional()
  warrantyEndDate?: string;

  @IsString()
  @IsOptional()
  warrantyProvider?: string;
}
