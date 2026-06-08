"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface FiltersBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  durationFilter: string | null
  onDurationFilterChange: (duration: string | null) => void
}

export function FiltersBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  durationFilter,
  onDurationFilterChange,
}: FiltersBarProps) {
  const durationFilters = [
    { label: "Short (1–3 days)", value: "short" },
    { label: "Medium (4–7 days)", value: "medium" },
    { label: "Long (7+ days)", value: "long" },
  ]

  return (
    <div className="mb-8 space-y-4">
      {/* Search and Sort row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search trips…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>

        {/* Sort dropdown */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white border-gray-200">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently created</SelectItem>
            <SelectItem value="duration">Trip length</SelectItem>
            <SelectItem value="alphabetical">A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Duration filter chips */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 font-medium py-1.5">
          Duration:
        </span>
        {durationFilters.map((filter) => (
          <Badge
            key={filter.value}
            variant={durationFilter === filter.value ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() =>
              onDurationFilterChange(
                durationFilter === filter.value ? null : filter.value
              )
            }
          >
            {filter.label}
          </Badge>
        ))}
        {durationFilter && (
          <Badge
            variant="secondary"
            className="cursor-pointer"
            onClick={() => onDurationFilterChange(null)}
          >
            Clear filter
          </Badge>
        )}
      </div>
    </div>
  )
}
