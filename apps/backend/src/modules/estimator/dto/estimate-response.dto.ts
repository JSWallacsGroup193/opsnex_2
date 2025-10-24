export interface TierDetails {
  name: string;
  price: number;
  equipment: string;
  features: string[];
  warranty: string;
  efficiency?: string;
}

export interface EstimateResponseDto {
  estimateMode: 'quick' | 'comprehensive';
  internal_calculations: {
    laborCost: number;
    materialsCost: number;
    equipmentCost: number;
    overheadCost: number;
    profitMargin: number;
    totalCost: number;
  };
  customer_summary: {
    totalBeforeIncentives: number;
    incentivesApplied: number;
    finalPrice: number;
    savingsAmount: number;
    paymentTerms?: string;
  };
  estimate_tiers: {
    recommended?: TierDetails;
    good?: TierDetails;
    better?: TierDetails;
    best?: TierDetails;
  };
  recommendations: string[];
  estimateId: string;
  createdAt: string;
}
