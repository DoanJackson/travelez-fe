"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Star, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { semanticSearchPOIs } from "@/services/poiService";
import { getPoiTypeUi } from "@/lib/poi-transform";
import type { POIResponseData } from "@/types/poi";

type Tab = "similar" | "nearby";

interface PoiRecommendationsProps {
  poiId: number;
  placeId?: number;
  poiName: string;
  poiType: string;
  poiTypeDetail: string;
}

function buildQuery(tab: Tab, poiName: string, poiTypeDetail: string): string {
  if (tab === "similar") {
    return `Top ${poiTypeDetail} similar to ${poiName}`;
  }
  return `Popular attractions near ${poiName}`;
}

// ── Inline mini card ──────────────────────────────────────────────────────────

function RecommendationCard({ poi }: { poi: POIResponseData }) {
  const imageUrl = poi.medias?.find((m) => m.type === "IMAGE")?.url ?? "";
  const typeUi = getPoiTypeUi(poi.poiType);

  return (
    <Link href={`/poi/${poi.id}`} className="group block h-full">
      <Card className="overflow-hidden rounded-xl h-full flex flex-col hover:shadow-md transition-shadow">
        <div className="relative h-44 shrink-0 bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={poi.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="h-8 w-8 text-gray-300" />
            </div>
          )}
          <div className="absolute top-2.5 left-2.5">
            <Badge className={`${typeUi.color} shadow-sm text-xs`}>
              {typeUi.label}
            </Badge>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1 gap-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-pink-600 transition-colors">
            {poi.name}
          </h3>
          <div className="flex items-center gap-1.5 text-sm">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 shrink-0" />
            <span className="font-medium text-gray-900">
              {poi.rating.toFixed(1)}
            </span>
            <span className="text-gray-400">({poi.reviewCount})</span>
          </div>
          {poi.address && (
            <p className="text-xs text-gray-500 line-clamp-1 flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" />
              {poi.address}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border bg-background">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function PoiRecommendations({
  poiId,
  placeId,
  poiName,
  poiType,
  poiTypeDetail,
}: PoiRecommendationsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("similar");
  const [limit, setLimit] = useState(4);

  // Reset to compact view whenever the tab switches
  useEffect(() => {
    setLimit(4);
  }, [activeTab]);

  const query = buildQuery(activeTab, poiName, poiTypeDetail);

  const { data: results = [], isFetching } = useQuery<POIResponseData[]>({
    queryKey: ["poi-recommendations", poiId, activeTab, limit],
    queryFn: () =>
      semanticSearchPOIs(
        query,
        placeId,
        limit,
        activeTab === "similar" ? poiType : undefined,
      ),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section id="recommendations" className="scroll-mt-24 mt-10 sm:mt-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Explore more</h2>

        {/* Tab pills */}
        <div className="flex items-center gap-2">
          {(
            [
              { id: "similar", label: "Similar places" },
              { id: "nearby", label: "Nearby" },
            ] as { id: Tab; label: string }[]
          ).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === id
                  ? "bg-pink-600 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isFetching ? (
          Array.from({ length: limit }).map((_, i) => <CardSkeleton key={i} />)
        ) : results.length > 0 ? (
          results.map((poi) => <RecommendationCard key={poi.id} poi={poi} />)
        ) : (
          <p className="col-span-full py-10 text-center text-sm text-gray-400">
            No recommendations found.
          </p>
        )}
      </div>

      {/* Expand CTA — hidden once already expanded or when results didn't fill the limit */}
      {!isFetching && limit < 20 && results.length >= limit && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 min-w-60"
            onClick={() => setLimit(10)}
          >
            See more
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
