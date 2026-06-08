// src/types/api.ts

/**
 * Universal backend response envelope.
 * Matches: { code, message, data: T, success }
 *
 * Usage:
 *   BaseResponse<null>        → register (no data)
 *   BaseResponse<LoginData>   → login
 *   BaseResponse<Itinerary>   → itinerary endpoints
 */
export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

/**
 * Normalised error shape thrown by all AuthService / service methods.
 * Matches the `throw { status, message }` pattern in service layer.
 */
export interface ApiError {
  status: number;
  message: string;
}

/**
 * Generic paginated response wrapper.
 * Matches the lean backend Page<T> envelope:
 * { content, totalPages, totalElements, size, page, empty }
 *
 * Usage:
 *   PaginatedData<ItinerarySummary> → GET /api/itineraries
 */
export interface PaginatedData<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  page: number; // 0-indexed
  empty: boolean;
}
