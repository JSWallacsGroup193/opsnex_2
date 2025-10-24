/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateBundleDto } from '../models/CreateBundleDto';
import type { CreateLaborRateDto } from '../models/CreateLaborRateDto';
import type { CreateServiceDto } from '../models/CreateServiceDto';
import type { UpdateServiceDto } from '../models/UpdateServiceDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServiceCatalogService {
    /**
     * Get all services in catalog
     * @param category
     * @param active
     * @returns any
     * @throws ApiError
     */
    public static serviceCatalogControllerGetServices(
        category: string,
        active: boolean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/service-catalog/services',
            query: {
                'category': category,
                'active': active,
            },
        });
    }
    /**
     * Create new service
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static serviceCatalogControllerCreateService(
        requestBody: CreateServiceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/service-catalog/services',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get service by ID
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static serviceCatalogControllerGetService(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/service-catalog/services/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update service
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static serviceCatalogControllerUpdateService(
        id: string,
        requestBody: UpdateServiceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/service-catalog/services/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete service
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static serviceCatalogControllerDeleteService(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/service-catalog/services/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get all service bundles
     * @param active
     * @returns any
     * @throws ApiError
     */
    public static serviceCatalogControllerGetBundles(
        active: boolean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/service-catalog/bundles',
            query: {
                'active': active,
            },
        });
    }
    /**
     * Create service bundle
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static serviceCatalogControllerCreateBundle(
        requestBody: CreateBundleDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/service-catalog/bundles',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get bundle by ID
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static serviceCatalogControllerGetBundle(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/service-catalog/bundles/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update service bundle
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static serviceCatalogControllerUpdateBundle(
        id: string,
        requestBody: CreateBundleDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/service-catalog/bundles/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete service bundle
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static serviceCatalogControllerDeleteBundle(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/service-catalog/bundles/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get all labor rates
     * @returns any
     * @throws ApiError
     */
    public static serviceCatalogControllerGetLaborRates(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/service-catalog/labor-rates',
        });
    }
    /**
     * Create labor rate
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static serviceCatalogControllerCreateLaborRate(
        requestBody: CreateLaborRateDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/service-catalog/labor-rates',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Update labor rate
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static serviceCatalogControllerUpdateLaborRate(
        id: string,
        requestBody: CreateLaborRateDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/service-catalog/labor-rates/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete labor rate
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static serviceCatalogControllerDeleteLaborRate(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/service-catalog/labor-rates/{id}',
            path: {
                'id': id,
            },
        });
    }
}
