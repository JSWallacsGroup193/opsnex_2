/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateFieldCalculationDto = {
    /**
     * Calculator type/name
     */
    calculatorType: string;
    /**
     * Calculator category
     */
    category: CreateFieldCalculationDto.category;
    /**
     * Calculator input data as JSON
     */
    inputs: Record<string, any>;
    /**
     * Calculator result data as JSON
     */
    results: Record<string, any>;
    /**
     * Work order ID to attach calculation to
     */
    workOrderId?: string;
    /**
     * Optional notes about the calculation
     */
    notes?: string;
};
export namespace CreateFieldCalculationDto {
    /**
     * Calculator category
     */
    export enum category {
        ELECTRICAL = 'electrical',
        REFRIGERATION = 'refrigeration',
        AIRFLOW = 'airflow',
        GAS = 'gas',
        HYDRONIC = 'hydronic',
        UTILITY = 'utility',
    }
}

