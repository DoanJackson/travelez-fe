"use client";

import { Button } from "@/components/ui/button";
import { usePoiReviews } from "./usePoiReviews";
import { usePoiDetail } from "@/hooks/usePoiDetail";
import { TravelerPhotosSidebar } from "./TravelerPhotosSidebar";
import { PoiReviewsHeader } from "./PoiReviewsHeader";
import { ReviewsToolbar } from "./ReviewsToolbar";
import { ReviewCard } from "./ReviewCard";
import { MobilePhotosSection } from "./MobilePhotosSection";
import { PenSquare } from "lucide-react";
import { AuthCookies } from "@/lib/cookie";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { InlineReviewForm } from "../review/InlineReviewForm";
import { ReviewLocation } from "@/types/review";

interface PoiReviewsPageProps {
  id: string;
}

export function PoiReviewsPage({ id }: PoiReviewsPageProps) {
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!AuthCookies.getToken());
  }, []);

  const poiId = parseInt(id, 10);
  const { poi } = usePoiDetail(isNaN(poiId) ? null : poiId);
  const photos = (poi?.medias ?? []).filter((m) => m.type === "IMAGE");
  const reviewLocation: ReviewLocation | null = poi
    ? {
        id: Number(id),
        name: poi.name,
        imageUrl: "",
        address: poi.address,
        rating: poi.rating,
        reviewCount: poi.reviewCount,
      }
    : null;

  const {
    sortBy,
    filterBy,
    visibleReviews,
    canLoadMore,
    setSortBy,
    setFilterBy,
    handleLoadMore,
    refresh,
  } = usePoiReviews(id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid lg:grid-cols-[460px_1fr] gap-6 lg:gap-10">
          {/* LEFT SIDEBAR - Photos (Desktop only, sticky) */}
          <TravelerPhotosSidebar photos={photos} />

          {/* RIGHT COLUMN - Main content */}
          <main className="min-w-0 pt-6 sm:pt-8">
            <PoiReviewsHeader
              id={id}
              poiName={poi?.name ?? ""}
              address={poi?.address ?? ""}
              ratingAvg={poi?.rating ?? 0}
              totalReviews={poi?.reviewCount ?? 0}
              actionButton={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setIsWriteOpen(true)}
                >
                  <PenSquare className="h-4 w-4" />
                  Write a review
                </Button>
              }
            />

            {/* Sort + Filter toolbar */}
            <ReviewsToolbar
              sortBy={sortBy}
              filterBy={filterBy}
              onSortChange={setSortBy}
              onFilterChange={setFilterBy}
            />

            {/* Reviews List */}
            <div className="space-y-3">
              {visibleReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {/* Load More */}
            {canLoadMore && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLoadMore}
                  className="min-w-[200px]"
                >
                  Load more reviews
                </Button>
              </div>
            )}

            {/* Mobile Photos Section (below reviews) */}
            <MobilePhotosSection photos={photos} />

            <Dialog open={isWriteOpen} onOpenChange={setIsWriteOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Write a review</DialogTitle>
                  <DialogDescription className="sr-only">Share your experience at this place</DialogDescription>
                </DialogHeader>
                <InlineReviewForm
                  location={reviewLocation}
                  isAuthenticated={isAuthenticated}
                  onSuccess={refresh}
                />
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    </div>
  );
}
