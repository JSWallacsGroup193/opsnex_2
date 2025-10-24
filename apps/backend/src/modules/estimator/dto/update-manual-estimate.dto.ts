export class UpdateManualEstimateDto {
  title?: string;
  description?: string;
  projectType?: string;
  location?: string;
  
  laborHours?: number;
  laborCost?: number;
  materialsCost?: number;
  permitsCost?: number;
  overheadCost?: number;
  taxRate?: number;
  profitMargin?: number;
  
  status?: 'draft' | 'final' | 'approved' | 'rejected';
  internalNotes?: string;
  customerNotes?: string;
  expiresAt?: string;
  
  lineItems?: LineItemDto[];
}

export class LineItemDto {
  id?: string;
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}
