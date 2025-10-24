import type React from "react"

import { useState } from "react"
import { Eye, Edit, Trash2, Calendar, User, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { WorkOrder } from "@/types/view-models/work-order"

interface WorkOrderCardProps {
  workOrder: WorkOrder
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function WorkOrderCard({ workOrder, onView, onEdit, onDelete }: WorkOrderCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [touchStart, setTouchStart] = useState(0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-500"
      case "high":
        return "text-orange-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-slate-400"
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentTouch = e.touches[0].clientX
    const diff = touchStart - currentTouch
    if (diff > 0 && diff < 100) {
      setSwipeOffset(diff)
    }
  }

  const handleTouchEnd = () => {
    if (swipeOffset > 50) {
      onDelete(workOrder.id)
    }
    setSwipeOffset(0)
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Delete Background */}
      {swipeOffset > 0 && (
        <div className="absolute inset-0 bg-red-900 flex items-center justify-end px-6">
          <Trash2 className="w-6 h-6 text-white" />
        </div>
      )}

      {/* Card Content */}
      <div
        className="bg-slate-700 border border-slate-600 rounded-lg p-4 transition-transform"
        style={{ transform: `translateX(-${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => onView(workOrder.id)}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">{workOrder.woNumber}</h3>
            <p className="text-sm text-slate-400">{workOrder.customer.name}</p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(workOrder.status)}`}
          >
            {workOrder.status.replace("-", " ")}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <User className="w-4 h-4 text-teal-500" />
            <span>{workOrder.technician?.name || "Unassigned"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Calendar className="w-4 h-4 text-teal-500" />
            <span>{new Date(workOrder.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Wrench className="w-4 h-4 text-teal-500" />
            <span className="capitalize">{workOrder.jobType}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-600">
          <span className={`text-xs font-medium uppercase ${getPriorityColor(workOrder.priority)}`}>
            {workOrder.priority} Priority
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onView(workOrder.id)
              }}
              className="text-teal-500 hover:text-teal-400 hover:bg-slate-800"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(workOrder.id)
              }}
              className="text-teal-500 hover:text-teal-400 hover:bg-slate-800"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(workOrder.id)
              }}
              className="text-red-500 hover:text-red-400 hover:bg-slate-800"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
