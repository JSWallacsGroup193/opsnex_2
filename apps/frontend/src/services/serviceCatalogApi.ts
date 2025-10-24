import api from './api';

export interface ServiceCatalog {
  id: string;
  serviceCode: string;
  serviceName: string;
  category: string;
  subcategory?: string;
  description?: string;
  pricingType: 'flat_rate' | 'hourly' | 'time_and_material';
  basePrice: number;
  minPrice?: number;
  maxPrice?: number;
  estimatedHours?: number;
  laborRateOverride?: number;
  skillLevelRequired?: string;
  durationMinutes?: number;
  warrantyDays?: number;
  requiresPermit: boolean;
  isEmergency: boolean;
  isActive: boolean;
  isSeasonalService: boolean;
  availableSeasons: string[];
  internalNotes?: string;
  customerFacingNotes?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceBundle {
  id: string;
  bundleCode: string;
  bundleName: string;
  description?: string;
  category?: string;
  bundlePrice: number;
  regularPrice: number;
  savings: number;
  savingsPercent: number;
  isActive: boolean;
  isPromotional: boolean;
  items: {
    id: string;
    serviceId: string;
    quantity: number;
    service: ServiceCatalog;
  }[];
}

export interface LaborRate {
  id: string;
  rateName: string;
  rateType: string;
  skillLevel?: string;
  hourlyRate: number;
  isDefault: boolean;
  afterHoursMultiplier?: number;
  isActive: boolean;
  description?: string;
}

export const serviceCatalogApi = {
  getServices: (params?: { category?: string; active?: boolean }) =>
    api.get<ServiceCatalog[]>('/service-catalog/services', { params }),
  
  getServiceById: (id: string) =>
    api.get<ServiceCatalog>(`/service-catalog/services/${id}`),
  
  createService: (data: Partial<ServiceCatalog>) =>
    api.post<ServiceCatalog>('/service-catalog/services', data),
  
  updateService: (id: string, data: Partial<ServiceCatalog>) =>
    api.put<ServiceCatalog>(`/service-catalog/services/${id}`, data),
  
  deleteService: (id: string) =>
    api.delete(`/service-catalog/services/${id}`),

  getBundles: (params?: { active?: boolean }) =>
    api.get<ServiceBundle[]>('/service-catalog/bundles', { params }),
  
  getBundleById: (id: string) =>
    api.get<ServiceBundle>(`/service-catalog/bundles/${id}`),
  
  createBundle: (data: Partial<ServiceBundle>) =>
    api.post<ServiceBundle>('/service-catalog/bundles', data),
  
  updateBundle: (id: string, data: Partial<ServiceBundle>) =>
    api.put<ServiceBundle>(`/service-catalog/bundles/${id}`, data),
  
  deleteBundle: (id: string) =>
    api.delete(`/service-catalog/bundles/${id}`),

  getLaborRates: () =>
    api.get<LaborRate[]>('/service-catalog/labor-rates'),
  
  createLaborRate: (data: Partial<LaborRate>) =>
    api.post<LaborRate>('/service-catalog/labor-rates', data),
  
  updateLaborRate: (id: string, data: Partial<LaborRate>) =>
    api.put<LaborRate>(`/service-catalog/labor-rates/${id}`, data),
  
  deleteLaborRate: (id: string) =>
    api.delete(`/service-catalog/labor-rates/${id}`),
};
