import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Clock, TrendingUp, Users, AlertCircle, Timer, Plus, Phone, Search } from "lucide-react"

interface WorkOrder {
  id: string
  customerName: string
  address: string
  time: string
  jobType: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
  priority?: "low" | "medium" | "high"
}

interface Technician {
  id: string
  name: string
  status: "available" | "break" | "busy"
  avatar?: string
  currentJob?: string
}

interface DispatcherDashboardProps {
  activeJobs: number
  availableTechs: number
  emergencyCalls: number
  avgResponseTime: number
  technicians: Technician[]
  workOrders: WorkOrder[]
  unassigned: WorkOrder[]
}

// interface ScheduleSlot {
//   technicianId: string
//   hour: number
//   workOrder?: WorkOrder
// }

function SortableWorkOrder({ workOrder }: { workOrder: WorkOrder }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: workOrder.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const priorityColor =
    workOrder.priority === "high" ? "bg-red-500" : workOrder.priority === "medium" ? "bg-amber-500" : "bg-slate-500"

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-slate-700 p-3 rounded-lg mb-2 cursor-grab active:cursor-grabbing hover:bg-slate-600 transition-colors"
    >
      <div className="flex items-start justify-between mb-1">
        <p className="text-slate-100 font-medium text-sm">{workOrder.customerName}</p>
        {workOrder.priority === "high" && <AlertCircle className="w-4 h-4 text-red-500" />}
      </div>
      <p className="text-slate-400 text-xs mb-2">{workOrder.address}</p>
      <div className="flex items-center justify-between">
        <span className="text-slate-300 text-xs">{workOrder.jobType}</span>
        <div className={`w-2 h-2 rounded-full ${priorityColor}`} />
      </div>
    </div>
  )
}

export function DispatcherDashboard({
  activeJobs,
  availableTechs,
  emergencyCalls,
  avgResponseTime,
  technicians,
  workOrders,
  unassigned,
}: DispatcherDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [activeId, setActiveId] = useState<string | null>(null)
  // const [schedule, setSchedule] = useState<ScheduleSlot[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = () => {
    setActiveId(null)
    // Handle drop logic here - event parameter removed as it's unused
  }

  const hours = Array.from({ length: 13 }, (_, i) => i + 7) // 7 AM to 7 PM

  const statusDotColor = (status: Technician["status"]) => {
    switch (status) {
      case "available":
        return "bg-emerald-500"
      case "break":
        return "bg-amber-500"
      case "busy":
        return "bg-red-500"
    }
  }

  const activeWorkOrder = activeId ? [...workOrders, ...unassigned].find((wo) => wo.id === activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-slate-950 text-slate-100">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Dispatch Overview</h1>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-slate-400" />
                <p className="text-slate-400 text-sm">
                  {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </p>
              </div>
            </div>
            <Badge className="bg-teal-500/20 text-teal-500 border-teal-500/30">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse mr-2" />
              Live Updates
            </Badge>
          </div>
        </header>

        <div className="p-6">
          {/* KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-700 border-slate-600 p-4 hover:bg-slate-600 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm">Active Jobs</p>
                <TrendingUp className="w-4 h-4 text-teal-500" />
              </div>
              <p className="text-3xl font-bold text-slate-100">{activeJobs}</p>
            </Card>

            <Card className="bg-slate-700 border-slate-600 p-4 hover:bg-slate-600 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm">Available Techs</p>
                <Users className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-slate-100">{availableTechs}</p>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                </div>
              </div>
            </Card>

            <Card className="bg-slate-700 border-slate-600 p-4 hover:bg-slate-600 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm">Emergency Calls</p>
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-slate-100">{emergencyCalls}</p>
            </Card>

            <Card className="bg-slate-700 border-slate-600 p-4 hover:bg-slate-600 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm">Avg Response Time</p>
                <Timer className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-3xl font-bold text-slate-100">{avgResponseTime} min</p>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Work Order
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Phone className="w-4 h-4 mr-2" />
              Emergency Call
            </Button>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search work orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Schedule Section */}
            <div className="lg:col-span-3">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h2 className="text-xl font-bold text-slate-100 mb-4">Today's Schedule</h2>

                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    {/* Timeline Header */}
                    <div className="flex mb-4">
                      <div className="w-32 flex-shrink-0" />
                      <div className="flex-1 flex">
                        {hours.map((hour) => (
                          <div
                            key={hour}
                            className="flex-1 text-center text-xs text-slate-400 border-l border-slate-700 px-1"
                          >
                            {hour > 12 ? hour - 12 : hour} {hour >= 12 ? "PM" : "AM"}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technician Rows */}
                    {technicians.map((tech) => (
                      <div key={tech.id} className="flex mb-3 group">
                        <div className="w-32 flex-shrink-0 pr-4">
                          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors">
                            <div className={`w-2 h-2 rounded-full ${statusDotColor(tech.status)}`} />
                            <div>
                              <p className="text-sm font-medium text-slate-100">{tech.name}</p>
                              <p className="text-xs text-slate-400 capitalize">{tech.status}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 flex bg-slate-700/30 rounded-lg relative min-h-[60px]">
                          {hours.map((hour) => (
                            <div
                              key={hour}
                              className="flex-1 border-l border-slate-700 hover:bg-slate-700/50 transition-colors"
                            />
                          ))}
                          {/* Work orders would be positioned absolutely here based on time */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Unassigned Jobs Panel */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800 border-slate-700 p-4 sticky top-6">
                <h2 className="text-lg font-bold text-slate-100 mb-4">Unassigned Jobs</h2>
                <SortableContext items={unassigned.map((wo) => wo.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {unassigned.map((workOrder) => (
                      <SortableWorkOrder key={workOrder.id} workOrder={workOrder} />
                    ))}
                  </div>
                </SortableContext>
                {unassigned.length === 0 && (
                  <p className="text-slate-400 text-sm text-center py-8">No unassigned jobs</p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeWorkOrder ? (
          <div className="bg-slate-700 p-3 rounded-lg shadow-lg border-2 border-teal-500">
            <p className="text-slate-100 font-medium text-sm">{activeWorkOrder.customerName}</p>
            <p className="text-slate-400 text-xs">{activeWorkOrder.address}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
