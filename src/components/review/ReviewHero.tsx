"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { LocationSearchBar } from "@/components/review/LocationSearchBar";
import { InlineReviewForm } from "@/components/review/InlineReviewForm";
import { AuthCookies } from "@/lib/cookie";
import type { ReviewLocation } from "@/types/review";

export function ReviewHero() {
  const queryClient = useQueryClient();
  const [selectedLocation, setSelectedLocation] =
    useState<ReviewLocation | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // AuthCookies uses js-cookie (browser-only) — must run in useEffect, not during SSR.
  // Default false ensures the banner never flickers incorrectly on the server.
  useEffect(() => {
    setIsAuthenticated(!!AuthCookies.getToken());
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      {/* Hero heading */}
      <section className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Write a review,{" "}
          <span className="text-primary">share your journey.</span>
        </h1>
        <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto">
          Help fellow travelers discover the best experiences around the world.
        </p>
      </section>

      {/* Unauthenticated banner */}
      {!isAuthenticated && (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 px-4 py-3 text-sm text-amber-700 dark:text-amber-400 text-center"
        >
          <Link href="/login" className="font-semibold underline underline-offset-2">
            Sign in
          </Link>{" "}
          to write a review.
        </div>
      )}

      {/* Location search */}
      <LocationSearchBar
        selected={selectedLocation}
        onSelect={setSelectedLocation}
        onClear={() => setSelectedLocation(null)}
      />

      {/* Form — receives location and auth state, owns all form state internally */}
      <InlineReviewForm
        location={selectedLocation}
        isAuthenticated={isAuthenticated}
        onReset={() => setSelectedLocation(null)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["reviews", "me"] })}
      />
    </div>
  );
}
