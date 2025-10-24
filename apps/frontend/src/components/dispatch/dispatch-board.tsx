import { useState } from "react"
import { DispatchHeader } from "./dispatch-header"
import { WeekView } from "./week-view"
import { MobileDispatchView } from "./mobile-dispatch-view"
import { TechnicianSidebar } from "./technician-sidebar"
import { UnassignedPanel } from "./unassigned-panel"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent } from "@dnd-kit/core"
import { WorkOrderCard } from "./work-order-card"
import { useDispatchData } from "@/hooks/useDispatchData"
import { dispatchService } from "@/services/dispatch.service"

export function DispatchBoard() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week")
  const [activeId, setActiveId] = useState<string | null>(null)
  
  const { workOrders, technicians, isLoading, error, reloadData } = useDispatchData()

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const workOrder = workOrders.find((wo) => wo.id === active.id)
      if (!workOrder) {
        setActiveId(null)
        return
      }

      const [techId] = (over.id as string).split("-")
      const newTechnicianId = techId === "unassigned" ? null : techId

      try {
        // Update dispatch slot assignment via backend API
        // Send null to unassign, or the new technician ID
        await dispatchService.updateSlot(workOrder.dispatchSlotId, {
          technicianId: newTechnicianId,
        } as any) // Type assertion needed due to frontend/backend type mismatch

        console.log("✅ Dispatch slot updated successfully")
      } catch (error) {
        console.error("Failed to update dispatch slot:", error)
        // TODO: Show error toast to user
      } finally {
        // Reload data from backend to get updated state
        await reloadData()
      }
    }

    setActiveId(null)
  }

  const handleCreateWorkOrder = () => {
    console.log("Create work order clicked")
    // TODO: Navigate to create work order page or open modal
  }

  const activeWorkOrder = workOrders.find((wo) => wo.id === activeId)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading dispatch board...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="text-destructive text-4xl">⚠️</div>
          <h2 className="text-xl font-bold text-foreground">Failed to Load Dispatch Board</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => reloadData()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen flex-col bg-background">
        <DispatchHeader
          selectedDate={selectedDate}
          viewMode={viewMode}
          onDateChange={setSelectedDate}
          onViewModeChange={setViewMode}
          onCreateWorkOrder={handleCreateWorkOrder}
        />

        {/* Desktop Layout: 3 columns */}
        <div className="hidden lg:flex flex-1 overflow-hidden">
          <TechnicianSidebar technicians={technicians} />

          <div className="flex-1 overflow-auto">
            <WeekView
              workOrders={workOrders}
              technicians={technicians}
              selectedDate={selectedDate}
              viewMode={viewMode}
            />
          </div>

          <UnassignedPanel workOrders={workOrders.filter((wo) => !wo.technicianId)} />
        </div>

        {/* Mobile Layout: Vertical Card View */}
        <div className="flex lg:hidden flex-1 overflow-hidden">
          <MobileDispatchView
            workOrders={workOrders}
            technicians={technicians}
            selectedDate={selectedDate}
          />
        </div>
      </div>

      <DragOverlay>{activeWorkOrder ? <WorkOrderCard workOrder={activeWorkOrder} isDragging /> : null}</DragOverlay>
    </DndContext>
  )
}
