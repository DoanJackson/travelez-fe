"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CalendarSyncHandlerProps {
  itineraryId: number;
}

export function CalendarSyncHandler({ itineraryId }: CalendarSyncHandlerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    if (!searchParams.get("calendarSynced")) return;
    handled.current = true;

    toast.success("Google Calendar synced!", {
      description: "Your itinerary activities have been added to your calendar.",
    });
    queryClient.invalidateQueries({ queryKey: ["integrations", "me"] });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("calendarSynced");
    const clean = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/itinerary/${itineraryId}${clean}`, { scroll: false });
  }, [searchParams]);

  return null;
}
