"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { generateItinerary } from "@/services/itineraryService";
import { useTripPlanningStore } from "@/state/planning-store";
import { Button } from "@/components/ui/button";
import { ItineraryLoadingBackground } from "@/components/planning/ItineraryLoadingBackground";
import { Special_Elite } from "next/font/google";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const hasFired = useRef(false);
  const router = useRouter();
  const {
    destinations,
    dayRange,
    budget,
    travelStyles,
    tripType,
    withKids,
    withPets,
    customNote,
    extraPreferences,
  } = useTripPlanningStore();

  useEffect(() => {
    // Guard: only fire once even in React Strict Mode double-invoke
    if (hasFired.current) return;
    hasFired.current = true;

    const finalNotes = [extraPreferences, customNote]
      .filter(Boolean)
      .join(" - "); 

    const payload = {
      destinationCities: destinations,
      startDate: dayRange.start
        ? dayRange.start.toISOString().split("T")[0]
        : "",
      endDate: dayRange.end ? dayRange.end.toISOString().split("T")[0] : "",
      budget: budget ?? 0,
      ...(customNote ? { specialNotes: customNote } : {}),
      styles: travelStyles,
      companion: tripType ?? "",
      hasKids: withKids ?? false,
      hasPets: withPets ?? false,
      specialNotes: finalNotes || "",
    };

    // Animate progress while POST is in-flight (0 → 90%)
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 88 ? prev + 2 : prev));
    }, 2400);

    generateItinerary(payload)
      .then((response) => {
        clearInterval(progressInterval);
        setProgress(100);

        const tempId = response.data?.tempId;

        if (!tempId) {
          setError(
            `Unexpected response — tempId is missing. Raw: ${JSON.stringify(response.data)}`,
          );
          return;
        }

        setTimeout(() => router.push(`/itinerary/${tempId}`), 400);
      })
      .catch((err) => {
        clearInterval(progressInterval);
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(message);
      });

    return () => {
      clearInterval(progressInterval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-lg w-full px-4 text-center space-y-6">
          <div className="text-5xl">😞</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Something went wrong
            </h2>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
          <Button
            onClick={() => router.push("/planning/summary")}
            className="bg-pink-500 hover:bg-pink-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <ItineraryLoadingBackground />
      <div
        className="absolute bottom-0 left-0 h-1 bg-pink-500/70 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
