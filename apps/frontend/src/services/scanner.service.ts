/**
 * Scanner Service
 * Handles barcode scanning and SKU lookup
 */

import apiClient from './api';
import type { ScannerResponse, BarcodeResponse } from '../types';

export const scannerService = {
  /**
   * Scan barcode and find matching SKU
   */
  async scanBarcode(barcode: string): Promise<ScannerResponse> {
    return apiClient.get<ScannerResponse>(`/scanner/${barcode}`);
  },

  /**
   * Generate barcode image for text
   */
  async generateBarcode(text: string): Promise<BarcodeResponse> {
    return apiClient.get<BarcodeResponse>(`/barcodes/${text}`);
  },
};
