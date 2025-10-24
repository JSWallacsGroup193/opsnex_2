import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { WorkOrderList } from '@/components/work-orders/work-order-list'
import type { FilterState, WorkOrderView } from '@/types/view-models/work-order'
import api from '../utils/axiosClient'

// Mock data for demonstration (fallback if API fails)
const mockWorkOrders: WorkOrderView[] = [
  {
    id: '1',
    woNumber: 'WO-2024-001',
    customer: {
      name: 'John Smith',
      address: '123 Main St, Springfield',
    },
    status: 'in-progress',
    technician: {
      id: 't1',
      name: 'Mike Johnson',
    },
    date: '2024-01-15',
    jobType: 'repair',
    priority: 'high',
    description: 'AC unit not cooling properly',
    createdAt: '2024-01-14',
  },
  {
    id: '2',
    woNumber: 'WO-2024-002',
    customer: {
      name: 'Sarah Williams',
      address: '456 Oak Ave, Springfield',
    },
    status: 'pending',
    technician: null,
    date: '2024-01-16',
    jobType: 'installation',
    priority: 'medium',
    description: 'New HVAC system installation',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    woNumber: 'WO-2024-003',
    customer: {
      name: 'Robert Brown',
      address: '789 Pine Rd, Springfield',
    },
    status: 'completed',
    technician: {
      id: 't2',
      name: 'David Lee',
    },
    date: '2024-01-14',
    jobType: 'maintenance',
    priority: 'low',
    description: 'Routine maintenance check',
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    woNumber: 'WO-2024-004',
    customer: {
      name: 'Emily Davis',
      address: '321 Elm St, Springfield',
    },
    status: 'in-progress',
    technician: {
      id: 't1',
      name: 'Mike Johnson',
    },
    date: '2024-01-15',
    jobType: 'inspection',
    priority: 'urgent',
    description: 'Emergency heating system failure',
    createdAt: '2024-01-15',
  },
  {
    id: '5',
    woNumber: 'WO-2024-005',
    customer: {
      name: 'Michael Chen',
      address: '555 Park Avenue, Springfield',
    },
    status: 'pending',
    technician: null,
    date: '2024-01-17',
    jobType: 'repair',
    priority: 'medium',
    description: 'Furnace making unusual noise',
    createdAt: '2024-01-15',
  },
]

export default function WorkOrders() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const equipmentIdFilter = searchParams.get('equipmentId')
  const [workOrders, setWorkOrders] = useState<WorkOrderView[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    dateRange: {
      from: null,
      to: null,
    },
    technicianIds: [],
    priority: 'all',
  })

  const loadWorkOrders = async () => {
    try {
      setLoading(true)
      const url = equipmentIdFilter 
        ? `/work-orders?equipmentId=${equipmentIdFilter}`
        : '/work-orders'
      const { data } = await api.get(url)
      
      const transformedOrders: WorkOrderView[] = data.map((wo: any) => ({
        id: wo.id,
        woNumber: wo.woNumber || `WO-${wo.id.slice(0, 8)}`,
        customer: {
          name: wo.customerName || 'Unknown',
          address: wo.address || 'No address',
        },
        status: wo.status?.toLowerCase() || 'pending',
        technician: wo.technician ? {
          id: wo.technician.id,
          name: wo.technician.name,
        } : null,
        date: wo.scheduledDate || wo.createdAt,
        jobType: wo.jobType || 'general',
        priority: wo.priority?.toLowerCase() || 'medium',
        description: wo.description || wo.title || '',
        createdAt: wo.createdAt,
      }))
      
      setWorkOrders(transformedOrders)
    } catch (error) {
      console.error('Error loading work orders:', error)
      toast.error('Failed to load work orders')
      setWorkOrders(mockWorkOrders)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWorkOrders()
  }, [equipmentIdFilter])

  // Filter work orders based on current filters
  const filteredWorkOrders = workOrders.filter((wo) => {
    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase()
      const matchesSearch = 
        wo.woNumber.toLowerCase().includes(query) ||
        wo.customer.name.toLowerCase().includes(query) ||
        wo.customer.address.toLowerCase().includes(query) ||
        wo.description.toLowerCase().includes(query) ||
        wo.technician?.name.toLowerCase().includes(query)
      
      if (!matchesSearch) return false
    }

    // Status filter
    if (filters.status !== 'all' && wo.status !== filters.status) {
      return false
    }

    // Priority filter
    if (filters.priority !== 'all' && wo.priority !== filters.priority) {
      return false
    }

    // Technician filter
    if (filters.technicianIds.length > 0 && wo.technician) {
      if (!filters.technicianIds.includes(wo.technician.id)) {
        return false
      }
    }

    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      const woDate = new Date(wo.date)
      if (filters.dateRange.from && woDate < filters.dateRange.from) {
        return false
      }
      if (filters.dateRange.to && woDate > filters.dateRange.to) {
        return false
      }
    }

    return true
  })

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handleCreate = () => {
    navigate('/work-orders/create')
  }

  const handleView = (id: string) => {
    navigate(`/work-orders/${id}`)
  }

  const handleEdit = (id: string) => {
    toast('Edit feature coming soon - navigate to detail page to update status', { icon: 'ℹ️' })
    navigate(`/work-orders/${id}`)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this work order? This action cannot be undone.')) {
      try {
        await api.delete(`/work-orders/${id}`)
        toast.success('Work order deleted successfully')
        loadWorkOrders()
      } catch (error) {
        console.error('Error deleting work order:', error)
        toast.error('Failed to delete work order')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-teal-500">Loading work orders...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Page Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Work Orders</h1>
        <p className="text-slate-400 text-sm sm:text-base">Track missions. Execute jobs. Close the loop.</p>
      </div>
      
      {/* Equipment Filter Banner */}
      {equipmentIdFilter && (
        <div className="bg-teal-900/20 border-b border-teal-500/30 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-teal-400">
                📋 Filtered by Equipment: <span className="font-mono font-semibold">{equipmentIdFilter}</span>
              </span>
            </div>
            <button
              onClick={() => navigate('/work-orders')}
              className="text-xs text-slate-400 hover:text-white underline transition-colors"
            >
              Clear Filter
            </button>
          </div>
        </div>
      )}
      
      <WorkOrderList
        workOrders={filteredWorkOrders}
        totalCount={workOrders.length}
        filters={filters}
        onFilterChange={handleFilterChange}
        onCreate={handleCreate}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
