import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, Clock, Wrench, Barcode, CheckCircle, AlertTriangle, MapPin, Calendar } from "lucide-react"

interface WorkOrder {
  id: string
  customerName: string
  address: string
  time: string
  jobType: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
  priority?: "low" | "medium" | "high"
}

interface TechnicianDashboardProps {
  technicianName: string
  jobsToday: number
  hoursWorked: number
  workOrders: WorkOrder[]
}

export function TechnicianDashboard({ technicianName, jobsToday, hoursWorked, workOrders }: TechnicianDashboardProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const getStatusColor = (status: WorkOrder["status"]) => {
    switch (status) {
      case "completed":
        return "bg-teal-500/20 text-teal-400 border-teal-500/30"
      case "in-progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Pull to refresh area */}
      <div className="h-2 bg-[#1e293b]" />

      {/* Header */}
      <header className="bg-[#1e293b] px-4 py-6 border-b border-[#475569]">
        <h1 className="text-2xl font-bold text-slate-100">Today&apos;s Schedule</h1>
        <div className="flex items-center gap-2 mt-1">
          <Calendar className="w-4 h-4 text-slate-400" />
          <p className="text-sm text-slate-400">{currentDate}</p>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* User Greeting */}
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 border-2 border-teal-500">
            <AvatarImage src="/placeholder.svg?height=48&width=48" alt={technicianName} />
            <AvatarFallback className="bg-teal-500 text-white">
              {technicianName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold text-slate-100">
              {getGreeting()}, {technicianName.split(" ")[0]}!
            </p>
            <p className="text-sm text-slate-400">Ready to start your day?</p>
          </div>
        </div>

        {/* KPI Summary */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-[#334155] border-[#475569] p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/20 rounded-lg">
                <Briefcase className="w-5 h-5 text-teal-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">{jobsToday}</p>
                <p className="text-sm text-slate-400">Jobs Today</p>
              </div>
            </div>
          </Card>

          <Card className="bg-[#334155] border-[#475569] p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-teal-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">{hoursWorked}</p>
                <p className="text-sm text-slate-400">Hours Worked</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Work Orders Section */}
        <section>
          <h2 className="text-xl font-semibold text-slate-100 mb-3">Assigned Jobs</h2>

          {workOrders.length === 0 ? (
            <Card className="bg-[#334155] border-[#475569] p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-teal-500/20 rounded-full mb-3">
                  <Briefcase className="w-8 h-8 text-teal-500" />
                </div>
                <p className="text-slate-400">No jobs scheduled</p>
                <p className="text-sm text-slate-500 mt-1">Check back later for new assignments</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {workOrders.map((order) => (
                <Card
                  key={order.id}
                  className={`bg-[#334155] border-[#475569] p-4 cursor-pointer transition-all hover:border-teal-500/50 ${
                    selectedOrder === order.id ? "border-teal-500" : ""
                  }`}
                  onClick={() => setSelectedOrder(order.id === selectedOrder ? null : order.id)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-100">{order.customerName}</h3>
                        <p className="text-sm text-slate-400 mt-1">{order.address}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>{order.status.replace("-", " ")}</Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-teal-500">
                        <Clock className="w-4 h-4" />
                        <span>{order.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Wrench className="w-4 h-4" />
                        <span>{order.jobType}</span>
                      </div>
                    </div>

                    {selectedOrder === order.id && (
                      <div className="pt-3 border-t border-[#475569]">
                        <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">View Details</Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold text-slate-100 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button className="h-20 bg-teal-500 hover:bg-teal-600 text-white flex-col gap-2" size="lg">
              <Wrench className="w-6 h-6" />
              <span className="text-sm font-medium">Field Tools</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 bg-[#334155] hover:bg-[#475569] border-[#475569] text-slate-100 flex-col gap-2"
              size="lg"
            >
              <Barcode className="w-6 h-6 text-teal-500" />
              <span className="text-sm font-medium">Scanner</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 bg-[#334155] hover:bg-[#475569] border-[#475569] text-slate-100 flex-col gap-2"
              size="lg"
            >
              <CheckCircle className="w-6 h-6 text-teal-500" />
              <span className="text-sm font-medium">Update Status</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 bg-[#334155] hover:bg-[#475569] border-[#475569] text-slate-100 flex-col gap-2"
              size="lg"
            >
              <AlertTriangle className="w-6 h-6 text-teal-500" />
              <span className="text-sm font-medium">Report Issue</span>
            </Button>
          </div>
        </section>

        {/* Map Preview */}
        <section>
          <h2 className="text-xl font-semibold text-slate-100 mb-3">Today&apos;s Route</h2>
          <Card className="bg-[#334155] border-[#475569] overflow-hidden">
            <div className="relative h-48 bg-[#1e293b] flex items-center justify-center">
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-teal-500/20 to-blue-500/20" />
              </div>
              <div className="relative z-10 text-center">
                <MapPin className="w-12 h-12 text-teal-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Map preview</p>
              </div>
            </div>
            <div className="p-4">
              <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">View Full Route</Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
