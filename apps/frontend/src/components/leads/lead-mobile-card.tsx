import { Building2, DollarSign, User, Calendar, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { Lead } from "@/types/view-models/lead"

interface LeadMobileCardProps {
  lead: Lead
  onViewLead: (leadId: string) => void
}

const statusColors = {
  new: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  contacted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  qualified: "bg-teal-500/10 text-teal-500 border-teal-500/20",
  proposal: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  won: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  lost: "bg-red-500/10 text-red-500 border-red-500/20",
}

const statusLabels = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal Sent",
  won: "Won",
  lost: "Lost",
}

const priorityColors = {
  hot: "text-red-500",
  warm: "text-amber-500",
  cold: "text-blue-500",
}

export function LeadMobileCard({ lead, onViewLead }: LeadMobileCardProps) {
  return (
    <Card className="bg-slate-700 border-slate-600 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-100">{lead.name}</h3>
            {lead.priority === "hot" && <Flag className={`h-4 w-4 ${priorityColors[lead.priority]}`} />}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Building2 className="h-3 w-3" />
            <span>{lead.company}</span>
          </div>
        </div>
        <Badge variant="outline" className={statusColors[lead.status]}>
          {statusLabels[lead.status]}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Value</span>
          <span className="text-teal-500 font-semibold">
            <DollarSign className="inline h-4 w-4" />
            {lead.value.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Assigned to</span>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <User className="h-3 w-3" />
            <span>{lead.assignedTo.name}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Created</span>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Calendar className="h-3 w-3" />
            <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={() => onViewLead(lead.id)}
        variant="outline"
        className="w-full border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white"
      >
        View Lead
      </Button>
    </Card>
  )
}
