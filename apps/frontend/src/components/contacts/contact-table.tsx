

import type { Contact } from "@/types/view-models/contact"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Phone, Mail, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ContactTableProps {
  contacts: Contact[]
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onCall: (phone: string) => void
  onEmail: (email: string) => void
  onMessage: (id: string) => void
}

export function ContactTable({ contacts, onView, onEdit, onDelete, onCall, onEmail, onMessage }: ContactTableProps) {

  const getRoleBadgeColor = (role: Contact["role"]) => {
    switch (role) {
      case "owner":
        return "bg-teal-500/10 text-teal-500 border-teal-500/20"
      case "manager":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "tenant":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (contacts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-400">No contacts found</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-slate-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-800 border-slate-700 hover:bg-slate-800">
            <TableHead className="text-slate-300">Name</TableHead>
            <TableHead className="text-slate-300">Account</TableHead>
            <TableHead className="text-slate-300">Role</TableHead>
            <TableHead className="text-slate-300">Phone</TableHead>
            <TableHead className="text-slate-300">Email</TableHead>
            <TableHead className="text-slate-300">Last Contact</TableHead>
            <TableHead className="text-slate-300 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow
              key={contact.id}
              className="bg-slate-900 border-slate-700 hover:bg-slate-800 cursor-pointer"
              onClick={() => onView(contact.id)}
            >
              <TableCell className="text-slate-100">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                    <AvatarFallback className="bg-teal-500/10 text-teal-500 text-xs">
                      {getInitials(contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{contact.name}</div>
                    {contact.isPrimary && <div className="text-xs text-teal-500">Primary</div>}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-slate-300">{contact.accountName}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getRoleBadgeColor(contact.role)}>
                  {contact.role.charAt(0).toUpperCase() + contact.role.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onCall(contact.phone)
                  }}
                  className="text-teal-500 hover:text-teal-400 flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" />
                  {contact.phone}
                </button>
              </TableCell>
              <TableCell>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEmail(contact.email)
                  }}
                  className="text-teal-500 hover:text-teal-400"
                >
                  {contact.email}
                </button>
              </TableCell>
              <TableCell className="text-slate-400">{new Date(contact.lastContact).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onCall(contact.phone)
                    }}
                    className="h-8 w-8 p-0 text-teal-500 hover:text-teal-400 hover:bg-slate-800"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEmail(contact.email)
                    }}
                    className="h-8 w-8 p-0 text-teal-500 hover:text-teal-400 hover:bg-slate-800"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMessage(contact.id)
                    }}
                    className="h-8 w-8 p-0 text-teal-500 hover:text-teal-400 hover:bg-slate-800"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onView(contact.id)
                        }}
                        className="text-slate-100 focus:bg-slate-700 focus:text-slate-100"
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(contact.id)
                        }}
                        className="text-slate-100 focus:bg-slate-700 focus:text-slate-100"
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(contact.id)
                        }}
                        className="text-red-400 focus:bg-slate-700 focus:text-red-400"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
