export type AccountType = 'residential' | 'commercial'
export type AccountStatus = 'active' | 'inactive'

export interface Account {
  id: string
  name: string
  type: AccountType
  status: AccountStatus
  phone: string
  email: string
  address: string
  serviceArea: string
  lastServiceDate: string | null
  totalJobs: number
  totalRevenue: number
  createdAt: string
  contactName: string
  notes?: string
}

export interface AccountFilters {
  search: string
  accountType: 'residential' | 'commercial' | 'both'
  status: 'active' | 'inactive' | 'all'
  serviceArea: string
  sortBy: 'name' | 'lastService' | 'revenue'
}

export interface AccountStats {
  totalAccounts: number
  activeAccounts: number
  revenueThisMonth: number
  newThisMonth: number
}
