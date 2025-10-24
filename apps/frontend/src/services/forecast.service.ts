/**
 * Forecast Service
 * Handles demand forecasting and inventory planning
 */

import apiClient from './api';
import type { Forecast, ForecastListResponse } from '../types';

export const forecastService = {
  /**
   * Get all forecasts for tenant
   */
  async getForecasts(): Promise<Forecast[]> {
    return apiClient.get<Forecast[]>('/forecast');
  },

  /**
   * Run forecast job (recalculates forecasts for all SKUs)
   */
  async runForecast(): Promise<ForecastListResponse> {
    return apiClient.post<ForecastListResponse>('/forecast');
  },

  /**
   * Get forecast for specific SKU
   */
  async getForecastForSKU(skuId: string): Promise<Forecast> {
    return apiClient.get<Forecast>(`/forecast/sku/${skuId}`);
  },
};
