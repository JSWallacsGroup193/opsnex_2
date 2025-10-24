import { Package, AlertTriangle, XCircle, DollarSign } from "lucide-react"
import type { InventoryStats as InventoryStatsType } from "@/types/view-models/inventory"

interface InventoryStatsProps {
  stats: InventoryStatsType
}

export function InventoryStats({ stats }: InventoryStatsProps) {
  const statCards = [
    {
      label: "Total SKUs",
      value: stats.totalSKUs.toLocaleString(),
      icon: Package,
      iconColor: "text-teal-500",
      bgColor: "bg-teal-500/10",
    },
    {
      label: "Low Stock Alerts",
      value: stats.lowStockAlerts.toLocaleString(),
      icon: AlertTriangle,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-500/10",
      badge: stats.lowStockAlerts > 0 ? stats.lowStockAlerts : undefined,
    },
    {
      label: "Out of Stock",
      value: stats.outOfStock.toLocaleString(),
      icon: XCircle,
      iconColor: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Total Inventory Value",
      value: `$${stats.totalInventoryValue.toLocaleString()}`,
      icon: DollarSign,
      iconColor: "text-teal-500",
      bgColor: "bg-teal-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 py-4 md:px-6">
      {statCards.map((stat) => (
        <div key={stat.label} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} p-2 rounded-lg relative`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              {stat.badge !== undefined && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {stat.badge}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
