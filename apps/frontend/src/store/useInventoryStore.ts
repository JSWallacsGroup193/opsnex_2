/**
 * Inventory Store
 * Zustand store for inventory (SKU, warehouses, bins) state management
 */

import { create } from 'zustand';
import { inventoryService } from '../services';
import type { SKU, Warehouse, Bin, CreateSKURequest } from '../types';

interface InventoryState {
  // SKU state
  skus: SKU[];
  selectedSKU: SKU | null;
  skusTotal: number;
  skusPage: number;
  skusPageSize: number;
  
  // Warehouse state
  warehouses: Warehouse[];
  selectedWarehouse: Warehouse | null;
  
  // Bin state
  bins: Bin[];
  
  // UI state
  isLoading: boolean;
  error: string | null;

  // SKU Actions
  fetchSKUs: (params?: { q?: string; page?: number; pageSize?: number }) => Promise<void>;
  fetchSKU: (id: string) => Promise<void>;
  createSKU: (data: CreateSKURequest) => Promise<SKU>;
  updateSKU: (id: string, data: Partial<SKU>) => Promise<void>;
  deleteSKU: (id: string) => Promise<void>;
  setSelectedSKU: (sku: SKU | null) => void;
  
  // Warehouse Actions
  fetchWarehouses: () => Promise<void>;
  createWarehouse: (data: { name: string; address?: string }) => Promise<void>;
  setSelectedWarehouse: (warehouse: Warehouse | null) => void;
  
  // Bin Actions
  fetchBins: () => Promise<void>;
  createBin: (data: { warehouseId: string; name: string }) => Promise<void>;
  
  // Utility
  clearError: () => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  // Initial state
  skus: [],
  selectedSKU: null,
  skusTotal: 0,
  skusPage: 1,
  skusPageSize: 50,
  
  warehouses: [],
  selectedWarehouse: null,
  
  bins: [],
  
  isLoading: false,
  error: null,

  // Fetch SKUs with pagination and search
  fetchSKUs: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const response = await inventoryService.getSKUs(params);
      set({
        skus: response.items,
        skusTotal: response.total,
        skusPage: response.page,
        skusPageSize: response.pageSize,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch SKUs',
        isLoading: false,
      });
    }
  },

  // Fetch single SKU
  fetchSKU: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const sku = await inventoryService.getSKU(id);
      set({ selectedSKU: sku, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch SKU',
        isLoading: false,
      });
    }
  },

  // Create new SKU
  createSKU: async (data: CreateSKURequest) => {
    try {
      set({ isLoading: true, error: null });
      const sku = await inventoryService.createSKU(data);
      set((state) => ({
        skus: [sku, ...state.skus],
        skusTotal: state.skusTotal + 1,
        isLoading: false,
      }));
      return sku;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create SKU',
        isLoading: false,
      });
      throw error;
    }
  },

  // Update SKU
  updateSKU: async (id: string, data: Partial<SKU>) => {
    try {
      set({ isLoading: true, error: null });
      const updatedSKU = await inventoryService.updateSKU(id, data);
      
      set((state) => ({
        skus: state.skus.map((sku) => (sku.id === id ? updatedSKU : sku)),
        selectedSKU: state.selectedSKU?.id === id ? updatedSKU : state.selectedSKU,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update SKU',
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete SKU
  deleteSKU: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await inventoryService.deleteSKU(id);
      
      set((state) => ({
        skus: state.skus.filter((sku) => sku.id !== id),
        skusTotal: state.skusTotal - 1,
        selectedSKU: state.selectedSKU?.id === id ? null : state.selectedSKU,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete SKU',
        isLoading: false,
      });
      throw error;
    }
  },

  // Set selected SKU
  setSelectedSKU: (sku: SKU | null) => {
    set({ selectedSKU: sku });
  },

  // Fetch warehouses
  fetchWarehouses: async () => {
    try {
      set({ isLoading: true, error: null });
      const warehouses = await inventoryService.getWarehouses();
      set({ warehouses, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch warehouses',
        isLoading: false,
      });
    }
  },

  // Create warehouse
  createWarehouse: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const warehouse = await inventoryService.createWarehouse(data);
      set((state) => ({
        warehouses: [...state.warehouses, warehouse],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create warehouse',
        isLoading: false,
      });
      throw error;
    }
  },

  // Set selected warehouse
  setSelectedWarehouse: (warehouse: Warehouse | null) => {
    set({ selectedWarehouse: warehouse });
  },

  // Fetch bins
  fetchBins: async () => {
    try {
      set({ isLoading: true, error: null });
      const bins = await inventoryService.getBins();
      set({ bins, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch bins',
        isLoading: false,
      });
    }
  },

  // Create bin
  createBin: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const bin = await inventoryService.createBin(data);
      set((state) => ({
        bins: [...state.bins, bin],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create bin',
        isLoading: false,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
