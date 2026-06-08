"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft, List, Map as MapIcon, Search, SearchX } from "lucide-react";

import { useSearchResults } from "@/hooks/useSearchResults";
import { FilterPills } from "@/components/discover/FilterPills";
import { SearchPOICard } from "@/components/search/SearchPOICard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FilterOption } from "@/types/discover";

// ─── Dynamic import: Leaflet map must be client-only ─────────────────────────
const SearchMap = dynamic(
  () =>
    import("@/components/search/SearchMap").then((m) => ({
      default: m.SearchMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
      </div>
    ),
  },
);

// ─── Static config ────────────────────────────────────────────────────────────
const SEARCH_FILTERS: FilterOption[] = [
  { id: "ALL",          label: "All" },
  { id: "ATTRACTION",   label: "Landmarks" },
  { id: "NATURE",       label: "Nature" },
  { id: "CAFE_DESSERT", label: "Cafés" },
  { id: "RESTAURANT",   label: "Dining" },
  { id: "STREET_FOOD",  label: "Street Food" },
  { id: "NIGHTLIFE",    label: "Nightlife" },
  { id: "RELIGIOUS",    label: "Religious" },
];

// Vietnam geographic center — used as the map's initial viewport before
// fitBounds repositions it once POI results load.
const VIETNAM_CENTER: [number, number] = [16.0, 108.0];

type SortOrder = "default" | "rating" | "reviews";

// ─── Skeleton helpers ─────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-48 bg-gray-200 w-full" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-16" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

function ContextBarSkeleton() {
  return (
    <div className="bg-white border-b px-6 py-3 space-y-3 shrink-0">
      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
      <div className="h-10 bg-gray-200 rounded-xl w-full max-w-lg animate-pulse" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded-full w-20 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

// ─── Inner component (requires useSearchParams → must be in Suspense) ─────────
function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL is the single source of truth
  const placeId       = parseInt(searchParams.get("placeId") ?? "0", 10);
  const typeParam     = searchParams.get("type") ?? "ALL";
  const queryParam    = searchParams.get("q") ?? "";
  const semanticQuery = searchParams.get("semanticQuery") ?? undefined;

  // UI-only — used for display (breadcrumb, placeholder text), never sent to the API
  const cityName = searchParams.get("cityName") ?? "Vietnam";

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const { results, totalElements, isLoading, isFetching } = useSearchResults({
    q: queryParam,
    placeId,
    poiType: typeParam,
    semanticQuery,
  });

  // ── Local UI state ───────────────────────────────────────────────────────────
  const [highlightedPoiId, setHighlightedPoiId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(semanticQuery ?? queryParam);
  const [showMap, setShowMap] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");

  // Sync input and reset sort when URL query changes (Back/Forward or new search)
  useEffect(() => {
    setInputValue(semanticQuery ?? queryParam);
    setSortOrder("default");
  }, [queryParam, typeParam, semanticQuery]);

  // ── Client-side sort (no re-fetch) ───────────────────────────────────────────
  const sortedResults = useMemo(() => {
    if (sortOrder === "rating")  return [...results].sort((a, b) => b.rating - a.rating);
    if (sortOrder === "reviews") return [...results].sort((a, b) => b.reviewCount - a.reviewCount);
    return results; // "default" preserves NLP relevance rank
  }, [results, sortOrder]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSearchSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());
    inputValue.trim() ? params.set("q", inputValue.trim()) : params.delete("q");
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  };

  const handleFilterChange = (filterId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    filterId === "ALL" ? params.delete("type") : params.set("type", filterId);
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setInputValue("");
    router.push(`/search?placeId=${placeId}`);
  };

  // Marker click: highlight + scroll the corresponding card into view
  const handleMarkerClick = (id: string) => {
    setHighlightedPoiId(id);
    document
      .getElementById(`poi-card-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-gray-50">
      {/* ── Search context bar ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 shrink-0 space-y-3">
        {/* Back + Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link
            href="/discover/hcmc"
            className="flex items-center gap-0.5 text-gray-400 hover:text-pink-600 transition-colors shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
          {/* <span className="text-gray-200">|</span>
          <Link href="/discover" className="hover:text-pink-600 transition-colors">
            Discover
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">{cityName}</span> */}
        </div>

        {/* Search input */}
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            placeholder={`Search in ${cityName}… (press Enter)`}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all"
          />
        </div>

        {/* Filter chips */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max pb-0.5">
            <FilterPills
              filters={SEARCH_FILTERS}
              activeFilter={typeParam === "" ? "ALL" : typeParam}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* ── Result count + sort + mobile map toggle ────────────────────────── */}
      <div className="flex items-center justify-between px-4 md:px-6 py-2 shrink-0 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">
            {isLoading
              ? "Searching…"
              : `${totalElements} place${totalElements !== 1 ? "s" : ""} found`}
          </p>

          {!isLoading && totalElements > 0 && (
            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)}>
              <SelectTrigger className="h-7 text-xs px-2.5 border-gray-200 bg-gray-50 rounded-lg w-auto gap-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Relevance</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="reviews">Most Reviewed</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="md:hidden gap-1.5 text-sm"
          onClick={() => setShowMap((v) => !v)}
        >
          {showMap ? <List className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
          {showMap ? "List" : "Map"}
        </Button>
      </div>

      {/* ── Split view ────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: Scrollable POI list ────────────────────────────────────── */}
        <div
          className={cn(
            "w-full md:w-[50%] h-full overflow-y-auto bg-gray-50 p-4 md:p-5",
            showMap ? "hidden md:flex md:flex-col" : "flex flex-col",
          )}
        >
          {isLoading || isFetching ? (
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : sortedResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center py-16">
              <SearchX className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="font-semibold text-gray-700 text-lg mb-1">No results found</h3>
              <p className="text-sm text-gray-500 mb-5">
                Try a different search or clear your filters.
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 pb-6">
              {sortedResults.map((poi) => (
                <div
                  id={`poi-card-${poi.id}`}
                  key={poi.id}
                  onMouseEnter={() => setHighlightedPoiId(String(poi.id))}
                  onMouseLeave={() => setHighlightedPoiId(null)}
                  className={cn(
                    "rounded-xl ring-2 ring-transparent transition-all duration-150",
                    highlightedPoiId === String(poi.id) && "ring-pink-400",
                  )}
                >
                  <SearchPOICard
                    poi={poi}
                    isSaved={false}
                    onSave={() => toast.info("Sign in to save places")}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Interactive map ───────────────────────────────────────── */}
        <div
          className={cn(
            "md:w-[50%] h-full relative bg-gray-100",
            showMap ? "block w-full" : "hidden md:block",
          )}
        >
          <SearchMap
            pois={sortedResults}
            center={VIETNAM_CENTER}
            highlightedId={highlightedPoiId}
            onMarkerClick={handleMarkerClick}
          />

          {showMap && (
            <Button
              className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-50 shadow-lg gap-2"
              onClick={() => setShowMap(false)}
            >
              <List className="h-4 w-4" />
              Back to list
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page export: Suspense required for useSearchParams ───────────────────────
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-gray-50">
          <ContextBarSkeleton />
          <div className="flex flex-1">
            <div className="w-full md:w-[40%] p-5 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
            <div className="hidden md:block md:w-[60%] bg-gray-100" />
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
