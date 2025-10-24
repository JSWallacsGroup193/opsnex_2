// Vendor Management Types

export type VendorStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';

export type VendorType = 
  | 'EQUIPMENT_SUPPLIER'
  | 'PARTS_DISTRIBUTOR'
  | 'SERVICE_PROVIDER'
  | 'MANUFACTURER'
  | 'CONTRACTOR'
  | 'CONSULTANT'
  | 'OTHER';

export interface VendorCategory {
  id: string;
  name: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorContact {
  id: string;
  tenantId: string;
  vendorId: string;
  firstName: string;
  lastName: string;
  title?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  isPrimary: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorPriceAgreement {
  id: string;
  tenantId: string;
  vendorId: string;
  skuId: string;
  sku?: {
    id: string;
    skuCode: string;
    description: string;
  };
  vendorPartNumber?: string;
  unitPrice: number;
  minimumOrderQty: number;
  currency: string;
  effectiveDate: string;
  expirationDate?: string;
  contractNumber?: string;
  leadTimeDays?: number;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorPerformanceReview {
  id: string;
  tenantId: string;
  vendorId: string;
  reviewedById: string;
  reviewedBy?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  reviewDate: string;
  reviewPeriodStart: string;
  reviewPeriodEnd: string;
  qualityRating: number;
  deliveryRating: number;
  serviceRating: number;
  pricingRating: number;
  overallRating: number;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorDocument {
  id: string;
  tenantId: string;
  vendorId: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
  description?: string;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  tenantId: string;
  vendorCode: string;
  companyName: string;
  displayName?: string;
  type: VendorType;
  status: VendorStatus;
  
  // Contact Information
  email?: string;
  phone?: string;
  fax?: string;
  website?: string;
  
  // Address
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  
  // Business Information
  taxId?: string;
  paymentTerms?: string;
  creditLimit?: number;
  
  // Performance Metrics
  rating?: number;
  qualityRating?: number;
  deliveryRating?: number;
  serviceRating?: number;
  
  // Flags
  isPreferred: boolean;
  isActive: boolean;
  
  // Additional Information
  notes?: string;
  
  // Metadata
  createdById: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  categories?: VendorCategory[];
  contacts?: VendorContact[];
  priceAgreements?: VendorPriceAgreement[];
  performanceReviews?: VendorPerformanceReview[];
  documents?: VendorDocument[];
  
  _count?: {
    priceAgreements: number;
    performanceReviews: number;
  };
}

export interface CreateVendorDto {
  vendorCode: string;
  companyName: string;
  displayName?: string;
  type: VendorType;
  status?: VendorStatus;
  
  email?: string;
  phone?: string;
  fax?: string;
  website?: string;
  
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  
  taxId?: string;
  paymentTerms?: string;
  creditLimit?: number;
  
  isPreferred?: boolean;
  isActive?: boolean;
  
  notes?: string;
  
  categories?: string[];
}

export interface UpdateVendorDto {
  companyName?: string;
  displayName?: string;
  type?: VendorType;
  status?: VendorStatus;
  
  email?: string;
  phone?: string;
  fax?: string;
  website?: string;
  
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  
  taxId?: string;
  paymentTerms?: string;
  creditLimit?: number;
  
  rating?: number;
  qualityRating?: number;
  deliveryRating?: number;
  serviceRating?: number;
  
  isPreferred?: boolean;
  isActive?: boolean;
  
  notes?: string;
}

export interface CreateVendorContactDto {
  firstName: string;
  lastName: string;
  title?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  isPrimary?: boolean;
  notes?: string;
}

export interface CreatePriceAgreementDto {
  skuId: string;
  vendorPartNumber?: string;
  unitPrice: number;
  minimumOrderQty?: number;
  currency?: string;
  effectiveDate: string;
  expirationDate?: string;
  contractNumber?: string;
  leadTimeDays?: number;
  isActive?: boolean;
  notes?: string;
}

export interface CreatePerformanceReviewDto {
  reviewDate: string;
  reviewPeriodStart: string;
  reviewPeriodEnd: string;
  qualityRating: number;
  deliveryRating: number;
  serviceRating: number;
  pricingRating: number;
  comments?: string;
}

export interface VendorQueryDto {
  status?: VendorStatus;
  type?: VendorType;
  search?: string;
  page?: number;
  limit?: number;
}

export interface VendorListResponse {
  vendors: Vendor[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface VendorStats {
  total: number;
  active: number;
  byType: Array<{
    type: VendorType;
    _count: number;
  }>;
  topRated: Array<{
    id: string;
    companyName: string;
    vendorCode: string;
    rating: number | null;
    type: VendorType;
  }>;
}
