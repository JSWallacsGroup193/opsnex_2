import { Plus, Search, Barcode, Upload, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface InventoryListHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onCreateSKU: () => void
  onScanBarcode: () => void
  onImportSKUs: () => void
  onExportCSV: () => void
}

export function InventoryListHeader({
  searchQuery,
  onSearchChange,
  onCreateSKU,
  onScanBarcode,
  onImportSKUs,
  onExportCSV,
}: InventoryListHeaderProps) {
  return (
    <div className="bg-slate-800 border-b border-slate-700 px-4 py-4 md:px-6">
      <div className="flex flex-col gap-4">
        {/* Title and Primary Actions */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-100">Inventory</h1>
          <div className="flex items-center gap-2">
            <Button onClick={onCreateSKU} className="bg-teal-500 hover:bg-teal-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create SKU</span>
            </Button>
          </div>
        </div>

        {/* Search and Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search SKUs, descriptions, barcodes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={onScanBarcode}
              variant="outline"
              className="bg-teal-500 hover:bg-teal-600 text-white border-teal-500"
            >
              <Barcode className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Scan</span>
            </Button>
            <Button
              onClick={onImportSKUs}
              variant="outline"
              className="border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
            >
              <Upload className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button
              onClick={onExportCSV}
              variant="outline"
              className="border-slate-600 text-slate-400 hover:bg-slate-700 bg-transparent"
            >
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
