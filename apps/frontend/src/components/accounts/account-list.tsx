import { useState } from 'react'
import type { Account, AccountFilters as AccountFiltersType, AccountStats } from '@/types/view-models/account'
import { AccountListHeader } from './account-list-header'
import { AccountStats as AccountStatsComponent } from './account-stats'
import { AccountFilters } from './account-filters'
import { AccountTable } from './account-table'
import { AccountCard } from './account-card'

interface AccountListProps {
  accounts: Account[]
  totalCount: number
  stats: AccountStats
  onFilterChange: (filters: AccountFiltersType) => void
  onCreate: () => void
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function AccountList({
  accounts,
  totalCount: _totalCount,
  stats,
  onFilterChange,
  onCreate,
  onView,
  onEdit,
  onDelete,
}: AccountListProps) {
  const [filters, setFilters] = useState<AccountFiltersType>({
    search: '',
    accountType: 'both',
    status: 'all',
    serviceArea: '',
    sortBy: 'name',
  })

  const handleFilterChange = (newFilters: Partial<AccountFiltersType>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFilterChange(updated)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <AccountListHeader
        searchQuery={filters.search}
        onSearchChange={(search) => handleFilterChange({ search })}
        onCreate={onCreate}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AccountStatsComponent stats={stats} />

        <AccountFilters filters={filters} onFilterChange={handleFilterChange} />

        {accounts.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-slate-600 bg-slate-700 py-12">
            <svg className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="mt-4 text-lg text-slate-400">No accounts found</p>
            <button
              onClick={onCreate}
              className="mt-4 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600"
            >
              Create your first account
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="mt-6 hidden md:block">
              <AccountTable
                accounts={accounts}
                sortBy={filters.sortBy}
                onSortChange={(sortBy) => handleFilterChange({ sortBy })}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>

            {/* Mobile Card View */}
            <div className="mt-6 space-y-4 md:hidden">
              {accounts.map((account) => (
                <AccountCard key={account.id} account={account} onView={onView} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
