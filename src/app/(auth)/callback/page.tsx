"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { AuthCookies } from "@/lib/cookie";
import { userService } from "@/services/userService";
import { syncNavUser } from "@/lib/nav-user";
import { toast } from "sonner";

// Component con xử lý logic để bọc trong Suspense
function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  // useRef để chặn React Strict Mode gọi useEffect 2 lần trong development.
  // Lần 2 sẽ dùng cùng authorization code đã hết hạn → backend trả lỗi "invalid_grant".
  const hasCalled = useRef(false);

  useEffect(() => {
    if (!code) {
      router.push("/login");
      return;
    }

    // Chặn double-invocation
    if (hasCalled.current) return;
    hasCalled.current = true;

    // Gọi API Backend để đổi code lấy JWT
    AuthService.loginWithGoogle(code)
      .then(async (result) => {
        // Backend trả { data: { token, userId, role } }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload = (result as any)?.data ?? result;
        const token: string = payload?.token ?? payload?.accessToken;
        const userId: number = payload?.userId ?? payload?.id;
        const role: string = payload?.role;

        if (!token) {
          console.error("[Google Callback] token missing in response:", result);
          toast.error("Đăng nhập Google thất bại: không nhận được token.");
          router.push("/login");
          return;
        }

        // Chặn tài khoản ADMIN đăng nhập qua portal user
        if (role === "ADMIN") {
          toast.error(
            "Tài khoản Administrator không được phép đăng nhập qua cổng này."
          );
          router.push("/login");
          return;
        }

        // Lưu token vào cookie (7 ngày, persistent)
        AuthCookies.set(token, userId, role, true);

        // Fetch profile để hiển thị tên + avatar trên nav
        try {
          const profile = await userService.getUserProfile();
          syncNavUser(profile.fullName, profile.avatar?.url ?? null);
        } catch {
          // Không quan trọng — nav vẫn render được
        }

        toast.success("Đăng nhập Google thành công!");
        router.push("/");
      })
      .catch((err) => {
        console.error("[Google Callback] login failed:", err);
        toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
        router.push("/login");
      });
  }, [code, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-600">Đang xử lý đăng nhập...</p>
    </div>
  );
}

// Next.js App Router yêu cầu dùng Suspense khi dùng useSearchParams
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}
