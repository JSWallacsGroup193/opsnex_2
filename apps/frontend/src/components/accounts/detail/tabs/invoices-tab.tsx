

import { Plus, Eye, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AccountInvoice } from "@/types/view-models/account-detail"

interface InvoicesTabProps {
  invoices: AccountInvoice[]
  totalBilled: number
  totalPaid: number
  totalOutstanding: number
  onCreateInvoice: () => void
  onViewInvoice: (invoiceId: string) => void
}

export function InvoicesTab({
  invoices,
  totalBilled,
  totalPaid,
  totalOutstanding,
  onCreateInvoice,
  onViewInvoice,
}: InvoicesTabProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "pending":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "overdue":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-600 text-slate-300 border-slate-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <p className="text-sm text-slate-400 mb-2">Total Billed</p>
          <p className="text-3xl font-bold text-slate-100">${totalBilled.toLocaleString()}</p>
        </div>

        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <p className="text-sm text-slate-400 mb-2">Total Paid</p>
          <p className="text-3xl font-bold text-emerald-400">${totalPaid.toLocaleString()}</p>
        </div>

        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <p className="text-sm text-slate-400 mb-2">Outstanding</p>
          <p className="text-3xl font-bold text-amber-400">${totalOutstanding.toLocaleString()}</p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">Invoices</h3>
          <Button onClick={onCreateInvoice} className="bg-teal-500 text-white hover:bg-teal-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-slate-700 rounded-lg border border-slate-600 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Invoice#
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-600">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-600/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-teal-500 font-medium">{invoice.invoiceNumber}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300">{invoice.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-100 font-medium">
                    ${invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewInvoice(invoice.id)}
                      className="text-teal-500 hover:text-teal-400"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Invoice
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-teal-500 font-medium">{invoice.invoiceNumber}</p>
                  <p className="text-sm text-slate-400">{invoice.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-slate-100">${invoice.amount.toLocaleString()}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewInvoice(invoice.id)}
                  className="border-teal-500 text-teal-500 hover:bg-teal-500/10"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History (Collapsed Section) */}
      <div className="bg-slate-700 rounded-lg border border-slate-600">
        <button className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-600/50 transition-colors">
          <span className="text-slate-100 font-medium">Payment History</span>
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </button>
      </div>
    </div>
  )
}
