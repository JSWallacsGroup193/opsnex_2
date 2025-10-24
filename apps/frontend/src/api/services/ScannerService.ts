/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ScannerService {
    /**
     * @param barcode
     * @returns any
     * @throws ApiError
     */
    public static scannerControllerScan(
        barcode: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scanner/{barcode}',
            path: {
                'barcode': barcode,
            },
        });
    }
}
