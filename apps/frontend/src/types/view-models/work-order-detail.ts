import type { WorkOrderView, WorkOrderStatusView, WorkOrderPriorityView, JobTypeView } from './work-order'

export type WorkOrderStatus = WorkOrderStatusView
export type WorkOrderPriority = WorkOrderPriorityView
export type JobType = JobTypeView

export interface Customer {
  id: string
  name: string
  accountNumber: string
  phone: string
  email: string
  address: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface Technician {
  id: string
  name: string
  avatar?: string
  phone?: string
  email?: string
}

export interface Task {
  id: string
  name: string
  completed: boolean
  completedAt?: string
  completedBy?: string
}

export interface Part {
  id: string
  sku: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Note {
  id: string
  text: string
  author: {
    name: string
    avatar?: string
  }
  timestamp: string
  photos?: string[]
}

export interface TimelineEvent {
  id: string
  type: 'created' | 'assigned' | 'status_changed' | 'parts_added' | 'completed' | 'invoiced' | 'note_added'
  description: string
  user: string
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface WorkOrderDetail extends Omit<WorkOrderView, 'customer' | 'technician'> {
  customer: Customer
  technician: Technician | null
  estimatedDuration: number // in minutes
  customerNotes?: string
  internalNotes?: string
  tasks: Task[]
  parts: Part[]
  notes: Note[]
  timeline: TimelineEvent[]
  statusHistory: Array<{
    status: WorkOrderStatus
    timestamp: string
    user: string
  }>
}

export interface WorkOrder {
  id: string
  workOrderNumber: string
  customerName: string
  address: string
  scheduledDate: string
  status: WorkOrderStatus
  priority: WorkOrderPriority
  jobType: string
  assignedTo: string
  estimatedCost?: number
  description?: string
}

