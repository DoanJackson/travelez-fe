"use client";

import { useQuery } from "@tanstack/react-query";
import { getPOIList, semanticSearchPOIs } from "@/services/poiService";
import type { POIResponseData } from "@/types/poi";

const PAGE_SIZE = 30;

export interface SearchParams {
  q: string;
  placeId: number;
  poiType: string;
  semanticQuery?: string;
}

export function useSearchResults({ q, placeId, poiType, semanticQuery }: SearchParams) {
  const { data, isLoading, isFetching } = useQuery<POIResponseData[]>({
    queryKey: ["search", placeId, poiType, semanticQuery ?? q],
    queryFn: async () => {
      const normalizedType = poiType !== "ALL" ? poiType : undefined;

      if (semanticQuery) {
        return semanticSearchPOIs(semanticQuery, placeId || undefined, PAGE_SIZE, normalizedType);
      }

      if (q.trim()) {
        return semanticSearchPOIs(q.trim(), placeId, PAGE_SIZE, normalizedType);
      }

      const res = await getPOIList({
        placeId,
        poiType: normalizedType,
        page: 0,
        size: PAGE_SIZE,
        sortField: "rating",
        sortDirection: "DESC",
      });
      return res.data.content as POIResponseData[];
    },
    enabled: !!placeId || !!semanticQuery,
    staleTime: 2 * 60 * 1000,
  });

  const results = data ?? [];

  return {
    results,
    totalElements: results.length,
    isLoading,
    isFetching,
  } as const;
}
