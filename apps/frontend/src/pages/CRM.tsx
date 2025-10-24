import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building, Plus, Search, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '../utils/axiosClient'
import toast from 'react-hot-toast'

interface Account {
  id: string
  name: string
  accountNumber: string
  type: string
  phone?: string
  email?: string
  billingAddress?: any
  _count?: {
    contacts: number
    properties: number
  }
}

export default function CRM() {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/crm/accounts')
      setAccounts(data)
    } catch (error: any) {
      console.error('Failed to load accounts:', error)
      toast.error('Failed to load accounts')
    } finally {
      setLoading(false)
    }
  }

  const filteredAccounts = accounts.filter(account =>
    account.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.accountNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewAccount = (accountId: string) => {
    navigate(`/accounts/${accountId}`)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Page Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 md:px-6 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Customer Accounts</h1>
            <p className="text-slate-400 text-sm sm:text-base">Manage customer accounts, properties, and equipment</p>
          </div>
          <Button className="bg-teal-500 hover:bg-teal-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-6 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-400">Loading accounts...</div>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-12 text-center border border-slate-700">
            <Building className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-200 mb-2">
              {searchQuery ? 'No accounts found' : 'No accounts yet'}
            </h3>
            <p className="text-slate-400 mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'Create your first customer account to get started'}
            </p>
            {!searchQuery && (
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add First Account
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAccounts.map((account) => (
              <div
                key={account.id}
                onClick={() => handleViewAccount(account.id)}
                className="bg-slate-800 rounded-lg border border-slate-700 p-5 hover:bg-slate-700/50 hover:border-teal-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <Building className="h-6 w-6 text-teal-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate group-hover:text-teal-400 transition-colors">
                        {account.name}
                      </h3>
                      <p className="text-sm text-slate-400">{account.accountNumber}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-teal-500 transition-colors flex-shrink-0" />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Type:</span>
                    <span className="text-slate-300 capitalize">{account.type}</span>
                  </div>
                  {account.email && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Email:</span>
                      <span className="text-slate-300 truncate ml-2">{account.email}</span>
                    </div>
                  )}
                  {account.phone && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Phone:</span>
                      <span className="text-slate-300">{account.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-slate-700">
                  <div className="text-xs text-slate-400">
                    <span className="text-white font-semibold">{account._count?.contacts || 0}</span> Contacts
                  </div>
                  <div className="text-xs text-slate-400">
                    <span className="text-white font-semibold">{account._count?.properties || 0}</span> Properties
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
