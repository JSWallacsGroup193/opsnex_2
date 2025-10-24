/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePerformanceReviewDto } from '../models/CreatePerformanceReviewDto';
import type { CreatePriceAgreementDto } from '../models/CreatePriceAgreementDto';
import type { CreateVendorContactDto } from '../models/CreateVendorContactDto';
import type { CreateVendorDto } from '../models/CreateVendorDto';
import type { UpdateVendorDto } from '../models/UpdateVendorDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VendorsService {
    /**
     * Create new vendor
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static vendorControllerCreate(
        requestBody: CreateVendorDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vendors',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all vendors
     * @param status
     * @param type
     * @param search
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static vendorControllerFindAll(
        status?: 'ACTIVE' | 'INACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'BLACKLISTED',
        type?: 'MANUFACTURER' | 'DISTRIBUTOR' | 'WHOLESALER' | 'SERVICE_PROVIDER' | 'CONTRACTOR' | 'SUPPLIES' | 'EQUIPMENT' | 'OTHER',
        search?: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vendors',
            query: {
                'status': status,
                'type': type,
                'search': search,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * Get vendor statistics
     * @returns any
     * @throws ApiError
     */
    public static vendorControllerGetStats(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vendors/stats',
        });
    }
    /**
     * Get vendor by ID
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static vendorControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vendors/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update vendor
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static vendorControllerUpdate(
        id: string,
        requestBody: UpdateVendorDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/vendors/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete vendor
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static vendorControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/vendors/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Add contact to vendor
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static vendorControllerCreateContact(
        id: string,
        requestBody: CreateVendorContactDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vendors/{id}/contacts',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get vendor contacts
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static vendorControllerGetContacts(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vendors/{id}/contacts',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update vendor contact
     * @param id
     * @param contactId
     * @returns any
     * @throws ApiError
     */
    public static vendorControllerUpdateContact(
        id: string,
        contactId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/vendors/{id}/contacts/{contactId}',
            path: {
                'id': id,
                'contactId': contactId,
            },
        });
    }
    /**
     * Delete vendor contact
     * @param id
     * @param contactId
     * @returns any
     * @throws ApiError
     */
    public static vendorControllerDeleteContact(
        id: string,
        contactId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/vendors/{id}/contacts/{contactId}',
            path: {
                'id': id,
                'contactId': contactId,
            },
        });
    }
    /**
     * Create price agreement
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static vendorControllerCreatePriceAgreement(
        id: string,
        requestBody: CreatePriceAgreementDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vendors/{id}/price-agreements',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get vendor price agreements
     * @param id
     * @param activeOnly
     * @returns any
     * @throws ApiError
     */
    public static vendorControllerGetPriceAgreements(
        id: string,
        activeOnly: boolean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vendors/{id}/price-agreements',
            path: {
                'id': id,
            },
            query: {
                'activeOnly': activeOnly,
            },
        });
    }
    /**
     * Update price agreement
     * @param id
     * @param agreementId
     * @returns any
     * @throws ApiError
     */
    public static vendorControllerUpdatePriceAgreement(
        id: string,
        agreementId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/vendors/{id}/price-agreements/{agreementId}',
            path: {
                'id': id,
                'agreementId': agreementId,
            },
        });
    }
    /**
     * Deactivate price agreement
     * @param id
     * @param agreementId
     * @returns any
     * @throws ApiError
     */
    public static vendorControllerDeactivatePriceAgreement(
        id: string,
        agreementId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/vendors/{id}/price-agreements/{agreementId}',
            path: {
                'id': id,
                'agreementId': agreementId,
            },
        });
    }
    /**
     * Create performance review
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static vendorControllerCreatePerformanceReview(
        id: string,
        requestBody: CreatePerformanceReviewDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vendors/{id}/performance-reviews',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get vendor performance reviews
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static vendorControllerGetPerformanceReviews(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vendors/{id}/performance-reviews',
            path: {
                'id': id,
            },
        });
    }
}
