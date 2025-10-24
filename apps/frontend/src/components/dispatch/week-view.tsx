import { useDroppable } from "@dnd-kit/core"
import { WorkOrderCard } from "./work-order-card"
import { startOfWeek, addDays, format, isSameDay } from "date-fns"
import type { WorkOrder, Technician } from "@/types/view-models/dispatch"

interface WeekViewProps {
  workOrders: WorkOrder[]
  technicians: Technician[]
  selectedDate: Date
  viewMode?: "day" | "week" | "month"
}

export function WeekView({ workOrders, technicians, selectedDate }: WeekViewProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="min-w-[1280px]">
        {/* Day headers */}
        <div className="sticky top-0 z-10 grid grid-cols-[200px_repeat(7,1fr)] border-b border-border bg-card">
          <div className="border-r border-border p-4" />
          {weekDays.map((day) => {
            const isToday = isSameDay(day, new Date())
            return (
              <div
                key={day.toISOString()}
                className={`border-r border-border p-4 text-center ${isToday ? "border-t-2 border-t-primary" : ""}`}
              >
                <div className="text-xs font-medium text-muted-foreground">{format(day, "EEE")}</div>
                <div className={`text-lg font-semibold ${isToday ? "text-primary" : "text-foreground"}`}>
                  {format(day, "d")}
                </div>
              </div>
            )
          })}
        </div>

        {/* Technician rows */}
        {technicians.map((tech, techIndex) => (
          <div
            key={tech.id}
            className={`grid grid-cols-[200px_repeat(7,1fr)] border-b border-border ${
              techIndex % 2 === 0 ? "bg-card" : "bg-background"
            }`}
          >
            {/* Technician name cell */}
            <div className="sticky left-0 z-10 border-r border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                  {tech.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{tech.name}</div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        tech.status === "available"
                          ? "bg-emerald-500"
                          : tech.status === "on-job"
                            ? "bg-amber-500"
                            : "bg-muted-foreground"
                      }`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {tech.status === "available" ? "Available" : tech.status === "on-job" ? "On Job" : "Off Duty"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Day cells */}
            {weekDays.map((day) => (
              <DayCell
                key={`${tech.id}-${day.toISOString()}`}
                technicianId={tech.id}
                date={day}
                workOrders={workOrders.filter(
                  (wo) => wo.technicianId === tech.id && wo.date === format(day, "yyyy-MM-dd"),
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

interface DayCellProps {
  technicianId: string
  date: Date
  workOrders: WorkOrder[]
}

function DayCell({ technicianId, date, workOrders }: DayCellProps) {
  const dateStr = format(date, "yyyy-MM-dd")
  const { setNodeRef, isOver } = useDroppable({
    id: `${technicianId}-${dateStr}`,
  })

  // Check for conflicts
  const hasConflict = workOrders.some((wo1, i) =>
    workOrders.some((wo2, j) => {
      if (i >= j) return false
      const start1 = Number.parseInt(wo1.startTime.replace(":", ""))
      const end1 = Number.parseInt(wo1.endTime.replace(":", ""))
      const start2 = Number.parseInt(wo2.startTime.replace(":", ""))
      const end2 = Number.parseInt(wo2.endTime.replace(":", ""))
      return start1 < end2 && end1 > start2
    }),
  )

  return (
    <div
      ref={setNodeRef}
      className={`relative min-h-[120px] border-r border-border p-2 transition-colors ${
        isOver ? "bg-primary/20" : "hover:bg-accent"
      }`}
    >
      <div className="space-y-2">
        {workOrders.map((workOrder) => (
          <div key={workOrder.id} className={hasConflict ? "ring-2 ring-red-500" : ""}>
            <WorkOrderCard workOrder={workOrder} />
          </div>
        ))}
      </div>
    </div>
  )
}
