import { ChevronRight, Edit, Printer, Package, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getStockStatusColor, type SKUDetail } from "@/types/view-models/inventory"

interface SKUDetailHeaderProps {
  sku: SKUDetail
  onEdit: () => void
  onPrintLabel: () => void
  onAdjustStock: () => void
}

export function SKUDetailHeader({ sku, onEdit, onPrintLabel, onAdjustStock }: SKUDetailHeaderProps) {
  const stockStatus = getStockStatusColor(
    sku.onHand === 0 ? "out-of-stock" : sku.onHand <= sku.reorderPoint ? "low-stock" : "in-stock",
  )

  return (
    <div className="bg-slate-800 border-b border-slate-700">
      <div className="px-6 py-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          <span className="hover:text-teal-500 cursor-pointer">Inventory</span>
          <ChevronRight className="h-4 w-4" />
          <span className="hover:text-teal-500 cursor-pointer">SKUs</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-100">{sku.sku}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-100">{sku.sku}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bg} ${stockStatus.text}`}>
                {stockStatus.label}
              </span>
            </div>
            <p className="text-slate-400">{sku.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onEdit}
              className="border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit SKU
            </Button>
            <Button
              variant="outline"
              onClick={onPrintLabel}
              className="border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Label
            </Button>
            <Button onClick={onAdjustStock} className="bg-teal-500 hover:bg-teal-600 text-white">
              <Package className="h-4 w-4 mr-2" />
              Adjust Stock
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-slate-600 text-slate-400 hover:bg-slate-700 bg-transparent"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                <DropdownMenuItem className="text-slate-100 hover:bg-slate-700">Duplicate SKU</DropdownMenuItem>
                <DropdownMenuItem className="text-slate-100 hover:bg-slate-700">Archive SKU</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500 hover:bg-slate-700">Delete SKU</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
