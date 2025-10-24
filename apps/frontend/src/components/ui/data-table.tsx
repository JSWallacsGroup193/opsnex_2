import * as React from "react"
import { ChevronUpIcon, ChevronDownIcon, MoreVerticalIcon, EyeIcon, EditIcon, TrashIcon, InboxIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export interface DataTableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: "left" | "center" | "right"
}

export interface DataTableProps {
  columns: DataTableColumn[]
  data: Array<Record<string, any>>
  onRowClick?: (row: Record<string, any>) => void
  onSort?: (column: string, direction: "asc" | "desc") => void
  selectable?: boolean
  loading?: boolean
  emptyMessage?: string
  pagination?: {
    currentPage: number
    totalPages: number
    pageSize: number
    totalItems: number
    onPageChange: (page: number) => void
  }
  actions?: {
    onView?: (row: Record<string, any>) => void
    onEdit?: (row: Record<string, any>) => void
    onDelete?: (row: Record<string, any>) => void
  }
  className?: string
}

export const DataTable = ({
  columns,
  data,
  onRowClick,
  onSort,
  selectable = false,
  loading = false,
  emptyMessage = "No data available",
  pagination,
  actions,
  className,
}: DataTableProps) => {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc")
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set())
  const [focusedCell, setFocusedCell] = React.useState<{ row: number; col: number } | null>(null)

  const tableRef = React.useRef<HTMLTableElement>(null)

  const handleSort = (column: DataTableColumn) => {
    if (!column.sortable) return

    const newDirection = sortColumn === column.key && sortDirection === "asc" ? "desc" : "asc"
    setSortColumn(column.key)
    setSortDirection(newDirection)
    onSort?.(column.key, newDirection)
  }

  const handleRowSelect = (index: number) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedRows(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(data.map((_, i) => i)))
    }
  }

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedCell) return

      const { row, col } = focusedCell
      const maxRow = data.length - 1
      const maxCol = columns.length - 1

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          if (row > 0) setFocusedCell({ row: row - 1, col })
          break
        case "ArrowDown":
          e.preventDefault()
          if (row < maxRow) setFocusedCell({ row: row + 1, col })
          break
        case "ArrowLeft":
          e.preventDefault()
          if (col > 0) setFocusedCell({ row, col: col - 1 })
          break
        case "ArrowRight":
          e.preventDefault()
          if (col < maxCol) setFocusedCell({ row, col: col + 1 })
          break
        case "Enter":
          e.preventDefault()
          if (onRowClick) onRowClick(data[row])
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [focusedCell, data, columns.length, onRowClick])

  if (loading) {
    return (
      <div className={cn("w-full", className)}>
        <div className="overflow-x-auto rounded-lg border border-slate-600">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                {selectable && (
                  <th className="w-12 p-4">
                    <Skeleton className="h-4 w-4 bg-slate-700" />
                  </th>
                )}
                {columns.map((column) => (
                  <th key={column.key} className="p-4 text-left" style={{ width: column.width }}>
                    <Skeleton className="h-4 w-24 bg-slate-700" />
                  </th>
                ))}
                {actions && (
                  <th className="w-20 p-4">
                    <Skeleton className="h-4 w-8 bg-slate-700" />
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-slate-700">
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-t border-slate-600">
                  {selectable && (
                    <td className="p-4">
                      <Skeleton className="h-4 w-4 bg-slate-600" />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="p-4">
                      <Skeleton className="h-4 w-32 bg-slate-600" />
                    </td>
                  ))}
                  {actions && (
                    <td className="p-4">
                      <Skeleton className="h-4 w-8 bg-slate-600" />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        <div className="overflow-x-auto rounded-lg border border-slate-600 bg-slate-700">
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <InboxIcon className="h-12 w-12 text-teal-500 mb-4" />
            <p className="text-slate-400 text-base">{emptyMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="overflow-x-auto rounded-lg border border-slate-600">
        <table ref={tableRef} className="w-full">
          <thead className="bg-slate-800">
            <tr>
              {selectable && (
                <th className="w-12 p-4">
                  <Checkbox
                    checked={selectedRows.size === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "p-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400",
                    column.sortable && "cursor-pointer select-none hover:text-teal-500 transition-colors",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUpIcon
                          className={cn(
                            "h-3 w-3 -mb-1",
                            sortColumn === column.key && sortDirection === "asc" ? "text-teal-500" : "text-slate-400",
                          )}
                        />
                        <ChevronDownIcon
                          className={cn(
                            "h-3 w-3",
                            sortColumn === column.key && sortDirection === "desc" ? "text-teal-500" : "text-slate-400",
                          )}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="w-20 p-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-slate-700">
            {data.map((row, rowIndex) => {
              const isSelected = selectedRows.has(rowIndex)
              const isClickable = !!onRowClick

              return (
                <tr
                  key={rowIndex}
                  className={cn(
                    "border-t border-slate-600 transition-colors",
                    "hover:bg-slate-600",
                    isClickable && "cursor-pointer",
                    isSelected && "border-l-4 border-l-teal-500",
                  )}
                  onClick={() => {
                    if (isClickable && !selectable) {
                      onRowClick(row)
                    }
                  }}
                >
                  {selectable && (
                    <td className="p-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleRowSelect(rowIndex)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select row ${rowIndex + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((column, colIndex) => (
                    <td
                      key={column.key}
                      className={cn(
                        "p-4 text-slate-100 text-sm",
                        focusedCell?.row === rowIndex && focusedCell?.col === colIndex && "ring-2 ring-teal-500",
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                      )}
                      tabIndex={0}
                      onFocus={() => setFocusedCell({ row: rowIndex, col: colIndex })}
                    >
                      {row[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-100">
                            <MoreVerticalIcon className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-800 border-slate-600">
                          {actions.onView && (
                            <DropdownMenuItem
                              onClick={() => actions.onView?.(row)}
                              className="text-slate-100 hover:bg-slate-700 hover:text-teal-500 cursor-pointer"
                            >
                              <EyeIcon className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                          )}
                          {actions.onEdit && (
                            <DropdownMenuItem
                              onClick={() => actions.onEdit?.(row)}
                              className="text-slate-100 hover:bg-slate-700 hover:text-teal-500 cursor-pointer"
                            >
                              <EditIcon className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {actions.onDelete && (
                            <DropdownMenuItem
                              onClick={() => actions.onDelete?.(row)}
                              className="text-slate-100 hover:bg-slate-700 hover:text-red-500 cursor-pointer"
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-slate-400">
            Showing {(pagination.currentPage - 1) * pagination.pageSize + 1}-
            {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (pagination.currentPage > 1) {
                      pagination.onPageChange(pagination.currentPage - 1)
                    }
                  }}
                  className={cn(
                    "bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600 hover:text-teal-500",
                    pagination.currentPage === 1 && "opacity-50 cursor-not-allowed",
                  )}
                />
              </PaginationItem>

              {[...Array(pagination.totalPages)].map((_, i) => {
                const pageNumber = i + 1
                const showPage =
                  pageNumber === 1 ||
                  pageNumber === pagination.totalPages ||
                  (pageNumber >= pagination.currentPage - 1 && pageNumber <= pagination.currentPage + 1)

                if (!showPage) {
                  if (pageNumber === pagination.currentPage - 2 || pageNumber === pagination.currentPage + 2) {
                    return (
                      <PaginationItem key={i}>
                        <PaginationEllipsis className="text-slate-400" />
                      </PaginationItem>
                    )
                  }
                  return null
                }

                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => pagination.onPageChange(pageNumber)}
                      isActive={pagination.currentPage === pageNumber}
                      className={cn(
                        "bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600 hover:text-teal-500",
                        pagination.currentPage === pageNumber && "bg-teal-500 text-white hover:bg-teal-600",
                      )}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (pagination.currentPage < pagination.totalPages) {
                      pagination.onPageChange(pagination.currentPage + 1)
                    }
                  }}
                  className={cn(
                    "bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600 hover:text-teal-500",
                    pagination.currentPage === pagination.totalPages && "opacity-50 cursor-not-allowed",
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
