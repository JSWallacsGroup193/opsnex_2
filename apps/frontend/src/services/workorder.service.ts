/**
 * Work Order Service
 * Handles work order management, status updates, and related operations
 */

import apiClient from './api';
import type { 
  WorkOrder, 
  CreateWorkOrderRequest, 
  UpdateWorkOrderStatusRequest,
  WorkOrderLineItem,
  WorkOrderAttachment,
} from '../types';

export const workOrderService = {
  /**
   * Get all work orders for a tenant
   */
  async getWorkOrders(tenantId: string): Promise<WorkOrder[]> {
    return apiClient.get<WorkOrder[]>(`/work-orders/${tenantId}`);
  },

  /**
   * Get single work order by ID
   */
  async getWorkOrder(id: string): Promise<WorkOrder> {
    return apiClient.get<WorkOrder>(`/work-orders/${id}`);
  },

  /**
   * Create new work order
   */
  async createWorkOrder(data: CreateWorkOrderRequest): Promise<WorkOrder> {
    return apiClient.post<WorkOrder>('/work-orders', data);
  },

  /**
   * Update work order status
   */
  async updateStatus(id: string, data: UpdateWorkOrderStatusRequest): Promise<WorkOrder> {
    return apiClient.put<WorkOrder>(`/work-orders/${id}/status`, data);
  },

  /**
   * Delete work order
   */
  async deleteWorkOrder(id: string): Promise<void> {
    return apiClient.delete(`/work-orders/${id}`);
  },

  /**
   * Get work order statistics
   */
  async getStats(tenantId: string): Promise<any> {
    return apiClient.get(`/work-orders/${tenantId}/stats`);
  },

  /**
   * Add line item to work order
   */
  async addLineItem(workOrderId: string, item: Partial<WorkOrderLineItem>): Promise<WorkOrderLineItem> {
    return apiClient.post<WorkOrderLineItem>(`/work-orders/${workOrderId}/line-items`, item);
  },

  /**
   * Upload attachment to work order
   */
  async uploadAttachment(workOrderId: string, file: File): Promise<WorkOrderAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<WorkOrderAttachment>(
      `/work-orders/${workOrderId}/attachments`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  },
};
