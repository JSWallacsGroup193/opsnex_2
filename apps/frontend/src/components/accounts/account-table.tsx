import { useState } from 'react'
import type { Account } from '@/types/view-models/account'
import { ChevronUp, Eye, Edit, Trash2 } from 'lucide-react'

interface AccountTableProps {
  accounts: Account[]
  sortBy: 'name' | 'lastService' | 'revenue'
  onSortChange: (sortBy: 'name' | 'lastService' | 'revenue') => void
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function AccountTable({ accounts, sortBy, onSortChange, onView, onEdit, onDelete }: AccountTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const itemsPerPage = 10

  const totalPages = Math.ceil(accounts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAccounts = accounts.slice(startIndex, startIndex + itemsPerPage)

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null
    return <ChevronUp className="ml-1 inline h-4 w-4 text-teal-500" />
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-600 bg-slate-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-600 bg-slate-800">
            <tr>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-slate-100"
                onClick={() => onSortChange('name')}
              >
                Account Name
                <SortIcon column="name" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-100">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-100">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-100">Email</th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-slate-100"
                onClick={() => onSortChange('lastService')}
              >
                Last Service
                <SortIcon column="lastService" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-100">Total Jobs</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAccounts.map((account) => (
              <tr
                key={account.id}
                onClick={() => onView(account.id)}
                onMouseEnter={() => setHoveredRow(account.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`cursor-pointer border-b border-slate-600 transition-colors last:border-b-0 ${
                  hoveredRow === account.id ? 'border-l-4 border-l-teal-500 bg-slate-600' : 'bg-slate-700'
                }`}
              >
                <td className="px-4 py-3 text-sm font-medium text-slate-100">{account.name}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      account.type === 'commercial' ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-600 text-slate-300'
                    }`}
                  >
                    {account.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">{account.phone}</td>
                <td className="px-4 py-3 text-sm text-slate-400">{account.email}</td>
                <td className="px-4 py-3 text-sm text-slate-400">
                  {account.lastServiceDate ? new Date(account.lastServiceDate).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">{account.totalJobs}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onView(account.id)
                      }}
                      className="rounded p-1 text-teal-500 hover:bg-slate-600"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(account.id)
                      }}
                      className="rounded p-1 text-teal-500 hover:bg-slate-600"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(account.id)
                      }}
                      className="rounded p-1 text-red-500 hover:bg-slate-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-600 bg-slate-800 px-4 py-3">
          <div className="text-sm text-slate-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, accounts.length)} of {accounts.length} accounts
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-1 text-sm text-slate-100 hover:bg-slate-600 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-lg px-3 py-1 text-sm ${
                  currentPage === page
                    ? 'bg-teal-500 text-white'
                    : 'border border-slate-600 bg-slate-700 text-slate-100 hover:bg-slate-600'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-1 text-sm text-slate-100 hover:bg-slate-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
