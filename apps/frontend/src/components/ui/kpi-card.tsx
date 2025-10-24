import type React from "react"
import { ArrowUp, ArrowDown } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  trend?: number
  icon?: React.ReactNode
}

export function KPICard({ title, value, trend, icon }: KPICardProps) {
  const isPositiveTrend = trend !== undefined && trend > 0
  const isNegativeTrend = trend !== undefined && trend < 0

  return (
    <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 md:p-6 transition-all duration-200 hover:bg-slate-600">
      {/* Icon and Title */}
      <div className="flex items-start justify-between mb-4">
        {icon && <div className="text-teal-500 w-10 h-10">{icon}</div>}
        <div className="flex-1 ml-3">
          <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end justify-between">
        <p className="text-slate-100 text-3xl font-bold">{value}</p>

        {/* Trend Indicator */}
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              isPositiveTrend ? "text-emerald-500" : isNegativeTrend ? "text-red-500" : "text-slate-400"
            }`}
          >
            {isPositiveTrend && <ArrowUp className="w-4 h-4" />}
            {isNegativeTrend && <ArrowDown className="w-4 h-4" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}
