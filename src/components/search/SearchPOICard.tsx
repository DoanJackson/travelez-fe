"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Star, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPoiTypeUi } from "@/lib/poi-transform";
import type { POIResponseData } from "@/types/poi";

interface SearchPOICardProps {
  poi: POIResponseData;
  isSaved?: boolean;
  onSave?: () => void;
}

export function SearchPOICard({ poi, isSaved = false, onSave }: SearchPOICardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = poi.medias?.find((m) => m.type === "IMAGE")?.url ?? "";
  const typeUi = getPoiTypeUi(poi.poiType);

  return (
    <Card className="group overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-row h-32 sm:h-36">
      {/* Thumbnail */}
      <div className="relative w-32 sm:w-40 shrink-0 bg-gray-100">
        {imageUrl && !imgError ? (
          <Image
            src={imageUrl}
            alt={poi.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-8 w-8 text-gray-300" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge className={`${typeUi.color} shadow-sm text-[10px] px-1.5 py-0.5`}>
            {typeUi.label}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0 p-3 sm:p-4 justify-between">
        <div className="space-y-0.5">
          {/* Name */}
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-pink-600 transition-colors">
            {poi.name}
          </h3>

          {/* Type detail */}
          {poi.poiTypeDetail && (
            <p className="text-xs text-gray-400">{poi.poiTypeDetail}</p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 shrink-0" />
            <span className="text-xs font-semibold text-gray-800">
              {poi.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">({poi.reviewCount})</span>
          </div>

          {/* Address */}
          {poi.address && (
            <div className="flex items-start gap-1 pt-0.5">
              <MapPin className="h-3 w-3 text-gray-300 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 line-clamp-1">{poi.address}</p>
            </div>
          )}
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-between mt-2">
          <Link href={`/poi/${poi.id}`}>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1 px-2.5">
              View details
              <ChevronRight className="h-3 w-3" />
            </Button>
          </Link>

          <button
            type="button"
            onClick={onSave}
            aria-label={isSaved ? "Unsave place" : "Save place"}
            className={cn(
              "h-7 w-7 rounded-full flex items-center justify-center transition-colors",
              "border border-gray-200 bg-white hover:bg-pink-50",
              isSaved ? "text-pink-600 border-pink-300" : "text-gray-400",
            )}
          >
            <Heart className={cn("h-3.5 w-3.5", isSaved && "fill-current")} />
          </button>
        </div>
      </div>
    </Card>
  );
}
