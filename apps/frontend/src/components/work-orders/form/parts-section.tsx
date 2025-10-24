

import { useState } from "react"
import { type UseFormReturn, useFieldArray } from "react-hook-form"
import { ChevronDown, ChevronUp, Plus, Trash2, Wrench } from "lucide-react"
import type { WorkOrderFormData } from "@/lib/validations/work-order-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface PartsSectionProps {
  form: UseFormReturn<WorkOrderFormData>
}

const commonEquipment = [
  "Ladder",
  "Multimeter",
  "Refrigerant Recovery Machine",
  "Vacuum Pump",
  "Torch Kit",
  "Pipe Cutter",
  "Drill",
  "Manifold Gauge Set",
]

export function PartsSection({ form }: PartsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "parts",
  })

  const equipmentNeeded = form.watch("equipmentNeeded") || []

  const addPart = () => {
    append({
      sku: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
    })
  }

  const calculateTotal = () => {
    return fields.reduce((sum, _, index) => {
      const quantity = form.watch(`parts.${index}.quantity`) || 0
      const unitPrice = form.watch(`parts.${index}.unitPrice`) || 0
      return sum + quantity * unitPrice
    }, 0)
  }

  const toggleEquipment = (equipment: string) => {
    const current = equipmentNeeded
    if (current.includes(equipment)) {
      form.setValue(
        "equipmentNeeded",
        current.filter((e) => e !== equipment),
      )
    } else {
      form.setValue("equipmentNeeded", [...current, equipment])
    }
  }

  return (
    <div className="bg-slate-700 rounded-lg border border-slate-600">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-600/50 transition-colors rounded-t-lg"
      >
        <h2 className="text-lg font-semibold text-slate-100">
          Parts & Equipment <span className="text-slate-400 text-sm font-normal">(Optional)</span>
        </h2>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-6 border-t border-slate-600">
          {/* Parts Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-slate-100">Parts & Materials</Label>
              <Button
                type="button"
                onClick={addPart}
                variant="outline"
                size="sm"
                className="border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Part
              </Button>
            </div>

            {fields.length > 0 && (
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 gap-2 p-3 bg-slate-800 rounded-lg border border-slate-600"
                  >
                    <div className="col-span-12 md:col-span-3">
                      <Input
                        {...form.register(`parts.${index}.sku`)}
                        placeholder="SKU"
                        className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <Input
                        {...form.register(`parts.${index}.description`)}
                        placeholder="Description"
                        className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="col-span-5 md:col-span-2">
                      <Input
                        type="number"
                        {...form.register(`parts.${index}.quantity`, { valueAsNumber: true })}
                        placeholder="Qty"
                        min={1}
                        className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="col-span-5 md:col-span-2">
                      <Input
                        type="number"
                        {...form.register(`parts.${index}.unitPrice`, { valueAsNumber: true })}
                        placeholder="Price"
                        min={0}
                        step={0.01}
                        className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-end gap-2 p-3 bg-slate-800 rounded-lg border border-slate-600">
                  <span className="text-slate-400">Total:</span>
                  <span className="text-xl font-semibold text-teal-500">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Equipment Checklist */}
          <div className="space-y-3">
            <Label className="text-slate-100 flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Equipment/Tools Needed
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {commonEquipment.map((equipment) => (
                <div
                  key={equipment}
                  className="flex items-center gap-2 p-3 bg-slate-800 rounded-lg border border-slate-600"
                >
                  <Checkbox
                    id={equipment}
                    checked={equipmentNeeded.includes(equipment)}
                    onCheckedChange={() => toggleEquipment(equipment)}
                    className="border-slate-600 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                  />
                  <Label htmlFor={equipment} className="text-sm text-slate-300 cursor-pointer flex-1">
                    {equipment}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
