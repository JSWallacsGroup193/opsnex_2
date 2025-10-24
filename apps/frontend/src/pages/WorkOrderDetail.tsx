import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WorkOrderDetailHeader } from '@/components/work-orders/work-order-detail-header'
import { WorkOrderSidebar } from '@/components/work-orders/work-order-sidebar'
import { OverviewTab } from '@/components/work-orders/tabs/overview-tab'
import { TasksTab } from '@/components/work-orders/tabs/tasks-tab'
import { PartsTab } from '@/components/work-orders/tabs/parts-tab'
import { NotesTab } from '@/components/work-orders/tabs/notes-tab'
import { TimelineTab } from '@/components/work-orders/tabs/timeline-tab'
import type { WorkOrderDetail, WorkOrderStatus } from '@/types/view-models/work-order'

const mockWorkOrder: WorkOrderDetail = {
  id: '1',
  woNumber: 'WO-2024-001',
  status: 'in-progress',
  priority: 'high',
  jobType: 'repair',
  date: '2025-01-25T10:00:00Z',
  description: 'AC unit not cooling properly. Customer reports warm air coming from vents.',
  createdAt: '2025-01-20T08:00:00Z',
  customer: {
    id: 'c1',
    name: 'John Smith',
    accountNumber: 'ACC-5678',
    phone: '(555) 123-4567',
    email: 'john.smith@example.com',
    address: '123 Main St, Springfield, IL 62701',
    coordinates: { lat: 39.7817, lng: -89.6501 },
  },
  technician: {
    id: 't1',
    name: 'Mike Johnson',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  estimatedDuration: 120,
  customerNotes: 'Please call before arriving. Dog in backyard.',
  internalNotes: 'Customer is a VIP. Ensure excellent service.',
  tasks: [
    { id: '1', name: 'Inspect AC unit', completed: true, completedAt: '2025-01-21T09:30:00Z' },
    { id: '2', name: 'Check refrigerant levels', completed: true, completedAt: '2025-01-21T10:00:00Z' },
    { id: '3', name: 'Clean condenser coils', completed: false },
    { id: '4', name: 'Test system operation', completed: false },
  ],
  parts: [
    {
      id: '1',
      sku: 'REF-R410A',
      description: 'R-410A Refrigerant (25lb)',
      quantity: 1,
      unitPrice: 89.99,
      total: 89.99,
    },
    { id: '2', sku: 'FILTER-20X25', description: 'Air Filter 20x25x1', quantity: 2, unitPrice: 12.5, total: 25.0 },
  ],
  notes: [
    {
      id: '1',
      text: 'Initial inspection complete. Found low refrigerant levels and dirty coils.',
      author: { name: 'Mike Johnson', avatar: '/placeholder.svg?height=40&width=40' },
      timestamp: '2025-01-21T09:45:00Z',
      photos: ['/placeholder.svg?height=200&width=200', '/placeholder.svg?height=200&width=200'],
    },
  ],
  timeline: [
    {
      id: '1',
      type: 'created',
      description: 'Work order created',
      user: 'Sarah Admin',
      timestamp: '2025-01-20T08:00:00Z',
    },
    {
      id: '2',
      type: 'assigned',
      description: 'Assigned to Mike Johnson',
      user: 'Sarah Admin',
      timestamp: '2025-01-20T08:15:00Z',
    },
    {
      id: '3',
      type: 'status_changed',
      description: 'Status changed to In Progress',
      user: 'Mike Johnson',
      timestamp: '2025-01-21T09:00:00Z',
      metadata: { from: 'pending', to: 'in-progress' },
    },
    {
      id: '4',
      type: 'parts_added',
      description: 'Added 2 parts to work order',
      user: 'Mike Johnson',
      timestamp: '2025-01-21T10:30:00Z',
    },
    {
      id: '5',
      type: 'note_added',
      description: 'Added inspection notes with photos',
      user: 'Mike Johnson',
      timestamp: '2025-01-21T09:45:00Z',
    },
  ],
  statusHistory: [
    { status: 'pending', timestamp: '2025-01-20T08:00:00Z', user: 'Sarah Admin' },
    { status: 'in-progress', timestamp: '2025-01-21T09:00:00Z', user: 'Mike Johnson' },
  ],
}

export default function WorkOrderDetail() {
  const [workOrder, setWorkOrder] = useState<WorkOrderDetail>(mockWorkOrder)

  const handleStatusChange = (status: WorkOrderStatus) => {
    console.log('Status changed to:', status)
    setWorkOrder({ ...workOrder, status })
  }

  const handleToggleTask = (taskId: string) => {
    setWorkOrder({
      ...workOrder,
      tasks: workOrder.tasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : undefined }
          : task
      ),
    })
  }

  const handleAddTask = (taskName: string) => {
    const newTask = {
      id: String(workOrder.tasks.length + 1),
      name: taskName,
      completed: false,
    }
    setWorkOrder({ ...workOrder, tasks: [...workOrder.tasks, newTask] })
  }

  const handleAddPart = (part: Omit<{ id: string; sku: string; description: string; quantity: number; unitPrice: number; total: number }, 'id' | 'total'>) => {
    const newPart = {
      id: String(workOrder.parts.length + 1),
      ...part,
      total: part.quantity * part.unitPrice,
    }
    setWorkOrder({ ...workOrder, parts: [...workOrder.parts, newPart] })
  }

  const handleAddNote = (text: string) => {
    const newNote = {
      id: String(workOrder.notes.length + 1),
      text,
      author: { name: 'Current User', avatar: '/placeholder.svg?height=40&width=40' },
      timestamp: new Date().toISOString(),
    }
    setWorkOrder({ ...workOrder, notes: [newNote, ...workOrder.notes] })
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <WorkOrderDetailHeader
        woNumber={workOrder.woNumber}
        status={workOrder.status}
        onEdit={() => console.log('Edit clicked')}
        onPrint={() => console.log('Print clicked')}
        onDelete={() => console.log('Delete clicked')}
      />

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
          {/* Main Content */}
          <div>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-slate-800 border border-slate-700 mb-6 w-full justify-start overflow-x-auto">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger value="tasks" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="parts" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
                  Parts
                </TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
                  Notes
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
                >
                  Timeline
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <OverviewTab workOrder={workOrder} />
              </TabsContent>

              <TabsContent value="tasks">
                <TasksTab tasks={workOrder.tasks} onToggleTask={handleToggleTask} onAddTask={handleAddTask} />
              </TabsContent>

              <TabsContent value="parts">
                <PartsTab parts={workOrder.parts} onAddPart={handleAddPart} />
              </TabsContent>

              <TabsContent value="notes">
                <NotesTab notes={workOrder.notes} onAddNote={handleAddNote} />
              </TabsContent>

              <TabsContent value="timeline">
                <TimelineTab timeline={workOrder.timeline} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <WorkOrderSidebar
              workOrder={workOrder}
              onStatusChange={handleStatusChange}
              onReassign={() => console.log('Reassign clicked')}
              onReschedule={() => console.log('Reschedule clicked')}
              onGenerateInvoice={() => console.log('Generate invoice clicked')}
              onSendUpdate={() => console.log('Send update clicked')}
              onMarkComplete={() => console.log('Mark complete clicked')}
              onCancel={() => console.log('Cancel clicked')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
