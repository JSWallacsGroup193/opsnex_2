import type { AccountFilters as AccountFiltersType } from '@/types/view-models/account'

interface AccountFiltersProps {
  filters: AccountFiltersType
  onFilterChange: (filters: Partial<AccountFiltersType>) => void
}

export function AccountFilters({ filters, onFilterChange }: AccountFiltersProps) {
  const handleClearFilters = () => {
    onFilterChange({
      accountType: 'both',
      status: 'all',
      serviceArea: '',
      sortBy: 'name',
    })
  }

  return (
    <div className="mt-6 rounded-lg border border-slate-600 bg-slate-700 p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Account Type Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Type:</span>
          <div className="flex rounded-lg border border-slate-600 bg-slate-800">
            {(['residential', 'commercial', 'both'] as const).map((type) => (
              <button
                key={type}
                onClick={() => onFilterChange({ accountType: type })}
                className={`px-3 py-1.5 text-sm font-medium capitalize transition-colors first:rounded-l-lg last:rounded-r-lg ${
                  filters.accountType === type ? 'bg-teal-500 text-white' : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Status:</span>
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({
                status: e.target.value as 'active' | 'inactive' | 'all',
              })
            }
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Service Area Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Service Area:</span>
          <select
            value={filters.serviceArea}
            onChange={(e) => onFilterChange({ serviceArea: e.target.value })}
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="">All Areas</option>
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="east">East</option>
            <option value="west">West</option>
            <option value="central">Central</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as 'name' | 'lastService' | 'revenue',
              })
            }
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="name">Name</option>
            <option value="lastService">Last Service</option>
            <option value="revenue">Total Revenue</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={handleClearFilters}
          className="ml-auto rounded-lg bg-slate-600 px-4 py-1.5 text-sm font-medium text-teal-500 hover:bg-slate-500"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}
