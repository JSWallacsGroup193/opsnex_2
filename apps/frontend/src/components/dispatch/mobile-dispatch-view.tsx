import { useState } from "react"
import { format, isSameDay } from "date-fns"
import { Clock, User, Wrench } from "lucide-react"
import type { WorkOrder, Technician } from "@/types/view-models/dispatch"

interface MobileDispatchViewProps {
  workOrders: WorkOrder[]
  technicians: Technician[]
  selectedDate: Date
}

type ViewTab = "all" | "unassigned" | "by-tech"

export function MobileDispatchView({ workOrders, technicians, selectedDate }: MobileDispatchViewProps) {
  const [activeTab, setActiveTab] = useState<ViewTab>("all")

  const dateStr = format(selectedDate, "yyyy-MM-dd")
  const isToday = isSameDay(selectedDate, new Date())
  
  // Filter work orders for selected date
  const dateWorkOrders = workOrders.filter(wo => wo.date === dateStr)
  const unassignedOrders = dateWorkOrders.filter(wo => !wo.technicianId)
  
  // Group by technician
  const ordersByTech = technicians.map(tech => ({
    tech,
    orders: dateWorkOrders.filter(wo => wo.technicianId === tech.id)
  })).filter(group => group.orders.length > 0)

  return (
    <div className="h-full overflow-auto bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-slate-900 border-b border-slate-800 shadow-md">
        {/* Date */}
        <div className="px-3 py-2.5 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">{format(selectedDate, "EEEE")}</div>
              <div className={`text-base font-bold mt-0.5 ${isToday ? "text-teal-400" : "text-white"}`}>
                {format(selectedDate, "MMMM d, yyyy")}
              </div>
            </div>
            {isToday && (
              <div className="px-2.5 py-1 bg-teal-500 text-white text-xs font-semibold rounded-md shadow-sm">
                TODAY
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "all" 
                ? "text-teal-400 border-b-2 border-teal-400 bg-slate-800/50" 
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            All ({dateWorkOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("unassigned")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "unassigned" 
                ? "text-teal-400 border-b-2 border-teal-400 bg-slate-800/50" 
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Unassigned ({unassignedOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("by-tech")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "by-tech" 
                ? "text-teal-400 border-b-2 border-teal-400 bg-slate-800/50" 
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            By Tech
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pb-6">
        {activeTab === "all" && <AllJobsTable workOrders={dateWorkOrders} technicians={technicians} />}
        {activeTab === "unassigned" && <UnassignedTable workOrders={unassignedOrders} />}
        {activeTab === "by-tech" && <ByTechTable groups={ordersByTech} />}
      </div>
    </div>
  )
}

// Table Components
interface AllJobsTableProps {
  workOrders: WorkOrder[]
  technicians: Technician[]
}

function AllJobsTable({ workOrders, technicians }: AllJobsTableProps) {
  if (workOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 text-sm">No work orders scheduled for this date</div>
      </div>
    )
  }

  const getTechName = (techId: string | null) => {
    if (!techId) return "Unassigned"
    return technicians.find(t => t.id === techId)?.name || "Unknown"
  }

  const getStatusColor = (status: WorkOrder["status"]) => {
    const colors = {
      scheduled: "bg-slate-600 text-slate-100",
      "in-progress": "bg-teal-600 text-white",
      completed: "bg-emerald-600 text-white",
      emergency: "bg-red-600 text-white",
    }
    return colors[status]
  }

  return (
    <div className="divide-y divide-slate-700">
      {workOrders.map((wo) => (
        <div key={wo.id} className="p-3 hover:bg-slate-800/30 active:bg-slate-800/50 transition-colors touch-manipulation">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{wo.customerName}</div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span>{wo.startTime} - {wo.endTime}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(wo.status)}`}>
                {wo.status.replace("-", " ").toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-slate-400">
              <Wrench className="h-3 w-3" />
              <span>{wo.jobType}</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1 text-slate-400">
              <User className="h-3 w-3" />
              <span>{getTechName(wo.technicianId)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface UnassignedTableProps {
  workOrders: WorkOrder[]
}

function UnassignedTable({ workOrders }: UnassignedTableProps) {
  if (workOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 text-sm">No unassigned work orders</div>
      </div>
    )
  }

  const getStatusColor = (status: WorkOrder["status"]) => {
    const colors = {
      scheduled: "bg-slate-600 text-slate-100",
      "in-progress": "bg-teal-600 text-white",
      completed: "bg-emerald-600 text-white",
      emergency: "bg-red-600 text-white",
    }
    return colors[status]
  }

  return (
    <div className="divide-y divide-slate-700">
      {workOrders.map((wo) => (
        <div key={wo.id} className="p-3 hover:bg-slate-800/30 active:bg-slate-800/50 transition-colors touch-manipulation">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{wo.customerName}</div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span>{wo.startTime} - {wo.endTime}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(wo.status)}`}>
                {wo.status.replace("-", " ").toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Wrench className="h-3 w-3" />
            <span>{wo.jobType}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

interface ByTechTableProps {
  groups: Array<{ tech: Technician; orders: WorkOrder[] }>
}

function ByTechTable({ groups }: ByTechTableProps) {
  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 text-sm">No technicians with assignments</div>
      </div>
    )
  }

  const getStatusColor = (status: WorkOrder["status"]) => {
    const colors = {
      scheduled: "bg-slate-600 text-slate-100",
      "in-progress": "bg-teal-600 text-white",
      completed: "bg-emerald-600 text-white",
      emergency: "bg-red-600 text-white",
    }
    return colors[status]
  }

  return (
    <div className="space-y-4 p-3">
      {groups.map(({ tech, orders }) => (
        <div key={tech.id} className="bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700">
          {/* Technician Header */}
          <div className="bg-slate-800 px-3 py-2.5 border-b border-slate-700">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white flex-shrink-0">
                {tech.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{tech.name}</div>
                <div className="text-xs text-slate-400">{orders.length} job{orders.length !== 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>
          
          {/* Jobs List */}
          <div className="divide-y divide-slate-700/50">
            {orders.map((wo) => (
              <div key={wo.id} className="p-3 hover:bg-slate-700/30 active:bg-slate-700/50 transition-colors touch-manipulation">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{wo.customerName}</div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span>{wo.startTime} - {wo.endTime}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${getStatusColor(wo.status)}`}>
                    {wo.status.replace("-", " ").toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Wrench className="h-3 w-3" />
                  <span>{wo.jobType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
