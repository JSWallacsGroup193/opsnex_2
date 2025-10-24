import { useState } from "react"
import type { Technician } from "@/types/view-models/dispatch"

interface TechnicianSidebarProps {
  technicians: Technician[]
}

export function TechnicianSidebar({ technicians }: TechnicianSidebarProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null)

  return (
    <div className="w-64 border-r border-border bg-card">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Technicians</h2>
      </div>

      <div className="divide-y divide-border">
        {technicians.map((tech) => (
          <button
            key={tech.id}
            onClick={() => setSelectedTech(tech.id)}
            className={`w-full p-4 text-left transition-colors hover:bg-accent ${
              selectedTech === tech.id ? "bg-primary/20 ring-2 ring-inset ring-primary" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                  {tech.avatar}
                </div>
                <div
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${
                    tech.status === "available"
                      ? "bg-emerald-500"
                      : tech.status === "on-job"
                        ? "bg-amber-500"
                        : "bg-muted-foreground"
                  }`}
                />
              </div>

              <div className="flex-1">
                <div className="font-medium text-foreground">{tech.name}</div>
                <div className="text-xs text-muted-foreground">
                  {tech.status === "available" ? "Available" : tech.status === "on-job" ? "On Job" : "Off Duty"}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
