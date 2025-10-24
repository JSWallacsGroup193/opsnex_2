import { FileText, Clock, CheckCircle } from "lucide-react"

interface WorkOrderStatsProps {
  stats: {
    total: number
    inProgress: number
    completed: number
  }
}

export function WorkOrderStats({ stats }: WorkOrderStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Total Orders</p>
            <p className="text-3xl font-bold text-slate-100 mt-2">{stats.total}</p>
          </div>
          <div className="bg-teal-500/10 p-3 rounded-lg">
            <FileText className="w-6 h-6 text-teal-500" />
          </div>
        </div>
      </div>

      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">In Progress</p>
            <p className="text-3xl font-bold text-slate-100 mt-2">{stats.inProgress}</p>
          </div>
          <div className="bg-teal-500/10 p-3 rounded-lg">
            <Clock className="w-6 h-6 text-teal-500" />
          </div>
        </div>
      </div>

      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Completed</p>
            <p className="text-3xl font-bold text-slate-100 mt-2">{stats.completed}</p>
          </div>
          <div className="bg-teal-500/10 p-3 rounded-lg">
            <CheckCircle className="w-6 h-6 text-teal-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
