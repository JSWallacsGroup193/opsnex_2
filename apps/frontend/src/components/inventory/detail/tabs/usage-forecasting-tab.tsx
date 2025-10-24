import { TrendingUp, AlertTriangle, Package } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { UsageData, ForecastData } from "@/types/view-models/inventory"

interface UsageForecastingTabProps {
  usageData: UsageData[]
  forecast: ForecastData
  workOrderUsage: {
    count: number
    commonJobTypes: string[]
  }
}

export function UsageForecastingTab({ usageData, forecast, workOrderUsage }: UsageForecastingTabProps) {
  return (
    <div className="space-y-6">
      {/* Usage Chart */}
      <div className="bg-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Usage Over Time (Last 90 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={usageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "#f1f5f9",
              }}
            />
            <Line type="monotone" dataKey="quantity" stroke="#14b8a6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Forecasting Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-teal-500" />
            <h4 className="text-sm font-medium text-slate-400">Avg Monthly Usage</h4>
          </div>
          <p className="text-2xl font-bold text-slate-100">{forecast.avgMonthlyUsage}</p>
          <p className="text-sm text-slate-400 mt-1">units per month</p>
        </div>

        <div className="bg-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle
              className={`h-5 w-5 ${forecast.daysUntilReorder < 30 ? "text-amber-500" : "text-teal-500"}`}
            />
            <h4 className="text-sm font-medium text-slate-400">Days Until Reorder</h4>
          </div>
          <p className={`text-2xl font-bold ${forecast.daysUntilReorder < 30 ? "text-amber-500" : "text-slate-100"}`}>
            {forecast.daysUntilReorder}
          </p>
          <p className="text-sm text-slate-400 mt-1">estimated days</p>
        </div>

        <div className="bg-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-5 w-5 text-teal-500" />
            <h4 className="text-sm font-medium text-slate-400">Suggested Order Qty</h4>
          </div>
          <p className="text-2xl font-bold text-teal-500">{forecast.suggestedOrderQuantity}</p>
          <p className="text-sm text-slate-400 mt-1">units to order</p>
        </div>
      </div>

      {/* Work Order Usage */}
      <div className="bg-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Used in Work Orders</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400">Times Used</label>
            <p className="text-2xl font-bold text-slate-100">{workOrderUsage.count}</p>
          </div>
          <div>
            <label className="text-sm text-slate-400">Common Job Types</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {workOrderUsage.commonJobTypes.map((jobType, index) => (
                <span key={index} className="px-3 py-1 bg-teal-500/20 text-teal-500 rounded-full text-sm">
                  {jobType}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
