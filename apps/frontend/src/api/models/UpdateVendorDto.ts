/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateVendorDto = {
    companyName?: string;
    displayName?: string;
    status?: UpdateVendorDto.status;
    type?: UpdateVendorDto.type;
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
};
export namespace UpdateVendorDto {
    export enum status {
        ACTIVE = 'ACTIVE',
        INACTIVE = 'INACTIVE',
        PENDING_APPROVAL = 'PENDING_APPROVAL',
        SUSPENDED = 'SUSPENDED',
        BLACKLISTED = 'BLACKLISTED',
    }
    export enum type {
        MANUFACTURER = 'MANUFACTURER',
        DISTRIBUTOR = 'DISTRIBUTOR',
        WHOLESALER = 'WHOLESALER',
        SERVICE_PROVIDER = 'SERVICE_PROVIDER',
        CONTRACTOR = 'CONTRACTOR',
        SUPPLIES = 'SUPPLIES',
        EQUIPMENT = 'EQUIPMENT',
        OTHER = 'OTHER',
    }
}

