import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { LeadKanbanCard } from "./lead-kanban-card"
import type { Lead, LeadStatus } from "@/types/view-models/lead"

interface LeadKanbanColumnProps {
  status: LeadStatus
  label: string
  leads: Lead[]
  onViewLead: (leadId: string) => void
  onConvert: (leadId: string) => void
  onMarkLost: (leadId: string) => void
  onScheduleFollowup: (leadId: string) => void
}

export function LeadKanbanColumn({
  status,
  label,
  leads,
  onViewLead,
  onConvert,
  onMarkLost,
  onScheduleFollowup,
}: LeadKanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-100">{label}</h3>
            <span className="text-sm text-slate-400 bg-slate-900 px-2 py-1 rounded">{leads.length}</span>
          </div>
        </div>

        <div ref={setNodeRef} className={`p-4 space-y-3 min-h-[500px] ${isOver ? "bg-slate-700/50" : ""}`}>
          <SortableContext items={leads.map((lead) => lead.id)} strategy={verticalListSortingStrategy}>
            {leads.map((lead) => (
              <LeadKanbanCard
                key={lead.id}
                lead={lead}
                onViewLead={onViewLead}
                onConvert={onConvert}
                onMarkLost={onMarkLost}
                onScheduleFollowup={onScheduleFollowup}
              />
            ))}
          </SortableContext>

          {leads.length === 0 && <div className="text-center py-8 text-slate-500">No leads</div>}
        </div>
      </div>
    </div>
  )
}
