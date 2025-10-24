import { IsString, IsInt, IsBoolean, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateCustomerPerformanceDto {
  @IsString()
  accountId: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalJobsCompleted?: number;

  @IsOptional()
  @IsNumber()
  averageTicketValue?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  serviceCallFrequency?: number;

  @IsOptional()
  @IsDateString()
  lastServiceDate?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  averagePaymentTime?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  latePayments?: number;

  @IsOptional()
  @IsBoolean()
  activePaymentPlan?: boolean;

  @IsOptional()
  @IsNumber()
  totalRevenueYTD?: number;

  @IsOptional()
  @IsNumber()
  totalCostToServe?: number;

  @IsOptional()
  @IsNumber()
  grossMarginPercent?: number;

  @IsOptional()
  @IsBoolean()
  discountsGiven?: boolean;

  @IsOptional()
  @IsBoolean()
  maintenancePlanEnrolled?: boolean;

  @IsOptional()
  @IsBoolean()
  respondsToUpsell?: boolean;

  @IsOptional()
  @IsBoolean()
  reviewLeft?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  referralsCount?: number;

  @IsOptional()
  @IsNumber()
  cancellationRate?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  disputesCount?: number;

  @IsOptional()
  @IsBoolean()
  specialHandlingRequired?: boolean;

  @IsOptional()
  @IsString()
  handlingNotes?: string;
}
