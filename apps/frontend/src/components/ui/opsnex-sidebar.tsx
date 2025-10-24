import type * as React from "react"
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Package,
  ShoppingCart,
  Calendar,
  Tag,
  TrendingUp,
  Scan,
  Wrench,
  Bot,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "work-orders", label: "Work Orders", icon: ClipboardList, href: "/work-orders" },
  { id: "crm", label: "CRM", icon: Users, href: "/crm" },
  { id: "inventory", label: "Inventory", icon: Package, href: "/inventory" },
  { id: "purchasing", label: "Purchasing", icon: ShoppingCart, href: "/purchasing" },
  { id: "dispatch", label: "Dispatch & Scheduling", icon: Calendar, href: "/dispatch" },
  { id: "labels", label: "Labels", icon: Tag, href: "/labels" },
  { id: "forecasting", label: "Forecasting", icon: TrendingUp, href: "/forecasting" },
  { id: "barcode", label: "Barcode Scanner", icon: Scan, href: "/barcode" },
  { id: "field-tools", label: "Field Tools", icon: Wrench, href: "/field-tools" },
  { id: "ai-assistant", label: "AI Assistant", icon: Bot, href: "/ai-assistant" },
]

interface UserInfo {
  name: string
  role: string
  avatar?: string
  email?: string
}

interface OpsNexSidebarProps {
  activeItem?: string
  onNavigate?: (itemId: string) => void
  userInfo: UserInfo
  onLogout?: () => void
}

function OpsNexSidebarContent({ activeItem, onNavigate, userInfo, onLogout }: OpsNexSidebarProps) {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <>
      <SidebarHeader className="border-b border-slate-700 bg-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-teal-500">
              <span className="text-sm font-bold text-white">ON</span>
            </div>
            {!isCollapsed && <span className="text-lg font-semibold text-slate-100">OpsNex</span>}
          </div>
          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="text-teal-500 hover:bg-slate-700 hover:text-teal-400 h-8 w-8 flex items-center justify-center rounded-md transition-colors"
            >
              <ChevronLeft className="size-4" />
              <span className="sr-only">Collapse sidebar</span>
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-slate-800 px-2 py-4">
        <SidebarMenu>
          {navigationItems.map((item) => {
            const isActive = activeItem === item.id
            const Icon = item.icon

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={isCollapsed ? item.label : undefined}
                  className={cn(
                    "h-11 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-100",
                    isActive && ["border-l-[3px] border-l-teal-500 bg-slate-700 text-slate-100", "hover:bg-slate-700"],
                    !isActive && "border-l-[3px] border-l-transparent",
                  )}
                  onClick={() => onNavigate?.(item.id)}
                >
                  <a href={item.href} className="flex items-center gap-3">
                    <Icon className={cn("size-5", isActive ? "text-teal-500" : "text-slate-400")} />
                    {!isCollapsed && <span className="text-base">{item.label}</span>}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-700 bg-slate-800 p-4">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={userInfo.avatar || "/placeholder.svg"} alt={userInfo.name} />
              <AvatarFallback className="bg-slate-700 text-slate-100">
                {userInfo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={toggleSidebar}
              className="text-teal-500 hover:bg-slate-700 hover:text-teal-400 h-8 w-8 flex items-center justify-center rounded-md transition-colors"
            >
              <ChevronRight className="size-4" />
              <span className="sr-only">Expand sidebar</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage src={userInfo.avatar || "/placeholder.svg"} alt={userInfo.name} />
                <AvatarFallback className="bg-slate-700 text-slate-100">
                  {userInfo.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-100">{userInfo.name}</span>
                <span className="text-xs text-slate-400">{userInfo.role}</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-slate-400 hover:bg-slate-700 hover:text-teal-400 h-8 w-8 flex items-center justify-center rounded-md transition-colors"
            >
              <LogOut className="size-4" />
              <span className="sr-only">Logout</span>
            </button>
          </div>
        )}
      </SidebarFooter>
    </>
  )
}

export function OpsNexSidebar({
  activeItem,
  onNavigate,
  userInfo,
  onLogout,
  children,
}: OpsNexSidebarProps & { children?: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar
          collapsible="icon"
          className="border-r border-slate-700"
          style={
            {
              "--sidebar-width": "280px",
              "--sidebar-width-icon": "64px",
            } as React.CSSProperties
          }
        >
          <OpsNexSidebarContent
            activeItem={activeItem}
            onNavigate={onNavigate}
            userInfo={userInfo}
            onLogout={onLogout}
          />
        </Sidebar>
        <main className="flex-1 bg-slate-900">{children}</main>
      </div>
    </SidebarProvider>
  )
}
