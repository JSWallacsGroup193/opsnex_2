import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { InventoryFilters as InventoryFiltersType } from "@/types/view-models/inventory"

interface InventoryFiltersProps {
  filters: InventoryFiltersType
  onFiltersChange: (filters: InventoryFiltersType) => void
  categories: string[]
  warehouses: string[]
}

export function InventoryFilters({ filters, onFiltersChange, categories, warehouses }: InventoryFiltersProps) {
  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      categories: [],
      stockStatus: "all",
      warehouse: "",
      sortBy: "sku",
    })
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.stockStatus !== "all" ||
    filters.warehouse !== "" ||
    filters.sortBy !== "sku"

  return (
    <div className="bg-slate-700 border-b border-slate-600 px-4 py-3 md:px-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <Select
          value={filters.categories[0] || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              categories: value === "all" ? [] : [value],
            })
          }
        >
          <SelectTrigger className="w-[180px] bg-slate-800 border-slate-600 text-slate-100">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all" className="text-slate-100">
              All Categories
            </SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="text-slate-100">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Stock Status Filter */}
        <Select
          value={filters.stockStatus}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              stockStatus: value as InventoryFiltersType["stockStatus"],
            })
          }
        >
          <SelectTrigger className="w-[180px] bg-slate-800 border-slate-600 text-slate-100">
            <SelectValue placeholder="Stock Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all" className="text-slate-100">
              All Stock
            </SelectItem>
            <SelectItem value="in-stock" className="text-slate-100">
              In Stock
            </SelectItem>
            <SelectItem value="low-stock" className="text-slate-100">
              Low Stock
            </SelectItem>
            <SelectItem value="out-of-stock" className="text-slate-100">
              Out of Stock
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Warehouse Filter */}
        <Select
          value={filters.warehouse || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              warehouse: value === "all" ? "" : value,
            })
          }
        >
          <SelectTrigger className="w-[180px] bg-slate-800 border-slate-600 text-slate-100">
            <SelectValue placeholder="Warehouse" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all" className="text-slate-100">
              All Warehouses
            </SelectItem>
            {warehouses.map((warehouse) => (
              <SelectItem key={warehouse} value={warehouse} className="text-slate-100">
                {warehouse}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              sortBy: value as InventoryFiltersType["sortBy"],
            })
          }
        >
          <SelectTrigger className="w-[180px] bg-slate-800 border-slate-600 text-slate-100">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="sku" className="text-slate-100">
              SKU
            </SelectItem>
            <SelectItem value="description" className="text-slate-100">
              Description
            </SelectItem>
            <SelectItem value="stock-level" className="text-slate-100">
              Stock Level
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            onClick={handleClearFilters}
            variant="outline"
            className="border-slate-600 text-teal-500 hover:bg-slate-600 bg-transparent"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
