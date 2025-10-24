import { ChevronRight } from "lucide-react"

type WorkOrderStatus = "scheduled" | "in-progress" | "completed" | "invoiced"

interface WorkOrderCardProps {
  status: WorkOrderStatus
  customer: string
  address: string
  timeSlot: string
  jobType: string
  technicianName?: string
  onViewDetails?: () => void
}

const statusConfig: Record<WorkOrderStatus, { label: string; bgColor: string; textColor: string }> = {
  scheduled: {
    label: "Scheduled",
    bgColor: "bg-gray-600",
    textColor: "text-white",
  },
  "in-progress": {
    label: "In Progress",
    bgColor: "bg-slate-500",
    textColor: "text-white",
  },
  completed: {
    label: "Completed",
    bgColor: "bg-emerald-500",
    textColor: "text-white",
  },
  invoiced: {
    label: "Invoiced",
    bgColor: "bg-teal-500",
    textColor: "text-white",
  },
}

export function WorkOrderCard({
  status,
  customer,
  address,
  timeSlot,
  jobType,
  technicianName,
  onViewDetails,
}: WorkOrderCardProps) {
  const config = statusConfig[status]

  return (
    <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 md:p-6 w-full md:max-w-[400px] transition-all duration-200 hover:bg-slate-600">
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <span className={`${config.bgColor} ${config.textColor} px-3 py-1 rounded-full text-xs font-medium`}>
          {config.label}
        </span>
      </div>

      {/* Customer Name */}
      <h3 className="text-slate-100 text-lg font-bold mb-2">{customer}</h3>

      {/* Address */}
      <p className="text-slate-400 text-sm mb-3">{address}</p>

      {/* Time Slot */}
      <p className="text-teal-400 text-base font-medium mb-2">{timeSlot}</p>

      {/* Job Type */}
      <p className="text-slate-100 text-base mb-3">{jobType}</p>

      {/* Technician */}
      {technicianName && <p className="text-slate-400 text-sm mb-4">Technician: {technicianName}</p>}

      {/* View Details Button */}
      <button
        onClick={onViewDetails}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mt-4"
      >
        View Details
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
