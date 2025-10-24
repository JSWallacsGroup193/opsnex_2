import type * as React from "react"
import { cn } from "@/lib/utils"

interface FormActionsProps {
  children: React.ReactNode
  sticky?: boolean
  className?: string
}

export function FormActions({ children, sticky = false, className }: FormActionsProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 pt-6 border-t border-slate-600",
        sticky && "sticky bottom-0 bg-slate-700 -mx-6 -mb-6 px-6 pb-6 rounded-b-xl",
        className,
      )}
    >
      {children}
    </div>
  )
}
