import { useState } from "react"
import { Eye, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { WorkOrder } from "@/types/view-models/work-order"

interface WorkOrderTableProps {
  workOrders: WorkOrder[]
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

type SortField = "woNumber" | "customer" | "status" | "date" | "jobType"
type SortDirection = "asc" | "desc"

export function WorkOrderTable({ workOrders, onView, onEdit, onDelete }: WorkOrderTableProps) {
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedWorkOrders = [...workOrders].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortField) {
      case "customer":
        aValue = a.customer.name
        bValue = b.customer.name
        break
      case "date":
        aValue = new Date(a.date)
        bValue = new Date(b.date)
        break
      default:
        aValue = a[sortField]
        bValue = b[sortField]
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedWorkOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedWorkOrders = sortedWorkOrders.slice(startIndex, startIndex + itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20"
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-teal-500" />
    ) : (
      <ChevronDown className="w-4 h-4 text-teal-500" />
    )
  }

  return (
    <div className="bg-slate-700 rounded-lg border border-slate-600 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-600">
              <th
                className="px-4 py-3 text-left text-sm font-medium text-slate-400 hover:text-teal-500 cursor-pointer"
                onClick={() => handleSort("woNumber")}
              >
                <div className="flex items-center gap-2">
                  WO #
                  <SortIcon field="woNumber" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-slate-400 hover:text-teal-500 cursor-pointer"
                onClick={() => handleSort("customer")}
              >
                <div className="flex items-center gap-2">
                  Customer
                  <SortIcon field="customer" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-slate-400 hover:text-teal-500 cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-2">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Technician</th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-slate-400 hover:text-teal-500 cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-2">
                  Date
                  <SortIcon field="date" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-slate-400 hover:text-teal-500 cursor-pointer"
                onClick={() => handleSort("jobType")}
              >
                <div className="flex items-center gap-2">
                  Job Type
                  <SortIcon field="jobType" />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedWorkOrders.map((workOrder) => (
              <tr
                key={workOrder.id}
                className="border-b border-slate-600 hover:bg-slate-600 cursor-pointer transition-colors"
                onClick={() => onView(workOrder.id)}
              >
                <td className="px-4 py-4 text-sm font-medium text-slate-100">{workOrder.woNumber}</td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-100">{workOrder.customer.name}</p>
                    <p className="text-xs text-slate-400">{workOrder.customer.address}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(workOrder.status)}`}
                  >
                    {workOrder.status.replace("-", " ")}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-100">{workOrder.technician?.name || "Unassigned"}</td>
                <td className="px-4 py-4 text-sm text-slate-100">{new Date(workOrder.date).toLocaleDateString()}</td>
                <td className="px-4 py-4 text-sm text-slate-100 capitalize">{workOrder.jobType}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        onView(workOrder.id)
                      }}
                      className="text-teal-500 hover:text-teal-400 hover:bg-slate-800"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(workOrder.id)
                      }}
                      className="text-teal-500 hover:text-teal-400 hover:bg-slate-800"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(workOrder.id)
                      }}
                      className="text-red-500 hover:text-red-400 hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-600">
          <p className="text-sm text-slate-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedWorkOrders.length)} of{" "}
            {sortedWorkOrders.length} results
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="bg-slate-800 border-slate-600 text-slate-100 hover:bg-slate-700 disabled:opacity-50"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? "bg-teal-500 text-white hover:bg-teal-600"
                    : "bg-slate-800 border-slate-600 text-slate-100 hover:bg-slate-700"
                }
              >
                {page}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="bg-slate-800 border-slate-600 text-slate-100 hover:bg-slate-700 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
