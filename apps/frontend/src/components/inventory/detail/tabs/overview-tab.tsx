import { Edit, Barcode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getStockStatusColor, type SKUDetail } from "@/types/view-models/inventory"

interface OverviewTabProps {
  sku: SKUDetail
  onEdit: () => void
}

export function OverviewTab({ sku, onEdit }: OverviewTabProps) {
  const stockStatus = getStockStatusColor(
    sku.onHand === 0 ? "out-of-stock" : sku.onHand <= sku.reorderPoint ? "low-stock" : "in-stock",
  )

  return (
    <div className="space-y-6">
      {/* General Information */}
      <div className="bg-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">General Information</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Info
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-slate-400">SKU Number</label>
            <p className="text-slate-100 font-medium">{sku.sku}</p>
          </div>
          <div>
            <label className="text-sm text-slate-400">Description</label>
            <p className="text-slate-100 font-medium">{sku.description}</p>
          </div>
          <div>
            <label className="text-sm text-slate-400">Category</label>
            <span className="inline-block px-2 py-1 bg-teal-500/20 text-teal-500 rounded text-sm font-medium">
              {sku.category}
            </span>
          </div>
          <div>
            <label className="text-sm text-slate-400">Manufacturer</label>
            <p className="text-slate-400">{sku.manufacturer || "N/A"}</p>
          </div>
          <div>
            <label className="text-sm text-slate-400">Model Number</label>
            <p className="text-slate-400">{sku.modelNumber || "N/A"}</p>
          </div>
          <div>
            <label className="text-sm text-slate-400">UPC/Barcode</label>
            <div className="flex items-center gap-2">
              <p className="text-slate-400">{sku.upc || "N/A"}</p>
              {sku.upc && <Barcode className="h-4 w-4 text-slate-400" />}
            </div>
          </div>
        </div>

        {sku.upc && (
          <div className="mt-4 p-4 bg-slate-800 rounded-lg">
            <div className="flex items-center justify-center">
              <svg className="h-16" viewBox="0 0 200 60">
                {Array.from({ length: 12 }).map((_, i) => (
                  <rect key={i} x={i * 16} y="0" width={i % 2 === 0 ? "8" : "4"} height="60" fill="#94a3b8" />
                ))}
              </svg>
            </div>
            <p className="text-center text-slate-400 text-sm mt-2">{sku.upc}</p>
          </div>
        )}
      </div>

      {/* Stock Information */}
      <div className="bg-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Stock Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm text-slate-400">On Hand Quantity</label>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-slate-100">{sku.onHand}</p>
              <div className={`w-3 h-3 rounded-full ${stockStatus.bg}`} />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400">Reorder Point</label>
            <p className="text-slate-400 text-lg">{sku.reorderPoint}</p>
          </div>
          <div>
            <label className="text-sm text-slate-400">Reorder Quantity</label>
            <p className="text-slate-400 text-lg">{sku.reorderQuantity}</p>
          </div>
          <div>
            <label className="text-sm text-slate-400">Safety Stock</label>
            <p className="text-slate-400 text-lg">{sku.safetyStock}</p>
          </div>
          <div>
            <label className="text-sm text-slate-400">Last Counted</label>
            <p className="text-slate-400">{sku.lastCounted || "Never"}</p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Pricing</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="text-sm text-slate-400">Unit Cost</label>
            <p className="text-slate-400 text-lg">${sku.unitCost.toFixed(2)}</p>
          </div>
          <div>
            <label className="text-sm text-slate-400">Average Cost</label>
            <p className="text-slate-400 text-lg">${sku.averageCost.toFixed(2)}</p>
          </div>
          <div>
            <label className="text-sm text-slate-400">Selling Price</label>
            <p className="text-slate-100 text-lg font-semibold">${sku.sellingPrice.toFixed(2)}</p>
          </div>
          <div>
            <label className="text-sm text-slate-400">Markup</label>
            <p className="text-teal-500 text-lg font-semibold">{sku.markup}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
