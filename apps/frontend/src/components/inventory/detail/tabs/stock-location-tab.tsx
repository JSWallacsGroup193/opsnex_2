import { Package, ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { StockLocation } from "@/types/view-models/inventory"

interface StockLocationTabProps {
  locations: StockLocation[]
  onTransfer: () => void
  onAdjust: (locationId: string) => void
}

export function StockLocationTab({ locations, onTransfer, onAdjust }: StockLocationTabProps) {
  const totalQuantity = locations.reduce((sum, loc) => sum + loc.quantity, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Stock by Location</h3>
        <Button onClick={onTransfer} className="bg-teal-500 hover:bg-teal-600 text-white">
          <ArrowRightLeft className="h-4 w-4 mr-2" />
          Transfer Stock
        </Button>
      </div>

      <div className="bg-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Bin Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-600">
              {locations.map((location) => (
                <tr key={location.id} className="hover:bg-slate-600/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-teal-500" />
                      <span className="text-slate-100 font-medium">{location.warehouse}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400">{location.bin}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-slate-100 font-semibold">{location.quantity}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400">{location.lastUpdated}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAdjust(location.id)}
                      className="border-teal-500 text-teal-500 hover:bg-teal-500/10"
                    >
                      Adjust
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-800">
              <tr>
                <td colSpan={2} className="px-6 py-4 text-slate-100 font-semibold">
                  Total Across All Locations
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-100 font-bold text-lg">{totalQuantity}</span>
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
