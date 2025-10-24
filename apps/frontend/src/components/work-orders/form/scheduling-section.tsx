

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { ChevronDown, ChevronUp, Calendar, Clock, User } from "lucide-react"
import type { WorkOrderFormData } from "@/lib/validations/work-order-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface Technician {
  id: string
  name: string
  phone?: string
  avatar?: string
}

interface SchedulingSectionProps {
  form: UseFormReturn<WorkOrderFormData>
  technicians: Technician[]
}

const timeSlots = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
]

export function SchedulingSection({ form, technicians }: SchedulingSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const selectedTimeSlot = form.watch("timeSlot")
  const selectedTechnicianId = form.watch("technicianId")

  return (
    <div className="bg-slate-700 rounded-lg border border-slate-600">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-600/50 transition-colors rounded-t-lg"
      >
        <h2 className="text-lg font-semibold text-slate-100">
          Scheduling <span className="text-red-400">*</span>
        </h2>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-slate-600">
          {/* Scheduled Date */}
          <div className="space-y-2">
            <Label htmlFor="scheduledDate" className="text-slate-100">
              Scheduled Date <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
              <Input
                id="scheduledDate"
                type="date"
                {...form.register("scheduledDate")}
                min={new Date().toISOString().split("T")[0]}
                className="pl-10 bg-slate-700 border-slate-600 text-slate-100 [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
            {form.formState.errors.scheduledDate && (
              <p className="text-sm text-red-400">{form.formState.errors.scheduledDate.message}</p>
            )}
          </div>

          {/* Time Slot */}
          <div className="space-y-2">
            <Label className="text-slate-100">
              Time Slot <span className="text-red-400">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => form.setValue("timeSlot", slot)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                    selectedTimeSlot === slot
                      ? "bg-teal-500/20 border-teal-500 text-teal-500"
                      : "bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">{slot}</span>
                </button>
              ))}
            </div>
            {form.formState.errors.timeSlot && (
              <p className="text-sm text-red-400">{form.formState.errors.timeSlot.message}</p>
            )}
          </div>

          {/* Estimated Duration */}
          <div className="space-y-2">
            <Label htmlFor="estimatedDuration" className="text-slate-100">
              Estimated Duration (minutes) <span className="text-red-400">*</span>
            </Label>
            <Input
              id="estimatedDuration"
              type="number"
              {...form.register("estimatedDuration", { valueAsNumber: true })}
              min={15}
              step={15}
              placeholder="60"
              className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
            />
            {form.formState.errors.estimatedDuration && (
              <p className="text-sm text-red-400">{form.formState.errors.estimatedDuration.message}</p>
            )}
          </div>

          {/* Assign Technician */}
          <div className="space-y-2">
            <Label className="text-slate-100">
              Assign Technician <span className="text-slate-400 text-sm font-normal">(Optional)</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {technicians.map((tech) => {
                const isAvailable = Math.random() > 0.3 // Mock availability
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => form.setValue("technicianId", tech.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      selectedTechnicianId === tech.id
                        ? "bg-teal-500/20 border-teal-500"
                        : "bg-slate-700 border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <div className="relative">
                      {tech.avatar ? (
                        <img src={tech.avatar || "/placeholder.svg"} alt={tech.name} className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                          <User className="h-4 w-4 text-slate-400" />
                        </div>
                      )}
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-700 ${
                          isAvailable ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div
                        className={`text-sm font-medium ${
                          selectedTechnicianId === tech.id ? "text-teal-500" : "text-slate-100"
                        }`}
                      >
                        {tech.name}
                      </div>
                      <div className="text-xs text-slate-400">{isAvailable ? "Available" : "Busy"}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
