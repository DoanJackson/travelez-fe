import { API_ENDPOINTS, BASE_URL } from "@/constants/api";
import { ApiError } from "@/types/auth";
import {
  POIDetailResponseData,
  POIResponse,
  POIResponseData,
} from "@/types/poi";

interface GetPOIListParams {
  name?: string;
  placeId?: number;
  wardId?: number;
  poiType?: string;
  placeStatus?: string;
  rating?: number;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  page?: number;
  size?: number;
}

export async function getPOIList(
  params: GetPOIListParams = {},
): Promise<POIResponse> {
  const {
    name,
    placeId,
    wardId,
    poiType,
    placeStatus,
    rating,
    sortField,
    sortDirection,
    page = 0,
    size = 10,
  } = params;

  const qs = new URLSearchParams();
  if (name !== undefined) qs.set("name", name);
  if (placeId !== undefined) qs.set("placeId", String(placeId));
  if (wardId !== undefined) qs.set("wardId", String(wardId));
  if (poiType !== undefined) qs.set("poiType", poiType);
  if (placeStatus !== undefined) qs.set("placeStatus", placeStatus);
  if (rating !== undefined) qs.set("rating", String(rating));
  if (sortField !== undefined) qs.set("sortField", sortField);
  if (sortDirection !== undefined) qs.set("sortDirection", sortDirection);
  qs.set("page", String(page));
  qs.set("size", String(size));

  const url = `${BASE_URL}${API_ENDPOINTS.POIS.GET_POI_LIST}?${qs.toString()}`;

  const response = await fetch(url, { method: "GET" });
  const data = await response.json();
  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || "Failed to fetch POI list",
    } satisfies ApiError;
  }
  return data as POIResponse;
}

export async function fetchPOIsByTypes(
  poiTypes: readonly string[],
  placeId: number,
  size = 5,
): Promise<POIResponseData[]> {
  const results = await Promise.all(
    poiTypes.map((poiType) =>
      getPOIList({ placeId, poiType, size })
        .then((res) => res.data.content as POIResponseData[])
        .catch(() => [] as POIResponseData[]),
    ),
  );
  return results.flat();
}

export async function getPOIDetails(
  poiId: number,
): Promise<POIDetailResponseData> {
  const url = `${BASE_URL}${API_ENDPOINTS.POIS.GET_POI_DETAIL(poiId)}`;

  const response = await fetch(url, { method: "GET" });
  const data = await response.json();
  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || "Failed to fetch POI details",
    } satisfies ApiError;
  }
  return data.data as POIDetailResponseData;
}

export async function semanticSearchPOIs(
  query: string,
  placeId?: number,
  limit = 9,
  poiType?: string,
): Promise<POIResponseData[]> {
  const qs = new URLSearchParams();
  qs.set("query", query);
  if (placeId !== undefined && placeId !== null) qs.set("placeId", String(placeId));
  qs.set("limit", String(limit));
  if (poiType) qs.set("poiType", poiType);

  const url = `${BASE_URL}${API_ENDPOINTS.POIS.SEMANTIC_SEARCH_POIS}?${qs.toString()}`;
  const response = await fetch(url, { method: "GET" });
  const data = await response.json();
  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || "Failed to fetch semantic search results",
    } satisfies ApiError;
  }
  return data.data as POIResponseData[];
}
