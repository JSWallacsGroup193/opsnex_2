import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FilterState } from "@/types/view-models/work-order"

interface WorkOrderFiltersProps {
  filters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
}

export function WorkOrderFilters({ filters, onFilterChange }: WorkOrderFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Status Filter */}
      <div>
        <label className="text-sm font-medium text-slate-400 mb-2 block">Status</label>
        <Select value={filters.status} onValueChange={(value) => onFilterChange({ status: value as any })}>
          <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100 focus:border-teal-500 focus:ring-teal-500">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all" className="text-slate-100 focus:bg-slate-700 focus:text-teal-500">
              All Statuses
            </SelectItem>
            <SelectItem value="pending" className="text-slate-100 focus:bg-slate-700 focus:text-teal-500">
              Pending
            </SelectItem>
            <SelectItem value="in-progress" className="text-slate-100 focus:bg-slate-700 focus:text-teal-500">
              In Progress
            </SelectItem>
            <SelectItem value="completed" className="text-slate-100 focus:bg-slate-700 focus:text-teal-500">
              Completed
            </SelectItem>
            <SelectItem value="cancelled" className="text-slate-100 focus:bg-slate-700 focus:text-teal-500">
              Cancelled
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Priority Filter */}
      <div>
        <label className="text-sm font-medium text-slate-400 mb-2 block">Priority</label>
        <Select value={filters.priority} onValueChange={(value) => onFilterChange({ priority: value as any })}>
          <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100 focus:border-teal-500 focus:ring-teal-500">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all" className="text-slate-100 focus:bg-slate-700 focus:text-teal-500">
              All Priorities
            </SelectItem>
            <SelectItem value="low" className="text-slate-100 focus:bg-slate-700 focus:text-teal-500">
              Low
            </SelectItem>
            <SelectItem value="medium" className="text-slate-100 focus:bg-slate-700 focus:text-teal-500">
              Medium
            </SelectItem>
            <SelectItem value="high" className="text-slate-100 focus:bg-slate-700 focus:text-teal-500">
              High
            </SelectItem>
            <SelectItem value="urgent" className="text-slate-100 focus:bg-slate-700 focus:text-teal-500">
              Urgent
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Range */}
      <div>
        <label className="text-sm font-medium text-slate-400 mb-2 block">Date From</label>
        <input
          type="date"
          value={filters.dateRange.from?.toISOString().split("T")[0] || ""}
          onChange={(e) =>
            onFilterChange({
              dateRange: {
                ...filters.dateRange,
                from: e.target.value ? new Date(e.target.value) : null,
              },
            })
          }
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-400 mb-2 block">Date To</label>
        <input
          type="date"
          value={filters.dateRange.to?.toISOString().split("T")[0] || ""}
          onChange={(e) =>
            onFilterChange({
              dateRange: {
                ...filters.dateRange,
                to: e.target.value ? new Date(e.target.value) : null,
              },
            })
          }
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
        />
      </div>
    </div>
  )
}
