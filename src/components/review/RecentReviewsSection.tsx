"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthCookies } from "@/lib/cookie";
import { getReviewsByUserId } from "@/services/reviewService";
import { ProfileReviewCard } from "@/components/profile/ProfileReviewCard";
import { Skeleton } from "@/components/ui/skeleton";
import { apiReviewToProfileReview } from "@/lib/adapters/review";

// ── Component ─────────────────────────────────────────────────────────────────

export function RecentReviewsSection() {
  const [userId, setUserId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const rawId = AuthCookies.getUserId();
    setUserId(rawId ? parseInt(rawId, 10) : null);
  }, []);

  const QUERY_KEY = ["reviews", "me", userId];

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      getReviewsByUserId(userId!, {
        size: 10,
        sortField: "createdAt",
        sortDirection: "DESC",
      }),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });

  const reviews = (data?.data?.content ?? []).map(apiReviewToProfileReview);
  const total   = data?.data?.totalElements ?? 0;

  const handleDelete = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

  // ── Unauthenticated ──────────────────────────────────────────────────────────
  if (!userId) {
    return (
      <Section>
        <Heading total={0} />
        <Empty message="Sign in to see your reviews." />
      </Section>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Section>
        <Heading total={0} loading />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </Section>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <Section>
        <Heading total={0} />
        <Empty message="Could not load your reviews. Please try again." />
      </Section>
    );
  }

  // ── Data ─────────────────────────────────────────────────────────────────────
  return (
    <Section>
      <Heading total={total} />
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((review) => (
            <ProfileReviewCard
              key={review.id}
              review={review}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Empty message="You haven't written any reviews yet." />
      )}
    </Section>
  );
}

// ── Local helpers ─────────────────────────────────────────────────────────────

function Section({ children }: { children: React.ReactNode }) {
  return <section className="space-y-6">{children}</section>;
}

function Heading({ total, loading }: { total: number; loading?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Your Recent Reviews
      </h2>
      {!loading && (
        <span className="text-sm text-slate-400 font-medium">
          {total} review{total !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 py-12 text-center">
      <p className="text-slate-400 text-sm">{message}</p>
    </div>
  );
}
