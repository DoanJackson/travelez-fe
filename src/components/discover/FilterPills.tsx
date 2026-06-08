import { Button } from "@/components/ui/button"
import { FilterOption } from "@/types/discover"

interface FilterPillsProps {
  filters: FilterOption[]
  activeFilter: string
  onFilterChange: (filterId: string) => void
}

export function FilterPills({ filters, activeFilter, onFilterChange }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "default" : "secondary"}
          onClick={() => onFilterChange(filter.id)}
          className="rounded-full"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  )
}
