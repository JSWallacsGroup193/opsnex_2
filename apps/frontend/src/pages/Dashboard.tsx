import { useEffect, useState } from 'react'
import { TechnicianDashboard } from '@/components/TechnicianDashboard'
import { useAuthStore } from '@/store/useAuthStore'
import { workOrderService } from '@/services/workorder.service'
import type { WorkOrder } from '@/types'

interface DashboardWorkOrder {
  id: string
  customerName: string
  address: string
  time: string
  jobType: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  priority?: 'low' | 'medium' | 'high'
}

const mapWorkOrderStatus = (status: string): 'pending' | 'in-progress' | 'completed' | 'cancelled' => {
  const statusMap: Record<string, 'pending' | 'in-progress' | 'completed' | 'cancelled'> = {
    'PENDING': 'pending',
    'ASSIGNED': 'pending',
    'IN_PROGRESS': 'in-progress',
    'ON_HOLD': 'pending',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled',
  }
  return statusMap[status] || 'pending'
}

const mapWorkOrderPriority = (priority: string): 'low' | 'medium' | 'high' => {
  const priorityMap: Record<string, 'low' | 'medium' | 'high'> = {
    'LOW': 'low',
    'MEDIUM': 'medium',
    'HIGH': 'high',
    'URGENT': 'high',
  }
  return priorityMap[priority] || 'medium'
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const [workOrders, setWorkOrders] = useState<DashboardWorkOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTodaysWorkOrders = async () => {
      if (!user?.tenantId) return

      try {
        setIsLoading(true)
        const response = await workOrderService.getWorkOrders(user.tenantId)
        
        // Transform work orders to dashboard format
        const dashboardOrders: DashboardWorkOrder[] = response.map((wo: WorkOrder) => ({
          id: wo.id,
          customerName: wo.customerName || 'Unknown Customer',
          address: wo.address || 'No address provided',
          time: wo.scheduledStart 
            ? new Date(wo.scheduledStart).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit' 
              })
            : 'Not scheduled',
          jobType: wo.type || 'General Service',
          status: mapWorkOrderStatus(wo.status),
          priority: mapWorkOrderPriority(wo.priority),
        }))

        setWorkOrders(dashboardOrders)
      } catch (error) {
        console.error('Failed to fetch work orders:', error)
        setWorkOrders([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodaysWorkOrders()
  }, [user?.tenantId])

  const jobsToday = workOrders.filter(wo => 
    wo.status === 'pending' || wo.status === 'in-progress'
  ).length

  const hoursWorked = workOrders.filter(wo => 
    wo.status === 'completed'
  ).length * 1.5 // Estimate 1.5 hours per completed job

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Page Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400 text-sm sm:text-base">Full situational awareness. Business ops at a glance.</p>
      </div>
      
      <TechnicianDashboard
        technicianName={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Technician'}
        jobsToday={jobsToday}
        hoursWorked={hoursWorked}
        workOrders={workOrders}
      />
    </div>
  )
}
