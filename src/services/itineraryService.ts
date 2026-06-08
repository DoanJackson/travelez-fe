import { BASE_URL, API_ENDPOINTS } from "@/constants/api";
import { AuthCookies } from "@/lib/cookie";
import { handleUnauthorized } from "@/lib/auth-utils";
import type {
  ItineraryCreationRequest,
  ItineraryApiResponse,
  ItinerariesApiResponse,
  SharedItinerariesApiResponse,
  SharedUsersPageResponse,
  SharedUsersSearchResponse,
  ItineraryGenerateResponse,
  ItinerarySaveRequest,
  ItineraryReplanRequest,
  ItineraryData,
  PublicItinerariesApiResponse,
} from "@/types/itinerary";
import type { BaseResponse, ApiError } from "@/types/api";

export async function generateItinerary(
  data: ItineraryCreationRequest,
): Promise<BaseResponse<ItineraryGenerateResponse>> {
  const token = AuthCookies.getToken();

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.ITINERARY.GENERATE}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(120_000),
    },
  );

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw new Error(
      `Failed to generate itinerary: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<BaseResponse<ItineraryGenerateResponse>>;
}

export async function getItineraryById(
  id: number,
): Promise<ItineraryApiResponse> {
  const token = AuthCookies.getToken();

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.ITINERARY.GET_DETAIL(id)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message:
        result?.message ??
        `Failed to fetch itinerary: ${response.status} ${response.statusText}`,
    } satisfies ApiError;
  }

  if (!result?.data) {
    throw {
      status: response.status,
      message: "Empty response from server",
    } satisfies ApiError;
  }

  return result as ItineraryApiResponse;
}

/**
 * Fetch the authenticated user's saved itineraries (paginated).
 *
 * Fixes applied vs. the original:
 *  1. Pagination params are in the URL query string — GET requests cannot have a body.
 *  2. Authorization: Bearer header attached from AuthCookies (no hardcoded cookie keys).
 *  3. Returns PaginatedData<ItinerarySummary>, not the full ItineraryData detail shape.
 */
export async function getMyItineraries(
  page = 0,
  size = 10,
): Promise<ItinerariesApiResponse> {
  const qs = new URLSearchParams({ page: String(page), size: String(size) });
  const token = AuthCookies.getToken();

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.ITINERARY.GET_MY_ITINERARIES}?${qs.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to load itineraries.",
    } satisfies ApiError;
  }

  return result as ItinerariesApiResponse;
}

export async function saveItinerary(
  data: ItinerarySaveRequest,
): Promise<BaseResponse<number>> {
  const token = AuthCookies.getToken();

  const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ITINERARY.SAVE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to save itinerary.",
    } satisfies ApiError;
  }

  return result as BaseResponse<number>;
}

export async function deleteItinerary(id: number): Promise<void> {
  const token = AuthCookies.getToken();

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.ITINERARY.DELETE_ITINERARY(id)}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message:
        result?.message ??
        `Failed to delete itinerary: ${response.status} ${response.statusText}`,
    } satisfies ApiError;
  }
}

export async function getTempItinerary(
  tempId: string,
): Promise<BaseResponse<ItineraryGenerateResponse>> {
  const token = AuthCookies.getToken();

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.ITINERARY.GET_TEMP(tempId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw new Error(
      `Failed to fetch temporary itinerary: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export async function addUserToSharedItinerary(
  itineraryId: number,
  username: string,
): Promise<void> {
  const token = AuthCookies.getToken();

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.ITINERARY_MANAGEMENT.SHARE_ITINERARY_TO_USER(itineraryId)}?username=${encodeURIComponent(username)}`,
    {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to share itinerary.",
    } satisfies ApiError;
  }
}

export async function removeUserFromSharedItinerary(
  itineraryId: number,
  userName: string,
): Promise<void> {
  const token = AuthCookies.getToken();

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.ITINERARY_MANAGEMENT.DELETE_SHARED_ITINERARY(itineraryId, userName)}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message:
        result?.message ?? "Failed to remove shared user from itinerary.",
    } satisfies ApiError;
  }
}

export async function replanItinerary(
  data: ItineraryReplanRequest,
): Promise<BaseResponse<ItineraryData>> {
  const token = AuthCookies.getToken();

  const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ITINERARY.REPLAN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(120_000),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Replan failed.",
    } satisfies ApiError;
  }

  return result as BaseResponse<ItineraryData>;
}

export async function getSharedItineraries(
  page = 0,
  size = 10,
): Promise<SharedItinerariesApiResponse> {
  const qs = new URLSearchParams({ page: String(page), size: String(size) });
  const token = AuthCookies.getToken();

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.ITINERARY_MANAGEMENT.GET_SHARED_ITINERARY()}?${qs}`,
    {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to fetch shared itineraries.",
    } satisfies ApiError;
  }

  return result as SharedItinerariesApiResponse;
}

export async function getSharedUsers(
  itineraryId: number,
  page = 0,
  size = 10,
): Promise<SharedUsersPageResponse> {
  const qs = new URLSearchParams({ page: String(page), size: String(size) });
  const token = AuthCookies.getToken();

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.ITINERARY_MANAGEMENT.GET_SHARED_USERS(itineraryId)}?${qs}`,
    {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to fetch collaborators.",
    } satisfies ApiError;
  }

  return result as SharedUsersPageResponse;
}

export async function toggleItineraryVisibility(
  id: number,
  isPublic: boolean,
): Promise<void> {
  const qs = new URLSearchParams({ isPublic: String(isPublic) });
  const token = AuthCookies.getToken();

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.ITINERARY_MANAGEMENT.TOGGLE_VISIBILITY(id)}?${qs}`,
    {
      method: "PATCH",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to update visibility.",
    } satisfies ApiError;
  }
}

export async function getPublicItineraries(
  page = 0,
  size = 10,
): Promise<PublicItinerariesApiResponse> {
  const token = AuthCookies.getToken();

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.ITINERARY_MANAGEMENT.GET_PUBLIC_ITINERARIES(page, size)}`,
    {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to fetch public itineraries.",
    } satisfies ApiError;
  }

  return result as PublicItinerariesApiResponse;
}

export async function getUserPublicItineraries(
  userId: number,
  page = 0,
  size = 9,
): Promise<PublicItinerariesApiResponse> {
  const token = AuthCookies.getToken();
  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.ITINERARY_MANAGEMENT.GET_USER_PUBLIC_ITINERARIES(userId, page, size)}`,
    {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to fetch user itineraries.",
    } satisfies ApiError;
  }
  return result as PublicItinerariesApiResponse;
}

export async function searchPublicItineraries(
  prompt: string,
  page = 0,
  size = 9,
): Promise<PublicItinerariesApiResponse> {
  const token = AuthCookies.getToken();

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.ITINERARY_MANAGEMENT.SEARCH_PUBLIC_ITINERARIES(prompt, page, size)}`,
    {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Search failed.",
    } satisfies ApiError;
  }

  return result as PublicItinerariesApiResponse;
}

export async function exportCalendar(
  itineraryId: number,
): Promise<{ oauthUrl?: string }> {
  const token = AuthCookies.getToken();

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.ITINERARY_MANAGEMENT.EXPORT_CALENDAR(itineraryId)}`,
    {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );
  const result = await response.json().catch(() => null);

  if (response.status === 403) {
    return { oauthUrl: result?.data as string };
  }
  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to export calendar.",
    } satisfies ApiError;
  }
  return {};
}

export async function searchSharedUsers(
  itineraryId: number,
  keyword: string,
): Promise<SharedUsersSearchResponse> {
  const qs = new URLSearchParams({ keyword });
  const token = AuthCookies.getToken();

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.ITINERARY_MANAGEMENT.SEARCH_SHARED_USERS(itineraryId)}?${qs}`,
    {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to search collaborators.",
    } satisfies ApiError;
  }

  return result as SharedUsersSearchResponse;
}
