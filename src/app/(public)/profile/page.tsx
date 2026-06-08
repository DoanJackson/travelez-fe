"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthCookies } from "@/lib/cookie";

export default function ProfilePage() {
  const router = useRouter();
  useEffect(() => {
    const cookieId = AuthCookies.getUserId();
    router.replace(cookieId ? `/profile/${cookieId}` : "/login");
  }, [router]);
  return null;
}
