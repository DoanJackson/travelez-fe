import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption, FilterOption } from "./usePoiReviews";

interface ReviewsToolbarProps {
  sortBy: SortOption;
  filterBy: FilterOption;
  onSortChange: (value: SortOption) => void;
  onFilterChange: (value: FilterOption) => void;
}

const FILTER_OPTIONS = [
  { id: "all",     label: "All" },
  { id: "5-stars", label: "5 stars" },
  { id: "4-stars", label: "4 stars" },
  { id: "3-stars", label: "3 stars" },
  { id: "2-stars", label: "2 stars" },
  { id: "1-star",  label: "1 star" },
] as const;

export function ReviewsToolbar({
  sortBy,
  filterBy,
  onSortChange,
  onFilterChange,
}: ReviewsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="highest">Highest Rated</SelectItem>
            <SelectItem value="lowest">Lowest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id as FilterOption)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterBy === filter.id
                ? "bg-pink-600 text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
