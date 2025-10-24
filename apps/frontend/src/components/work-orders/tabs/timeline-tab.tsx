import { FileText, UserCheck, RefreshCw, Package, CheckCircle, DollarSign, MessageSquare } from "lucide-react"
import type { TimelineEvent } from "@/types/view-models/work-order"

interface TimelineTabProps {
  timeline: TimelineEvent[]
}

const eventIcons = {
  created: FileText,
  assigned: UserCheck,
  status_changed: RefreshCw,
  parts_added: Package,
  completed: CheckCircle,
  task_completed: CheckCircle,
  invoiced: DollarSign,
  note_added: MessageSquare,
}

export function TimelineTab({ timeline }: TimelineTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <h2 className="text-lg font-bold text-slate-100 mb-6">Activity Timeline</h2>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-600" />

          {/* Timeline Events */}
          <div className="space-y-6">
            {timeline.map((event) => {
              const Icon = eventIcons[event.type]
              return (
                <div key={event.id} className="relative flex gap-4">
                  {/* Icon */}
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 border-2 border-teal-500">
                    <Icon className="w-5 h-5 text-teal-500" />
                  </div>

                  {/* Event Card */}
                  <div className="flex-1 bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-slate-100 font-medium">{event.description}</h3>
                      <span className="text-slate-400 text-sm whitespace-nowrap ml-4">
                        {new Date(event.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">by {event.user}</p>

                    {/* Event Metadata */}
                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        {Object.entries(event.metadata).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="text-slate-400">{key}: </span>
                            <span className="text-slate-300">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
