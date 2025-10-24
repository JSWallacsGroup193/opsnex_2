import { cn } from "@/lib/utils"

type Status = "scheduled" | "in-progress" | "completed" | "invoiced" | "cancelled"

interface StatusBadgeProps {
  status: Status
  showDot?: boolean
  className?: string
}

const statusConfig: Record<
  Status,
  {
    label: string
    bgColor: string
    textColor: string
  }
> = {
  scheduled: {
    label: "Scheduled",
    bgColor: "bg-[#6b7280]",
    textColor: "text-white",
  },
  "in-progress": {
    label: "In Progress",
    bgColor: "bg-[#64748b]",
    textColor: "text-white",
  },
  completed: {
    label: "Completed",
    bgColor: "bg-[#10b981]",
    textColor: "text-white",
  },
  invoiced: {
    label: "Invoiced",
    bgColor: "bg-[#14b8a6]",
    textColor: "text-white",
  },
  cancelled: {
    label: "Cancelled",
    bgColor: "bg-[#ef4444]",
    textColor: "text-white",
  },
}

export function StatusBadge({ status, showDot = false, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium min-h-[28px]",
        config.bgColor,
        config.textColor,
        className,
      )}
    >
      {showDot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {config.label}
    </span>
  )
}
