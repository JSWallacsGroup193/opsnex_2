

import { Users, UserCheck, UserPlus } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ContactStatsProps {
  totalContacts: number
  primaryContacts: number
  recentlyAdded: number
}

export function ContactStats({ totalContacts, primaryContacts, recentlyAdded }: ContactStatsProps) {
  const stats = [
    {
      label: "Total Contacts",
      value: totalContacts,
      icon: Users,
      color: "text-teal-500",
    },
    {
      label: "Primary Contacts",
      value: primaryContacts,
      icon: UserCheck,
      color: "text-teal-500",
    },
    {
      label: "Recently Added",
      value: recentlyAdded,
      icon: UserPlus,
      color: "text-teal-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 px-6 py-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="bg-slate-800 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="text-2xl font-semibold text-slate-100 mt-1">{stat.value.toLocaleString()}</p>
              </div>
              <Icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
