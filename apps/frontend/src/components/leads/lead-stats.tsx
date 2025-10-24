import { TrendingUp, TrendingDown, Users, Star, CheckCircle, DollarSign } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { LeadStats } from "@/types/view-models/lead"

interface LeadStatsBarProps {
  stats: LeadStats
}

export function LeadStatsBar({ stats }: LeadStatsBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-6">
      <Card className="bg-slate-800 border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Total Leads</p>
            <p className="text-2xl font-semibold text-slate-100 mt-1">{stats.total}</p>
          </div>
          <Users className="h-8 w-8 text-teal-500" />
        </div>
      </Card>

      <Card className="bg-slate-800 border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">New</p>
            <p className="text-2xl font-semibold text-slate-100 mt-1">{stats.new}</p>
          </div>
          <div className="bg-amber-500/10 p-2 rounded-lg">
            <Star className="h-6 w-6 text-amber-500" />
          </div>
        </div>
      </Card>

      <Card className="bg-slate-800 border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Qualified</p>
            <p className="text-2xl font-semibold text-slate-100 mt-1">{stats.qualified}</p>
          </div>
          <div className="bg-teal-500/10 p-2 rounded-lg">
            <CheckCircle className="h-6 w-6 text-teal-500" />
          </div>
        </div>
      </Card>

      <Card className="bg-slate-800 border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Conversion Rate</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-2xl font-semibold text-slate-100">{stats.conversionRate}%</p>
              {stats.conversionTrend === "up" ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-slate-800 border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Revenue Pipeline</p>
            <p className="text-2xl font-semibold text-teal-500 mt-1">${stats.revenuePipeline.toLocaleString()}</p>
          </div>
          <DollarSign className="h-8 w-8 text-teal-500" />
        </div>
      </Card>
    </div>
  )
}
