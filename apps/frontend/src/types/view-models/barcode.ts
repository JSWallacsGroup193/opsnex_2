/**
 * Barcode Scanner View Models
 * Type definitions for the barcode scanner module
 */

export interface SKUData {
  barcode: string
  description: string
  category: string
  stock: number
  location: string
}

export interface ScanResult {
  barcode: string
  timestamp: Date
  skuData: SKUData | null
}
