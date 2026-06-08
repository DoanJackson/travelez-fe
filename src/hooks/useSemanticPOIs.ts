import { useQuery } from "@tanstack/react-query";
import { semanticSearchPOIs } from "@/services/poiService";
import type { POIResponseData } from "@/types/poi";

export interface SemanticFilterConfig {
  query: string;
  poiType?: string;
}

export function useSemanticPOIs<T = POIResponseData[]>(
  placeId: number | undefined,
  filterConfig: SemanticFilterConfig,
  select?: (raw: POIResponseData[]) => T,
  limit = 9,
) {
  return useQuery<POIResponseData[], Error, T>({
    queryKey: [
      "semantic-pois",
      placeId,
      filterConfig.poiType ?? null,
      filterConfig.query,
    ],
    queryFn: () =>
      semanticSearchPOIs(
        filterConfig.query,
        placeId!,
        limit,
        filterConfig.poiType,
      ),
    enabled: !!placeId,
    staleTime: 5 * 60 * 1000,
    select,
  });
}
