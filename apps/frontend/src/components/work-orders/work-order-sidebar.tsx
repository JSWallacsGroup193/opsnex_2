import { useState } from "react"
import { Calendar, User, FileText, Send, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { WorkOrderStatus, WorkOrderDetail } from "@/types/view-models/work-order"

interface WorkOrderSidebarProps {
  workOrder: WorkOrderDetail
  onStatusChange: (status: WorkOrderStatus) => void
  onReassign?: (technicianId: string) => void
  onReschedule?: (date: string) => void
  onGenerateInvoice: () => void
  onSendUpdate: () => void
  onMarkComplete: () => void
  onCancel: () => void
}

const statusConfig: Record<WorkOrderStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  "in-progress": { label: "In Progress", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  completed: { label: "Completed", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  cancelled: { label: "Cancelled", className: "bg-red-500/20 text-red-400 border-red-500/30" },
}

export function WorkOrderSidebar({
  workOrder,
  onStatusChange,
  onGenerateInvoice,
  onSendUpdate,
  onMarkComplete,
  onCancel,
}: WorkOrderSidebarProps) {
  const [selectedStatus, setSelectedStatus] = useState(workOrder.status)

  return (
    <div className="space-y-4">
      {/* Status Management */}
      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
        <h3 className="text-slate-100 font-semibold mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-500" />
          Status Management
        </h3>

        <Badge className={`${statusConfig[workOrder.status].className} w-full justify-center py-2 mb-3`}>
          {statusConfig[workOrder.status].label}
        </Badge>

        <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as WorkOrderStatus)}>
          <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="pending" className="text-slate-300 focus:bg-slate-700">
              Pending
            </SelectItem>
            <SelectItem value="in-progress" className="text-slate-300 focus:bg-slate-700">
              In Progress
            </SelectItem>
            <SelectItem value="completed" className="text-slate-300 focus:bg-slate-700">
              Completed
            </SelectItem>
            <SelectItem value="cancelled" className="text-slate-300 focus:bg-slate-700">
              Cancelled
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={() => onStatusChange(selectedStatus)}
          disabled={selectedStatus === workOrder.status}
          className="w-full mt-3 bg-teal-500 hover:bg-teal-600 text-white"
        >
          Update Status
        </Button>

        {workOrder.statusHistory.length > 0 && (
          <details className="mt-3">
            <summary className="text-slate-400 text-sm cursor-pointer hover:text-slate-300">
              Status History ({workOrder.statusHistory.length})
            </summary>
            <div className="mt-2 space-y-2">
              {workOrder.statusHistory.slice(0, 3).map((history, idx) => (
                <div key={idx} className="text-xs text-slate-400 pl-2 border-l-2 border-slate-600">
                  <div className="font-medium text-slate-300 capitalize">{history.status}</div>
                  <div>{new Date(history.timestamp).toLocaleString()}</div>
                  <div>by {history.user}</div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>

      {/* Assignment */}
      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
        <h3 className="text-slate-100 font-semibold mb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-teal-500" />
          Assignment
        </h3>

        {workOrder.technician ? (
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={workOrder.technician.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-teal-500/20 text-teal-500">
                {workOrder.technician.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-slate-100 font-medium">{workOrder.technician.name}</p>
              <p className="text-slate-400 text-sm">Current Technician</p>
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-sm mb-3">No technician assigned</p>
        )}

        <Button variant="outline" className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent">
          Reassign
        </Button>
      </div>

      {/* Schedule */}
      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
        <h3 className="text-slate-100 font-semibold mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-500" />
          Schedule
        </h3>

        <div className="mb-3">
          <p className="text-slate-400 text-sm mb-1">Scheduled Date</p>
          <p className="text-teal-500 font-medium">
            {new Date(workOrder.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <Button variant="outline" className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent">
          Reschedule
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
        <h3 className="text-slate-100 font-semibold mb-3">Quick Actions</h3>

        <div className="space-y-2">
          <Button onClick={onGenerateInvoice} className="w-full bg-teal-500 hover:bg-teal-600 text-white">
            <FileText className="w-4 h-4 mr-2" />
            Generate Invoice
          </Button>

          <Button
            onClick={onSendUpdate}
            variant="outline"
            className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Update to Customer
          </Button>

          <Button onClick={onMarkComplete} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark Complete
          </Button>

          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full border-red-500 text-red-500 hover:bg-red-500/10 bg-transparent"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel Work Order
          </Button>
        </div>
      </div>
    </div>
  )
}
