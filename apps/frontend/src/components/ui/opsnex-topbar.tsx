"use client"

import * as React from "react"
import { Search, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SearchResult {
  id: string
  type: "work-order" | "customer"
  title: string
  subtitle?: string
}

interface OpsNexTopBarProps {
  pageTitle: string
  subtitle?: string
  userName: string
  userAvatar?: string
  notifications?: number
  onSearch?: (query: string) => void
  onNotificationClick?: () => void
  onLogout?: () => void
}

export function OpsNexTopBar({
  pageTitle,
  subtitle,
  userName,
  userAvatar,
  notifications = 0,
  onSearch,
  onNotificationClick,
  onLogout,
}: OpsNexTopBarProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showSearchResults, setShowSearchResults] = React.useState(false)
  const [showMobileSearch, setShowMobileSearch] = React.useState(false)
  const searchRef = React.useRef<HTMLDivElement>(null)

  // Mock search results - in real app, this would come from API
  const searchResults: SearchResult[] = React.useMemo(() => {
    if (!searchQuery.trim()) return []

    return ([
      {
        id: "1",
        type: "work-order" as const,
        title: `Work Order #${searchQuery}`,
        subtitle: "HVAC Installation - 123 Main St",
      },
      {
        id: "2",
        type: "customer" as const,
        title: "John Smith",
        subtitle: "john.smith@example.com",
      },
      {
        id: "3",
        type: "work-order" as const,
        title: "Work Order #12345",
        subtitle: "AC Repair - 456 Oak Ave",
      },
    ] as SearchResult[]).filter(
      (result) =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowSearchResults(value.length > 0)
    onSearch?.(value)
  }

  // Close search results when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Get user initials for avatar fallback
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-slate-800 border-b border-slate-700">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left Section - Page Title */}
        <div className="flex flex-col min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-slate-100 truncate">{pageTitle}</h1>
          {subtitle && <p className="text-sm text-slate-400 truncate">{subtitle}</p>}
        </div>

        {/* Center Section - Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center px-8 max-w-2xl">
          <div ref={searchRef} className="relative w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search work orders, customers..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="h-10 w-full bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 pl-10 pr-4 focus-visible:border-teal-500 focus-visible:ring-teal-500/50"
              />
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-slate-700 border border-slate-600 rounded-md shadow-lg overflow-hidden z-50">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    className="w-full px-4 py-3 text-left hover:bg-slate-600 transition-colors border-b border-slate-600 last:border-b-0"
                    onClick={() => {
                      setShowSearchResults(false)
                      setSearchQuery("")
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "size-8 rounded-md flex items-center justify-center text-xs font-medium",
                          result.type === "work-order"
                            ? "bg-teal-500/20 text-teal-400"
                            : "bg-blue-500/20 text-blue-400",
                        )}
                      >
                        {result.type === "work-order" ? "WO" : "C"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-100 truncate">{result.title}</p>
                        {result.subtitle && <p className="text-xs text-slate-400 truncate">{result.subtitle}</p>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-400 hover:text-teal-500 hover:bg-slate-700"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search className="size-5" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-400 hover:text-teal-500 hover:bg-slate-700"
            onClick={onNotificationClick}
          >
            <Bell className="size-5" />
            {notifications > 0 && <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full" />}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-slate-100 hover:bg-slate-700 h-10 px-2 md:px-3"
              >
                <Avatar className="size-8">
                  <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
                  <AvatarFallback className="bg-teal-500/20 text-teal-400 text-xs">{userInitials}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium">{userName}</span>
                <ChevronDown className="size-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-700 border-slate-600 text-slate-100">
              <DropdownMenuItem className="hover:bg-slate-600 focus:bg-slate-600 cursor-pointer">
                <User className="mr-2 size-4 text-slate-400" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-600 focus:bg-slate-600 cursor-pointer">
                <Settings className="mr-2 size-4 text-slate-400" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-600" />
              <DropdownMenuItem
                className="hover:bg-slate-600 focus:bg-slate-600 cursor-pointer text-red-400"
                onClick={onLogout}
              >
                <LogOut className="mr-2 size-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="md:hidden px-4 pb-4 bg-slate-800 border-t border-slate-700">
          <div ref={searchRef} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search work orders, customers..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="h-10 w-full bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 pl-10 pr-4 focus-visible:border-teal-500 focus-visible:ring-teal-500/50"
              />
            </div>

            {/* Mobile Search Results */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-slate-700 border border-slate-600 rounded-md shadow-lg overflow-hidden z-50">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    className="w-full px-4 py-3 text-left hover:bg-slate-600 transition-colors border-b border-slate-600 last:border-b-0"
                    onClick={() => {
                      setShowSearchResults(false)
                      setSearchQuery("")
                      setShowMobileSearch(false)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "size-8 rounded-md flex items-center justify-center text-xs font-medium",
                          result.type === "work-order"
                            ? "bg-teal-500/20 text-teal-400"
                            : "bg-blue-500/20 text-blue-400",
                        )}
                      >
                        {result.type === "work-order" ? "WO" : "C"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-100 truncate">{result.title}</p>
                        {result.subtitle && <p className="text-xs text-slate-400 truncate">{result.subtitle}</p>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
