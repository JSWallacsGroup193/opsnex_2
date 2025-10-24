import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Printer, Download, Package, Search } from "lucide-react"
import { LabelPreview } from "./LabelPreview"
import { inventoryService } from "../../services/inventory.service"
import type { SKU } from "../../types"
import { useToast } from "../ui/use-toast"

const labelSizes = [
  { value: "2x1", label: '2" x 1"' },
  { value: "3x2", label: '3" x 2"' },
  { value: "4x2", label: '4" x 2"' },
  { value: "4x3", label: '4" x 3"' },
]

const labelFields = [
  { id: "sku", label: "SKU Number" },
  { id: "name", label: "Product Name" },
  { id: "category", label: "Category" },
  { id: "barcode", label: "Barcode" },
  { id: "price", label: "Price" },
  { id: "date", label: "Date" },
]

export function LabelsGenerator() {
  const [searchTerm, setSearchTerm] = useState("")
  const [skus, setSkus] = useState<SKU[]>([])
  const [selectedSKUs, setSelectedSKUs] = useState<string[]>([])
  const [labelSize, setLabelSize] = useState("3x2")
  const [selectedFields, setSelectedFields] = useState<string[]>(["sku", "name", "barcode"])
  const [quantity, setQuantity] = useState("1")
  const { toast } = useToast()

  useEffect(() => {
    loadSKUs()
  }, [])

  const loadSKUs = async () => {
    try {
      const response = await inventoryService.getSKUs()
      setSkus(response.items)
    } catch (error) {
      console.error('Failed to load SKUs:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load SKU list",
      })
    }
  }

  const filteredSKUs = skus.filter(
    (item) =>
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const toggleSKU = (skuId: string) => {
    setSelectedSKUs((prev) => (prev.includes(skuId) ? prev.filter((id) => id !== skuId) : [...prev, skuId]))
  }

  const toggleField = (fieldId: string) => {
    setSelectedFields((prev) => (prev.includes(fieldId) ? prev.filter((id) => id !== fieldId) : [...prev, fieldId]))
  }

  const handlePrint = () => {
    toast({
      title: "Preparing Labels",
      description: `Generating ${selectedSKUs.length} label(s) for printing...`,
    })
    console.log("Printing labels...", { selectedSKUs, labelSize, selectedFields, quantity })
    window.print()
  }

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "PDF generation in progress...",
    })
    console.log("Downloading PDF...", { selectedSKUs, labelSize, selectedFields, quantity })
  }

  const selectedSKUObjects = selectedSKUs.map(id => skus.find(s => s.id === id)).filter(Boolean) as SKU[]

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">Labels Generator</h1>
        <p className="text-slate-400">Create and print custom labels for your HVAC inventory</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="bg-[#334155] border-[#475569]">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <Package className="h-5 w-5 text-[#14b8a6]" />
                Select SKUs
              </CardTitle>
              <CardDescription className="text-slate-400">
                Search and select products for label generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by SKU or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#1e293b] border-[#475569] text-slate-100 placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredSKUs.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleSKU(item.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedSKUs.includes(item.id)
                        ? "bg-[#14b8a6]/10 border-[#14b8a6]"
                        : "bg-[#1e293b] border-[#475569] hover:border-[#14b8a6]/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-mono text-sm font-semibold text-slate-100">{item.sku}</div>
                        <div className="text-sm text-slate-400">{item.name || 'No name'}</div>
                        {item.category && <div className="text-xs text-[#14b8a6] mt-1">{item.category}</div>}
                      </div>
                      <Checkbox
                        checked={selectedSKUs.includes(item.id)}
                        className="data-[state=checked]:bg-[#14b8a6] data-[state=checked]:border-[#14b8a6]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {selectedSKUs.length > 0 && (
                <div className="text-sm text-[#14b8a6] font-medium">
                  {selectedSKUs.length} SKU{selectedSKUs.length > 1 ? "s" : ""} selected
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#334155] border-[#475569]">
            <CardHeader>
              <CardTitle className="text-slate-100">Label Settings</CardTitle>
              <CardDescription className="text-slate-400">
                Configure label size, fields, and quantity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="label-size" className="text-slate-100">
                  Label Size
                </Label>
                <Select value={labelSize} onValueChange={setLabelSize}>
                  <SelectTrigger id="label-size" className="bg-[#1e293b] border-[#475569] text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-[#475569]">
                    {labelSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value} className="text-slate-100">
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-slate-100">Label Fields</Label>
                <div className="space-y-2">
                  {labelFields.map((field) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={field.id}
                        checked={selectedFields.includes(field.id)}
                        onCheckedChange={() => toggleField(field.id)}
                        className="data-[state=checked]:bg-[#14b8a6] data-[state=checked]:border-[#14b8a6]"
                      />
                      <label
                        htmlFor={field.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-100 cursor-pointer"
                      >
                        {field.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-slate-100">
                  Quantity per SKU
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="bg-[#1e293b] border-[#475569] text-slate-100"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#334155] border-[#475569]">
            <CardHeader>
              <CardTitle className="text-slate-100">Label Preview</CardTitle>
              <CardDescription className="text-slate-400">Preview how your labels will look</CardDescription>
            </CardHeader>
            <CardContent>
              <LabelPreview
                sku={selectedSKUs.length > 0 ? selectedSKUObjects[0] : null}
                size={labelSize}
                fields={selectedFields}
              />
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handlePrint}
              disabled={selectedSKUs.length === 0}
              className="flex-1 bg-[#14b8a6] hover:bg-[#0d9488] text-[#0f172a]"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Labels
            </Button>
            <Button
              onClick={handleDownload}
              disabled={selectedSKUs.length === 0}
              variant="outline"
              className="flex-1 border-[#14b8a6] text-[#14b8a6] hover:bg-[#14b8a6]/10 bg-transparent"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
