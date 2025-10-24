

import type { Contact } from "@/types/view-models/contact"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MessageSquare, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ContactCardProps {
  contact: Contact
  onView: (id: string) => void
  onDelete: (id: string) => void
  onCall: (phone: string) => void
  onEmail: (email: string) => void
  onMessage: (id: string) => void
}

export function ContactCard({ contact, onView, onDelete, onCall, onEmail, onMessage }: ContactCardProps) {
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

  return (
    <Card className="bg-slate-700 border-slate-600 p-4 relative group">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(contact.id)}
        className="absolute top-2 right-2 h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
          <AvatarFallback className="bg-teal-500/10 text-teal-500">{getInitials(contact.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-100 truncate">{contact.name}</h3>
            {contact.isPrimary && (
              <Badge variant="outline" className="bg-teal-500/10 text-teal-500 border-teal-500/20 text-xs">
                Primary
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-400 truncate">{contact.accountName}</p>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <Badge variant="outline" className={getRoleBadgeColor(contact.role)}>
          {contact.role.charAt(0).toUpperCase() + contact.role.slice(1)}
        </Badge>

        <div className="space-y-1">
          <button
            onClick={() => onCall(contact.phone)}
            className="flex items-center gap-2 text-sm text-teal-500 hover:text-teal-400 w-full"
          >
            <Phone className="h-3 w-3" />
            {contact.phone}
          </button>
          <button
            onClick={() => onEmail(contact.email)}
            className="flex items-center gap-2 text-sm text-teal-500 hover:text-teal-400 w-full truncate"
          >
            <Mail className="h-3 w-3" />
            {contact.email}
          </button>
        </div>

        <p className="text-xs text-slate-400">Last contact: {new Date(contact.lastContact).toLocaleDateString()}</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(contact.id)}
          className="flex-1 bg-slate-800 border-teal-500 text-teal-500 hover:bg-slate-700 hover:text-teal-400"
        >
          View Contact
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMessage(contact.id)}
          className="h-9 w-9 p-0 text-teal-500 hover:text-teal-400 hover:bg-slate-600"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
