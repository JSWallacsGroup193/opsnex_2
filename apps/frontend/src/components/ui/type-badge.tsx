import { cn } from "@/lib/utils"

type JobType = "maintenance" | "repair" | "installation" | "emergency"

interface TypeBadgeProps {
  type: JobType
  showDot?: boolean
  className?: string
}

const typeConfig: Record<
  JobType,
  {
    label: string
    bgColor: string
    textColor: string
  }
> = {
  maintenance: {
    label: "Maintenance",
    bgColor: "bg-[#14b8a6]",
    textColor: "text-white",
  },
  repair: {
    label: "Repair",
    bgColor: "bg-[#64748b]",
    textColor: "text-white",
  },
  installation: {
    label: "Installation",
    bgColor: "bg-[#14b8a6]",
    textColor: "text-white",
  },
  emergency: {
    label: "Emergency",
    bgColor: "bg-[#64748b]",
    textColor: "text-white",
  },
}

export function TypeBadge({ type, showDot = false, className }: TypeBadgeProps) {
  const config = typeConfig[type]

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
