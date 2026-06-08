import { BASE_URL, API_ENDPOINTS } from "@/constants/api";
import { AuthCookies } from "@/lib/cookie";
import { handleUnauthorized } from "@/lib/auth-utils";
import type { UserProfileUpdateRequest, UserProfileResponseData, UserAvatarMedia, IntegrationStatus } from "@/types/profile";
import type { ApiError } from "@/types/api";

function authHeaders(): Record<string, string> {
  const token = AuthCookies.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const userService = {
  async getUserProfile(): Promise<UserProfileResponseData> {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.USER.GET_PROFILE}`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      handleUnauthorized(response.status);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to load profile.",
      } satisfies ApiError;
    }

    return result.data as UserProfileResponseData;
  },

  async updateUserProfile(payload: UserProfileUpdateRequest): Promise<UserProfileResponseData> {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.USER.UPDATE_USERINFO}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(payload),
      },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      handleUnauthorized(response.status);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to update profile.",
      } satisfies ApiError;
    }
    return result.data as UserProfileResponseData;
  },

  async followUser(targetUserId: number): Promise<void> {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.SOCIAL.FOLLOW_USER(String(targetUserId))}`,
      { method: "POST", headers: authHeaders() },
    );
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to follow user.",
      } satisfies ApiError;
    }
  },

  async unfollowUser(targetUserId: number): Promise<void> {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.SOCIAL.UNFOLLOW_USER(String(targetUserId))}`,
      { method: "DELETE", headers: authHeaders() },
    );
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to unfollow user.",
      } satisfies ApiError;
    }
  },

  async getIntegrations(): Promise<IntegrationStatus> {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.USER.GET_INTEGRATIONS}`,
      { method: "GET", headers: authHeaders() },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      handleUnauthorized(response.status);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to load integration status.",
      } satisfies ApiError;
    }
    return result.data as IntegrationStatus;
  },

  async calendarCallback(code: string): Promise<void> {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.USER.CALENDAR_CALLBACK}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ code }),
      },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      handleUnauthorized(response.status);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to complete Google authorization.",
      } satisfies ApiError;
    }
  },

  async updateUserAvatar(file: File): Promise<UserAvatarMedia> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.USER.UPDATE_USERAVATAR}`,
      {
        method: "PATCH",
        headers: authHeaders(), // no Content-Type — browser sets multipart boundary
        body: formData,
      },
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      handleUnauthorized(response.status);
      throw {
        status: response.status,
        message: result?.message ?? "Failed to update avatar.",
      } satisfies ApiError;
    }

    return result.data as UserAvatarMedia;
  },
};

export async function getUserById(
  userId: number,
  token?: string,
): Promise<UserProfileResponseData> {
  const headers: Record<string, string> = {};
  const t = token ?? AuthCookies.getToken();
  if (t) headers.Authorization = `Bearer ${t}`;

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.USER.GET_USER_BY_ID(userId)}`,
    { method: "GET", headers },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to load user profile.",
    } satisfies ApiError;
  }

  return result.data as UserProfileResponseData;
}

export async function updateUserProfile(payload: UserProfileUpdateRequest): Promise<void> {
  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.USER.UPDATE_USERINFO}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(payload),
    },
  );
  if (!response.ok) {
    const result = await response.json().catch(() => null);
    handleUnauthorized(response.status);
    throw {
      status: response.status,
      message: result?.message ?? "Failed to update profile.",
    } satisfies ApiError;
  }
}
