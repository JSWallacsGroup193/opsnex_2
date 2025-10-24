import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { format } from "date-fns"

interface DispatchHeaderProps {
  selectedDate: Date
  viewMode: "day" | "week" | "month"
  onDateChange: (date: Date) => void
  onViewModeChange: (mode: "day" | "week" | "month") => void
  onCreateWorkOrder: () => void
}

export function DispatchHeader({
  selectedDate,
  viewMode,
  onDateChange,
  onViewModeChange,
  onCreateWorkOrder,
}: DispatchHeaderProps) {
  const goToPrevious = () => {
    const newDate = new Date(selectedDate)
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    onDateChange(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(selectedDate)
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    onDateChange(newDate)
  }

  const goToToday = () => {
    onDateChange(new Date())
  }

  return (
    <header className="border-b border-border bg-card">
      {/* Mobile Header */}
      <div className="lg:hidden px-3 py-3 space-y-3">
        {/* Top Row: Date Navigation */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="h-8 w-8 text-primary hover:text-primary/90"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button variant="ghost" onClick={goToToday} className="h-8 px-2 text-xs text-foreground font-medium">
              Today
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="h-8 w-8 text-primary hover:text-primary/90"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={onCreateWorkOrder} size="sm" className="h-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Bottom Row: Current Date */}
        <div className="text-center">
          <div className="text-sm font-semibold text-foreground">{format(selectedDate, "MMMM d, yyyy")}</div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-foreground">Dispatch & Scheduling</h1>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="h-8 w-8 text-primary hover:text-primary/90"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button variant="ghost" onClick={goToToday} className="h-8 px-3 text-sm text-foreground">
              Today
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="h-8 w-8 text-primary hover:text-primary/90"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <span className="ml-2 text-sm text-foreground">{format(selectedDate, "MMMM d, yyyy")}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex rounded-lg bg-background p-1">
            {(["day", "week", "month"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                className={`rounded px-4 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === mode ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <Button onClick={onCreateWorkOrder}>
            <Plus className="mr-2 h-4 w-4" />
            Create Work Order
          </Button>
        </div>
      </div>
    </header>
  )
}
