import { Plus, Mail, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AccountDetail } from "@/types/view-models/account-detail"

interface AccountSidebarProps {
  account: AccountDetail
  onCreateWorkOrder: () => void
  onSendEmail: () => void
  onScheduleService: () => void
  onViewOnMap: () => void
  onReassignTeam: () => void
  onViewAgreement: () => void
}

export function AccountSidebar({
  account,
  onCreateWorkOrder,
  onSendEmail,
  onScheduleService,
  onViewOnMap,
  onReassignTeam,
  onViewAgreement,
}: AccountSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Quick Actions Card */}
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button onClick={onCreateWorkOrder} className="w-full bg-teal-500 text-white hover:bg-teal-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Work Order
          </Button>
          <Button
            onClick={onSendEmail}
            variant="outline"
            className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button
            onClick={onScheduleService}
            variant="outline"
            className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Service
          </Button>
          <Button
            onClick={onViewOnMap}
            variant="outline"
            className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
          >
            <MapPin className="h-4 w-4 mr-2" />
            View on Map
          </Button>
        </div>
      </div>

      {/* Account Details Card */}
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Account Details</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-400 mb-1">Account ID</p>
            <p className="text-slate-100">{account.id}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Type</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                account.type === "residential"
                  ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                  : "bg-slate-600 text-slate-300 border border-slate-500"
              }`}
            >
              {account.type === "residential" ? "Residential" : "Commercial"}
            </span>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Status</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                account.status === "active"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {account.status === "active" ? "Active" : "Inactive"}
            </span>
          </div>
          {account.tags && account.tags.length > 0 && (
            <div>
              <p className="text-sm text-slate-400 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {account.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs border border-teal-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="text-sm text-slate-400 mb-1">Created</p>
            <p className="text-slate-100">{account.createdAt}</p>
          </div>
        </div>
      </div>

      {/* Service Agreement Card */}
      {account.serviceAgreement && (
        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Service Agreement</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-400 mb-1">Plan Name</p>
              <p className="text-slate-100">{account.serviceAgreement.planName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  account.serviceAgreement.status === "active"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {account.serviceAgreement.status === "active" ? "Active" : "Expired"}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Next Service</p>
              <p className="text-teal-500 font-medium">{account.serviceAgreement.nextServiceDate}</p>
            </div>
            <Button
              onClick={onViewAgreement}
              variant="outline"
              size="sm"
              className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
            >
              View Agreement
            </Button>
          </div>
        </div>
      )}

      {/* Assigned Team Card */}
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Assigned Team</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-semibold">
              {account.assignedTeam.primaryTechnician.name.charAt(0)}
            </div>
            <div>
              <p className="text-slate-100 font-medium">{account.assignedTeam.primaryTechnician.name}</p>
              <p className="text-sm text-slate-400">Primary Technician</p>
            </div>
          </div>

          {account.assignedTeam.accountManager && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-semibold">
                {account.assignedTeam.accountManager.name.charAt(0)}
              </div>
              <div>
                <p className="text-slate-100 font-medium">{account.assignedTeam.accountManager.name}</p>
                <p className="text-sm text-slate-400">Account Manager</p>
              </div>
            </div>
          )}

          <Button
            onClick={onReassignTeam}
            variant="outline"
            size="sm"
            className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
          >
            Reassign
          </Button>
        </div>
      </div>
    </div>
  )
}
