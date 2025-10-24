import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  // On mobile, show only last 2 items
  const mobileItems = items.slice(-2)

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm", className)}>
      {/* Desktop breadcrumbs - show all items */}
      <ol className="hidden md:flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center gap-2">
              {!isLast && item.href ? (
                <Link to={item.href} className="text-slate-400 hover:text-teal-500 hover:underline transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn("text-slate-100 font-semibold", !isLast && "text-slate-400")}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-4 w-4 text-slate-500" aria-hidden="true" />}
            </li>
          )
        })}
      </ol>

      {/* Mobile breadcrumbs - show only last 2 items */}
      <ol className="flex md:hidden items-center gap-2">
        {mobileItems.map((item, index) => {
          const isLast = index === mobileItems.length - 1
          const actualIndex = items.length - mobileItems.length + index

          return (
            <li key={actualIndex} className="flex items-center gap-2">
              {!isLast && item.href ? (
                <Link to={item.href} className="text-slate-400 hover:text-teal-500 hover:underline transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn("text-slate-100 font-semibold", !isLast && "text-slate-400")}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-4 w-4 text-slate-500" aria-hidden="true" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
