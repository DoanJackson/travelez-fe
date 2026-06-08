import { BASE_URL, API_ENDPOINTS } from "@/constants/api";
import { AuthCookies } from "@/lib/cookie";
import { handleUnauthorized } from "@/lib/auth-utils";
import type { ApiError, BaseResponse } from "@/types/api";
import type { ReviewData, ReviewRequest, ReviewResponse } from "@/types/review";

export interface GetReviewsParams {
  page?: number;
  size?: number;
  rating?: number;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
}

function authHeaders(): Record<string, string> {
  const token = AuthCookies.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getReviewsByPoiId(
  poiId: number,
  params?: GetReviewsParams,
): Promise<ReviewResponse> {
  const qs = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) qs.append(key, String(value));
    });
  }

  const url = `${BASE_URL}${API_ENDPOINTS.REVIEWS.GET_REVIEWS(poiId)}?${qs.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!response.ok) {
    handleUnauthorized(response.status);
    const result = await response.json().catch(() => null);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to fetch reviews.",
    } satisfies ApiError;
  }

  return response.json();
}

export async function createReview(
  poiId: number,
  payload: ReviewRequest,
): Promise<BaseResponse<ReviewData>> {
  const url = `${BASE_URL}${API_ENDPOINTS.REVIEWS.CREATE_REVIEW(poiId)}`;

  const formData = new FormData();
  formData.append("content", payload.content);
  formData.append("rating", String(payload.rating));
  payload.files.forEach((file) => formData.append("files", file));

  const response = await fetch(url, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to create review.",
    } satisfies ApiError;
  }

  return result as BaseResponse<ReviewData>;
}

export async function deleteReview(reviewId: number): Promise<void> {
  const url = `${BASE_URL}${API_ENDPOINTS.REVIEWS.DELETE_REVIEW(reviewId)}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    handleUnauthorized(response.status);
    const result = await response.json().catch(() => null);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to delete review.",
    } satisfies ApiError;
  }
}

export async function getReviewsByUserId(userId: number, params?: GetReviewsParams): Promise<ReviewResponse> {
  const qs = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) qs.append(key, String(value));
    });
  }

  const url = `${BASE_URL}${API_ENDPOINTS.REVIEWS.GET_REVIEW_BY_USER(userId)}?${qs.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!response.ok) {
    handleUnauthorized(response.status);
    const result = await response.json().catch(() => null);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to fetch reviews.",
    } satisfies ApiError;
  }

  return response.json();
}
