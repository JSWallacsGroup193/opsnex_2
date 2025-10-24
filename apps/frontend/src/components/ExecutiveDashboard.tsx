import { useState } from "react"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  ClipboardList,
  Star,
  Clock,
  DollarSign,
  FileText,
  Download,
  User,
  AlertCircle,
  CheckCircle,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Activity, TopTechnician, RevenueDataPoint, JobDistribution } from "@/types"

interface ExecutiveDashboardProps {
  revenue: { value: number; trend: number }
  activeWorkOrders: number
  satisfaction: number
  utilization: number
  avgDuration: number
  partsCost: number
  revenueData: RevenueDataPoint[]
  jobDistribution: JobDistribution
  topTechnicians: TopTechnician[]
  recentActivity: Activity[]
}

export function ExecutiveDashboard({
  revenue,
  activeWorkOrders,
  satisfaction,
  utilization,
  avgDuration,
  partsCost,
  revenueData,
  jobDistribution,
  topTechnicians,
  recentActivity,
}: ExecutiveDashboardProps) {
  const [dateRange, setDateRange] = useState("Last 30 Days")

  const pieData = [
    { name: "Scheduled", value: jobDistribution.scheduled, color: "#64748b" },
    { name: "In Progress", value: jobDistribution.inProgress, color: "#14b8a6" },
    { name: "Completed", value: jobDistribution.completed, color: "#10b981" },
  ]

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "work_order":
        return <ClipboardList className="h-4 w-4 text-teal-500" />
      case "technician":
        return <User className="h-4 w-4 text-teal-500" />
      case "customer":
        return <Star className="h-4 w-4 text-teal-500" />
      case "payment":
        return <CreditCard className="h-4 w-4 text-teal-500" />
      case "alert":
        return <AlertCircle className="h-4 w-4 text-teal-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-teal-500" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between rounded-lg bg-slate-800 p-4">
        <h1 className="text-2xl font-bold text-slate-100">Executive Overview</h1>
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-teal-500 bg-slate-700 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Revenue */}
        <Card className="border-slate-600 bg-slate-700 p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-400">Total Revenue</span>
            <DollarSign className="h-5 w-5 text-teal-500" />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-slate-100">${revenue.value.toLocaleString()}</span>
            <div
              className={`flex items-center gap-1 text-sm ${revenue.trend >= 0 ? "text-emerald-500" : "text-red-500"}`}
            >
              {revenue.trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{Math.abs(revenue.trend)}%</span>
            </div>
          </div>
        </Card>

        {/* Active Work Orders */}
        <Card className="border-slate-600 bg-slate-700 p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-400">Active Work Orders</span>
            <ClipboardList className="h-5 w-5 text-teal-500" />
          </div>
          <span className="text-3xl font-bold text-slate-100">{activeWorkOrders}</span>
        </Card>

        {/* Customer Satisfaction */}
        <Card className="border-slate-600 bg-slate-700 p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-400">Customer Satisfaction</span>
            <Star className="h-5 w-5 text-teal-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-slate-100">{satisfaction.toFixed(1)}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= satisfaction ? "fill-amber-500 text-amber-500" : "text-slate-600"}`}
                />
              ))}
            </div>
          </div>
        </Card>

        {/* Technician Utilization */}
        <Card className="border-slate-600 bg-slate-700 p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-400">Technician Utilization</span>
            <User className="h-5 w-5 text-teal-500" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-slate-100">{utilization}%</span>
            <div className="relative h-16 w-16">
              <svg className="h-16 w-16 -rotate-90 transform">
                <circle cx="32" cy="32" r="28" stroke="#475569" strokeWidth="8" fill="none" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#14b8a6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(utilization / 100) * 176} 176`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </Card>

        {/* Avg Job Duration */}
        <Card className="border-slate-600 bg-slate-700 p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-400">Avg Job Duration</span>
            <Clock className="h-5 w-5 text-teal-500" />
          </div>
          <span className="text-3xl font-bold text-slate-100">{avgDuration.toFixed(1)}h</span>
        </Card>

        {/* Parts Cost */}
        <Card className="border-slate-600 bg-slate-700 p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-400">Parts Cost</span>
            <DollarSign className="h-5 w-5 text-teal-500" />
          </div>
          <span className="text-3xl font-bold text-slate-100">${partsCost.toLocaleString()}</span>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="border-slate-600 bg-slate-700 p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#334155",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
              />
              <Line type="monotone" dataKey="amount" stroke="#14b8a6" strokeWidth={2} dot={{ fill: "#14b8a6", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Job Status Distribution */}
        <Card className="border-slate-600 bg-slate-700 p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Job Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#334155",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
              />
              <Legend wrapperStyle={{ color: "#f1f5f9" }} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Performance Table and Activity Feed */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Performance Table */}
        <Card className="border-slate-600 bg-slate-700 p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Top Technicians</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="pb-3 text-left text-sm font-medium text-slate-400">Name</th>
                  <th className="pb-3 text-left text-sm font-medium text-slate-400">Jobs Completed</th>
                  <th className="pb-3 text-left text-sm font-medium text-slate-400">Avg Duration</th>
                  <th className="pb-3 text-left text-sm font-medium text-slate-400">Rating</th>
                </tr>
              </thead>
              <tbody>
                {topTechnicians.map((tech, index) => (
                  <tr
                    key={tech.id}
                    className="cursor-pointer border-b border-slate-600 transition-colors hover:bg-slate-600"
                  >
                    <td className="py-3 text-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white">
                          {index + 1}
                        </span>
                        {tech.name}
                      </div>
                    </td>
                    <td className="py-3 text-slate-100">{tech.jobsCompleted}</td>
                    <td className="py-3 text-slate-100">{tech.avgDuration.toFixed(1)}h</td>
                    <td className="py-3 text-slate-100">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        {tech.customerRating.toFixed(1)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="border-slate-600 bg-slate-700 p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3 border-b border-slate-600 pb-3 last:border-0">
                <div className="mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="text-sm text-slate-100">{activity.description}</p>
                  <p className="mt-1 text-xs text-slate-400">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex gap-4">
        <Button className="bg-teal-500 text-white hover:bg-teal-600">
          <FileText className="mr-2 h-4 w-4" />
          View Reports
        </Button>
        <Button variant="outline" className="border-teal-500 bg-slate-700 text-teal-500 hover:bg-slate-600">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>
    </div>
  )
}
