// src/services/adminService.ts
import { API_ENDPOINTS } from "@/constants/api";
import { AuthCookies } from "@/lib/cookie";
import type {
  AdminUser,
  AdminUsersQuery,
  UpdateUserStatusPayload,
  UserDetail,
} from "@/types/admin";
import type { BaseResponse, PaginatedData } from "@/types/api";

function adminAuthHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${AuthCookies.getToken()}` };
}

export async function getAdminUsers(
  query: AdminUsersQuery = {}
): Promise<BaseResponse<PaginatedData<AdminUser>>> {
  const params = new URLSearchParams();
  if (query.keyword) params.set("keyword", query.keyword);
  if (query.status) params.set("status", query.status);
  params.set("page", String(query.page ?? 0));
  params.set("size", String(query.size ?? 10));
  if (query.sortField) params.set("sortField", query.sortField);
  if (query.sortDirection) params.set("sortDirection", query.sortDirection);

  const url = `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.ADMIN_USERS.LIST()}?${params}`;
  const res = await fetch(url, { headers: adminAuthHeaders(), cache: "no-store" });
  const result = await res.json().catch(() => null);
  if (!res.ok) throw new Error(result?.message ?? `Failed to fetch users: ${res.status}`);
  return result;
}

export async function getAdminUserById(
  userId: number
): Promise<BaseResponse<UserDetail>> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.ADMIN_USERS.DETAIL(userId)}`;
  const res = await fetch(url, { headers: adminAuthHeaders(), cache: "no-store" });
  const result = await res.json().catch(() => null);
  if (!res.ok) throw new Error(result?.message ?? `Failed to fetch user: ${res.status}`);
  return result;
}

export async function updateAdminUserStatus(
  userId: number,
  payload: UpdateUserStatusPayload
): Promise<BaseResponse<UserDetail>> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.ADMIN_USERS.STATUS(userId)}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...adminAuthHeaders() },
    body: JSON.stringify(payload),
  });
  const result = await res.json().catch(() => null);
  if (!res.ok) throw new Error(result?.message ?? `Failed to update user status: ${res.status}`);
  return result;
}

export const adminService = {
  getDashboardStats: async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard/stats`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AuthCookies.getToken()}`,
        },
      });
      
      if (!response.ok) {
        console.warn(`[AdminService] Failed to fetch stats: ${response.status}. Fallback applied.`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("[AdminService] Network error fetching stats:", error);
      return null;
    }
  },

  getDashboardActivities: async (filter = "ALL", page = 0, size = 10) => {
    try {
      const params = new URLSearchParams({
        filter: filter,
        page: page.toString(),
        size: size.toString(),
      });
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard/activities?${params.toString()}`;

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AuthCookies.getToken()}`,
        },
      });

      if (!response.ok) {
        console.warn(`[AdminService] Failed to fetch activities: ${response.status}. Fallback applied.`);
        return { data: { content: [], totalElements: 0, totalPages: 1 } }; 
      }

      return await response.json();
    } catch (error) {
      console.error("[AdminService] Network error fetching activities:", error);
      return { data: { content: [], totalElements: 0, totalPages: 1 } };
    }
  },
};