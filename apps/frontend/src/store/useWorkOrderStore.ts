/**
 * Work Order Store
 * Zustand store for work order state management
 */

import { create } from 'zustand';
import { workOrderService } from '../services';
import type { WorkOrder, CreateWorkOrderRequest, UpdateWorkOrderStatusRequest } from '../types';

interface WorkOrderState {
  // State
  workOrders: WorkOrder[];
  selectedWorkOrder: WorkOrder | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWorkOrders: (tenantId: string) => Promise<void>;
  fetchWorkOrder: (id: string) => Promise<void>;
  createWorkOrder: (data: CreateWorkOrderRequest) => Promise<WorkOrder>;
  updateStatus: (id: string, data: UpdateWorkOrderStatusRequest) => Promise<void>;
  deleteWorkOrder: (id: string) => Promise<void>;
  setSelectedWorkOrder: (workOrder: WorkOrder | null) => void;
  clearError: () => void;
}

export const useWorkOrderStore = create<WorkOrderState>((set) => ({
  // Initial state
  workOrders: [],
  selectedWorkOrder: null,
  isLoading: false,
  error: null,

  // Fetch all work orders
  fetchWorkOrders: async (tenantId: string) => {
    try {
      set({ isLoading: true, error: null });
      const workOrders = await workOrderService.getWorkOrders(tenantId);
      set({ workOrders, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch work orders',
        isLoading: false,
      });
    }
  },

  // Fetch single work order
  fetchWorkOrder: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const workOrder = await workOrderService.getWorkOrder(id);
      set({ selectedWorkOrder: workOrder, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch work order',
        isLoading: false,
      });
    }
  },

  // Create new work order
  createWorkOrder: async (data: CreateWorkOrderRequest) => {
    try {
      set({ isLoading: true, error: null });
      const workOrder = await workOrderService.createWorkOrder(data);
      set((state) => ({
        workOrders: [workOrder, ...state.workOrders],
        isLoading: false,
      }));
      return workOrder;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create work order',
        isLoading: false,
      });
      throw error;
    }
  },

  // Update work order status
  updateStatus: async (id: string, data: UpdateWorkOrderStatusRequest) => {
    try {
      set({ isLoading: true, error: null });
      const updatedWorkOrder = await workOrderService.updateStatus(id, data);
      
      set((state) => ({
        workOrders: state.workOrders.map((wo) =>
          wo.id === id ? updatedWorkOrder : wo
        ),
        selectedWorkOrder:
          state.selectedWorkOrder?.id === id
            ? updatedWorkOrder
            : state.selectedWorkOrder,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update work order status',
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete work order
  deleteWorkOrder: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await workOrderService.deleteWorkOrder(id);
      
      set((state) => ({
        workOrders: state.workOrders.filter((wo) => wo.id !== id),
        selectedWorkOrder:
          state.selectedWorkOrder?.id === id ? null : state.selectedWorkOrder,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete work order',
        isLoading: false,
      });
      throw error;
    }
  },

  // Set selected work order
  setSelectedWorkOrder: (workOrder: WorkOrder | null) => {
    set({ selectedWorkOrder: workOrder });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
