export class CreateProposalDto {
  estimateId?: string;
  accountId?: string;
  workOrderId?: string;
  
  title: string;
  description?: string;
  
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  totalAmount: number;
  
  paymentTerms?: string;
  validityDays?: number;
  termsAndConditions?: string;
  
  internalNotes?: string;
  customerNotes?: string;
  
  lineItems: ProposalLineItemDto[];
}

export class ProposalLineItemDto {
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}
