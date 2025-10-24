

import { Phone, Mail, MapPin, Edit, DollarSign, Wrench, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AccountDetail } from "@/types/view-models/account-detail"

interface OverviewTabProps {
  account: AccountDetail
  onEdit: () => void
}

export function OverviewTab({ account, onEdit }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Account Information Card */}
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Account Information</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
          >
            <Edit className="h-3 w-3 mr-2" />
            Edit Info
          </Button>
        </div>

        <div className="space-y-4">
          {/* Primary Contact */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-semibold">
              {account.primaryContact.name.charAt(0)}
            </div>
            <div>
              <p className="text-slate-100 font-medium">{account.primaryContact.name}</p>
              <p className="text-sm text-slate-400">{account.primaryContact.role}</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-slate-400" />
              <a href={`tel:${account.phone}`} className="text-teal-500 hover:text-teal-400">
                {account.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <a href={`mailto:${account.email}`} className="text-teal-500 hover:text-teal-400">
                {account.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-slate-400" />
              <div className="flex-1">
                <p className="text-slate-100">{account.address}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(account.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-teal-500 hover:text-teal-400"
                >
                  View on Map
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-slate-400" />
              <p className="text-slate-400">Account since {account.accountSince}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <Wrench className="h-8 w-8 text-teal-500" />
          </div>
          <p className="text-3xl font-bold text-slate-100">{account.totalJobs}</p>
          <p className="text-sm text-slate-400">Total Work Orders</p>
        </div>

        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 text-teal-500" />
          </div>
          <p className="text-3xl font-bold text-slate-100">${account.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-slate-400">Total Revenue</p>
        </div>

        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-8 w-8 text-teal-500" />
          </div>
          <p className="text-3xl font-bold text-slate-100">{account.lastServiceDate || "Never"}</p>
          <p className="text-sm text-slate-400">Last Service</p>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Quick Summary</h3>

        <div className="space-y-4">
          {account.notes && (
            <div>
              <p className="text-sm font-medium text-slate-400 mb-2">Customer Notes</p>
              <p className="text-slate-100">{account.notes}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-slate-400 mb-2">Service History Summary</p>
            <p className="text-slate-400">
              {account.totalJobs} completed work orders with a total revenue of ${account.totalRevenue.toLocaleString()}
              . Last service was on {account.lastServiceDate || "N/A"}.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-400 mb-2">Equipment on Site</p>
            <p className="text-slate-100">{account.equipmentCount} equipment items registered</p>
          </div>
        </div>
      </div>
    </div>
  )
}
