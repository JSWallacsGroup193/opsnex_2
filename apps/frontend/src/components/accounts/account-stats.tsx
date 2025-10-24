import type { AccountStats as Stats } from '@/types/view-models/account'
import { Users, UserCheck, DollarSign, UserPlus } from 'lucide-react'

interface AccountStatsProps {
  stats: Stats
}

export function AccountStats({ stats }: AccountStatsProps) {
  const statCards = [
    {
      label: 'Total Accounts',
      value: stats.totalAccounts.toLocaleString(),
      icon: Users,
      iconColor: 'text-teal-500',
    },
    {
      label: 'Active',
      value: stats.activeAccounts.toLocaleString(),
      icon: UserCheck,
      iconColor: 'text-emerald-500',
    },
    {
      label: 'Revenue This Month',
      value: `$${stats.revenueThisMonth.toLocaleString()}`,
      icon: DollarSign,
      iconColor: 'text-teal-500',
    },
    {
      label: 'New This Month',
      value: stats.newThisMonth.toLocaleString(),
      icon: UserPlus,
      iconColor: 'text-amber-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-slate-600 bg-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-100">{stat.value}</p>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
          </div>
        </div>
      ))}
    </div>
  )
}
