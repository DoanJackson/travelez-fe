// src/services/auth.service.ts
import { BASE_URL, API_ENDPOINTS } from "@/constants/api";
import type {
  RegisterRequest,
  RegisterApiResponse,
  LoginRequest,
  LoginApiResponse,
  LoginApiResponse as GoogleLoginApiResponse,
} from "@/types/auth";
import type { ApiError } from "@/types/api";

export const AuthService = {
  // 1. Tạo URL để chuyển hướng sang Google
  getGoogleAuthUrl: () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI as string,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      access_type: "offline", // Để lấy Refresh Token
      response_type: "code",
      prompt: "select_account",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/calendar", // Quyền Calendar
      ].join(" "),
    };
    return `${rootUrl}?${new URLSearchParams(options).toString()}`;
  },

  // 2. Gọi Backend để đổi Code lấy JWT
  loginWithGoogle: async (code: string): Promise<GoogleLoginApiResponse> => {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.SSO.GOOGLE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw {
        status: response.status,
        message: result?.message ?? "Google Login Failed",
      };
    }

    return result as GoogleLoginApiResponse; // Trả về { data: { token, userId, role, ... } }
  },

  /**
   * Register a new user account.
   * Maps FE 'email' → BE 'username'.
   * Fields fullName, gender, dob are nullable per backend contract.
   */
  register: async (payload: RegisterRequest): Promise<RegisterApiResponse> => {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.SSO.REGISTER}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000), // 15 s timeout
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw {
        status: response.status,
        message: result?.message || "An unexpected error occurred.",
        errors: result?.errors,
        code: result?.code,
      };
    }

    return result as RegisterApiResponse;
  },

  /**
   * Authenticate with email + password.
   * Maps FE 'email' → BE 'username'.
   *
   * Error handling strategy (backend returns HTTP 500 for client errors):
   *  - Always attempt JSON.parse regardless of response.ok
   *  - Layer 1: structured body `message` field (e.g. "invalid credentials")
   *  - Layer 2: generic fallback string for empty-body 500s
   *  - Layer 3: component catch block pattern-matches on the message string for UI copy
   */
  login: async (payload: LoginRequest): Promise<LoginApiResponse> => {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.SSO.LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000), // 15 s timeout
    });

    // Always attempt to parse — the backend may return a useful message body
    // even on 500, so we never skip this step based on response.ok
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw {
        status: response.status,
        // Layer 1: backend JSON body message; Layer 2: generic fallback (empty body)
        message: result?.message ?? "An unexpected error occurred.",
      } satisfies ApiError;
    }

    return result as LoginApiResponse;
  },
};
