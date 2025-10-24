"use client"

import { Home, ClipboardList, Wrench, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab: "home" | "work-orders" | "field-tools" | "profile"
  onTabChange: (tab: "home" | "work-orders" | "field-tools" | "profile") => void
}

const navItems = [
  { id: "home" as const, icon: Home, label: "Home" },
  { id: "work-orders" as const, icon: ClipboardList, label: "Work Orders" },
  { id: "field-tools" as const, icon: Wrench, label: "Field Tools" },
  { id: "profile" as const, icon: User, label: "Profile" },
]

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const handleTabClick = (tabId: typeof activeTab) => {
    // Haptic feedback for supported devices
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10)
    }
    onTabChange(tabId)
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 h-[72px] border-t border-slate-700 bg-slate-800 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-full items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 transition-colors",
                "active:scale-95 active:opacity-80",
                isActive ? "text-teal-500" : "text-slate-400",
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-6 w-6" strokeWidth={2} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
