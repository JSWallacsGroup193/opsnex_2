import { Button } from "@/components/ui/button"
import type { SKU } from "@/types/view-models/inventory"
import { getStockStatus, getStockStatusColor } from "@/types/view-models/inventory"

interface InventoryCardProps {
  sku: SKU
  onView: (id: string) => void
}

export function InventoryCard({ sku, onView }: InventoryCardProps) {
  const status = getStockStatus(sku.onHand, sku.reorderPoint)
  const statusColor = getStockStatusColor(status)

  return (
    <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-teal-500 transition-colors">
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-mono font-bold text-slate-100">{sku.sku}</p>
            <p className="text-sm text-slate-100 mt-1">{sku.description}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-600 text-slate-100">
            {sku.category}
          </span>
        </div>

        {/* Stock Level Badge */}
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor.bg} ${statusColor.text}`}
          >
            {statusColor.label}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-1">
          <p className="text-sm text-slate-400">
            On hand: <span className="text-slate-100">{sku.onHand} units</span>
          </p>
          <p className="text-sm text-slate-400">
            Location:{" "}
            <span className="text-slate-100">
              {sku.location?.warehouse || 'N/A'} - {sku.location?.bin || 'N/A'}
            </span>
          </p>
          <p className="text-sm text-slate-400">
            Unit Cost: <span className="text-slate-100">${sku.unitCost?.toFixed(2) || '0.00'}</span>
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onView(sku.id)}
          variant="outline"
          className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10"
        >
          View Details
        </Button>
      </div>
    </div>
  )
}
