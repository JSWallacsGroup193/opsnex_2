import { useEffect, useRef } from "react"
import JsBarcode from "jsbarcode"

interface LabelPreviewProps {
  sku: { id: string; sku: string; name: string; category?: string } | null
  size: string
  fields: string[]
}

export function LabelPreview({ sku, size, fields }: LabelPreviewProps) {
  const barcodeRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (barcodeRef.current && sku && fields.includes("barcode")) {
      try {
        JsBarcode(barcodeRef.current, sku.sku, {
          format: "CODE128",
          width: 2,
          height: 60,
          displayValue: false,
          background: "#ffffff",
          lineColor: "#000000",
        })
      } catch (error) {
        console.error("Barcode generation error:", error)
      }
    }
  }, [sku, fields])

  const getSizeClasses = () => {
    switch (size) {
      case "2x1":
        return "w-48 h-24"
      case "3x2":
        return "w-72 h-48"
      case "4x2":
        return "w-96 h-48"
      case "4x3":
        return "w-96 h-72"
      default:
        return "w-72 h-48"
    }
  }

  if (!sku) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#1e293b]/50 rounded-lg border-2 border-dashed border-[#475569]">
        <p className="text-slate-400 text-center px-4">Select a SKU to preview the label</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8 bg-[#1e293b]/50 rounded-lg min-h-64">
      <div
        className={`${getSizeClasses()} bg-white rounded-sm shadow-lg p-4 flex flex-col justify-between border border-gray-200`}
      >
        <div className="space-y-2">
          {fields.includes("sku") && <div className="font-mono text-xs font-bold text-black">{sku.sku}</div>}
          {fields.includes("name") && <div className="text-sm font-semibold text-black leading-tight">{sku.name}</div>}
          {fields.includes("category") && sku.category && <div className="text-xs text-gray-600">{sku.category}</div>}
          {fields.includes("price") && <div className="text-sm font-bold text-black">$99.99</div>}
          {fields.includes("date") && <div className="text-xs text-gray-500">{new Date().toLocaleDateString()}</div>}
        </div>

        {fields.includes("barcode") && (
          <div className="flex justify-center mt-2">
            <svg ref={barcodeRef} className="max-w-full"></svg>
          </div>
        )}
      </div>
    </div>
  )
}
