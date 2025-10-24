export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost"
export type LeadSource = "website" | "referral" | "phone" | "email" | "social"
export type LeadPriority = "hot" | "warm" | "cold"

export interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: LeadStatus
  source: LeadSource
  priority: LeadPriority
  value: number
  assignedTo: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: string
  updatedAt: string
  daysInStatus: number
  notes?: string
}

export interface LeadFilters {
  search: string
  status: LeadStatus[]
  source: LeadSource | "all"
  assignedTo: string | "all"
  dateRange: {
    from: string
    to: string
  } | null
}

export interface LeadStats {
  total: number
  new: number
  qualified: number
  conversionRate: number
  conversionTrend: "up" | "down"
  revenuePipeline: number
}
