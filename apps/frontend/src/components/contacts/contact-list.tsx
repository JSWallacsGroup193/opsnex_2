

import { useState } from "react"
import type { Contact, ContactFilters } from "@/types/view-models/contact"
import { ContactListHeader } from "./contact-list-header"
import { ContactStats } from "./contact-stats"
import { ContactFilters as ContactFiltersComponent } from "./contact-filters"
import { ContactTable } from "./contact-table"
import { ContactCard } from "./contact-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ContactListProps {
  contacts: Contact[]
  totalCount: number
  onFilterChange: (filters: ContactFilters) => void
  onCreate: () => void
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  accounts: Array<{ id: string; name: string }>
}

export function ContactList({
  contacts,
  totalCount,
  onFilterChange,
  onCreate,
  onView,
  onEdit,
  onDelete,
  accounts,
}: ContactListProps) {
  const [filters, setFilters] = useState<ContactFilters>({
    search: "",
    accountIds: [],
    role: "all",
    sortBy: "name",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleFiltersChange = (newFilters: ContactFilters) => {
    setFilters(newFilters)
    onFilterChange(newFilters)
    setCurrentPage(1)
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  const handleMessage = (id: string) => {
    console.log("Message contact:", id)
  }

  const primaryContacts = contacts.filter((c) => c.isPrimary).length
  const recentlyAdded = contacts.filter((c) => {
    const createdDate = new Date(c.createdAt)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return createdDate >= thirtyDaysAgo
  }).length

  const totalPages = Math.ceil(contacts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedContacts = contacts.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-slate-900">
      <ContactListHeader
        searchQuery={filters.search}
        onSearchChange={(search) => handleFiltersChange({ ...filters, search })}
        onCreateContact={onCreate}
      />

      <ContactStats totalContacts={totalCount} primaryContacts={primaryContacts} recentlyAdded={recentlyAdded} />

      <div className="space-y-4 pb-6">
        <ContactFiltersComponent filters={filters} onFiltersChange={handleFiltersChange} accounts={accounts} />

        <div className="px-6">
          <div className="hidden md:block">
            <ContactTable
              contacts={paginatedContacts}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onCall={handleCall}
              onEmail={handleEmail}
              onMessage={handleMessage}
            />
          </div>

          <div className="md:hidden grid gap-4">
            {paginatedContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onView={onView}
                onDelete={onDelete}
                onCall={handleCall}
                onEmail={handleEmail}
                onMessage={handleMessage}
              />
            ))}
          </div>

          {contacts.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-400">No contacts found</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-slate-400">
                Showing {startIndex + 1} to {Math.min(endIndex, contacts.length)} of {contacts.length} contacts
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
