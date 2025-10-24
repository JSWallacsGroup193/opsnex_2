export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

export interface SKU {
  id: string
  sku: string
  description: string
  category: string
  onHand: number
  reorderPoint: number
  unitCost: number
  location: {
    warehouse: string
    bin: string
  }
  barcode?: string
  lastRestocked?: string
  supplier?: string
}

export interface SKUDetail extends SKU {
  manufacturer?: string
  modelNumber?: string
  upc?: string
  reorderQuantity: number
  safetyStock: number
  lastCounted?: string
  averageCost: number
  sellingPrice: number
  markup: number
  active: boolean
  createdDate: string
  lastUpdated: string
}

export interface StockLocation {
  id: string
  warehouse: string
  bin: string
  quantity: number
  lastUpdated: string
}

export interface StockTransaction {
  id: string
  date: string
  type: 'purchase' | 'sale' | 'adjustment' | 'transfer'
  quantity: number
  balance: number
  reason: string
  user: string
}

export interface UsageData {
  date: string
  quantity: number
}

export interface ForecastData {
  avgMonthlyUsage: number
  daysUntilReorder: number
  suggestedOrderQuantity: number
}

export interface Supplier {
  id: string
  name: string
  partNumber: string
  unitCost: number
  leadTime: string
  lastOrdered?: string
  isPrimary: boolean
}

export interface RelatedSKU {
  id: string
  sku: string
  description: string
  type: 'alternative' | 'compatible'
}

export interface InventoryStats {
  totalSKUs: number
  lowStockAlerts: number
  outOfStock: number
  totalInventoryValue: number
}

export interface InventoryFilters {
  search: string
  categories: string[]
  stockStatus: 'all' | StockStatus
  warehouse: string
  sortBy: 'sku' | 'description' | 'stock-level'
}

export function getStockStatus(onHand: number, reorderPoint: number): StockStatus {
  if (onHand === 0) {
    return 'out-of-stock'
  }
  if (onHand <= reorderPoint) {
    return 'low-stock'
  }
  return 'in-stock'
}

export function getStockStatusColor(status: StockStatus): {
  bg: string
  text: string
  label: string
} {
  switch (status) {
    case 'in-stock':
      return { bg: 'bg-emerald-500', text: 'text-white', label: 'In Stock' }
    case 'low-stock':
      return { bg: 'bg-amber-500', text: 'text-slate-900', label: 'Low Stock' }
    case 'out-of-stock':
      return { bg: 'bg-red-500', text: 'text-white', label: 'Out of Stock' }
  }
}
