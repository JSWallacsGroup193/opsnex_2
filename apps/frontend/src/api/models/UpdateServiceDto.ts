/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateServiceDto = {
    serviceCode?: string;
    serviceName?: string;
    category?: string;
    subcategory?: string;
    description?: string;
    pricingType?: string;
    basePrice?: number;
    minPrice?: number;
    maxPrice?: number;
    estimatedHours?: number;
    laborRateOverride?: number;
    skillLevelRequired?: string;
    durationMinutes?: number;
    warrantyDays?: number;
    requiresPermit?: boolean;
    isEmergency?: boolean;
    includedParts?: Record<string, any>;
    recommendedParts?: Record<string, any>;
    isActive?: boolean;
    isSeasonalService?: boolean;
    availableSeasons?: Array<string>;
    internalNotes?: string;
    customerFacingNotes?: string;
    displayOrder?: number;
};

