"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTripPlanningStore } from "@/state/planning-store";

// This page is the entry point for every "Plan trip" link.
// Resetting here is the correct moment — the user has explicitly chosen
// to start a fresh trip. router.replace removes /planning from the
// history stack so pressing Back from step1 skips this page entirely.
export default function PlanningPage() {
  const router = useRouter();
  const reset = useTripPlanningStore((s) => s.reset);
  // useRef persists across React 19 StrictMode's simulated unmount/remount cycle,
  // preventing the effect from firing twice and causing a double navigation.
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    reset();
    router.replace("/planning/step1");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
