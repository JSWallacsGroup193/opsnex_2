import { useState, useEffect } from "react"
import { toast } from 'react-hot-toast'
import { LeadList } from "@/components/leads/lead-list"
import type { Lead, LeadStats, LeadStatus } from "@/types/view-models/lead"
import api from '../utils/axiosClient'

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "John Anderson",
    company: "Anderson Manufacturing",
    email: "john@anderson.com",
    phone: "(555) 123-4567",
    status: "new",
    source: "website",
    priority: "hot",
    value: 15000,
    assignedTo: { id: "1", name: "John Smith" },
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    daysInStatus: 2,
  },
  {
    id: "2",
    name: "Sarah Williams",
    company: "Williams Retail",
    email: "sarah@williams.com",
    phone: "(555) 234-5678",
    status: "contacted",
    source: "referral",
    priority: "warm",
    value: 8500,
    assignedTo: { id: "2", name: "Sarah Johnson" },
    createdAt: "2024-01-14",
    updatedAt: "2024-01-16",
    daysInStatus: 3,
  },
  {
    id: "3",
    name: "Michael Chen",
    company: "Chen Tech Solutions",
    email: "michael@chentech.com",
    phone: "(555) 345-6789",
    status: "qualified",
    source: "phone",
    priority: "hot",
    value: 25000,
    assignedTo: { id: "1", name: "John Smith" },
    createdAt: "2024-01-10",
    updatedAt: "2024-01-17",
    daysInStatus: 5,
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    company: "Rodriguez Enterprises",
    email: "emily@rodriguez.com",
    phone: "(555) 456-7890",
    status: "proposal",
    source: "email",
    priority: "warm",
    value: 12000,
    assignedTo: { id: "3", name: "Mike Wilson" },
    createdAt: "2024-01-08",
    updatedAt: "2024-01-18",
    daysInStatus: 7,
  },
  {
    id: "5",
    name: "David Thompson",
    company: "Thompson Industries",
    email: "david@thompson.com",
    phone: "(555) 567-8901",
    status: "won",
    source: "social",
    priority: "hot",
    value: 35000,
    assignedTo: { id: "2", name: "Sarah Johnson" },
    createdAt: "2024-01-05",
    updatedAt: "2024-01-19",
    daysInStatus: 10,
  },
]

const mockStats: LeadStats = {
  total: 127,
  new: 23,
  qualified: 18,
  conversionRate: 32,
  conversionTrend: "up",
  revenuePipeline: 485000,
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<LeadStats>(mockStats)
  const [loading, setLoading] = useState(true)

  const loadLeads = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/crm/leads')
      setLeads(data.map((lead: any) => ({
        ...lead,
        assignedTo: lead.assignedTo || { id: '1', name: 'Unassigned' },
        daysInStatus: Math.floor((Date.now() - new Date(lead.updatedAt).getTime()) / (1000 * 60 * 60 * 24)),
      })))
      setStats({ ...mockStats, total: data.length })
    } catch (error) {
      console.error('Error loading leads:', error)
      toast.error('Failed to load leads')
      setLeads(mockLeads)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await api.put(`/crm/leads/${leadId}`, { status: newStatus })
      setLeads((prevLeads) =>
        prevLeads.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus, daysInStatus: 0 } : lead)),
      )
      toast.success('Lead status updated')
    } catch (error) {
      console.error('Error updating lead:', error)
      toast.error('Failed to update lead status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-teal-500">Loading leads...</div>
      </div>
    )
  }

  return (
    <LeadList
      leads={leads}
      stats={stats}
      totalCount={stats.total}
      onFilterChange={() => {}}
      onCreate={async () => {
        const company = prompt("Enter company name:")
        if (company) {
          try {
            await api.post('/crm/leads', { description: company })
            toast.success('Lead created successfully')
            loadLeads()
          } catch (error) {
            toast.error('Failed to create lead')
          }
        }
      }}
      onViewLead={(id) => toast(`Lead detail page coming soon for ID: ${id}`, { icon: 'ℹ️' })}
      onConvert={(id) => toast(`Convert lead to customer - coming soon (ID: ${id})`, { icon: 'ℹ️' })}
      onMarkLost={async (id) => {
        try {
          await api.put(`/crm/leads/${id}`, { status: 'lost' })
          toast.success('Lead marked as lost')
          loadLeads()
        } catch (error) {
          toast.error('Failed to mark lead as lost')
        }
      }}
      onScheduleFollowup={(id) => toast(`Schedule follow-up coming soon (ID: ${id})`, { icon: 'ℹ️' })}
      onStatusChange={handleStatusChange}
    />
  )
}
