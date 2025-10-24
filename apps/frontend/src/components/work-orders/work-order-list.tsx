import { Search, Plus, Filter, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WorkOrderTable } from "./work-order-table"
import { WorkOrderCard } from "./work-order-card"
import { WorkOrderStats } from "./work-order-stats"
import { WorkOrderFilters } from "./work-order-filters"
import type { WorkOrder, FilterState } from "@/types/view-models/work-order"

interface WorkOrderListProps {
  workOrders: WorkOrder[]
  totalCount: number
  filters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
  onCreate: () => void
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function WorkOrderList({
  workOrders,
  totalCount,
  filters,
  onFilterChange,
  onCreate,
  onView,
  onEdit,
  onDelete,
}: WorkOrderListProps) {
  // Calculate stats
  const stats = {
    total: totalCount,
    inProgress: workOrders.filter((wo) => wo.status === "in-progress").length,
    completed: workOrders.filter((wo) => wo.status === "completed").length,
  }

  // Count active filters
  const activeFilterCount = [
    filters.status !== "all",
    filters.priority !== "all",
    filters.technicianIds.length > 0,
    filters.dateRange.from !== null || filters.dateRange.to !== null,
  ].filter(Boolean).length

  const handleClearFilters = () => {
    onFilterChange({
      status: "all",
      priority: "all",
      technicianIds: [],
      dateRange: { from: null, to: null },
    })
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-600 sticky top-0 z-10">
        <div className="px-4 py-4 md:px-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-100">Work Orders</h1>
            <Button onClick={onCreate} className="bg-teal-500 hover:bg-teal-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Work Order
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
            <Input
              type="text"
              placeholder="Search work orders..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
        </div>
      </header>

      <div className="px-4 py-6 md:px-6 space-y-6">
        {/* Stats Bar */}
        <WorkOrderStats stats={stats} />

        {/* Filters Bar */}
        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-teal-500" />
              <h2 className="text-lg font-semibold text-slate-100">Filters</h2>
              {activeFilterCount > 0 && (
                <span className="bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-teal-500 hover:text-teal-400 hover:bg-slate-600"
              >
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>

          <WorkOrderFilters filters={filters} onFilterChange={onFilterChange} />
        </div>

        {/* Work Orders List */}
        {workOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-12 h-12 text-teal-500 mb-4" />
            <p className="text-slate-400 text-lg">No work orders found</p>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your filters or create a new work order</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <WorkOrderTable workOrders={workOrders} onView={onView} onEdit={onEdit} onDelete={onDelete} />
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {workOrders.map((workOrder) => (
                <WorkOrderCard
                  key={workOrder.id}
                  workOrder={workOrder}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
