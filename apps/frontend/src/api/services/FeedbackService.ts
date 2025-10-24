/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateFeedbackDto } from '../models/CreateFeedbackDto';
import type { UpdateFeedbackDto } from '../models/UpdateFeedbackDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FeedbackService {
    /**
     * Submit feedback
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static feedbackControllerCreate(
        requestBody: CreateFeedbackDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/feedback',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List all feedback (Admin only)
     * @param page
     * @param limit
     * @param category
     * @param status
     * @returns any
     * @throws ApiError
     */
    public static feedbackControllerFindAll(
        page?: number,
        limit?: number,
        category?: string,
        status?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feedback',
            query: {
                'page': page,
                'limit': limit,
                'category': category,
                'status': status,
            },
        });
    }
    /**
     * Get feedback by ID (Admin only)
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static feedbackControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feedback/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update feedback status (Admin only)
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static feedbackControllerUpdate(
        id: string,
        requestBody: UpdateFeedbackDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/feedback/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete feedback (Admin only)
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static feedbackControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/feedback/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get feedback statistics (Admin only)
     * @returns any
     * @throws ApiError
     */
    public static feedbackControllerGetStats(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feedback/stats/summary',
        });
    }
}
