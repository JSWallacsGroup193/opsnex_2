import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { LeadFilters, LeadStatus, LeadSource } from "@/types/view-models/lead"

interface LeadFiltersBarProps {
  filters: LeadFilters
  onFiltersChange: (filters: LeadFilters) => void
}

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal Sent" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
]

const sourceOptions: { value: LeadSource | "all"; label: string }[] = [
  { value: "all", label: "All Sources" },
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "social", label: "Social" },
]

const technicians = [
  { id: "all", name: "All Technicians" },
  { id: "1", name: "John Smith" },
  { id: "2", name: "Sarah Johnson" },
  { id: "3", name: "Mike Wilson" },
]

export function LeadFiltersBar({ filters, onFiltersChange }: LeadFiltersBarProps) {
  const toggleStatus = (status: LeadStatus) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status]
    onFiltersChange({ ...filters, status: newStatus })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: [],
      source: "all",
      assignedTo: "all",
      dateRange: null,
    })
  }

  const hasActiveFilters = filters.status.length > 0 || filters.source !== "all" || filters.assignedTo !== "all"

  return (
    <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-400">Status:</span>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <Badge
                key={option.value}
                variant={filters.status.includes(option.value) ? "default" : "outline"}
                className={`cursor-pointer ${
                  filters.status.includes(option.value)
                    ? "bg-teal-500 hover:bg-teal-600 text-white border-teal-500"
                    : "bg-slate-900 hover:bg-slate-700 text-slate-300 border-slate-600"
                }`}
                onClick={() => toggleStatus(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Select
            value={filters.source}
            onValueChange={(value) => onFiltersChange({ ...filters, source: value as LeadSource | "all" })}
          >
            <SelectTrigger className="w-[180px] bg-slate-900 border-slate-700 text-slate-100">
              <SelectValue placeholder="Lead Source" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              {sourceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-slate-100">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.assignedTo}
            onValueChange={(value) => onFiltersChange({ ...filters, assignedTo: value })}
          >
            <SelectTrigger className="w-[180px] bg-slate-900 border-slate-700 text-slate-100">
              <SelectValue placeholder="Assigned To" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              {technicians.map((tech) => (
                <SelectItem key={tech.id} value={tech.id} className="text-slate-100">
                  {tech.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="bg-slate-900 border-slate-700 text-teal-500 hover:bg-slate-700 hover:text-teal-400"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
