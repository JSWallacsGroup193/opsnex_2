import { useState, useMemo, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { ContactList } from '@/components/contacts/contact-list'
import type { Contact, ContactFilters } from '@/types/view-models/contact'
import api from '../utils/axiosClient'

// Mock accounts data for filtering
const mockAccounts = [
  { id: '1', name: 'Johnson Residence' },
  { id: '2', name: 'ABC Manufacturing Co.' },
  { id: '3', name: 'Smith Family Home' },
  { id: '4', name: 'Green Valley Apartments' },
  { id: '5', name: 'Davis Residence' },
]

// Mock contacts data
const mockContactsData: Contact[] = [
  {
    id: '1',
    name: 'John Johnson',
    accountId: '1',
    accountName: 'Johnson Residence',
    role: 'owner',
    phone: '(555) 123-4567',
    email: 'john.johnson@email.com',
    avatar: undefined,
    isPrimary: true,
    lastContact: '2024-01-15',
    createdAt: '2023-01-10',
  },
  {
    id: '2',
    name: 'Sarah Williams',
    accountId: '2',
    accountName: 'ABC Manufacturing Co.',
    role: 'manager',
    phone: '(555) 234-5678',
    email: 'sarah.williams@abcmfg.com',
    avatar: undefined,
    isPrimary: true,
    lastContact: '2024-01-20',
    createdAt: '2022-06-15',
  },
  {
    id: '3',
    name: 'Mike Smith',
    accountId: '3',
    accountName: 'Smith Family Home',
    role: 'owner',
    phone: '(555) 345-6789',
    email: 'mike.smith@email.com',
    avatar: undefined,
    isPrimary: true,
    lastContact: '2024-01-10',
    createdAt: '2023-03-20',
  },
  {
    id: '4',
    name: 'Robert Chen',
    accountId: '4',
    accountName: 'Green Valley Apartments',
    role: 'manager',
    phone: '(555) 456-7890',
    email: 'robert.chen@greenvalley.com',
    avatar: undefined,
    isPrimary: true,
    lastContact: '2024-01-18',
    createdAt: '2021-11-05',
  },
  {
    id: '5',
    name: 'Emily Davis',
    accountId: '5',
    accountName: 'Davis Residence',
    role: 'owner',
    phone: '(555) 567-8901',
    email: 'emily.davis@email.com',
    avatar: undefined,
    isPrimary: false,
    lastContact: '2023-08-12',
    createdAt: '2022-02-14',
  },
  {
    id: '6',
    name: 'Tom Baker',
    accountId: '2',
    accountName: 'ABC Manufacturing Co.',
    role: 'tenant',
    phone: '(555) 678-9012',
    email: 'tom.baker@abcmfg.com',
    avatar: undefined,
    isPrimary: false,
    lastContact: '2024-01-12',
    createdAt: '2023-08-22',
  },
  {
    id: '7',
    name: 'Lisa Anderson',
    accountId: '4',
    accountName: 'Green Valley Apartments',
    role: 'tenant',
    phone: '(555) 789-0123',
    email: 'lisa.anderson@greenvalley.com',
    avatar: undefined,
    isPrimary: false,
    lastContact: '2024-01-14',
    createdAt: '2023-12-01',
  },
]

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ContactFilters>({
    search: '',
    accountIds: [],
    role: 'all',
    sortBy: 'name',
  })

  const loadContacts = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/crm/contacts')
      
      const transformedContacts: Contact[] = data.map((contact: any) => ({
        id: contact.id,
        name: contact.name || 'Unnamed Contact',
        accountId: contact.accountId || '',
        accountName: contact.account?.name || 'No Account',
        role: contact.role || 'other',
        phone: contact.phone || '',
        email: contact.email || '',
        avatar: contact.avatar,
        isPrimary: contact.isPrimary || false,
        lastContact: contact.lastContact || contact.createdAt,
        createdAt: contact.createdAt,
      }))
      
      setContacts(transformedContacts)
    } catch (error) {
      console.error('Error loading contacts:', error)
      toast.error('Failed to load contacts')
      setContacts(mockContactsData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  // Filter and sort contacts based on current filters
  const filteredAndSortedContacts = useMemo(() => {
    let result = [...contacts]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchLower) ||
          contact.accountName.toLowerCase().includes(searchLower) ||
          contact.phone.includes(filters.search) ||
          contact.email.toLowerCase().includes(searchLower)
      )
    }

    // Apply account filter
    if (filters.accountIds.length > 0) {
      result = result.filter((contact) => filters.accountIds.includes(contact.accountId))
    }

    // Apply role filter
    if (filters.role !== 'all') {
      result = result.filter((contact) => contact.role === filters.role)
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'account':
          return a.accountName.localeCompare(b.accountName)
        case 'lastContact':
          return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime()
        default:
          return 0
      }
    })

    return result
  }, [contacts, filters])

  const handleFilterChange = (newFilters: ContactFilters) => {
    setFilters(newFilters)
  }

  const handleCreate = async () => {
    const name = prompt('Enter contact name:')
    if (name) {
      const email = prompt('Enter contact email (optional):')
      const phone = prompt('Enter contact phone (optional):')
      try {
        await api.post('/crm/contacts', { name, email: email || undefined, phone: phone || undefined })
        toast.success('Contact created successfully')
        loadContacts()
      } catch (error) {
        console.error('Error creating contact:', error)
        toast.error('Failed to create contact')
      }
    }
  }

  const handleView = (id: string) => {
    toast('Contact detail page coming soon', { icon: 'ℹ️' })
    console.log('[Contacts] View contact:', id)
  }

  const handleEdit = async (id: string) => {
    const contact = contacts.find((c) => c.id === id)
    if (!contact) return

    const newName = prompt('Edit contact name:', contact.name)
    if (newName && newName !== contact.name) {
      try {
        await api.put(`/crm/contacts/${id}`, { name: newName })
        toast.success('Contact updated successfully')
        loadContacts()
      } catch (error) {
        console.error('Error updating contact:', error)
        toast.error('Failed to update contact')
      }
    }
  }

  const handleDelete = (_id: string) => {
    toast('Delete functionality not available - backend endpoint not implemented', { icon: '⚠️' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-teal-500">Loading contacts...</div>
      </div>
    )
  }

  return (
    <ContactList
      contacts={filteredAndSortedContacts}
      totalCount={contacts.length}
      onFilterChange={handleFilterChange}
      onCreate={handleCreate}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      accounts={mockAccounts}
    />
  )
}
