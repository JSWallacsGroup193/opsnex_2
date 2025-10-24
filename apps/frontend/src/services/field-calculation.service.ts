/**
 * Field Calculation Service
 * Handles HVAC calculator results and work order integration
 */

import apiClient from './api';
import type { 
  FieldCalculation, 
  FieldCalculationListResponse,
  CreateFieldCalculationRequest 
} from '../types';

export const fieldCalculationService = {
  /**
   * Get all field calculations for current user
   */
  async getCalculations(): Promise<FieldCalculation[]> {
    const response = await apiClient.get<FieldCalculationListResponse>('/field-calculations');
    return response.items || [];
  },

  /**
   * Get calculations for specific technician
   */
  async getTechnicianCalculations(technicianId: string): Promise<FieldCalculation[]> {
    const response = await apiClient.get<FieldCalculationListResponse>(
      `/field-calculations/technician/${technicianId}`
    );
    return response.items || [];
  },

  /**
   * Get single calculation by ID
   */
  async getCalculation(id: string): Promise<FieldCalculation> {
    return apiClient.get<FieldCalculation>(`/field-calculations/${id}`);
  },

  /**
   * Save new calculation
   */
  async createCalculation(data: CreateFieldCalculationRequest): Promise<FieldCalculation> {
    return apiClient.post<FieldCalculation>('/field-calculations', data);
  },

  /**
   * Delete calculation
   */
  async deleteCalculation(id: string): Promise<void> {
    return apiClient.delete(`/field-calculations/${id}`);
  },

  /**
   * Attach calculation to work order
   */
  async attachToWorkOrder(calculationId: string, workOrderId: string): Promise<FieldCalculation> {
    return apiClient.put<FieldCalculation>(`/field-calculations/${calculationId}/attach`, {
      workOrderId,
    });
  },
};
