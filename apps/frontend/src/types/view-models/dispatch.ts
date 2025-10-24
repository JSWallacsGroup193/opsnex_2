export interface DispatchWorkOrder {
  id: string
  dispatchSlotId: string
  customerName: string
  startTime: string
  endTime: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'emergency'
  jobType: string
  priority: 'normal' | 'emergency'
  technicianId: string | null
  date: string
}

export interface Technician {
  id: string
  name: string
  avatar: string
  status: 'available' | 'on-job' | 'off'
}

export type DispatchViewMode = 'day' | 'week' | 'month'

// Alias for component compatibility
export type WorkOrder = DispatchWorkOrder
