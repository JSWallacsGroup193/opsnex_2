import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  collapsible?: boolean
  defaultCollapsed?: boolean
  className?: string
}

export function FormSection({
  title,
  description,
  children,
  collapsible = false,
  defaultCollapsed = false,
  className,
}: FormSectionProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn("bg-slate-800 rounded-lg p-4", collapsible && "cursor-pointer select-none")}
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-slate-100 text-lg font-bold">{title}</h3>
            {description && <p className="text-slate-400 text-sm mt-1">{description}</p>}
          </div>
          {collapsible && (
            <ChevronDown className={cn("size-5 text-slate-400 transition-transform", isCollapsed && "rotate-180")} />
          )}
        </div>
      </div>

      {(!collapsible || !isCollapsed) && <div className="space-y-4 px-1">{children}</div>}

      <div className="border-t border-slate-600 pt-4" />
    </div>
  )
}
