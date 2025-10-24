/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCustomerEquipmentDto } from '../models/CreateCustomerEquipmentDto';
import type { CreateCustomerPerformanceDto } from '../models/CreateCustomerPerformanceDto';
import type { CreateEstimateDto } from '../models/CreateEstimateDto';
import type { CreateManualEstimateDto } from '../models/CreateManualEstimateDto';
import type { CreatePropertyDto } from '../models/CreatePropertyDto';
import type { CreateProposalDto } from '../models/CreateProposalDto';
import type { UpdateCustomerEquipmentDto } from '../models/UpdateCustomerEquipmentDto';
import type { UpdateCustomerPerformanceDto } from '../models/UpdateCustomerPerformanceDto';
import type { UpdateManualEstimateDto } from '../models/UpdateManualEstimateDto';
import type { UpdatePropertyDto } from '../models/UpdatePropertyDto';
import type { UpdateProposalDto } from '../models/UpdateProposalDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static authControllerRegister(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static authControllerLogin(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static meControllerGetMe(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static adminControllerGetDashboard(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/dashboard',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static adminControllerGetAllUsers(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/users',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static adminControllerCreateUser(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/users',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static adminControllerGetUser(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/users/{id}',
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
    public static adminControllerUpdateUser(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/users/{id}',
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
    public static adminControllerDeleteUser(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/users/{id}',
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
    public static adminControllerActivateUser(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/users/{id}/activate',
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
    public static adminControllerDeactivateUser(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/users/{id}/deactivate',
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
    public static adminControllerUpdateUserRoles(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/users/{id}/roles',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static adminControllerGetAllRoles(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/roles',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static adminControllerCreateRole(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/roles',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static adminControllerGetRole(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/roles/{id}',
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
    public static adminControllerUpdateRole(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/roles/{id}',
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
    public static adminControllerDeleteRole(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/roles/{id}',
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
    public static adminControllerUpdateRolePermissions(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/roles/{id}/permissions',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static adminControllerGetAllPermissions(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/permissions',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static adminControllerCreatePermission(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/permissions',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static adminControllerUpdatePermission(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/permissions/{id}',
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
    public static adminControllerDeletePermission(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/permissions/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static adminControllerGetAllTenants(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/tenants',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static adminControllerGetTenant(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/tenants/{id}',
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
    public static adminControllerUpdateTenant(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/tenants/{id}',
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
    public static adminControllerActivateTenant(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/tenants/{id}/activate',
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
    public static adminControllerDeactivateTenant(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/tenants/{id}/deactivate',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static usersControllerUpdateProfile(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/profile',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static usersControllerChangePassword(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/password',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static workOrderControllerGetStats(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/work-orders/stats',
        });
    }
    /**
     * @param equipmentId
     * @returns any
     * @throws ApiError
     */
    public static workOrderControllerFindAll(
        equipmentId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/work-orders',
            query: {
                'equipmentId': equipmentId,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static workOrderControllerCreate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/work-orders',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static workOrderControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/work-orders/{id}',
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
    public static workOrderControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/work-orders/{id}',
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
    public static workOrderControllerUpdateStatus(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/work-orders/{id}/status',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param text
     * @returns any
     * @throws ApiError
     */
    public static barcodeControllerGetBarcode(
        text: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/barcodes/{text}',
            path: {
                'text': text,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static crmControllerGetAccounts(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crm/accounts',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static crmControllerCreateAccount(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/crm/accounts',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static crmControllerGetAccount(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crm/accounts/{id}',
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
    public static crmControllerUpdateAccount(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/crm/accounts/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static crmControllerGetContacts(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crm/contacts',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static crmControllerCreateContact(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/crm/contacts',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static crmControllerGetContact(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crm/contacts/{id}',
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
    public static crmControllerUpdateContact(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/crm/contacts/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static crmControllerGetLeads(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crm/leads',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static crmControllerCreateLead(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/crm/leads',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static crmControllerUpdateLead(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/crm/leads/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param contactId
     * @returns any
     * @throws ApiError
     */
    public static crmControllerGetNotes(
        contactId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/crm/notes/contact/{contactId}',
            path: {
                'contactId': contactId,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static crmControllerCreateNote(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/crm/notes',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static dispatchControllerCreate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/dispatch',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static dispatchControllerUpdate(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/dispatch/{id}',
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
    public static dispatchControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/dispatch/{id}',
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
    public static dispatchControllerGetForTechnician(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dispatch/technician/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static dispatchControllerGetAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dispatch/all',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static forecastControllerRun(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forecast',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static forecastControllerGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/forecast',
        });
    }
    /**
     * @param skuId
     * @returns any
     * @throws ApiError
     */
    public static forecastControllerGetForSku(
        skuId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/forecast/sku/{skuId}',
            path: {
                'skuId': skuId,
            },
        });
    }
    /**
     * @param skuId
     * @returns any
     * @throws ApiError
     */
    public static labelControllerPrintLabel(
        skuId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/labels/{skuId}',
            path: {
                'skuId': skuId,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static chatControllerQuery(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chat',
        });
    }
    /**
     * @param tenantId
     * @returns any
     * @throws ApiError
     */
    public static chatControllerGetLogs(
        tenantId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chat/logs/{tenantId}',
            path: {
                'tenantId': tenantId,
            },
        });
    }
    /**
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static notificationControllerGetNotifications(
        limit: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notifications',
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static notificationControllerGetUnreadCount(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notifications/unread-count',
        });
    }
    /**
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static notificationControllerGetNotificationsWithCount(
        limit: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notifications/with-count',
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static notificationControllerMarkAsRead(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/notifications/{id}/read',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static notificationControllerMarkAllAsRead(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/notifications/mark-all-read',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static notificationControllerDeleteNotification(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/notifications/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static notificationControllerGetPreferences(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notifications/preferences',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static notificationControllerUpdatePreferences(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/notifications/preferences',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static notificationControllerCreateTestNotification(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/notifications/test',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static estimatorControllerCalculateEstimate(
        requestBody: CreateEstimateDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/estimator/calculate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static estimatorControllerCreateManualEstimate(
        requestBody: CreateManualEstimateDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/estimator/manual',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static estimatorControllerUpdateManualEstimate(
        id: string,
        requestBody: UpdateManualEstimateDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/estimator/manual/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param type
     * @returns any
     * @throws ApiError
     */
    public static estimatorControllerListEstimates(
        type: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/estimator/estimates',
            query: {
                'type': type,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static estimatorControllerGetEstimate(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/estimator/estimates/{id}',
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
    public static estimatorControllerDeleteEstimate(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/estimator/estimates/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static estimatorControllerCreateProposal(
        requestBody: CreateProposalDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/estimator/proposals',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static estimatorControllerListProposals(
        page: string,
        limit: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/estimator/proposals',
            query: {
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param estimateId
     * @returns any
     * @throws ApiError
     */
    public static estimatorControllerConvertEstimateToProposal(
        estimateId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/estimator/proposals/convert/{estimateId}',
            path: {
                'estimateId': estimateId,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static estimatorControllerUpdateProposal(
        id: string,
        requestBody: UpdateProposalDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/estimator/proposals/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static estimatorControllerGetProposal(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/estimator/proposals/{id}',
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
    public static estimatorControllerDeleteProposal(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/estimator/proposals/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static propertyControllerCreate(
        requestBody: CreatePropertyDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/properties',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param accountId
     * @returns any
     * @throws ApiError
     */
    public static propertyControllerFindAll(
        accountId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/properties',
            query: {
                'accountId': accountId,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static propertyControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/properties/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static propertyControllerUpdate(
        id: string,
        requestBody: UpdatePropertyDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/properties/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static propertyControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/properties/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static customerPerformanceControllerCreate(
        requestBody: CreateCustomerPerformanceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/customer-performance',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static customerPerformanceControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/customer-performance',
        });
    }
    /**
     * @param accountId
     * @returns any
     * @throws ApiError
     */
    public static customerPerformanceControllerFindByAccountId(
        accountId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/customer-performance/account/{accountId}',
            path: {
                'accountId': accountId,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static customerPerformanceControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/customer-performance/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static customerPerformanceControllerUpdate(
        id: string,
        requestBody: UpdateCustomerPerformanceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/customer-performance/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static customerPerformanceControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/customer-performance/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param accountId
     * @returns any
     * @throws ApiError
     */
    public static customerPerformanceControllerRecalculate(
        accountId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/customer-performance/recalculate/{accountId}',
            path: {
                'accountId': accountId,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static customerEquipmentControllerCreate(
        requestBody: CreateCustomerEquipmentDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/customer-equipment',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param propertyId
     * @returns any
     * @throws ApiError
     */
    public static customerEquipmentControllerFindAll(
        propertyId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/customer-equipment',
            query: {
                'propertyId': propertyId,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static customerEquipmentControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/customer-equipment/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static customerEquipmentControllerUpdate(
        id: string,
        requestBody: UpdateCustomerEquipmentDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/customer-equipment/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static customerEquipmentControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/customer-equipment/{id}',
            path: {
                'id': id,
            },
        });
    }
}
