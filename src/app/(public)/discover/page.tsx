"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { vietnamCities, topRatedPOIs, cityGuides, type City } from "@/lib/mock-discover-data";
import { PlaceResponseData } from "@/types/place";
import { searchPlaces } from "@/services/placeService";
import { getPublicItineraries } from "@/services/itineraryService";
import { POICard } from "@/components/discover/POICard";
import { CitiesSection } from "@/components/discover/CitiesSection";
import { DiscoverHero } from "@/components/discover/DiscoverHero";
import { GuideCard } from "@/components/discover/GuideCard";
import { SectionHeader } from "@/components/discover/SectionHeader";
import { ItineraryExploreFeed } from "@/components/discover/ItineraryExploreFeed";
import type { PublicItinerarySummary } from "@/types/itinerary";

// ─── Thumbnail + duration helpers (mirrors ItineraryExploreFeed) ───────────────

const THUMBNAILS = [
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
  "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
  "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&q=80",
  "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80",
  "https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=80",
];

function getThumbnail(id: number) {
  return THUMBNAILS[id % THUMBNAILS.length];
}

function calcDays(startDate: string, endDate: string): number {
  const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
  return Math.max(1, Math.round(diff / 86_400_000) + 1);
}

// ─── Main inner page ───────────────────────────────────────────────────────────

function DiscoverPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlPrompt = searchParams.get("prompt") ?? "";

  const [searchQuery, setSearchQuery] = useState(urlPrompt);
  const [itineraryPrompt, setItineraryPrompt] = useState<string | null>(
    urlPrompt.length >= 2 ? urlPrompt : null,
  );
  const [activeDiscoverTab, setActiveDiscoverTab] = useState<"places" | "itineraries">(
    urlPrompt.length >= 2 ? "itineraries" : "places",
  );
  const [activeRegion, setActiveRegion] = useState("all");
  const [savedCities, setSavedCities] = useState<Set<string>>(new Set());
  const [followedCities, setFollowedCities] = useState<Set<string>>(new Set());
  const [savedPOIs, setSavedPOIs] = useState<Set<string>>(new Set());

  // Search & pagination state
  const [searchResults, setSearchResults] = useState<PlaceResponseData[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Sync hero input, feed, and tab when URL prompt changes (chip navigation)
  useEffect(() => {
    setSearchQuery(urlPrompt);
    if (urlPrompt.length >= 2) {
      setItineraryPrompt(urlPrompt);
      setActiveDiscoverTab("itineraries");
    } else {
      setItineraryPrompt(null);
      setActiveDiscoverTab("places");
    }
  }, [urlPrompt]);

  const filteredCities = vietnamCities.filter((city) => {
    if (activeRegion === "all") return true;
    if (activeRegion === "north" || activeRegion === "central" || activeRegion === "south") {
      return city.region === activeRegion;
    }
    return city.tags.includes(activeRegion);
  });

  const fetchNextPage = useCallback(async () => {
    const trimmed = searchQuery.trim();
    if (!trimmed || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await searchPlaces(trimmed, "Việt Nam", "VN", "name", "ASC", currentPage, 20);
      setSearchResults((prev) => [...(prev ?? []), ...res.data.content]);
      setHasMore(res.data.page < res.data.totalPages - 1);
      setCurrentPage((p) => p + 1);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Failed to load more.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [searchQuery, currentPage, isLoadingMore]);

  const handleSaveCity = useCallback((cityId: string) => {
    setSavedCities((prev) => {
      const next = new Set(prev);
      next.has(cityId) ? next.delete(cityId) : next.add(cityId);
      return next;
    });
  }, []);

  const handleFollowCity = useCallback((cityId: string) => {
    setFollowedCities((prev) => {
      const next = new Set(prev);
      next.has(cityId) ? next.delete(cityId) : next.add(cityId);
      return next;
    });
  }, []);

  const handleSavePOI = useCallback((poiId: string) => {
    setSavedPOIs((prev) => {
      const next = new Set(prev);
      next.has(poiId) ? next.delete(poiId) : next.add(poiId);
      return next;
    });
  }, []);

  const executeSearch = useCallback(async (query: string) => {
    setSearchResults([]);
    setCurrentPage(0);
    setHasMore(false);
    setSearchError(null);
    setIsSearching(true);
    try {
      const res = await searchPlaces(query, "Việt Nam", "VN", "name", "ASC", 0, 10);
      setSearchResults(res.data.content);
      setHasMore(res.data.page < res.data.totalPages - 1);
      setCurrentPage(1);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Search failed.");
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleClear = useCallback(() => {
    setSearchQuery("");
    setItineraryPrompt(null);
    setSearchResults(null);
    setHasMore(false);
    setCurrentPage(0);
    setSearchError(null);
    router.push("/discover");
  }, [router]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = searchQuery.trim();
      if (trimmed.length < 2) {
        setSearchResults(null);
        setHasMore(false);
        setCurrentPage(0);
        setSearchError(null);
        setItineraryPrompt(null);
        return;
      }

      if (activeDiscoverTab === "itineraries") {
        setItineraryPrompt(trimmed);
        router.push(`/discover?prompt=${encodeURIComponent(trimmed)}`);
      } else {
        setItineraryPrompt(null);
        executeSearch(trimmed);
      }
    },
    [searchQuery, activeDiscoverTab, executeSearch, router],
  );

  const handleQueryChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (value.trim().length < 2) {
      setSearchResults(null);
      setHasMore(false);
      setCurrentPage(0);
      setSearchError(null);
      setItineraryPrompt(null);
    }
  }, []);

  const isActiveSearch = searchResults !== null;
  const searchResultCities: City[] = (searchResults ?? []).map((place) => ({
    id: String(place.id),
    name: place.name,
    nameVi: place.name,
    region: "north" as const,
    vibe: place.country,
    tags: [],
    imageUrl: "",
    placesCount: 0,
    reviewsCount: 0,
  }));
  const displayedCities = isActiveSearch ? searchResultCities : filteredCities;

  return (
    <div className="min-h-screen bg-gray-50">
      <DiscoverHero
        searchQuery={searchQuery}
        onSearchChange={handleQueryChange}
        onSearch={handleSearch}
        onTabChange={setActiveDiscoverTab}
        onClear={handleClear}
      />

      {itineraryPrompt ? (
        /* Full-screen itinerary feed — hides all static layout blocks */
        <ItineraryExploreFeed prompt={itineraryPrompt} />
      ) : (
        <>
          {/* Places to Visit */}
          <CitiesSection
            cities={displayedCities}
            savedCities={savedCities}
            followedCities={followedCities}
            activeFilter={activeRegion}
            onFilterChange={setActiveRegion}
            onSaveCity={handleSaveCity}
            onFollowCity={handleFollowCity}
            isSearching={isSearching}
            searchError={searchError}
            isActiveSearch={isActiveSearch}
          />

          {/* Load More */}
          {hasMore && isActiveSearch && (
            <div className="flex justify-center pb-8 bg-white">
              <Button
                variant="outline"
                onClick={fetchNextPage}
                disabled={isLoadingMore}
                className="px-8 rounded-full"
              >
                {isLoadingMore ? (
                  <>
                    <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
                    Loading…
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}

          {/* Trending Community Itineraries */}
          <TrendingItinerariesSection />

          {/* Traveler's Choice */}
          <TravelersChoiceSection
            pois={topRatedPOIs}
            savedPOIs={savedPOIs}
            onSavePOI={handleSavePOI}
          />

          {/* Guides */}
          <GuidesSection guides={cityGuides} />
        </>
      )}
    </div>
  );
}

// ─── Trending Community Itineraries section ────────────────────────────────────

function TrendingItinerariesSection() {
  const [items, setItems] = useState<PublicItinerarySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getPublicItineraries(0, 3)
      .then((res) => { if (!cancelled) setItems(res.data.content); })
      .catch(() => { /* silently hide section on error */ })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (!isLoading && items.length === 0) return null;

  return (
    <section className="py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Trending Community Itineraries
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Handpicked travel routes shared by our community explorers.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-2xl" />
                <div className="pt-3 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="flex gap-1.5">
                    <div className="h-5 w-16 bg-gray-200 rounded-full" />
                    <div className="h-5 w-20 bg-gray-200 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link key={item.id} href={`/itinerary/${item.id}`} className="group block">
                <div className="relative h-48 overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={getThumbnail(item.id)}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>

                <div className="pt-3 space-y-2">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    ⏱ {calcDays(item.startDate, item.endDate)} Days
                  </p>

                  {item.destinationCities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.destinationCities.map((city) => (
                        <span
                          key={city}
                          className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5"
                        >
                          {city}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.styles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.styles.map((style) => (
                        <span
                          key={style}
                          className="text-xs text-pink-500 bg-pink-50 rounded-full px-2 py-0.5"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.ownerUsername && (
                    <p className="text-xs text-gray-400">by @{item.ownerUsername}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Static sections ───────────────────────────────────────────────────────────

interface TravelersChoiceSectionProps {
  pois: any[];
  savedPOIs: Set<string>;
  onSavePOI: (poiId: string) => void;
}

function TravelersChoiceSection({ pois, savedPOIs, onSavePOI }: TravelersChoiceSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Traveler's Choice in Vietnam"
          subtitle="Highly-rated places based on traveler reviews on TravelEZ."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pois.map((poi, index) => (
            <POICard
              key={poi.id}
              poi={poi}
              isSaved={savedPOIs.has(poi.id)}
              onSave={() => onSavePOI(poi.id)}
              index={index}
              showViewButton={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function GuidesSection({ guides }: { guides: any[] }) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Local highlights & city guides"
          subtitle="Curated guides to help you understand each destination."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide, index) => (
            <GuideCard key={guide.id} guide={guide} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Suspense shell ────────────────────────────────────────────────────────────

function DiscoverFeedSkeleton() {
  return <div className="min-h-screen bg-gray-50" />;
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<DiscoverFeedSkeleton />}>
      <DiscoverPageInner />
    </Suspense>
  );
}
