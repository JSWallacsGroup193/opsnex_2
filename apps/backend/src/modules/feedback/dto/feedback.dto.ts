import { IsString, IsInt, IsEmail, IsOptional, Min, Max, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty({ enum: ['bug', 'feature_request', 'complaint', 'praise', 'other'] })
  @IsString()
  @IsIn(['bug', 'feature_request', 'complaint', 'praise', 'other'])
  category: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pageUrl?: string;
}

export class UpdateFeedbackDto {
  @ApiPropertyOptional({ enum: ['new', 'reviewed', 'in_progress', 'resolved', 'dismissed'] })
  @IsOptional()
  @IsString()
  @IsIn(['new', 'reviewed', 'in_progress', 'resolved', 'dismissed'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminNotes?: string;
}

export class QueryFeedbackDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;
}
