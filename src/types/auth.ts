// src/types/auth.ts
import type { BaseResponse } from "./api";

export type { ApiError } from "./api"; // re-export — existing `import { ApiError } from "@/types/auth"` keeps working

// ─── Register ──────────────────────────────────────────────────────────────

/**
 * Request body for POST /api/sso/register.
 * NOTE: fullName, gender, and dob are confirmed nullable by the backend.
 */
export interface RegisterRequest {
  username: string;
  password: string;
  role: "TRAVELER" | "PROVIDER";
  fullName: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  dob: string | null;
  recaptchaToken: string;
  secretCode?: string;
}

/** POST /api/sso/register — data is null on success */
export type RegisterApiResponse = BaseResponse<null>;

// ─── Login ─────────────────────────────────────────────────────────────────

/** Request body for POST /api/sso/login */
export interface LoginRequest {
  username: string; // mapped from the `email` state field
  password: string;
  recaptchaToken: string;
}

/** Nested data object returned on successful login */
export interface LoginData {
  token: string;
  userId: number;
  role: "TRAVELER" | "ADMIN";
}

/** POST /api/sso/login */
export type LoginApiResponse = BaseResponse<LoginData>;
