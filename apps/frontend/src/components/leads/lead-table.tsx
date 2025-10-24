import { Flag, MoreVertical, CheckCircle, XCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Lead } from "@/types/view-models/lead"

interface LeadTableProps {
  leads: Lead[]
  onViewLead: (leadId: string) => void
  onConvert: (leadId: string) => void
  onMarkLost: (leadId: string) => void
  onScheduleFollowup: (leadId: string) => void
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

export function LeadTable({ leads, onViewLead, onConvert, onMarkLost, onScheduleFollowup }: LeadTableProps) {
  return (
    <div className="rounded-lg border border-slate-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-800 border-slate-700 hover:bg-slate-800">
            <TableHead className="text-slate-300">Lead Name</TableHead>
            <TableHead className="text-slate-300">Company</TableHead>
            <TableHead className="text-slate-300">Status</TableHead>
            <TableHead className="text-slate-300">Source</TableHead>
            <TableHead className="text-slate-300">Value</TableHead>
            <TableHead className="text-slate-300">Assigned To</TableHead>
            <TableHead className="text-slate-300">Created</TableHead>
            <TableHead className="text-slate-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              onClick={() => onViewLead(lead.id)}
              className="bg-slate-900 border-slate-700 hover:bg-slate-800 cursor-pointer"
            >
              <TableCell className="font-medium text-slate-100">
                <div className="flex items-center gap-2">
                  {lead.priority === "hot" && <Flag className={`h-4 w-4 ${priorityColors[lead.priority]}`} />}
                  {lead.name}
                </div>
              </TableCell>
              <TableCell className="text-slate-400">{lead.company}</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusColors[lead.status]}>
                  {statusLabels[lead.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-400 capitalize">{lead.source}</TableCell>
              <TableCell className="text-teal-500 font-semibold">${lead.value.toLocaleString()}</TableCell>
              <TableCell className="text-slate-400">{lead.assignedTo.name}</TableCell>
              <TableCell className="text-slate-400">{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="hover:bg-slate-700">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onConvert(lead.id)
                      }}
                      className="text-slate-100 hover:bg-slate-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                      Convert to Account
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onMarkLost(lead.id)
                      }}
                      className="text-slate-100 hover:bg-slate-700"
                    >
                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      Mark as Lost
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onScheduleFollowup(lead.id)
                      }}
                      className="text-slate-100 hover:bg-slate-700"
                    >
                      <Calendar className="mr-2 h-4 w-4 text-teal-500" />
                      Schedule Follow-up
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {leads.length === 0 && (
        <div className="text-center py-12 bg-slate-900">
          <p className="text-slate-400 mb-4">No leads found</p>
          <Button className="bg-teal-500 hover:bg-teal-600 text-white">Create your first lead</Button>
        </div>
      )}
    </div>
  )
}
