import { BASE_URL, API_ENDPOINTS } from "@/constants/api";
import { AuthCookies } from "@/lib/cookie";
import { handleUnauthorized } from "@/lib/auth-utils";
import type { BaseResponse, PaginatedData } from "@/types/api";
import type {
  EnhancementHistoryDetail,
  EnhancementHistorySummary,
} from "@/types/provider";


function authHeaders(): Record<string, string> {
  const token = AuthCookies.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * POST /api/itinerary-enhancement/improve
 * Sends an itinerary file + prompt as multipart/form-data.
 * Do NOT set Content-Type manually — fetch sets the boundary automatically.
 */
export async function improveItinerary(
  file: File,
  providerPrompt: string,
): Promise<BaseResponse<number>> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("providerPrompt", providerPrompt); // exact Swagger field name

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.PROVIDER_ITINERARY.IMPROVE}`,
    {
      method: "POST",
      headers: authHeaders(),
      body: formData,
    },
  );

  handleUnauthorized(response.status);

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw { status: response.status, message: err?.message ?? "Itinerary analysis failed." };
  }

  return response.json();
}

/**
 * GET /api/itinerary-enhancement/histories
 */
export async function getEnhancementHistories(
  page = 0,
  size = 10,
): Promise<BaseResponse<PaginatedData<EnhancementHistorySummary>>> {
  const qs = new URLSearchParams({ page: String(page), size: String(size) });
  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.PROVIDER_ITINERARY.GET_HISTORIES}?${qs}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json", ...authHeaders() },
    },
  );

  handleUnauthorized(response.status);

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw { status: response.status, message: err?.message ?? "Failed to load histories." };
  }

  return response.json();
}

/**
 * GET /api/itinerary-enhancement/histories/{id}
 */
export async function getEnhancementHistoryDetail(
  id: number,
): Promise<BaseResponse<EnhancementHistoryDetail>> {
  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.PROVIDER_ITINERARY.GET_HISTORY_DETAIL(id)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json", ...authHeaders() },
    },
  );

  handleUnauthorized(response.status);

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw { status: response.status, message: err?.message ?? "Failed to load history detail." };
  }

  return response.json();
}

/**
 * DELETE /api/itinerary-enhancement/histories/{id}
 */
export async function deleteEnhancementHistory(id: number): Promise<void> {
  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.PROVIDER_ITINERARY.DELETE_HISTORY(id)}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );

  handleUnauthorized(response.status);

  if (!response.ok) {
    throw { status: response.status, message: "Failed to delete history." };
  }
}
