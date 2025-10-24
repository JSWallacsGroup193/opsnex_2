import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type MenuItem = {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  disabled?: boolean
  destructive?: boolean
  divider?: boolean
  submenu?: MenuItem[]
}

export interface DropdownProps {
  trigger: React.ReactNode
  items: MenuItem[]
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end"
  align?: "start" | "end" | "center"
  onSelect?: (itemId: string) => void
  className?: string
}

export const Dropdown = ({
  trigger,
  items,
  placement = "bottom-end",
  align = "end",
  onSelect,
  className,
}: DropdownProps) => {
  const [side, alignValue] = React.useMemo(() => {
    const [s, a] = placement.split("-") as ["bottom" | "top", "start" | "end" | undefined]
    return [s, a || align]
  }, [placement, align])

  const renderMenuItem = (item: MenuItem) => {
    if (item.divider) {
      return <DropdownMenuSeparator key={item.id} className="bg-slate-600" />
    }

    if (item.submenu && item.submenu.length > 0) {
      return (
        <DropdownMenuSub key={item.id}>
          <DropdownMenuSubTrigger
            disabled={item.disabled}
            className={cn(
              "h-10 px-3 text-slate-100",
              "hover:bg-slate-600 focus:bg-slate-600",
              "data-[state=open]:bg-slate-600",
              item.disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            {item.icon && <span className="text-teal-400 mr-2">{item.icon}</span>}
            <span className="flex-1">{item.label}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            className={cn("bg-slate-700 border-slate-600 min-w-[200px]", "shadow-lg rounded-lg p-1")}
          >
            {item.submenu.map((subItem) => renderMenuItem(subItem))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      )
    }

    return (
      <DropdownMenuItem
        key={item.id}
        disabled={item.disabled}
        onClick={() => !item.disabled && onSelect?.(item.id)}
        className={cn(
          "h-10 px-3 text-slate-100 cursor-pointer",
          "hover:bg-slate-600 focus:bg-slate-600",
          "focus:border-l-[3px] focus:border-teal-500",
          "transition-colors duration-150",
          item.disabled && "opacity-50 cursor-not-allowed",
          item.destructive && "text-red-400 hover:bg-red-950 hover:text-white focus:bg-red-950 focus:text-white",
        )}
      >
        {item.icon && (
          <span className={cn("mr-2", item.destructive ? "text-red-400" : "text-teal-400")}>{item.icon}</span>
        )}
        <span className="flex-1">{item.label}</span>
        {item.shortcut && (
          <DropdownMenuShortcut className="text-slate-400 text-xs font-mono ml-4">{item.shortcut}</DropdownMenuShortcut>
        )}
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        align={alignValue}
        className={cn(
          "bg-slate-700 border-slate-600 min-w-[200px] max-h-[400px]",
          "shadow-lg rounded-lg p-1",
          "animate-in fade-in-0 zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className,
        )}
        sideOffset={8}
      >
        {items.map((item) => renderMenuItem(item))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
