/**
 * Inventory Service
 * Handles SKU management, warehouses, bins, and stock ledger operations
 */

import apiClient from './api';
import type { 
  SKU, 
  SKUListResponse,
  CreateSKURequest, 
  Warehouse, 
  Bin, 
  StockLedger 
} from '../types';

export const inventoryService = {
  // ============================================================================
  // SKU Operations
  // ============================================================================

  /**
   * Get all SKUs with optional search and pagination
   */
  async getSKUs(params?: { 
    q?: string; 
    page?: number; 
    pageSize?: number;
  }): Promise<SKUListResponse> {
    return apiClient.get<SKUListResponse>('/inventory/skus', { params });
  },

  /**
   * Get single SKU by ID
   */
  async getSKU(id: string): Promise<SKU> {
    return apiClient.get<SKU>(`/inventory/skus/${id}`);
  },

  /**
   * Create new SKU
   */
  async createSKU(data: CreateSKURequest): Promise<SKU> {
    return apiClient.post<SKU>('/inventory/skus', data);
  },

  /**
   * Update SKU
   */
  async updateSKU(id: string, data: Partial<SKU>): Promise<SKU> {
    return apiClient.put<SKU>(`/inventory/skus/${id}`, data);
  },

  /**
   * Delete SKU
   */
  async deleteSKU(id: string): Promise<void> {
    return apiClient.delete(`/inventory/skus/${id}`);
  },

  /**
   * Get on-hand quantity for SKU
   */
  async getOnHand(skuId: string): Promise<{ onHand: number }> {
    return apiClient.get<{ onHand: number }>(`/inventory/skus/${skuId}/onhand`);
  },

  // ============================================================================
  // Warehouse Operations
  // ============================================================================

  /**
   * Get all warehouses
   */
  async getWarehouses(): Promise<Warehouse[]> {
    return apiClient.get<Warehouse[]>('/inventory/warehouses');
  },

  /**
   * Create new warehouse
   */
  async createWarehouse(data: { name: string; address?: string }): Promise<Warehouse> {
    return apiClient.post<Warehouse>('/inventory/warehouses', data);
  },

  // ============================================================================
  // Bin Operations
  // ============================================================================

  /**
   * Get all bins
   */
  async getBins(): Promise<Bin[]> {
    return apiClient.get<Bin[]>('/inventory/bins');
  },

  /**
   * Create new bin
   */
  async createBin(data: { warehouseId: string; name: string }): Promise<Bin> {
    return apiClient.post<Bin>('/inventory/bins', data);
  },

  // ============================================================================
  // Stock Ledger Operations
  // ============================================================================

  /**
   * Get stock ledger entries for SKU
   */
  async getStockLedger(skuId: string): Promise<StockLedger[]> {
    return apiClient.get<StockLedger[]>(`/inventory/stock-ledger/${skuId}`);
  },

  /**
   * Record stock movement (IN/OUT)
   */
  async recordStockMovement(data: {
    skuId: string;
    direction: 'IN' | 'OUT';
    quantity: number;
    reason: string;
    warehouseId?: string;
    binId?: string;
  }): Promise<StockLedger> {
    return apiClient.post<StockLedger>('/inventory/stock-ledger', data);
  },
};
