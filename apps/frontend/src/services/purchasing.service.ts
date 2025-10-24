/**
 * Purchasing Service
 * Handles purchase order management
 */

import apiClient from './api';
import type { 
  PurchaseOrder, 
  PurchaseOrderListResponse,
  CreatePurchaseOrderRequest 
} from '../types';

export const purchasingService = {
  /**
   * Get all purchase orders with pagination
   */
  async getPurchaseOrders(params?: { 
    page?: number; 
    pageSize?: number;
  }): Promise<PurchaseOrderListResponse> {
    return apiClient.get<PurchaseOrderListResponse>('/purchasing', { params });
  },

  /**
   * Get single purchase order by ID
   */
  async getPurchaseOrder(id: string): Promise<PurchaseOrder> {
    return apiClient.get<PurchaseOrder>(`/purchasing/${id}`);
  },

  /**
   * Create new purchase order
   */
  async createPurchaseOrder(data: CreatePurchaseOrderRequest): Promise<PurchaseOrder> {
    return apiClient.post<PurchaseOrder>('/purchasing', data);
  },

  /**
   * Mark purchase order as received
   */
  async receivePurchaseOrder(id: string): Promise<PurchaseOrder> {
    return apiClient.put<PurchaseOrder>(`/purchasing/${id}/receive`);
  },

  /**
   * Cancel purchase order
   */
  async cancelPurchaseOrder(id: string): Promise<PurchaseOrder> {
    return apiClient.put<PurchaseOrder>(`/purchasing/${id}/cancel`);
  },
};
