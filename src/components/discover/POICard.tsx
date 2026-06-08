import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Star, MapPin, ChevronRight, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { POI } from "@/types/discover";
import { getPoiTypeUi } from "@/lib/poi-transform";

interface POICardProps {
  poi: POI;
  isSaved: boolean;
  onSave: () => void;
  index?: number;
  showViewButton?: boolean;
}

export function POICard({
  poi,
  isSaved,
  onSave,
  index = 0,
  showViewButton = true,
}: POICardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="h-full"
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col rounded-xl shadow-sm">
        {/* Fixed Height Image Container */}
        <div className="relative h-48 overflow-hidden shrink-0">
          {poi.imageUrl && !imgError ? (
            <Image
              src={poi.imageUrl}
              alt={poi.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
          )}

          {/* Traveler's Choice Badge - Top Left */}
          {poi.isTravelersChoice && (
            <div className="absolute top-3 left-3 z-10">
              <Badge
                variant="success"
                className="flex items-center gap-1 shadow-sm"
              >
                <Award className="h-3 w-3" />
                Traveler's Choice
              </Badge>
            </div>
          )}

          {/* Category Badge - Top Left */}
          {!poi.isTravelersChoice && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className={`${getPoiTypeUi(poi.poiType).color} shadow-sm`}>
                {getPoiTypeUi(poi.poiType).label}
              </Badge>
            </div>
          )}

          {/* Save Button - Top Right */}
          <div className="absolute top-3 right-3 z-10">
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                onSave();
              }}
              className={`rounded-full bg-white/90 backdrop-blur-sm hover:bg-white ${
                isSaved ? "text-pink-600" : ""
              }`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Content Area with Flex Column */}
        <div className="flex flex-col flex-1 p-5 space-y-3">
          {/* Title - Always 2 lines */}
          <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-pink-600 transition-colors line-clamp-2 min-h-[2.5rem]">
            {poi.name}
          </h3>

          {/* Description - Always 2 lines */}
          {/* <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {poi.description}
          </p> */}

          {/* Rating Row */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold text-sm text-gray-900">
                {poi.rating}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({poi.reviewCount} reviews)
            </span>
          </div>

          {/* Location Row */}
          {poi.neighborhood && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{poi.neighborhood}</span>
            </div>
          )}

          {/* Push button to bottom with mt-auto */}
          {showViewButton && (
            <div className="mt-auto pt-3">
              <Button variant="outline" className="w-full" size="sm" asChild>
                <Link
                  href={`/poi/${poi.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
