
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreatePoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiProperty()
  @IsUUID()
  skuId!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity!: number;
}
