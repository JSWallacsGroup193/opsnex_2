import { useState } from "react"
import { Eye, Edit, Printer, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { SKU } from "@/types/view-models/inventory"
import { getStockStatus, getStockStatusColor } from "@/types/view-models/inventory"

interface InventoryTableProps {
  skus: SKU[]
  onView: (id: string) => void
  onEdit: (id: string) => void
  onPrintLabel: (id: string) => void
  onDelete: (id: string) => void
}

type SortField = "sku" | "description" | "category" | "onHand" | "unitCost"
type SortDirection = "asc" | "desc"

export function InventoryTable({ skus, onView, onEdit, onPrintLabel, onDelete }: InventoryTableProps) {
  const [sortField, setSortField] = useState<SortField>("sku")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedSKUs = [...skus].sort((a, b) => {
    let aValue: string | number = a[sortField]
    let bValue: string | number = b[sortField]

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = (bValue as string).toLowerCase()
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 text-teal-500" />
    ) : (
      <ChevronDown className="h-4 w-4 text-teal-500" />
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700 hover:bg-slate-800">
            <TableHead className="text-slate-400 cursor-pointer" onClick={() => handleSort("sku")}>
              <div className="flex items-center gap-2">
                SKU
                <SortIcon field="sku" />
              </div>
            </TableHead>
            <TableHead className="text-slate-400 cursor-pointer" onClick={() => handleSort("description")}>
              <div className="flex items-center gap-2">
                Description
                <SortIcon field="description" />
              </div>
            </TableHead>
            <TableHead className="text-slate-400 cursor-pointer" onClick={() => handleSort("category")}>
              <div className="flex items-center gap-2">
                Category
                <SortIcon field="category" />
              </div>
            </TableHead>
            <TableHead className="text-slate-400 cursor-pointer" onClick={() => handleSort("onHand")}>
              <div className="flex items-center gap-2">
                On Hand
                <SortIcon field="onHand" />
              </div>
            </TableHead>
            <TableHead className="text-slate-400">Reorder Point</TableHead>
            <TableHead className="text-slate-400 cursor-pointer" onClick={() => handleSort("unitCost")}>
              <div className="flex items-center gap-2">
                Unit Cost
                <SortIcon field="unitCost" />
              </div>
            </TableHead>
            <TableHead className="text-slate-400">Location</TableHead>
            <TableHead className="text-slate-400 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSKUs.map((sku) => {
            const status = getStockStatus(sku.onHand, sku.reorderPoint)
            const statusColor = getStockStatusColor(status)

            return (
              <TableRow
                key={sku.id}
                className="border-slate-700 bg-slate-700 hover:bg-slate-600 cursor-pointer"
                onClick={() => onView(sku.id)}
              >
                <TableCell className="font-mono text-slate-100">{sku.sku}</TableCell>
                <TableCell className="text-slate-100">{sku.description}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-600 text-slate-100">
                    {sku.category}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
                  >
                    {sku.onHand} units
                  </span>
                </TableCell>
                <TableCell className="text-slate-400">{sku.reorderPoint} units</TableCell>
                <TableCell className="text-slate-100">${sku.unitCost?.toFixed(2) || '0.00'}</TableCell>
                <TableCell className="text-slate-400">
                  {sku.location?.warehouse || 'N/A'} - {sku.location?.bin || 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(sku.id)}
                      className="text-slate-400 hover:text-teal-500 hover:bg-slate-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(sku.id)}
                      className="text-slate-400 hover:text-teal-500 hover:bg-slate-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPrintLabel(sku.id)}
                      className="text-slate-400 hover:text-teal-500 hover:bg-slate-600"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(sku.id)}
                      className="text-slate-400 hover:text-red-500 hover:bg-slate-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
