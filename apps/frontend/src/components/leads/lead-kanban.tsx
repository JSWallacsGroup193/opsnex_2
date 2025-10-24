import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { useState } from "react"
import { LeadKanbanColumn } from "./lead-kanban-column"
import { LeadKanbanCard } from "./lead-kanban-card"
import type { Lead, LeadStatus } from "@/types/view-models/lead"

interface LeadKanbanProps {
  leads: Lead[]
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void
  onViewLead: (leadId: string) => void
  onConvert: (leadId: string) => void
  onMarkLost: (leadId: string) => void
  onScheduleFollowup: (leadId: string) => void
}

const columns: { status: LeadStatus; label: string }[] = [
  { status: "new", label: "New" },
  { status: "contacted", label: "Contacted" },
  { status: "qualified", label: "Qualified" },
  { status: "proposal", label: "Proposal Sent" },
  { status: "won", label: "Won" },
  { status: "lost", label: "Lost" },
]

export function LeadKanban({
  leads,
  onStatusChange,
  onViewLead,
  onConvert,
  onMarkLost,
  onScheduleFollowup,
}: LeadKanbanProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const leadId = active.id as string
      const newStatus = over.id as LeadStatus
      onStatusChange(leadId, newStatus)
    }

    setActiveId(null)
  }

  const activeLead = activeId ? leads.find((lead) => lead.id === activeId) : null

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-6">
        {columns.map((column) => {
          const columnLeads = leads.filter((lead) => lead.status === column.status)
          return (
            <LeadKanbanColumn
              key={column.status}
              status={column.status}
              label={column.label}
              leads={columnLeads}
              onViewLead={onViewLead}
              onConvert={onConvert}
              onMarkLost={onMarkLost}
              onScheduleFollowup={onScheduleFollowup}
            />
          )
        })}
      </div>

      <DragOverlay>
        {activeLead ? (
          <LeadKanbanCard
            lead={activeLead}
            onViewLead={onViewLead}
            onConvert={onConvert}
            onMarkLost={onMarkLost}
            onScheduleFollowup={onScheduleFollowup}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
