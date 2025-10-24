/**
 * Monitoring Service
 * Handles system health checks and metrics
 */

import apiClient from './api';
import type { HealthResponse, MetricsResponse } from '../types';

export const monitoringService = {
  /**
   * Check system health
   */
  async checkHealth(): Promise<HealthResponse> {
    return apiClient.get<HealthResponse>('/health');
  },

  /**
   * Get system metrics
   */
  async getMetrics(): Promise<MetricsResponse> {
    return apiClient.get<MetricsResponse>('/metrics');
  },
};
