import { ChevronRight, Edit, Printer, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { WorkOrderStatus } from "@/types/view-models/work-order"

interface WorkOrderDetailHeaderProps {
  woNumber: string
  status: WorkOrderStatus
  onEdit: () => void
  onPrint: () => void
  onDelete: () => void
}

const statusConfig: Record<WorkOrderStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  "in-progress": { label: "In Progress", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  completed: { label: "Completed", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  cancelled: { label: "Cancelled", className: "bg-red-500/20 text-red-400 border-red-500/30" },
}

export function WorkOrderDetailHeader({ woNumber, status, onEdit, onPrint, onDelete }: WorkOrderDetailHeaderProps) {
  return (
    <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
        <span className="hover:text-teal-500 cursor-pointer">Work Orders</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-100">{woNumber}</span>
      </div>

      {/* Header Content */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-100">{woNumber}</h1>
          <Badge className={`${statusConfig[status].className} text-base px-4 py-1.5`}>
            {statusConfig[status].label}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onEdit}
            className="border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={onPrint}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            variant="outline"
            onClick={onDelete}
            className="border-red-500 text-red-500 hover:bg-red-500/10 bg-transparent"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
              <DropdownMenuItem className="text-slate-300 focus:bg-slate-700 focus:text-slate-100">
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-300 focus:bg-slate-700 focus:text-slate-100">
                Export PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-300 focus:bg-slate-700 focus:text-slate-100">
                Send to Customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
