import { Plus, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Part } from "@/types/view-models/work-order"

interface PartsTabProps {
  parts: Part[]
  onAddPart?: (part: Omit<Part, "id" | "total">) => void
}

export function PartsTab({ parts }: PartsTabProps) {
  const totalCost = parts.reduce((sum, part) => sum + part.total, 0)

  return (
    <div className="space-y-6">
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-100">Parts & Materials</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
            >
              <Scan className="w-4 h-4 mr-2" />
              Scan Barcode
            </Button>
            <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Part
            </Button>
          </div>
        </div>

        {/* Parts Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">SKU</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Description</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Qty</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Unit Price</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Total</th>
              </tr>
            </thead>
            <tbody>
              {parts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    No parts added yet
                  </td>
                </tr>
              ) : (
                parts.map((part) => (
                  <tr key={part.id} className="border-b border-slate-700 hover:bg-slate-800/50">
                    <td className="py-3 px-4 text-slate-300 font-mono text-sm">{part.sku}</td>
                    <td className="py-3 px-4 text-slate-100">{part.description}</td>
                    <td className="py-3 px-4 text-slate-300 text-right">{part.quantity}</td>
                    <td className="py-3 px-4 text-slate-300 text-right">${part.unitPrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-slate-100 font-medium text-right">${part.total.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Total */}
        {parts.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-600 flex justify-end">
            <div className="text-right">
              <p className="text-slate-400 text-sm mb-1">Total Cost</p>
              <p className="text-2xl font-bold text-teal-500">${totalCost.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
