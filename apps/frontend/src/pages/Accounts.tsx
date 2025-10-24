import { useState, useMemo, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { AccountList } from '@/components/accounts/account-list'
import type { Account, AccountFilters, AccountStats } from '@/types/view-models/account'
import api from '../utils/axiosClient'

// Mock data (fallback)
const mockAccountsData: Account[] = [
  {
    id: '1',
    name: 'Johnson Residence',
    type: 'residential',
    status: 'active',
    phone: '(555) 123-4567',
    email: 'john.johnson@email.com',
    address: '123 Main St, Springfield',
    serviceArea: 'north',
    lastServiceDate: '2024-01-15',
    totalJobs: 12,
    totalRevenue: 4500,
    createdAt: '2023-01-10',
    contactName: 'John Johnson',
  },
  {
    id: '2',
    name: 'ABC Manufacturing Co.',
    type: 'commercial',
    status: 'active',
    phone: '(555) 234-5678',
    email: 'facilities@abcmfg.com',
    address: '456 Industrial Blvd, Springfield',
    serviceArea: 'south',
    lastServiceDate: '2024-01-20',
    totalJobs: 45,
    totalRevenue: 28000,
    createdAt: '2022-06-15',
    contactName: 'Sarah Williams',
  },
  {
    id: '3',
    name: 'Smith Family Home',
    type: 'residential',
    status: 'active',
    phone: '(555) 345-6789',
    email: 'smith.family@email.com',
    address: '789 Oak Ave, Springfield',
    serviceArea: 'east',
    lastServiceDate: '2024-01-10',
    totalJobs: 8,
    totalRevenue: 3200,
    createdAt: '2023-03-20',
    contactName: 'Mike Smith',
  },
  {
    id: '4',
    name: 'Green Valley Apartments',
    type: 'commercial',
    status: 'active',
    phone: '(555) 456-7890',
    email: 'maintenance@greenvalley.com',
    address: '321 Valley Rd, Springfield',
    serviceArea: 'west',
    lastServiceDate: '2024-01-18',
    totalJobs: 67,
    totalRevenue: 52000,
    createdAt: '2021-11-05',
    contactName: 'Robert Chen',
  },
  {
    id: '5',
    name: 'Davis Residence',
    type: 'residential',
    status: 'inactive',
    phone: '(555) 567-8901',
    email: 'davis.home@email.com',
    address: '654 Pine St, Springfield',
    serviceArea: 'central',
    lastServiceDate: '2023-08-12',
    totalJobs: 5,
    totalRevenue: 1800,
    createdAt: '2022-02-14',
    contactName: 'Emily Davis',
  },
]

const mockStats: AccountStats = {
  totalAccounts: 156,
  activeAccounts: 142,
  revenueThisMonth: 45600,
  newThisMonth: 8,
}

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [stats, setStats] = useState<AccountStats>(mockStats)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<AccountFilters>({
    search: '',
    accountType: 'both',
    status: 'all',
    serviceArea: '',
    sortBy: 'name',
  })

  const loadAccounts = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/crm/accounts')
      
      const transformedAccounts: Account[] = data.map((acc: any) => ({
        id: acc.id,
        name: acc.name || 'Unnamed Account',
        type: acc.type || 'residential',
        status: acc.status || 'active',
        phone: acc.phone || '',
        email: acc.email || '',
        address: acc.address || '',
        serviceArea: acc.serviceArea || 'central',
        lastServiceDate: acc.lastServiceDate || null,
        totalJobs: acc.totalJobs || 0,
        totalRevenue: acc.totalRevenue || 0,
        createdAt: acc.createdAt,
        contactName: acc.contactName || '',
      }))
      
      setAccounts(transformedAccounts)
      
      const activeCount = transformedAccounts.filter((a) => a.status === 'active').length
      const totalRevenue = transformedAccounts.reduce((sum, a) => sum + (a.totalRevenue || 0), 0)
      setStats({
        totalAccounts: transformedAccounts.length,
        activeAccounts: activeCount,
        revenueThisMonth: totalRevenue,
        newThisMonth: transformedAccounts.filter((a) => {
          const created = new Date(a.createdAt)
          const now = new Date()
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
        }).length,
      })
    } catch (error) {
      console.error('Error loading accounts:', error)
      toast.error('Failed to load accounts')
      setAccounts(mockAccountsData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  // Filter and sort accounts based on current filters
  const filteredAndSortedAccounts = useMemo(() => {
    let result = [...accounts]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (account) =>
          account.name.toLowerCase().includes(searchLower) ||
          account.contactName.toLowerCase().includes(searchLower) ||
          account.phone.includes(filters.search) ||
          account.email.toLowerCase().includes(searchLower) ||
          account.address.toLowerCase().includes(searchLower)
      )
    }

    // Apply account type filter
    if (filters.accountType !== 'both') {
      result = result.filter((account) => account.type === filters.accountType)
    }

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter((account) => account.status === filters.status)
    }

    // Apply service area filter
    if (filters.serviceArea) {
      result = result.filter((account) => account.serviceArea === filters.serviceArea)
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'lastService':
          if (!a.lastServiceDate) return 1
          if (!b.lastServiceDate) return -1
          return new Date(b.lastServiceDate).getTime() - new Date(a.lastServiceDate).getTime()
        case 'revenue':
          return b.totalRevenue - a.totalRevenue
        default:
          return 0
      }
    })

    return result
  }, [accounts, filters])

  const handleFilterChange = (newFilters: AccountFilters) => {
    setFilters(newFilters)
  }

  const handleCreate = async () => {
    const name = prompt('Enter account name:')
    if (name) {
      try {
        await api.post('/crm/accounts', { name })
        toast.success('Account created successfully')
        loadAccounts()
      } catch (error) {
        console.error('Error creating account:', error)
        toast.error('Failed to create account')
      }
    }
  }

  const handleView = (id: string) => {
    toast('Account detail page coming soon', { icon: 'ℹ️' })
    console.log('[Accounts] View account:', id)
  }

  const handleEdit = async (id: string) => {
    const account = accounts.find((a) => a.id === id)
    if (!account) return

    const newName = prompt('Edit account name:', account.name)
    if (newName && newName !== account.name) {
      try {
        await api.put(`/crm/accounts/${id}`, { name: newName })
        toast.success('Account updated successfully')
        loadAccounts()
      } catch (error) {
        console.error('Error updating account:', error)
        toast.error('Failed to update account')
      }
    }
  }

  const handleDelete = (_id: string) => {
    toast('Delete functionality not available - backend endpoint not implemented', { icon: '⚠️' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-teal-500">Loading accounts...</div>
      </div>
    )
  }

  return (
    <AccountList
      accounts={filteredAndSortedAccounts}
      totalCount={accounts.length}
      stats={stats}
      onFilterChange={handleFilterChange}
      onCreate={handleCreate}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}
