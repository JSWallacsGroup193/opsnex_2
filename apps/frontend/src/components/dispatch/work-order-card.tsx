import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { AlertCircle, Clock, GripVertical, Wrench } from "lucide-react"
import type { WorkOrder } from "@/types/view-models/dispatch"

interface WorkOrderCardProps {
  workOrder: WorkOrder
  isDragging?: boolean
}

export function WorkOrderCard({ workOrder, isDragging = false }: WorkOrderCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: workOrder.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  const statusColors = {
    scheduled: "bg-gray-500 hover:bg-gray-600",
    "in-progress": "bg-primary hover:bg-primary/90",
    completed: "bg-emerald-500 hover:bg-emerald-600",
    emergency: "bg-red-500 hover:bg-red-600",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative cursor-move rounded-lg p-3 sm:p-3 text-white shadow-lg transition-all touch-manipulation ${
        statusColors[workOrder.status]
      } ${isDragging ? "opacity-50" : ""}`}
      {...listeners}
      {...attributes}
    >
      <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 sm:transition-opacity sm:group-hover:opacity-100 lg:block hidden">
        <GripVertical className="h-4 w-4 text-primary-foreground/70" />
      </div>

      <div className="sm:pl-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm sm:text-base truncate">{workOrder.customerName}</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs sm:text-xs">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {workOrder.startTime} - {workOrder.endTime}
              </span>
            </div>
          </div>

          {workOrder.priority === "emergency" && <AlertCircle className="h-5 w-5 sm:h-4 sm:w-4 text-red-200 flex-shrink-0" />}
        </div>

        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 rounded bg-white/20 px-2 py-1 sm:py-0.5 text-xs">
            <Wrench className="h-3.5 w-3.5" />
            <span>{workOrder.jobType}</span>
          </div>
          <div className="rounded bg-white/20 px-2 py-1 sm:py-0.5 text-xs capitalize">{workOrder.status.replace("-", " ")}</div>
        </div>
      </div>
    </div>
  )
}
