

import { useState } from "react"
import { Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { WorkOrder } from "@/types/view-models/work-order-detail"

interface WorkOrdersTabProps {
  workOrders: WorkOrder[]
  onCreateWorkOrder: () => void
  onViewWorkOrder: (workOrderId: string) => void
}

export function WorkOrdersTab({ workOrders, onCreateWorkOrder, onViewWorkOrder }: WorkOrdersTabProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredWorkOrders = statusFilter === "all" ? workOrders : workOrders.filter((wo) => wo.status === statusFilter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "in-progress":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "completed":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-600 text-slate-300 border-slate-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-slate-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-slate-100">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onCreateWorkOrder} className="bg-teal-500 text-white hover:bg-teal-600">
          <Plus className="h-4 w-4 mr-2" />
          Create Work Order
        </Button>
      </div>

      {filteredWorkOrders.length === 0 ? (
        <div className="bg-slate-700 rounded-lg p-12 border border-slate-600 text-center">
          <p className="text-slate-400 mb-4">No work orders yet</p>
          <Button onClick={onCreateWorkOrder} className="bg-teal-500 text-white hover:bg-teal-600">
            <Plus className="h-4 w-4 mr-2" />
            Create First Work Order
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-slate-700 rounded-lg border border-slate-600 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    WO#
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Technician
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600">
                {filteredWorkOrders.map((wo) => (
                  <tr
                    key={wo.id}
                    onClick={() => onViewWorkOrder(wo.id)}
                    className="hover:bg-slate-600/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-teal-500 font-medium">#{wo.workOrderNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">{wo.scheduledDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">{wo.jobType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(wo.status)}`}
                      >
                        {wo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">{wo.assignedTo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-slate-100 font-medium">
                      ${wo.estimatedCost?.toLocaleString() || "0"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredWorkOrders.map((wo) => (
              <div
                key={wo.id}
                onClick={() => onViewWorkOrder(wo.id)}
                className="bg-slate-700 rounded-lg p-4 border border-slate-600 cursor-pointer hover:bg-slate-600/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-teal-500 font-medium">#{wo.workOrderNumber}</p>
                    <p className="text-sm text-slate-400">{wo.scheduledDate}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(wo.status)}`}>
                    {wo.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-slate-100">{wo.jobType}</p>
                  <p className="text-sm text-slate-400">Technician: {wo.assignedTo}</p>
                  <p className="text-lg font-semibold text-slate-100">${wo.estimatedCost?.toLocaleString() || "0"}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
