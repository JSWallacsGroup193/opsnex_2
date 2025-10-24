import { IsIn, IsOptional, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class QuickEstimateInput {
  @IsIn(['installation', 'replacement', 'repair'])
  jobType: 'installation' | 'replacement' | 'repair';

  @IsOptional()
  @IsNumber()
  squareFootage?: number;

  @IsOptional()
  @IsNumber()
  tonnage?: number;

  @IsIn(['budget', 'standard', 'premium'])
  equipmentTier: 'budget' | 'standard' | 'premium';

  @IsNumber()
  laborHours: number;

  @IsString()
  zipCode: string;

  @IsOptional()
  @IsString()
  specialConditions?: string;
}

export class ComprehensiveEstimateInput {
  projectInfo: object;
  laborInputs: object;
  equipmentMaterials: object;
  permitCosts: object;
  overhead: object;
  profit: object;
  rebates: object;
  options: object;
  siteComplexity: object;
  geo: object;
  packaging: object;
}

export class CreateEstimateDto {
  @IsIn(['quick', 'comprehensive'])
  estimateMode: 'quick' | 'comprehensive';

  @IsOptional()
  @ValidateNested()
  @Type(() => QuickEstimateInput)
  quickData?: QuickEstimateInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => ComprehensiveEstimateInput)
  comprehensiveData?: ComprehensiveEstimateInput;
}
