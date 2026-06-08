"use client"

import { format, parseISO } from "date-fns"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { usePagination } from "@/hooks/usePagination"
import type { ModerationReport, ViolationCategory } from "@/types/admin"
import { CategoryBadge } from "./CategoryBadge"

const PAGE_SIZE = 10

type CategoryFilter = ViolationCategory | "ALL"

interface ModerationTableProps {
  reports: ModerationReport[]
  total: number
  search: string
  category: CategoryFilter
  onSearchChange: (value: string) => void
  onCategoryChange: (value: CategoryFilter) => void
  onReview: (id: string) => void
}

export function ModerationTable({
  reports,
  total,
  search,
  category,
  onSearchChange,
  onCategoryChange,
  onReview,
}: ModerationTableProps) {
  const { page, totalPages, pageItems, setPage } = usePagination(total, PAGE_SIZE)

  return (
    <div className="mt-4 space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search by report ID or author…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="sm:w-72"
        />
        {/* <Select
          value={category}
          onValueChange={(v) => onCategoryChange(v as CategoryFilter)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value="spam">Spam</SelectItem>
            <SelectItem value="fraud">Fraud</SelectItem>
            <SelectItem value="hate_speech">Hate Speech</SelectItem>
            <SelectItem value="inappropriate">Inappropriate</SelectItem>
            <SelectItem value="misinformation">Misinformation</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[120px] text-center">Report ID</TableHead>
              <TableHead className="w-[180px] text-center">Date</TableHead>
              <TableHead className="text-center">Author</TableHead>
              <TableHead className="w-[120px] text-center">Reports</TableHead>
              <TableHead className="w-[120px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-sm text-slate-400"
                >
                  No reports found.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="text-center font-mono text-sm text-slate-700">
                    #{report.id}
                  </TableCell>
                  <TableCell className="text-center text-sm text-slate-500 tabular-nums">
                    {format(parseISO(report.date), "MMM d, HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarImage
                          src={report.author.avatarUrl}
                          alt={report.author.name}
                        />
                        <AvatarFallback className="text-[10px]">
                          {report.author.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-slate-800">
                        {report.author.name}
                      </span>
                    </div>
                  </TableCell>
                  {/* <TableCell>
                    <CategoryBadge category={report.category} />
                  </TableCell> */}
                  <TableCell className="text-center text-sm font-medium text-slate-700">
                    {report.reportCount}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onReview(report.id)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="border-t border-slate-100 px-6 py-3">
            <Pagination className="w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(page - 1)}
                    className={cn(
                      "cursor-pointer",
                      page === 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>

                {pageItems.map((item, index) => (
                  <PaginationItem key={index}>
                    {item === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => setPage(item)}
                        isActive={item === page}
                        className="cursor-pointer"
                      >
                        {item}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(page + 1)}
                    className={cn(
                      "cursor-pointer",
                      page === totalPages && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
