/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSkuDto } from '../models/CreateSkuDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InventoryService {
    /**
     * @param q
     * @param pageSize
     * @param page
     * @returns any
     * @throws ApiError
     */
    public static inventoryControllerGetSkUs(
        q?: string,
        pageSize?: any,
        page?: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/inventory/skus',
            query: {
                'q': q,
                'pageSize': pageSize,
                'page': page,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static inventoryControllerCreateSku(
        requestBody: CreateSkuDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/inventory/skus',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static inventoryControllerGetSku(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/inventory/skus/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static inventoryControllerUpdateSku(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/inventory/skus/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static inventoryControllerDeleteSku(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/inventory/skus/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param skuId
     * @returns any
     * @throws ApiError
     */
    public static inventoryControllerGetStockLedger(
        skuId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/inventory/stock-ledger/{skuId}',
            path: {
                'skuId': skuId,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static inventoryControllerCreateStockLedgerEntry(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/inventory/stock-ledger',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static inventoryControllerGetWarehouses(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/inventory/warehouses',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static inventoryControllerCreateWarehouse(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/inventory/warehouses',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static inventoryControllerGetBins(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/inventory/bins',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static inventoryControllerCreateBin(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/inventory/bins',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static inventoryControllerGetOnHand(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/inventory/skus/{id}/onhand',
            path: {
                'id': id,
            },
        });
    }
}
