

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ContactFilters as ContactFiltersType, ContactRole } from "@/types/view-models/contact"
import { Card } from "@/components/ui/card"

interface ContactFiltersProps {
  filters: ContactFiltersType
  onFiltersChange: (filters: ContactFiltersType) => void
  accounts: Array<{ id: string; name: string }>
}

export function ContactFilters({ filters, onFiltersChange, accounts }: ContactFiltersProps) {
  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      accountIds: [],
      role: "all",
      sortBy: "name",
    })
  }

  return (
    <Card className="bg-slate-800 border-slate-700 px-6 py-4 mx-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1">
          <Select
            value={filters.accountIds[0] || "all"}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                accountIds: value === "all" ? [] : [value],
              })
            }
          >
            <SelectTrigger className="w-full sm:w-48 bg-slate-900 border-slate-700 text-slate-100">
              <SelectValue placeholder="All Accounts" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all" className="text-slate-100">
                All Accounts
              </SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id} className="text-slate-100">
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.role}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                role: value as ContactRole | "all",
              })
            }
          >
            <SelectTrigger className="w-full sm:w-40 bg-slate-900 border-slate-700 text-slate-100">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all" className="text-slate-100">
                All Roles
              </SelectItem>
              <SelectItem value="owner" className="text-slate-100">
                Owner
              </SelectItem>
              <SelectItem value="manager" className="text-slate-100">
                Manager
              </SelectItem>
              <SelectItem value="tenant" className="text-slate-100">
                Tenant
              </SelectItem>
              <SelectItem value="other" className="text-slate-100">
                Other
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                sortBy: value as ContactFiltersType["sortBy"],
              })
            }
          >
            <SelectTrigger className="w-full sm:w-48 bg-slate-900 border-slate-700 text-slate-100">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="name" className="text-slate-100">
                Sort by Name
              </SelectItem>
              <SelectItem value="account" className="text-slate-100">
                Sort by Account
              </SelectItem>
              <SelectItem value="lastContact" className="text-slate-100">
                Sort by Last Contact
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="bg-slate-700 border-slate-600 text-teal-500 hover:bg-slate-600 hover:text-teal-400"
        >
          Clear Filters
        </Button>
      </div>
    </Card>
  )
}
