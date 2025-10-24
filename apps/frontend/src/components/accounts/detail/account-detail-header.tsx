import { ChevronRight, Edit, Plus, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { AccountDetail } from "@/types/view-models/account-detail"

interface AccountDetailHeaderProps {
  account: AccountDetail
  onEdit: () => void
  onCreateWorkOrder: () => void
}

export function AccountDetailHeader({ account, onEdit, onCreateWorkOrder }: AccountDetailHeaderProps) {
  return (
    <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
        <span className="hover:text-teal-500 cursor-pointer">CRM</span>
        <ChevronRight className="h-4 w-4" />
        <span className="hover:text-teal-500 cursor-pointer">Accounts</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-100">{account.name}</span>
      </div>

      {/* Header Content */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-100">{account.name}</h1>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              account.type === "residential"
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                : "bg-slate-600 text-slate-300 border border-slate-500"
            }`}
          >
            {account.type === "residential" ? "Residential" : "Commercial"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onEdit}
            className="border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Account
          </Button>
          <Button onClick={onCreateWorkOrder} className="bg-teal-500 text-white hover:bg-teal-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Work Order
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-slate-600 text-slate-400 hover:bg-slate-700 bg-transparent"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
              <DropdownMenuItem className="text-slate-300 hover:bg-slate-700 hover:text-slate-100">
                Deactivate Account
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-300 hover:bg-slate-700 hover:text-slate-100">
                Merge Account
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400 hover:bg-slate-700 hover:text-red-300">
                Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
