import { cn } from "@/lib/utils"

type Priority = "low" | "medium" | "high" | "emergency"

interface PriorityBadgeProps {
  priority: Priority
  showDot?: boolean
  className?: string
}

const priorityConfig: Record<
  Priority,
  {
    label: string
    bgColor: string
    textColor: string
  }
> = {
  low: {
    label: "Low",
    bgColor: "bg-[#6b7280]",
    textColor: "text-white",
  },
  medium: {
    label: "Medium",
    bgColor: "bg-[#f59e0b]",
    textColor: "text-white",
  },
  high: {
    label: "High",
    bgColor: "bg-[#fb923c]",
    textColor: "text-white",
  },
  emergency: {
    label: "Emergency",
    bgColor: "bg-[#ef4444]",
    textColor: "text-white",
  },
}

export function PriorityBadge({ priority, showDot = false, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority]

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
