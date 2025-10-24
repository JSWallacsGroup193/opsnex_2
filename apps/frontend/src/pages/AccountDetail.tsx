import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { AccountDetailHeader } from '@/components/accounts/detail/account-detail-header'
import { AccountSidebar } from '@/components/accounts/detail/account-sidebar'
import { OverviewTab } from '@/components/accounts/detail/tabs/overview-tab'
import { ContactsTab } from '@/components/accounts/detail/tabs/contacts-tab'
import { PropertiesTab } from '@/components/accounts/detail/tabs/properties-tab'
import { crmService } from '@/services/crm.service'
import toast from 'react-hot-toast'
import type { Contact } from '@/types'

export default function AccountDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [account, setAccount] = useState<any>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadAccountData()
    }
  }, [id])

  const loadAccountData = async () => {
    try {
      setLoading(true)
      const [accountData, contactsData] = await Promise.all([
        crmService.getAccount(id!),
        crmService.getAccountContacts(id!)
      ])
      setAccount(accountData)
      setContacts(contactsData)
    } catch (error: any) {
      console.error('Failed to load account:', error)
      toast.error('Failed to load account details')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    try {
      await crmService.deleteContact(contactId)
      toast.success('Contact deleted successfully')
      setContacts(prev => prev.filter(c => c.id !== contactId))
    } catch (error: any) {
      console.error('Failed to delete contact:', error)
      toast.error('Failed to delete contact')
    }
  }

  const handleEditContact = (contactId: string) => {
    toast('Edit contact feature coming soon')
    console.log('Edit contact:', contactId)
  }

  const handleAddContact = () => {
    toast('Add contact feature coming soon')
    console.log('Add contact')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading account details...</p>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Account not found</p>
          <Button onClick={() => navigate('/crm')} className="bg-teal-500 text-white hover:bg-teal-600">
            Back to Accounts
          </Button>
        </div>
      </div>
    )
  }

  // Map account data to expected format
  const mappedAccount = {
    id: account.id,
    name: account.name || 'Unnamed Account',
    type: account.type?.toLowerCase() || 'residential',
    status: account.status || 'active',
    phone: account.phone || account.billingAddress?.phone || '',
    email: account.email || account.billingAddress?.email || '',
    address: formatAddress(account.billingAddress),
    serviceArea: account.billingAddress?.city || '',
    lastServiceDate: account.lastServiceDate || '',
    totalJobs: account._count?.workOrders || 0,
    totalRevenue: 0,
    createdAt: account.createdAt ? new Date(account.createdAt).toLocaleDateString() : '',
    contactName: account.name,
    notes: account.notes || '',
    primaryContact: contacts.find(c => c.isPrimary) ? {
      id: contacts.find(c => c.isPrimary)!.id,
      name: `${contacts.find(c => c.isPrimary)!.firstName} ${contacts.find(c => c.isPrimary)!.lastName}`,
      role: (contacts.find(c => c.isPrimary)! as any).role || 'Contact',
      phone: contacts.find(c => c.isPrimary)!.phone || '',
      email: contacts.find(c => c.isPrimary)!.email || '',
      isPrimary: true,
    } : {
      id: '',
      name: '',
      role: 'Contact',
      phone: '',
      email: '',
      isPrimary: false,
    },
    accountSince: account.createdAt ? new Date(account.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
    tags: [],
    serviceAgreement: undefined,
    assignedTeam: {
      primaryTechnician: {
        id: '',
        name: 'Unassigned',
      },
      accountManager: {
        id: '',
        name: 'Unassigned',
      },
    },
    equipmentCount: account._count?.properties || 0,
    outstandingBalance: 0,
  }

  // Map contacts to expected format
  const mappedContacts = contacts.map(contact => ({
    id: contact.id,
    name: `${contact.firstName} ${contact.lastName}`,
    role: (contact as any).role || 'Contact',
    phone: contact.phone || '',
    email: contact.email || '',
    isPrimary: contact.isPrimary || false,
  }))

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Back Button */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3">
        <Button
          onClick={() => navigate('/crm')}
          variant="ghost"
          className="text-slate-400 hover:text-white -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Accounts
        </Button>
      </div>

      <AccountDetailHeader
        account={mappedAccount}
        onEdit={() => toast('Edit account feature coming soon')}
        onCreateWorkOrder={() => navigate('/work-orders/create')}
      />

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-slate-800 border border-slate-700 mb-6 w-full justify-start overflow-x-auto">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="contacts"
                  className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
                >
                  Contacts ({mappedContacts.length})
                </TabsTrigger>
                <TabsTrigger
                  value="equipment"
                  className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
                >
                  Properties & Equipment
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <OverviewTab 
                  account={mappedAccount} 
                  onEdit={() => toast('Edit account feature coming soon')} 
                />
              </TabsContent>

              <TabsContent value="contacts">
                <ContactsTab
                  contacts={mappedContacts}
                  onAddContact={handleAddContact}
                  onEditContact={handleEditContact}
                  onDeleteContact={handleDeleteContact}
                />
              </TabsContent>

              <TabsContent value="equipment">
                <PropertiesTab
                  accountId={account.id}
                  onViewServiceHistory={(equipmentId: string) => navigate(`/work-orders?equipmentId=${equipmentId}`)}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AccountSidebar
              account={mappedAccount}
              onCreateWorkOrder={() => navigate('/work-orders/create')}
              onSendEmail={() => window.location.href = `mailto:${mappedAccount.email}`}
              onScheduleService={() => toast('Schedule service feature coming soon')}
              onViewOnMap={() => {
                if (mappedAccount.address) {
                  window.open(`https://maps.google.com/?q=${encodeURIComponent(mappedAccount.address)}`, '_blank')
                }
              }}
              onReassignTeam={() => toast('Reassign team feature coming soon')}
              onViewAgreement={() => toast('View agreement feature coming soon')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function formatAddress(address: any): string {
  if (!address) return ''
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode
  ].filter(Boolean)
  return parts.join(', ')
}
