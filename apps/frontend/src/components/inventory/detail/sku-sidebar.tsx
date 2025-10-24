import { ShoppingCart, Package, Printer, Barcode, Bell, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { getStockStatusColor, type SKUDetail, type RelatedSKU } from "@/types/view-models/inventory"

interface SKUSidebarProps {
  sku: SKUDetail
  relatedItems: RelatedSKU[]
  onCreatePO: () => void
  onAdjustStock: () => void
  onPrintLabel: () => void
  onViewScanner: () => void
  onConfigureAlerts: () => void
  onManageRelations: () => void
  onToggleActive: (active: boolean) => void
}

export function SKUSidebar({
  sku,
  relatedItems,
  onCreatePO,
  onAdjustStock,
  onPrintLabel,
  onViewScanner,
  onConfigureAlerts,
  onManageRelations,
  onToggleActive,
}: SKUSidebarProps) {
  const stockStatus = getStockStatusColor(
    sku.onHand === 0 ? "out-of-stock" : sku.onHand <= sku.reorderPoint ? "low-stock" : "in-stock",
  )

  const isBelowReorder = sku.onHand <= sku.reorderPoint

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button onClick={onCreatePO} className="w-full bg-teal-500 hover:bg-teal-600 text-white">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Create Purchase Order
          </Button>
          <Button
            onClick={onAdjustStock}
            variant="outline"
            className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
          >
            <Package className="h-4 w-4 mr-2" />
            Adjust Stock
          </Button>
          <Button
            onClick={onPrintLabel}
            variant="outline"
            className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Barcode Label
          </Button>
          <Button
            onClick={onViewScanner}
            variant="outline"
            className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
          >
            <Barcode className="h-4 w-4 mr-2" />
            View in Barcode Scanner
          </Button>
        </div>
      </div>

      {/* Stock Alert */}
      <div className="bg-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Stock Alert</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Status</label>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bg} ${stockStatus.text}`}>
              {stockStatus.label}
            </span>
          </div>
          {isBelowReorder && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <Bell className="h-4 w-4 text-red-500 mt-0.5" />
              <p className="text-sm text-red-500">Below reorder point!</p>
            </div>
          )}
          <Button
            onClick={onConfigureAlerts}
            variant="outline"
            className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
          >
            Configure Alerts
          </Button>
        </div>
      </div>

      {/* Key Details */}
      <div className="bg-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Key Details</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400">Category</label>
            <span className="block mt-1 px-2 py-1 bg-teal-500/20 text-teal-500 rounded text-sm font-medium w-fit">
              {sku.category}
            </span>
          </div>
          <div>
            <label className="text-sm text-slate-400">Created</label>
            <p className="text-slate-400 text-sm mt-1">{sku.createdDate}</p>
          </div>
          <div>
            <label className="text-sm text-slate-400">Last Updated</label>
            <p className="text-slate-400 text-sm mt-1">{sku.lastUpdated}</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-600">
            <label className="text-sm text-slate-400">Active Status</label>
            <Switch
              checked={sku.active}
              onCheckedChange={onToggleActive}
              className="data-[state=checked]:bg-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Related Items */}
      <div className="bg-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Related Items</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Compatible SKUs</label>
            <div className="space-y-2">
              {relatedItems
                .filter((item) => item.type === "compatible")
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 bg-slate-800 rounded hover:bg-slate-600/50 cursor-pointer"
                  >
                    <Link2 className="h-4 w-4 text-teal-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-100 font-medium truncate">{item.sku}</p>
                      <p className="text-xs text-slate-400 truncate">{item.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Alternative SKUs</label>
            <div className="space-y-2">
              {relatedItems
                .filter((item) => item.type === "alternative")
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 bg-slate-800 rounded hover:bg-slate-600/50 cursor-pointer"
                  >
                    <Link2 className="h-4 w-4 text-teal-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-100 font-medium truncate">{item.sku}</p>
                      <p className="text-xs text-slate-400 truncate">{item.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <Button
            onClick={onManageRelations}
            variant="outline"
            className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
          >
            Manage Relations
          </Button>
        </div>
      </div>
    </div>
  )
}
