"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { usePoiDetail } from "@/hooks/usePoiDetail";
import { transformDetailToPoiDetail } from "@/lib/poi-transform";
import { PoiHeader } from "@/components/poi-detail/PoiHeader";
import { PoiHeroGallery } from "@/components/poi-detail/PoiHeroGallery";
import { PoiStickyNav } from "@/components/poi-detail/PoiStickyNav";
import { PoiOverviewSection } from "@/components/poi-detail/PoiOverviewSection";
import { PoiMapSection } from "@/components/poi-detail/PoiMapSection";
import { PoiReviews } from "@/components/poi-detail/PoiReviews";
import { PoiVisitSummary } from "@/components/poi-detail/PoiVisitSummary";
import { PoiOpeningHoursCard } from "@/components/poi-detail/PoiOpeningHoursCard";
import { PoiContactCard } from "@/components/poi-detail/PoiContactCard";
import { PoiRecommendations } from "@/components/poi-detail/PoiRecommendations";

export default function POIDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // Fetch POI from real API
  const poiId = parseInt(id, 10);
  const { poi: rawPoi, isLoading, error } = usePoiDetail(isNaN(poiId) ? null : poiId);
  const poi = rawPoi ? transformDetailToPoiDetail(rawPoi) : null;

  // State management
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  // Event handlers
  const handleSave = useCallback(() => {
    setIsSaved((prev: boolean) => !prev);
  }, []);

  const handleFollow = useCallback(() => {
    setIsFollowed((prev: boolean) => !prev);
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.share && poi) {
      navigator.share({
        title: poi.name,
        text: `Check out ${poi.name} on TravelEZ`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  }, [poi]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-600 border-t-transparent" />
      </div>
    );
  }

  // Error / not found
  if (error || !poi) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {error ? "Could not load place" : "POI Not Found"}
          </h1>
          <p className="text-gray-600">
            {error ?? "The place you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  const city = rawPoi?.address?.split(",").pop()?.trim() ?? "";

  // Navigation sections
  const navSections = [
    { id: "overview", label: "Overview" },
    { id: "reviews", label: "Reviews" },
    { id: "recommendations", label: "Explore more" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PoiHeader
        name={poi.name}
        categories={poi.categories}
        city={city}
        district=""
        poiTypeDetail={rawPoi?.poiTypeDetail}
        isSaved={isSaved}
        isFollowed={isFollowed}
        onSave={handleSave}
        onFollow={handleFollow}
        onShare={handleShare}
      />

      {/* Hero Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <PoiHeroGallery images={poi.galleryImages} altText={poi.name} />
      </section>

      {/* Sticky Navigation Bar */}
      <PoiStickyNav sections={navSections} />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 mt-6">
        {/* 2-Column Layout: Main Content + Sticky Decision Panel */}
        <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-6 lg:gap-10">
          {/* LEFT COLUMN: Primary Content Flow */}
          <div className="space-y-6 sm:space-y-10 lg:space-y-12">
            {/* 1. Overview */}
            <section id="overview" className="scroll-mt-24">
              <PoiOverviewSection overview={poi.overview} />
            </section>

            {/* 2. Map */}
            <PoiMapSection
              name={poi.name}
              address={poi.location.address}
              lat={poi.location.lat}
              lng={poi.location.lng}
            />

            {/* 3. Reviews */}
            <PoiReviews
              summary={poi.reviewSummary}
              id={id}
              name={poi.name}
              address={poi.location.address}
              imageUrl={poi.galleryImages[0]}
            />
          </div>

          {/* RIGHT COLUMN: Sticky Decision Panel */}
          <aside className="space-y-4 sm:space-y-5 lg:sticky lg:top-24 lg:self-start">
            {/* 1. Visit Summary */}
            <PoiVisitSummary
              duration={poi.meta.duration}
              entryFee={poi.meta.entryFee}
            />

            {/* 2. Contact & Directions */}
            <PoiContactCard
              phoneNumber={rawPoi?.phoneNumber}
              website={rawPoi?.website}
              googleMapsUrl={rawPoi?.googleMapsUrl}
            />

            {/* 3. Opening Hours + Rating Distribution + Amenities */}
            <PoiOpeningHoursCard
              openingHour={rawPoi?.openingHour ?? []}
              reviewsDistribution={rawPoi?.reviewsDistribution ?? { oneStar: 0, twoStar: 0, threeStar: 0, fourStar: 0, fiveStar: 0 }}
              additionalInfo={rawPoi?.additionalInfo ?? {}}
            />

          </aside>
        </div>

        {/* Full-width Recommendations — outside the 2-col grid */}
        <PoiRecommendations
          poiId={poiId}
          placeId={rawPoi!.placeId}
          poiName={poi.name}
          poiType={rawPoi!.poiType}
          poiTypeDetail={rawPoi!.poiTypeDetail}
        />
      </main>
    </div>
  );
}
