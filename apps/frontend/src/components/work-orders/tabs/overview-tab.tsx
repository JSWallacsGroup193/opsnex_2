import { Phone, Mail, MapPin, User, Calendar, Clock, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { WorkOrderDetail, WorkOrderPriority } from "@/types/view-models/work-order"

interface OverviewTabProps {
  workOrder: WorkOrderDetail
}

const priorityConfig: Record<WorkOrderPriority, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
  medium: { label: "Medium", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  high: { label: "High", className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  urgent: { label: "Urgent", className: "bg-red-500/20 text-red-400 border-red-500/30" },
}

export function OverviewTab({ workOrder }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Customer Section */}
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Customer Information</h2>
        <div className="space-y-3">
          <div>
            <h3 className="text-slate-100 font-semibold text-lg">{workOrder.customer.name}</h3>
            <p className="text-slate-400 text-sm">Account #{workOrder.customer.accountNumber}</p>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Phone className="w-4 h-4 text-teal-500" />
            <a href={`tel:${workOrder.customer.phone}`} className="hover:text-teal-500 transition-colors">
              {workOrder.customer.phone}
            </a>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Mail className="w-4 h-4 text-teal-500" />
            <a href={`mailto:${workOrder.customer.email}`} className="hover:text-teal-500 transition-colors">
              {workOrder.customer.email}
            </a>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-4 h-4 text-teal-500" />
            <span>{workOrder.customer.address}</span>
            {workOrder.customer.coordinates && (
              <a
                href={`https://maps.google.com/?q=${workOrder.customer.coordinates.lat},${workOrder.customer.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 hover:underline ml-2"
              >
                View Map
              </a>
            )}
          </div>

          <Button variant="link" className="text-teal-500 hover:text-teal-400 p-0 h-auto">
            View Customer Profile →
          </Button>
        </div>
      </div>

      {/* Job Details */}
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Job Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-4 h-4 text-teal-500" />
              <span className="text-slate-400 text-sm">Job Type</span>
            </div>
            <p className="text-slate-100 font-medium capitalize">{workOrder.jobType}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-slate-400 text-sm">Priority</span>
            </div>
            <Badge className={priorityConfig[workOrder.priority].className}>
              {priorityConfig[workOrder.priority].label}
            </Badge>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-teal-500" />
              <span className="text-slate-400 text-sm">Scheduled Date</span>
            </div>
            <p className="text-teal-500 font-medium">
              {new Date(workOrder.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-teal-500" />
              <span className="text-slate-400 text-sm">Estimated Duration</span>
            </div>
            <p className="text-slate-400">{workOrder.estimatedDuration} minutes</p>
          </div>

          {workOrder.technician && (
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-teal-500" />
                <span className="text-slate-400 text-sm">Assigned Technician</span>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={workOrder.technician.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-teal-500/20 text-teal-500">
                    {workOrder.technician.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-slate-100 hover:text-teal-500 cursor-pointer transition-colors">
                  {workOrder.technician.name}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description & Notes */}
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Description & Notes</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-slate-300 font-medium mb-2">Problem Description</h3>
            <p className="text-slate-100">{workOrder.description}</p>
          </div>

          {workOrder.customerNotes && (
            <div>
              <h3 className="text-slate-300 font-medium mb-2">Customer Notes</h3>
              <p className="text-slate-400 italic">{workOrder.customerNotes}</p>
            </div>
          )}

          {workOrder.internalNotes && (
            <div>
              <h3 className="text-slate-300 font-medium mb-2">Internal Notes</h3>
              <p className="text-slate-400">{workOrder.internalNotes}</p>
            </div>
          )}

          <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent">
            Add Note
          </Button>
        </div>
      </div>
    </div>
  )
}
