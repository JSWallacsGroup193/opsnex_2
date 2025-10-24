/**
 * Work Order View Model
 * Lightweight UI-friendly representation of WorkOrder for v0 components
 * Maps from comprehensive backend WorkOrder type to simplified display format
 */

export type WorkOrderStatusView = "pending" | "in-progress" | "completed" | "cancelled"
export type WorkOrderPriorityView = "low" | "medium" | "high" | "urgent"
export type JobTypeView = "installation" | "repair" | "maintenance" | "inspection"

export interface WorkOrderView {
  id: string
  woNumber: string
  customer: {
    name: string
    address: string
  }
  status: WorkOrderStatusView
  technician: {
    id: string
    name: string
  } | null
  date: string
  jobType: JobTypeView
  priority: WorkOrderPriorityView
  description: string
  createdAt: string
}

export interface FilterState {
  search: string
  status: WorkOrderStatusView | "all"
  dateRange: {
    from: Date | null
    to: Date | null
  }
  technicianIds: string[]
  priority: WorkOrderPriorityView | "all"
}

export interface WorkOrderDetail extends Omit<WorkOrderView, 'customer' | 'technician'> {
  customer: {
    id: string
    name: string
    accountNumber: string
    phone: string
    email: string
    address: string
    coordinates: { lat: number; lng: number }
  }
  technician: {
    id: string
    name: string
    avatar: string
  } | null
  estimatedDuration: number
  customerNotes?: string
  internalNotes?: string
  tasks: WorkOrderTask[]
  parts: WorkOrderPart[]
  notes: WorkOrderNote[]
  timeline: WorkOrderTimelineEvent[]
  statusHistory: WorkOrderStatusHistory[]
}

export interface WorkOrderTask {
  id: string
  name: string
  completed: boolean
  completedAt?: string
}

export interface WorkOrderPart {
  id: string
  sku: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface WorkOrderNote {
  id: string
  text: string
  author: {
    name: string
    avatar: string
  }
  timestamp: string
  photos?: string[]
}

export interface WorkOrderTimelineEvent {
  id: string
  type: 'created' | 'assigned' | 'status_changed' | 'parts_added' | 'note_added' | 'task_completed'
  description: string
  user: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface WorkOrderStatusHistory {
  status: WorkOrderStatusView
  timestamp: string
  user: string
}

export interface WorkOrderStats {
  total: number
  pending: number
  inProgress: number
  completed: number
  revenue: number
}

// Type aliases for compatibility with new components
export type WorkOrder = WorkOrderView
export type WorkOrderStatus = WorkOrderStatusView
export type WorkOrderPriority = WorkOrderPriorityView
export type Task = WorkOrderTask
export type Part = WorkOrderPart
export type Note = WorkOrderNote
export type TimelineEvent = WorkOrderTimelineEvent
