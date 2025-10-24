import * as React from "react"
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "warning" | "info"

export interface ToastProps {
  id: string
  type: ToastType
  message: string
  duration?: number
  onClose: () => void
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    borderColor: "border-l-emerald-500",
    iconColor: "text-emerald-500",
    bgColor: "bg-slate-700",
  },
  error: {
    icon: XCircle,
    borderColor: "border-l-red-500",
    iconColor: "text-red-500",
    bgColor: "bg-slate-700",
  },
  warning: {
    icon: AlertTriangle,
    borderColor: "border-l-amber-500",
    iconColor: "text-amber-500",
    bgColor: "bg-slate-700",
  },
  info: {
    icon: Info,
    borderColor: "border-l-teal-500",
    iconColor: "text-teal-500",
    bgColor: "bg-slate-700",
  },
}

export function OpsNexToast({ type, message, duration = 5000, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = React.useState(false)
  const config = toastConfig[type]
  const Icon = config.icon

  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose()
    }, 300) // Match animation duration
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "flex items-start gap-3 w-full max-w-md p-4 rounded-lg shadow-lg border-l-4",
        config.bgColor,
        config.borderColor,
        "animate-in slide-in-from-right-full duration-300",
        isExiting && "animate-out fade-out-0 slide-out-to-right-full duration-300",
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.iconColor)} />

      <p className="flex-1 text-sm text-slate-100 leading-relaxed">{message}</p>

      <button
        onClick={handleClose}
        className="flex-shrink-0 text-slate-400 hover:text-teal-400 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
