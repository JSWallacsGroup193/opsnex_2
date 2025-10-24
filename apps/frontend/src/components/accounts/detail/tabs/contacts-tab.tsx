

import { Phone, Mail, Star, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AccountContact } from "@/types/view-models/account-detail"

interface ContactsTabProps {
  contacts: AccountContact[]
  onAddContact: () => void
  onEditContact: (contactId: string) => void
  onDeleteContact: (contactId: string) => void
}

export function ContactsTab({ contacts, onAddContact, onEditContact, onDeleteContact }: ContactsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Contacts</h3>
        <Button onClick={onAddContact} className="bg-teal-500 text-white hover:bg-teal-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-slate-700 rounded-lg border border-slate-600 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-600">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-slate-600/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-semibold">
                      {contact.name.charAt(0)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-100 font-medium">{contact.name}</span>
                      {contact.isPrimary && <Star className="h-4 w-4 text-emerald-500 fill-emerald-500" />}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-300">{contact.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-teal-500 hover:text-teal-400 flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    {contact.phone}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-teal-500 hover:text-teal-400 flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    {contact.email}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditContact(contact.id)}
                      className="text-slate-400 hover:text-teal-500"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteContact(contact.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {contacts.map((contact) => (
          <div key={contact.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-semibold">
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-100 font-medium">{contact.name}</p>
                    {contact.isPrimary && <Star className="h-4 w-4 text-emerald-500 fill-emerald-500" />}
                  </div>
                  <p className="text-sm text-slate-400">{contact.role}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-teal-500 hover:text-teal-400">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{contact.phone}</span>
              </a>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-teal-500 hover:text-teal-400">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{contact.email}</span>
              </a>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditContact(contact.id)}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteContact(contact.id)}
                className="border-slate-600 text-red-400 hover:bg-slate-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
