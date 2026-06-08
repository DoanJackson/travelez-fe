import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAdminUserById,
  getAdminUsers,
  updateAdminUserStatus,
} from "@/services/adminService";
import type {
  AdminUser,
  AdminUsersQuery,
  UpdateUserStatusPayload,
  UserDetail,
} from "@/types/admin";
import type { BaseResponse, PaginatedData } from "@/types/api";

export function useAdminUsers(query: AdminUsersQuery = {}) {
  return useQuery({
    queryKey: ["admin", "users", "list", query],
    queryFn: () => getAdminUsers(query).then((r) => r.data),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useAdminUserDetail(userId: number) {
  return useQuery({
    queryKey: ["admin", "users", "detail", userId],
    queryFn: () => getAdminUserById(userId).then((r) => r.data),
    staleTime: 60_000,
    enabled: !!userId,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    BaseResponse<UserDetail>,
    Error,
    { userId: number; payload: UpdateUserStatusPayload }
  >({
    mutationFn: ({ userId, payload }) => updateAdminUserStatus(userId, payload),

    onSuccess: (response, { userId }) => {
      const newStatus = response.data?.status;

      // Optimistic patch: if the PATCH response carries the new status, apply it
      // immediately to both caches so the UI responds without waiting for refetches.
      if (newStatus) {
        queryClient.setQueryData<UserDetail>(
          ["admin", "users", "detail", userId],
          (old) => (old ? { ...old, status: newStatus } : old)
        );

        queryClient.setQueriesData<PaginatedData<AdminUser>>(
          { queryKey: ["admin", "users", "list"] },
          (old) => {
            if (!old || !Array.isArray(old.content)) return old;
            return {
              ...old,
              content: old.content.map((u) =>
                u.id === userId ? { ...u, status: newStatus } : u
              ),
            };
          }
        );
      }

      // Always invalidate both caches so stale data is replaced with a fresh
      // server fetch. This guarantees the UI updates even when the PATCH
      // response body is empty or carries a partial payload.
      queryClient.invalidateQueries({ queryKey: ["admin", "users", "detail", userId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", "list"] });
    },
  });
}
