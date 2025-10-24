import { useState } from "react"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InventoryListHeader } from "./inventory-list-header"
import { InventoryStats } from "./inventory-stats"
import { InventoryFilters } from "./inventory-filters"
import { InventoryTable } from "./inventory-table"
import { InventoryCard } from "./inventory-card"
import type { SKU, InventoryFilters as Filters, InventoryStats as Stats } from "@/types/view-models/inventory"
import { getStockStatus } from "@/types/view-models/inventory"

interface InventoryListProps {
  skus: SKU[]
  stats: Stats
  categories: string[]
  warehouses: string[]
  onCreateSKU: () => void
  onView: (id: string) => void
  onEdit: (id: string) => void
  onPrintLabel: (id: string) => void
  onDelete: (id: string) => void
  onScanBarcode: () => void
  onImportSKUs: () => void
  onExportCSV: () => void
}

export function InventoryList({
  skus,
  stats,
  categories,
  warehouses,
  onCreateSKU,
  onView,
  onEdit,
  onPrintLabel,
  onDelete,
  onScanBarcode,
  onImportSKUs,
  onExportCSV,
}: InventoryListProps) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    categories: [],
    stockStatus: "all",
    warehouse: "",
    sortBy: "sku",
  })

  // Filter SKUs based on current filters
  const filteredSKUs = skus.filter((sku) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch =
        sku.sku.toLowerCase().includes(searchLower) ||
        sku.description.toLowerCase().includes(searchLower) ||
        sku.barcode?.toLowerCase().includes(searchLower)
      if (!matchesSearch) return false
    }

    // Category filter
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(sku.category)) return false
    }

    // Stock status filter
    if (filters.stockStatus !== "all") {
      const status = getStockStatus(sku.onHand, sku.reorderPoint)
      if (status !== filters.stockStatus) return false
    }

    // Warehouse filter
    if (filters.warehouse) {
      if (sku.location.warehouse !== filters.warehouse) return false
    }

    return true
  })

  const isEmpty = filteredSKUs.length === 0

  return (
    <div className="min-h-screen bg-slate-950">
      <InventoryListHeader
        searchQuery={filters.search}
        onSearchChange={(search) => setFilters({ ...filters, search })}
        onCreateSKU={onCreateSKU}
        onScanBarcode={onScanBarcode}
        onImportSKUs={onImportSKUs}
        onExportCSV={onExportCSV}
      />

      <InventoryStats stats={stats} />

      <InventoryFilters
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        warehouses={warehouses}
      />

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <Package className="h-16 w-16 text-teal-500 mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No SKUs found</h3>
          <p className="text-slate-500 mb-6 text-center">
            {filters.search || filters.categories.length > 0 || filters.stockStatus !== "all" || filters.warehouse
              ? "Try adjusting your filters"
              : "Get started by creating your first SKU"}
          </p>
          {!filters.search &&
            filters.categories.length === 0 &&
            filters.stockStatus === "all" &&
            !filters.warehouse && (
              <Button onClick={onCreateSKU} className="bg-teal-500 hover:bg-teal-600 text-white">
                Create your first SKU
              </Button>
            )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block px-4 py-4 md:px-6">
            <InventoryTable
              skus={filteredSKUs}
              onView={onView}
              onEdit={onEdit}
              onPrintLabel={onPrintLabel}
              onDelete={onDelete}
            />
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden px-4 py-4 space-y-4">
            {filteredSKUs.map((sku) => (
              <InventoryCard key={sku.id} sku={sku} onView={onView} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
