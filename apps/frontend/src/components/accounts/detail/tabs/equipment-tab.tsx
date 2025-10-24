

import { Plus, Wrench, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AccountEquipment } from "@/types/view-models/account-detail"

interface EquipmentTabProps {
  equipment: AccountEquipment[]
  onAddEquipment: () => void
  onViewServiceHistory: (equipmentId: string) => void
}

export function EquipmentTab({ equipment, onAddEquipment, onViewServiceHistory }: EquipmentTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Equipment</h3>
        <Button onClick={onAddEquipment} className="bg-teal-500 text-white hover:bg-teal-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {equipment.map((item) => (
          <div key={item.id} className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-teal-500/20 flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <h4 className="text-slate-100 font-semibold">{item.type}</h4>
                  <p className="text-sm text-slate-400">{item.model}</p>
                </div>
              </div>
              {item.isDueSoon && <AlertCircle className="h-5 w-5 text-amber-500" />}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Serial Number:</span>
                <span className="text-sm text-slate-100">{item.serialNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Install Date:</span>
                <span className="text-sm text-slate-100">{item.installDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Last Service:</span>
                <span className="text-sm text-slate-100">{item.lastServiceDate}</span>
              </div>
              {item.nextServiceDate && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Next Service:</span>
                  <span className={`text-sm font-medium ${item.isDueSoon ? "text-amber-400" : "text-slate-100"}`}>
                    {item.nextServiceDate}
                  </span>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewServiceHistory(item.id)}
              className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10"
            >
              Service History
            </Button>
          </div>
        ))}
      </div>

      {equipment.length === 0 && (
        <div className="bg-slate-700 rounded-lg p-12 border border-slate-600 text-center">
          <p className="text-slate-400 mb-4">No equipment registered yet</p>
          <Button onClick={onAddEquipment} className="bg-teal-500 text-white hover:bg-teal-600">
            <Plus className="h-4 w-4 mr-2" />
            Add First Equipment
          </Button>
        </div>
      )}
    </div>
  )
}
