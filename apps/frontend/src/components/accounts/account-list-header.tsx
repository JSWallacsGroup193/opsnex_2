import { Search } from 'lucide-react'

interface AccountListHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onCreate: () => void
}

export function AccountListHeader({ searchQuery, onSearchChange, onCreate }: AccountListHeaderProps) {
  return (
    <header className="border-b border-slate-600 bg-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-slate-100">Customer Accounts</h1>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-500" />
              <input
                type="text"
                placeholder="Search accounts, contacts, phone..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 py-2 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:w-80"
              />
            </div>

            <button
              onClick={onCreate}
              className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
