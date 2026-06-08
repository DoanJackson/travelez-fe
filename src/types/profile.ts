// ProfileReview — joins ApiReview fields with POI display metadata.
// Used only on the profile page; not exported from the review service.
//
// EditFormState / UserProfileUpdateRequest — used by profile/edit/page.tsx
// and userService.updateUserProfile(). Defined here to avoid circular imports.

import type { ReviewMedia } from "@/types/review";

export interface ProfilePoiMeta {
  id: number;
  name: string;
  imageUrl: string;
  /** e.g. "Market", "Museum", "Landmark" */
  category: string;
  /** e.g. "District 1, Ho Chi Minh City" */
  area: string;
}

export interface ProfileReview {
  id: number;
  poi: ProfilePoiMeta;
  /** Maps to ApiReview.rating */
  rating: number;
  /** Maps to ApiReview.content */
  content: string;
  /** ISO 8601 string — formatted on render */
  createdAt: string;
  /** All user-uploaded review images/videos from ApiReview.medias */
  medias: ReviewMedia[];
}

// ─── Edit profile form ────────────────────────────────────────────────────────

/** Controlled form state for the /profile/edit page. */
export interface EditFormState {
  fullName: string;
  username: string;
  /** ISO date string "YYYY-MM-DD" for <input type="date"> */
  dob: string;
  /** "male" | "female" | "other" */
  gender: string;
  /** Read-only display value — not editable by the user */
  email: string;
}

/**
 * Payload sent to userService.updateUserProfile().
 * Email is excluded — it is read-only and cannot be changed here.
 * TODO: align with PUT /api/users/me request body when endpoint ships.
 */
export interface UserProfileUpdateRequest {
  fullName: string;
  username: string;
  dob: string;
  gender: string;
}

// {
//   "code": 9007199254740991,
//   "message": "string",
//   "data": {
//     "id": 9007199254740991,
//     "username": "string",
//     "email": "string",
//     "fullName": "string",
//     "gender": "MALE",
//     "dob": "2026-04-18T08:57:15.782Z",
//     "status": "ACTIVE",
//     "avatar": "string",
//     "role": "TRAVELER"
//   },
//   "success": true
// }

export interface IntegrationStatus {
  isGoogleLinked: boolean;
  hasCalendarScope: boolean;
}

export interface UserAvatarMedia {
  id: number;
  url: string;
  type: string;
}

export interface UserProfileResponseData {
  id: number;
  username: string;
  email: string;
  fullName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dob: string;
  status: "ACTIVE" | "INACTIVE";
  avatar: UserAvatarMedia | null;
  role: "TRAVELER" | "ADMIN";
  followerCount: number;
  followingCount: number;
  followedByMe: boolean;
  followingMe: boolean;
}
