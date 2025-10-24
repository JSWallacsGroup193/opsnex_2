import { BarcodeScanner } from "@/components/barcode-scanner/barcode-scanner"
import type { SKUData } from "@/types/view-models/barcode"

export default function Scanner() {
  const handleScan = (barcode: string) => {
    console.log("Barcode scanned:", barcode)
    // In real app, this could trigger an API call to verify the barcode
  }

  const handleSKUFound = (sku: SKUData) => {
    console.log("SKU found:", sku)
    // In real app, this could:
    // 1. Update inventory state
    // 2. Show toast notification
    // 3. Navigate to SKU detail page
    // 4. Add to work order parts list
  }

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Page Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 flex-shrink-0">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Barcode Scanner</h1>
        <p className="text-slate-400 text-xs sm:text-sm">Use camera to scan. Fast. Precise. No gear needed.</p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <BarcodeScanner onScan={handleScan} onSKUFound={handleSKUFound} />
      </div>
    </div>
  )
}