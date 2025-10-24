/**
 * Dispatch Service
 * Handles technician scheduling and dispatch management
 */

import apiClient from './api';
import type { 
  DispatchSlot, 
  CreateDispatchRequest 
} from '../types';

export const dispatchService = {
  /**
   * Get all dispatch slots
   */
  async getAllSlots(): Promise<DispatchSlot[]> {
    return apiClient.get<DispatchSlot[]>('/dispatch/all');
  },

  /**
   * Get dispatch slots for specific technician
   */
  async getTechnicianSlots(technicianId: string): Promise<DispatchSlot[]> {
    return apiClient.get<DispatchSlot[]>(`/dispatch/technician/${technicianId}`);
  },

  /**
   * Create new dispatch slot
   */
  async createSlot(data: CreateDispatchRequest): Promise<DispatchSlot> {
    return apiClient.post<DispatchSlot>('/dispatch', data);
  },

  /**
   * Update dispatch slot
   */
  async updateSlot(id: string, data: Partial<DispatchSlot>): Promise<DispatchSlot> {
    return apiClient.put<DispatchSlot>(`/dispatch/${id}`, data);
  },

  /**
   * Delete dispatch slot
   */
  async deleteSlot(id: string): Promise<void> {
    return apiClient.delete(`/dispatch/${id}`);
  },
};
