/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateFeedbackDto = {
    category: CreateFeedbackDto.category;
    rating?: number;
    message: string;
    contactEmail?: string;
    userAgent?: string;
    pageUrl?: string;
};
export namespace CreateFeedbackDto {
    export enum category {
        BUG = 'bug',
        FEATURE_REQUEST = 'feature_request',
        COMPLAINT = 'complaint',
        PRAISE = 'praise',
        OTHER = 'other',
    }
}

