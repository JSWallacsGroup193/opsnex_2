import * as React from "react"
import { cn } from "@/lib/utils"

export interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: string
  disabled?: boolean
}

export interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  orientation?: "horizontal" | "vertical"
  variant?: "underline" | "pills" | "buttons"
  fullWidth?: boolean
  className?: string
}

export const OpsNexTabs = ({
  tabs,
  activeTab,
  onChange,
  orientation = "horizontal",
  variant = "underline",
  fullWidth = false,
  className,
}: TabsProps) => {
  const tabsRef = React.useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({})

  React.useEffect(() => {
    if (variant === "underline" && tabsRef.current) {
      const activeButton = tabsRef.current.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement
      if (activeButton) {
        if (orientation === "horizontal") {
          setIndicatorStyle({
            left: activeButton.offsetLeft,
            width: activeButton.offsetWidth,
          })
        } else {
          setIndicatorStyle({
            top: activeButton.offsetTop,
            height: activeButton.offsetHeight,
          })
        }
      }
    }
  }, [activeTab, variant, orientation])

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    const enabledTabs = tabs.filter((tab) => !tab.disabled)
    const currentEnabledIndex = enabledTabs.findIndex((tab) => tab.id === tabs[currentIndex].id)

    let nextIndex = currentEnabledIndex

    if (orientation === "horizontal") {
      if (e.key === "ArrowLeft") {
        nextIndex = currentEnabledIndex > 0 ? currentEnabledIndex - 1 : enabledTabs.length - 1
        e.preventDefault()
      } else if (e.key === "ArrowRight") {
        nextIndex = currentEnabledIndex < enabledTabs.length - 1 ? currentEnabledIndex + 1 : 0
        e.preventDefault()
      }
    } else {
      if (e.key === "ArrowUp") {
        nextIndex = currentEnabledIndex > 0 ? currentEnabledIndex - 1 : enabledTabs.length - 1
        e.preventDefault()
      } else if (e.key === "ArrowDown") {
        nextIndex = currentEnabledIndex < enabledTabs.length - 1 ? currentEnabledIndex + 1 : 0
        e.preventDefault()
      }
    }

    if (nextIndex !== currentEnabledIndex) {
      onChange(enabledTabs[nextIndex].id)
      setTimeout(() => {
        const newButton = tabsRef.current?.querySelector(`[data-tab-id="${enabledTabs[nextIndex].id}"]`) as HTMLElement
        newButton?.focus()
      }, 0)
    }
  }

  const getTabClassName = (tab: Tab, index: number) => {
    const isActive = tab.id === activeTab
    const baseClasses =
      "relative flex items-center gap-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"

    if (variant === "underline") {
      return cn(
        baseClasses,
        "h-12 px-4 text-sm font-medium border-b-3",
        orientation === "horizontal" ? "border-b-3" : "border-l-3",
        isActive ? "text-slate-100" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700",
        tab.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        fullWidth && orientation === "horizontal" && "flex-1 justify-center",
      )
    }

    if (variant === "pills") {
      return cn(
        baseClasses,
        "px-4 py-2 rounded-full text-sm font-medium",
        isActive ? "bg-teal-500 text-white" : "text-slate-400 hover:bg-slate-700 hover:text-slate-200",
        tab.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        fullWidth && orientation === "horizontal" && "flex-1 justify-center",
      )
    }

    if (variant === "buttons") {
      return cn(
        baseClasses,
        "px-4 py-2 text-sm font-medium border border-slate-600",
        orientation === "horizontal" && index > 0 && "-ml-px",
        orientation === "horizontal" && index === 0 && "rounded-l-md",
        orientation === "horizontal" && index === tabs.length - 1 && "rounded-r-md",
        orientation === "vertical" && index > 0 && "-mt-px",
        orientation === "vertical" && index === 0 && "rounded-t-md",
        orientation === "vertical" && index === tabs.length - 1 && "rounded-b-md",
        isActive
          ? "bg-slate-700 text-slate-100 z-10"
          : "bg-transparent text-slate-400 hover:bg-slate-700 hover:text-slate-200",
        tab.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        fullWidth && orientation === "horizontal" && "flex-1 justify-center",
      )
    }

    return baseClasses
  }

  const containerClassName = cn(
    "relative",
    variant === "underline" && orientation === "horizontal" && "border-b border-slate-600",
    variant === "underline" && orientation === "vertical" && "border-l border-slate-600",
    variant === "underline" && "bg-slate-800",
    variant === "pills" && "bg-slate-800 p-2 rounded-lg",
    variant === "buttons" && "bg-slate-800 p-2 rounded-lg",
    orientation === "horizontal" ? "flex flex-row" : "flex flex-col",
    variant === "pills" && orientation === "horizontal" && "gap-2",
    variant === "pills" && orientation === "vertical" && "gap-2",
    orientation === "horizontal" &&
      "overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800",
    className,
  )

  return (
    <div ref={tabsRef} role="tablist" aria-orientation={orientation} className={containerClassName}>
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={getTabClassName(tab, index)}
          >
            {tab.icon && (
              <span
                className={cn("flex-shrink-0", isActive && variant !== "pills" ? "text-teal-500" : "text-slate-400")}
              >
                {tab.icon}
              </span>
            )}
            <span className="whitespace-nowrap">{tab.label}</span>
            {tab.badge && (
              <span
                className={cn(
                  "ml-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                  isActive && variant === "pills" ? "bg-white/20 text-white" : "bg-red-500 text-white",
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
      {variant === "underline" && (
        <div
          className={cn(
            "absolute bg-teal-500 transition-all duration-300 ease-out",
            orientation === "horizontal" ? "bottom-0 h-[3px]" : "left-0 w-[3px]",
          )}
          style={indicatorStyle}
        />
      )}
    </div>
  )
}
