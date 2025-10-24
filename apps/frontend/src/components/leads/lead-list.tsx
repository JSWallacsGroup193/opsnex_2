import { useState } from "react"
import { LayoutGrid, TableIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadListHeader } from "./lead-list-header"
import { LeadStatsBar } from "./lead-stats"
import { LeadFiltersBar } from "./lead-filters"
import { LeadKanban } from "./lead-kanban"
import { LeadTable } from "./lead-table"
import { LeadMobileCard } from "./lead-mobile-card"
import type { Lead, LeadFilters, LeadStats, LeadStatus } from "@/types/view-models/lead"

interface LeadListProps {
  leads: Lead[]
  stats: LeadStats
  totalCount: number
  onFilterChange: (filters: LeadFilters) => void
  onCreate: () => void
  onViewLead: (leadId: string) => void
  onConvert: (leadId: string) => void
  onMarkLost: (leadId: string) => void
  onScheduleFollowup: (leadId: string) => void
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void
}

export function LeadList({
  leads,
  stats,
  onCreate,
  onViewLead,
  onConvert,
  onMarkLost,
  onScheduleFollowup,
  onStatusChange,
}: LeadListProps) {
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table")
  const [filters, setFilters] = useState<LeadFilters>({
    search: "",
    status: [],
    source: "all",
    assignedTo: "all",
    dateRange: null,
  })

  return (
    <div className="min-h-screen bg-slate-900">
      <LeadListHeader
        searchQuery={filters.search}
        onSearchChange={(search) => setFilters({ ...filters, search })}
        onCreateClick={onCreate}
      />

      <LeadStatsBar stats={stats} />

      <LeadFiltersBar filters={filters} onFiltersChange={setFilters} />

      <div className="px-6 py-4">
        <div className="flex items-center justify-end gap-2 mb-4">
          <Button
            variant={viewMode === "table" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className={
              viewMode === "table"
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            }
          >
            <TableIcon className="h-4 w-4 mr-2" />
            Table
          </Button>
          <Button
            variant={viewMode === "kanban" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("kanban")}
            className={
              viewMode === "kanban"
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            }
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Kanban
          </Button>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          {viewMode === "table" ? (
            <LeadTable
              leads={leads}
              onViewLead={onViewLead}
              onConvert={onConvert}
              onMarkLost={onMarkLost}
              onScheduleFollowup={onScheduleFollowup}
            />
          ) : (
            <LeadKanban
              leads={leads}
              onStatusChange={onStatusChange}
              onViewLead={onViewLead}
              onConvert={onConvert}
              onMarkLost={onMarkLost}
              onScheduleFollowup={onScheduleFollowup}
            />
          )}
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {leads.map((lead) => (
            <LeadMobileCard key={lead.id} lead={lead} onViewLead={onViewLead} />
          ))}
        </div>
      </div>
    </div>
  )
}
