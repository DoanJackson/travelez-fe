import { API_ENDPOINTS, BASE_URL } from "@/constants/api";
import { ApiError } from "@/types/auth";
import { PlaceResponse, PlaceResponseData } from "@/types/place";

export async function searchPlaces(
  name: string,
  country: string,
  countryCode: string,
  sortField: string,
  sortDirection: "ASC" | "DESC",
  page: number = 0,
  size: number = 10,
): Promise<PlaceResponse> {
  const qs = new URLSearchParams({
    name,
    country,
    countryCode,
    sortField,
    sortDirection,
    page: String(page),
    size: String(size),
  });

  const url = `${BASE_URL}${API_ENDPOINTS.PLACES.FIND_PLACES}?${qs.toString()}`;

  const response = await fetch(url, { method: "GET" });
  const data = await response.json();
  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || "Failed to search places",
    } satisfies ApiError;
  }
  return data as PlaceResponse;
}

export async function getAllPlaces(
  countryCode = "VN",
  size = 200,
): Promise<PlaceResponseData[]> {
  const qs = new URLSearchParams({
    country: "Vietnam",
    countryCode,
    sortField: "name",
    sortDirection: "ASC",
    page: "0",
    size: size.toString(),
  });

  const url = `${BASE_URL}${API_ENDPOINTS.PLACES.FIND_PLACES}?${qs.toString()}`;

  const response = await fetch(url, { method: "GET" });
  const data = await response.json();
  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || "Failed to fetch places",
    } satisfies ApiError;
  }
  return (data as PlaceResponse).data.content;
}
