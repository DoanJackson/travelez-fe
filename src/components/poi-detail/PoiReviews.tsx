"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, PenSquare, Sparkles, ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { POIReviewSummary } from "@/types/poi";
import { useQuery } from "@tanstack/react-query";
import { getReviewsByPoiId } from "@/services/reviewService";
import type { ApiReview, ReviewLocation } from "@/types/review";
import { formatDistanceToNow } from "date-fns";
import { InlineReviewForm } from "@/components/review/InlineReviewForm";
import { AuthCookies } from "@/lib/cookie";

interface PoiReviewsProps {
  summary: POIReviewSummary;
  id: string;
  name: string;
  address: string;
  imageUrl?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

const PREVIEW_SIZE = 5;

export function PoiReviews({ summary, id, name, address, imageUrl }: PoiReviewsProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!AuthCookies.getToken());
  }, []);

  const reviewLocation: ReviewLocation = {
    id: Number(id),
    name,
    imageUrl: imageUrl ?? "",
    address,
    rating: summary.average,
    reviewCount: summary.total,
  };

  const { data, isFetching } = useQuery({
    queryKey: ["reviews", id, "preview"],
    queryFn: () => getReviewsByPoiId(Number(id), { page: 0, size: PREVIEW_SIZE }),
    enabled: !isNaN(Number(id)),
  });

  const reviews: ApiReview[] = data?.data?.content ?? [];

  const filters = [
    { id: "all", label: "All" },
    { id: "photos", label: "With photos" },
    { id: "recent", label: "Recent" },
    { id: "couples", label: "Couples" },
    { id: "families", label: "Families" },
  ];

  return (
    <>
    <section id="reviews" className="scroll-mt-24">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <span className="text-2xl font-bold text-gray-900">
              {summary.average}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(summary.average)
                      ? "text-amber-500 fill-amber-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsWriteOpen(true)}
          >
            <PenSquare className="h-4 w-4" />
            Write a review
          </Button>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-6">
        Based on {summary.total.toLocaleString()} reviews
      </div>

      {/* Traveler Insights Summary */}
      <Card className="rounded-xl border bg-gradient-to-br from-pink-50 to-blue-50 p-5 mb-6">
        {/* Title giữ nguyên và hiển thị rõ ràng */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-pink-600" />
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Traveler Insights Summary
          </h3>
        </div>

        {/* Khung chứa nội dung mờ và chữ Coming Soon */}
        <div className="relative">
          {/* Nội dung bị làm mờ và vô hiệu hóa tương tác */}
          <div className="blur-[4px] opacity-60 select-none pointer-events-none">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="bg-white/80 text-gray-700">
                Crowded but worth it
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-gray-700">
                Romantic atmosphere
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-gray-700">
                Great for families
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-gray-700">
                Iconic architecture
              </Badge>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Most visitors praise the stunning architecture and peaceful interior.
              Many recommend visiting early morning to avoid crowds and capture the
              best photos.
            </p>
          </div>

          {/* Lớp overlay chứa chữ Coming Soon căn giữa */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white/90 text-pink-600 border border-pink-200 shadow-sm px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase backdrop-blur-sm">
              Coming Soon
            </div>
          </div>
        </div>
      </Card>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter.id
                ? "bg-pink-600 text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Review Cards */}
      <div className="space-y-3">
        {isFetching ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="rounded-xl border bg-background p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </Card>
          ))
        ) : reviews.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">
            No reviews yet. Be the first to share your experience!
          </p>
        ) : (
          reviews.map((review) => {
            const isExternal = !!review.externalName;
            const displayName = isExternal
              ? review.externalName!
              : (review.author?.fullName ?? "TravelEZ User");
            const displayAvt = isExternal
              ? (review.externalAvt ?? "")
              : (review.author?.avatar ?? "");
            const photos = (review.medias ?? []).filter(
              (m) => m.type === "IMAGE",
            );
            return (
              <Card
                key={review.id}
                className="rounded-xl border bg-background p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={displayAvt} alt={displayName} />
                    <AvatarFallback className="bg-pink-100 text-pink-600 font-semibold">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    {/* Name, Date, Stars Row */}
                    <div className="flex items-start justify-between mb-1.5">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {displayName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(review.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= review.rating
                                ? "text-amber-500 fill-amber-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Content */}
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-2">
                      {review.content}
                    </p>

                    {/* Photo count badge */}
                    {photos.length > 0 && (
                      <Badge
                        variant="outline"
                        className="text-xs py-0.5 gap-1"
                      >
                        <ImageIcon className="h-3 w-3" />
                        {photos.length} photo{photos.length > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Read All Reviews CTA */}
      <div className="mt-6 text-center">
        <Button
          variant="default"
          size="lg"
          className="min-w-[200px] bg-pink-600 hover:bg-pink-700"
          asChild
        >
          <Link href={`/poi/${id}/reviews`}>Read all reviews</Link>
        </Button>
      </div>
    </section>

    <Dialog open={isWriteOpen} onOpenChange={setIsWriteOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription className="sr-only">Share your experience at this place</DialogDescription>
        </DialogHeader>
        <InlineReviewForm
          location={reviewLocation}
          isAuthenticated={isAuthenticated}
        />
      </DialogContent>
    </Dialog>
    </>
  );
}
