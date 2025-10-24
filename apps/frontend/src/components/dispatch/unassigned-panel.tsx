import { WorkOrderCard } from "./work-order-card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import type { WorkOrder } from "@/types/view-models/dispatch"

interface UnassignedPanelProps {
  workOrders: WorkOrder[]
}

export function UnassignedPanel({ workOrders }: UnassignedPanelProps) {
  const emergencyOrders = workOrders.filter((wo) => wo.priority === "emergency")
  const normalOrders = workOrders.filter((wo) => wo.priority !== "emergency")
  const sortedOrders = [...emergencyOrders, ...normalOrders]

  return (
    <div className="w-64 border-l border-border bg-card">
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Unassigned</h2>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {workOrders.length}
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        {sortedOrders.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No unassigned work orders</div>
        ) : (
          sortedOrders.map((workOrder) => (
            <div key={workOrder.id} className="space-y-2">
              <WorkOrderCard workOrder={workOrder} />
              <Button
                size="sm"
                className="w-full"
                onClick={() => console.log("[v0] Assign work order:", workOrder.id)}
              >
                Assign Technician
              </Button>
              {workOrder.priority === "emergency" && (
                <div className="flex items-center gap-2 rounded bg-red-500/20 p-2 text-xs text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span>Emergency - Requires immediate attention</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
