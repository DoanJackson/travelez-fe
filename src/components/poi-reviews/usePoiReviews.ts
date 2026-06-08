import { useState, useEffect, useCallback } from "react";
import { ApiReview } from "@/types/review";
import { getReviewsByPoiId } from "@/services/reviewService";

export type SortOption = "newest" | "oldest" | "highest" | "lowest";
export type FilterOption =
  | "all"
  | "5-stars"
  | "4-stars"
  | "3-stars"
  | "2-stars"
  | "1-star";

function getSortParams(sort: SortOption) {
  switch (sort) {
    case "oldest":
      return { sortField: "createdAt", sortDirection: "ASC" as const };
    case "highest":
      return { sortField: "rating", sortDirection: "DESC" as const };
    case "lowest":
      return { sortField: "rating", sortDirection: "ASC" as const };
    case "newest":
    default:
      return { sortField: "createdAt", sortDirection: "DESC" as const };
  }
}

function getRatingParam(filter: FilterOption): number | undefined {
  const map: Partial<Record<FilterOption, number>> = {
    "5-stars": 5,
    "4-stars": 4,
    "3-stars": 3,
    "2-stars": 2,
    "1-star": 1,
  };
  return map[filter];
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

const PAGE_SIZE = 8;

export function usePoiReviews(poiId?: string) {
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // ------ Fetch logic ------

  const fetchPage = useCallback(
    async (
      page: number,
      sort: SortOption,
      filter: FilterOption,
      append: boolean,
    ) => {
      if (!poiId) return;

      try {
        setIsLoading(true);

        const { sortField, sortDirection } = getSortParams(sort);
        const response = await getReviewsByPoiId(Number(poiId), {
          page,
          size: PAGE_SIZE,
          sortField,
          sortDirection,
          rating: getRatingParam(filter),
        });

        if (response.success) {
          const incoming = response.data.content;

          setReviews((prev) => {
            if (!append) return incoming;
            const seen = new Set<number>(prev.map((r) => r.id));
            return [...prev, ...incoming.filter((r) => !seen.has(r.id))];
          });

          setTotalPages(response.data.totalPages);
          setCurrentPage(page);
        }
      } catch {
        // Silently handle – keeps the same UX (reviews stay empty)
      } finally {
        setIsLoading(false);
      }
    },
    [poiId],
  );

  // Re-fetch from page 0 when poiId, sort, or filter changes
  useEffect(() => {
    fetchPage(0, sortBy, filterBy, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poiId, sortBy, filterBy]);

  // ------ Pagination ------

  const handleLoadMore = () => {
    if (currentPage < totalPages - 1 && !isLoading) {
      fetchPage(currentPage + 1, sortBy, filterBy, true);
    }
  };

  const refresh = useCallback(() => {
    fetchPage(0, sortBy, filterBy, false);
  }, [fetchPage, sortBy, filterBy]);

  const canLoadMore = currentPage < totalPages - 1 && !isLoading;

  return {
    sortBy,
    filterBy,
    visibleReviews: reviews,
    totalCount: reviews.length,
    canLoadMore,
    setSortBy,
    setFilterBy,
    handleLoadMore,
    refresh,
  };
}
