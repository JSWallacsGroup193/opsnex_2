/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateVendorDto = {
    vendorCode: string;
    companyName: string;
    displayName?: string;
    type: CreateVendorDto.type;
    status?: CreateVendorDto.status;
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
    categories?: Array<string>;
};
export namespace CreateVendorDto {
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
    export enum status {
        ACTIVE = 'ACTIVE',
        INACTIVE = 'INACTIVE',
        PENDING_APPROVAL = 'PENDING_APPROVAL',
        SUSPENDED = 'SUSPENDED',
        BLACKLISTED = 'BLACKLISTED',
    }
}

