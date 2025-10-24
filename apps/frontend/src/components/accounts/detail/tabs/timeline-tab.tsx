

import { Wrench, FileText, UserPlus, MessageSquare, Package, DollarSign } from "lucide-react"
import type { AccountActivity } from "@/types/view-models/account-detail"

interface TimelineTabProps {
  activities: AccountActivity[]
}

export function TimelineTab({ activities }: TimelineTabProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "work_order":
        return <Wrench className="h-5 w-5 text-teal-500" />
      case "invoice":
        return <FileText className="h-5 w-5 text-teal-500" />
      case "contact":
        return <UserPlus className="h-5 w-5 text-teal-500" />
      case "note":
        return <MessageSquare className="h-5 w-5 text-teal-500" />
      case "equipment":
        return <Package className="h-5 w-5 text-teal-500" />
      case "payment":
        return <DollarSign className="h-5 w-5 text-teal-500" />
      default:
        return <Wrench className="h-5 w-5 text-teal-500" />
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-100">Activity Timeline</h3>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-600" />

        {/* Activities */}
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="relative flex gap-4">
              {/* Icon */}
              <div className="relative z-10 flex-shrink-0 h-12 w-12 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 bg-slate-700 rounded-lg p-4 border border-slate-600">
                <p className="text-slate-100 mb-1">{activity.description}</p>
                <p className="text-sm text-slate-400">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activities.length === 0 && (
        <div className="bg-slate-700 rounded-lg p-12 border border-slate-600 text-center">
          <p className="text-slate-400">No activity yet</p>
        </div>
      )}
    </div>
  )
}
