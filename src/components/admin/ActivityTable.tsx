"use client"

import { useMemo, useState } from "react"
import { ArrowDown, ArrowUp, Cpu, FileText, UserCheck } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Activity, ActivityCategory, ActivityStatus } from "@/types/admin"

const PAGE_SIZE = 10

interface ActivityTableProps {
  activities: Activity[]
}

interface PaginationState {
  currentPage: number
  totalPages: number
}

type PageItem = number | "ellipsis"

const CATEGORY_ICONS: Record<
  ActivityCategory,
  React.ComponentType<{ className?: string }>
> = {
  CONTENT: FileText,
  USER: UserCheck,
  SYSTEM: Cpu,
}

const CATEGORY_COLORS: Record<ActivityCategory, string> = {
  CONTENT: "text-violet-600",
  USER: "text-sky-600",
  SYSTEM: "text-amber-600",
}

interface StatusBadgeConfig {
  variant: "success" | "warning" | "destructive" | "location"
  label: string
}

const STATUS_BADGE_MAP: Record<ActivityStatus, StatusBadgeConfig> = {
  action_taken: { variant: "success", label: "Action Taken" },
  pending_review: { variant: "warning", label: "Pending Review" },
  auto_flagged: { variant: "destructive", label: "Auto-Flagged" },
  master_update: { variant: "location", label: "Master Update" },
}

type FilterValue = ActivityCategory | "ALL"

/**
 * Builds a compact page list with ellipsis for gaps larger than 1.
 * A gap of exactly 1 inserts the missing page directly (no ellipsis needed).
 * Always includes page 1, the last page, and the current page ±1.
 */
function buildPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pageSet = new Set<number>([1, totalPages])
  for (let p = Math.max(1, currentPage - 1); p <= Math.min(totalPages, currentPage + 1); p++) {
    pageSet.add(p)
  }

  const sorted = [...pageSet].sort((a, b) => a - b)
  const result: PageItem[] = []
  let prev = 0

  for (const page of sorted) {
    const gap = page - prev
    if (gap > 2) {
      result.push("ellipsis")
    } else if (gap === 2) {
      result.push(prev + 1)
    }
    result.push(page)
    prev = page
  }

  return result
}

export function ActivityTable({
  activities
}: ActivityTableProps) {
  const [categoryFilter, setCategoryFilter] = useState<FilterValue>("ALL")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = useMemo(() => {
    const base =
      categoryFilter === "ALL"
        ? activities
        : activities.filter((a) => a.category === categoryFilter)

    return [...base].sort((a, b) => {
      const aTime = a.time || a.timestamp || "" 
      const bTime = b.time || b.timestamp || ""
      
      return sortOrder === "desc"
        ? bTime.localeCompare(aTime)
        : aTime.localeCompare(bTime)
    })
  }, [activities, categoryFilter, sortOrder])

  const pagination: PaginationState = useMemo(
    () => ({
      currentPage,
      totalPages: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    }),
    [filtered.length, currentPage]
  )

  const visibleRows = useMemo(() => {
    const start = (pagination.currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, pagination.currentPage])

  const pageItems = useMemo(
    () => buildPageItems(pagination.currentPage, pagination.totalPages),
    [pagination.currentPage, pagination.totalPages]
  )

  function handleFilterChange(value: FilterValue) {
    setCategoryFilter(value)
    setCurrentPage(1)
  }

  function handleSortToggle() {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
    setCurrentPage(1)
  }

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "N/A"
    try {
      const d = new Date(timeStr)
      return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    } catch (e) {
      return timeStr
    }
  }


  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
        <div className="flex items-center gap-3">
          <Select
            value={categoryFilter}
            onValueChange={(v) => handleFilterChange(v as FilterValue)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              <SelectItem value="CONTENT">Content</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="SYSTEM">System</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSortToggle}
            title={sortOrder === "desc" ? "Newest first" : "Oldest first"}
          >
            {sortOrder === "desc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[120px] pl-6">Time</TableHead>
              <TableHead className="w-[140px]">Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[160px]">Status</TableHead>
              {/* <TableHead className="w-[120px] pr-6 text-right">Action</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-sm text-slate-400"
                >
                  No activity found for this category.
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((activity, index) => {
                const Icon = CATEGORY_ICONS[activity.category]
                const badge = STATUS_BADGE_MAP[activity.status as ActivityStatus] || { 
                  variant: "outline",
                  label: activity.status || "Unknown" 
                }

                const safeKey = activity.id || `${activity.time || activity.timestamp}-${index}`;

                return (
                  <TableRow key={safeKey}>
                    <TableCell className="pl-6 text-sm text-slate-400 tabular-nums">
                      {formatTime(activity.time || activity.timestamp)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "flex items-center gap-1.5 text-sm font-medium",
                          CATEGORY_COLORS[activity.category]
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        {activity.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm leading-relaxed text-slate-700">
                      {activity.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination footer */}
        <div className="flex items-center border-t border-slate-100 px-6 py-3">
          {/* <p className="text-xs text-slate-400">
            {filtered.length === 0
              ? "0 records"
              : `${(pagination.currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                  pagination.currentPage * PAGE_SIZE,
                  filtered.length
                )} of ${filtered.length} records`}
          </p> */}

          <Pagination className="w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className={cn(
                    "cursor-pointer",
                    pagination.currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>

              {pageItems.map((item, index) => (
                <PaginationItem key={index}>
                  {item === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => setCurrentPage(item)}
                      isActive={item === pagination.currentPage}
                      className="cursor-pointer"
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className={cn(
                    "cursor-pointer",
                    pagination.currentPage === pagination.totalPages &&
                      "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
