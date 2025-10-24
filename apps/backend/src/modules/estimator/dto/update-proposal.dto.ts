export class UpdateProposalDto {
  title?: string;
  description?: string;
  
  subtotal?: number;
  taxRate?: number;
  taxAmount?: number;
  totalAmount?: number;
  
  status?: 'draft' | 'sent' | 'viewed' | 'approved' | 'rejected' | 'expired';
  
  paymentTerms?: string;
  validityDays?: number;
  termsAndConditions?: string;
  
  internalNotes?: string;
  customerNotes?: string;
  
  lineItems?: ProposalLineItemDto[];
}

export class ProposalLineItemDto {
  id?: string;
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}
