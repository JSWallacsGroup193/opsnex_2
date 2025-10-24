import { Star, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Supplier } from "@/types/view-models/inventory"

interface SuppliersTabProps {
  suppliers: Supplier[]
  onAddSupplier: () => void
  onReorder: (supplierId: string) => void
}

export function SuppliersTab({ suppliers, onAddSupplier, onReorder }: SuppliersTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Suppliers</h3>
        <Button onClick={onAddSupplier} className="bg-teal-500 hover:bg-teal-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <div className="bg-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Supplier Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Part Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Unit Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Lead Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Last Ordered
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-600">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-slate-600/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {supplier.isPrimary && <Star className="h-4 w-4 text-emerald-500 fill-emerald-500" />}
                      <span className="text-slate-100 font-medium">{supplier.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400">{supplier.partNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-100 font-semibold">
                    ${supplier.unitCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400">{supplier.leadTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400">{supplier.lastOrdered || "Never"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReorder(supplier.id)}
                      className="border-teal-500 text-teal-500 hover:bg-teal-500/10"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Reorder
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
