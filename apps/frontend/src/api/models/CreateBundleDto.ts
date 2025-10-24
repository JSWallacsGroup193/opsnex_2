/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BundleItemDto } from './BundleItemDto';
export type CreateBundleDto = {
    bundleCode: string;
    bundleName: string;
    description?: string;
    category?: string;
    bundlePrice: number;
    regularPrice: number;
    savings: number;
    savingsPercent: number;
    isActive?: boolean;
    isPromotional?: boolean;
    displayOrder?: number;
    items: Array<BundleItemDto>;
};

