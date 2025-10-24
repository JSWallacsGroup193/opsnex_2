import { z } from 'zod';

export const TierDetailsSchema = z.object({
  name: z.string(),
  price: z.number(),
  equipment: z.string(),
  features: z.array(z.string()),
  warranty: z.string(),
  efficiency: z.string().optional(),
});

export const EstimateResponseSchema = z.object({
  estimateMode: z.enum(['quick', 'comprehensive']),
  internal_calculations: z.object({
    laborCost: z.number(),
    materialsCost: z.number(),
    equipmentCost: z.number(),
    overheadCost: z.number(),
    profitMargin: z.number(),
    totalCost: z.number(),
  }),
  customer_summary: z.object({
    totalBeforeIncentives: z.number(),
    incentivesApplied: z.number(),
    finalPrice: z.number(),
    savingsAmount: z.number(),
    paymentTerms: z.string().optional(),
  }),
  estimate_tiers: z.object({
    recommended: TierDetailsSchema.optional(),
    good: TierDetailsSchema.optional(),
    better: TierDetailsSchema.optional(),
    best: TierDetailsSchema.optional(),
  }),
  recommendations: z.array(z.string()),
  estimateId: z.string(),
  createdAt: z.string(),
});

export type ValidatedEstimateResponse = z.infer<typeof EstimateResponseSchema>;
