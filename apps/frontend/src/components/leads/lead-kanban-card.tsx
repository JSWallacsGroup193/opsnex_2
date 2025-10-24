import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Flag, Building2, DollarSign, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Lead } from "@/types/view-models/lead"

interface LeadKanbanCardProps {
  lead: Lead
  onViewLead: (leadId: string) => void
  onConvert: (leadId: string) => void
  onMarkLost: (leadId: string) => void
  onScheduleFollowup: (leadId: string) => void
  isDragging?: boolean
}

const priorityColors = {
  hot: "text-red-500",
  warm: "text-amber-500",
  cold: "text-blue-500",
}

export function LeadKanbanCard({ lead, onViewLead, isDragging = false }: LeadKanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: lead.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onViewLead(lead.id)}
      className="bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg p-4 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-slate-100">{lead.name}</h4>
        {lead.priority === "hot" && <Flag className={`h-4 w-4 ${priorityColors[lead.priority]}`} />}
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
        <Building2 className="h-3 w-3" />
        <span>{lead.company}</span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 text-teal-500 font-semibold">
          <DollarSign className="h-4 w-4" />
          <span>{lead.value.toLocaleString()}</span>
        </div>

        <Badge variant="outline" className="bg-slate-800 border-slate-600 text-slate-300">
          {lead.source}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{lead.daysInStatus}d in status</span>
        </div>
        <span>{lead.assignedTo.name}</span>
      </div>
    </div>
  )
}
