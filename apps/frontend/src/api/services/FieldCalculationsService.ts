/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateFieldCalculationDto } from '../models/CreateFieldCalculationDto';
import type { FieldCalculationResponseDto } from '../models/FieldCalculationResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FieldCalculationsService {
    /**
     * Save a field calculation
     * @param requestBody
     * @returns FieldCalculationResponseDto Calculation saved successfully
     * @throws ApiError
     */
    public static fieldCalculationControllerCreate(
        requestBody: CreateFieldCalculationDto,
    ): CancelablePromise<FieldCalculationResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/field-calculations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request data`,
            },
        });
    }
    /**
     * Get all field calculations
     * @param workOrderId
     * @returns FieldCalculationResponseDto List of calculations
     * @throws ApiError
     */
    public static fieldCalculationControllerFindAll(
        workOrderId: string,
    ): CancelablePromise<Array<FieldCalculationResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/field-calculations',
            query: {
                'workOrderId': workOrderId,
            },
        });
    }
    /**
     * Get calculations by technician
     * @param technicianId
     * @returns FieldCalculationResponseDto List of calculations by technician
     * @throws ApiError
     */
    public static fieldCalculationControllerFindByTechnician(
        technicianId: string,
    ): CancelablePromise<Array<FieldCalculationResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/field-calculations/technician/{technicianId}',
            path: {
                'technicianId': technicianId,
            },
        });
    }
    /**
     * Get a specific field calculation
     * @param id
     * @returns FieldCalculationResponseDto Calculation found
     * @throws ApiError
     */
    public static fieldCalculationControllerFindOne(
        id: string,
    ): CancelablePromise<FieldCalculationResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/field-calculations/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Calculation not found`,
            },
        });
    }
    /**
     * Delete a field calculation
     * @param id
     * @returns any Calculation deleted successfully
     * @throws ApiError
     */
    public static fieldCalculationControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/field-calculations/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Calculation not found`,
            },
        });
    }
    /**
     * Attach calculation to work order
     * @param calculationId
     * @returns FieldCalculationResponseDto Calculation attached successfully
     * @throws ApiError
     */
    public static fieldCalculationControllerAttachToWorkOrder(
        calculationId: string,
    ): CancelablePromise<FieldCalculationResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/field-calculations/{calculationId}/attach',
            path: {
                'calculationId': calculationId,
            },
            errors: {
                404: `Calculation not found`,
            },
        });
    }
}
