"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { userService } from "@/services/userService";
import { exportCalendar } from "@/services/itineraryService";
import type { ApiError } from "@/types/api";

export function CalendarCallbackInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    let cancelled = false;

    const code = searchParams.get("code");
    const state = searchParams.get("state"); // itineraryId
    const error = searchParams.get("error");

    if (error === "access_denied") {
      router.push(state ? `/itinerary/${state}` : "/");
      return;
    }

    if (!code || !state) {
      toast.error("Invalid callback parameters.");
      router.push("/");
      return;
    }

    const run = async () => {
      try {
        await userService.calendarCallback(code);
        if (cancelled) return;

        const { oauthUrl } = await exportCalendar(Number(state));
        if (cancelled) return;

        if (oauthUrl) {
          toast.error("Please back to Itinerary page");
          router.push(`/itinerary/${state}`);
          return;
        }

        router.push(`/itinerary/${state}?calendarSynced=1`);
      } catch (err) {
        if (cancelled) return;
        const apiErr = err as ApiError;

        if (apiErr.status === 401) {
          const returnUrl = encodeURIComponent(window.location.href);
          router.push(`/login?returnUrl=${returnUrl}`);
          return;
        }

        toast.error(apiErr.message ?? "Failed to connect Google Calendar.");
        router.push(state ? `/itinerary/${state}` : "/");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-slate-600">
      <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
      <p className="text-sm font-medium">Connecting to Google Calendar…</p>
    </div>
  );
}
