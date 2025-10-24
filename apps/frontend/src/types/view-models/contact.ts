export type ContactRole = 'owner' | 'manager' | 'tenant' | 'other'

export interface Contact {
  id: string
  name: string
  accountId: string
  accountName: string
  role: ContactRole
  phone: string
  email: string
  avatar?: string
  isPrimary: boolean
  lastContact: string
  createdAt: string
}

export interface ContactFilters {
  search: string
  accountIds: string[]
  role: ContactRole | 'all'
  sortBy: 'name' | 'account' | 'lastContact'
}

export interface ContactStats {
  totalContacts: number
  primaryContacts: number
  recentlyContacted: number
  newThisMonth: number
}
