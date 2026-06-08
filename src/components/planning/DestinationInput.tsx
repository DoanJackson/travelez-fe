"use client";

import { useState, useCallback, useMemo, KeyboardEvent, MouseEvent } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DestinationInputProps {
  destinations: string[];
  onAdd: (destination: string) => void;
  onRemove: (destination: string) => void;
  maxDestinations?: number;
}

const VIETNAM_DESTINATIONS = [
  {
    id: "thanh_pho_ho_chi_minh",
    name: "Ho Chi Minh City",
    country: "Vietnam",
    image: "/destination/hcm.jpg", // Đường dẫn nội bộ trong folder public
    description:
      "A vibrant metropolis blending timeless history with modern energy.",
    isAvailable: true,
  },
  {
    id: "thanh_pho_ha_noi",
    name: "Hanoi",
    country: "Vietnam",
    image: "/destination/hn.jpg",
    description:
      "The capital city, rich in centuries-old architecture and cultural heritage.",
    isAvailable: false,
  },
  {
    id: "tinh_quang_ninh",
    name: "Ha Long Bay",
    country: "Vietnam",
    image: "/destination/halong.jpg",
    description:
      "Famous for its emerald waters and thousands of towering limestone islands.",
    isAvailable: false,
  },
  {
    id: "thanh_pho_hue",
    name: "Hue",
    country: "Vietnam",
    image: "/destination/hue.jpg",
    description:
      "The ancient imperial capital, showcasing majestic palaces and royal tombs.",
    isAvailable: false,
  },
  {
    id: "thanh_pho_da_nang",
    name: "Da Nang",
    country: "Vietnam",
    image: "/destination/danang.jpg",
    description:
      "A modern coastal city known for sandy beaches and the iconic Dragon Bridge.",
    isAvailable: false,
  },
  {
    id: "thanh_pho_hoi_an",
    name: "Hoi An",
    country: "Vietnam",
    image: "/destination/hoian.jpg",
    description:
      "An exceptionally well-preserved old town illuminated by thousands of lanterns.",
    isAvailable: false,
  },
  {
    id: "tinh_can_tho",
    name: "Can Tho",
    country: "Vietnam",
    image: "/destination/cantho.jpg",
    description:
      "The heart of the Mekong Delta, famous for bustling floating markets.",
    isAvailable: false,
  },
  {
    id: "tinh_lao_cai",
    name: "Sapa",
    country: "Vietnam",
    image: "/destination/sapa.jpg",
    description:
      "A misty mountain town surrounded by breathtaking terraced rice fields.",
    isAvailable: false,
  },
] as const;

// Reverse map: slug → display name, used for badge rendering
const SLUG_TO_NAME: Record<string, string> = Object.fromEntries(
  VIETNAM_DESTINATIONS.map((d) => [d.id, d.name]),
);

export default function DestinationInput({
  destinations,
  onAdd,
  onRemove,
  maxDestinations = 20,
}: DestinationInputProps) {
  const [inputValue, setInputValue] = useState("");

  const selectedSet = useMemo(() => new Set(destinations), [destinations]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const normalized = inputValue.trim().replace(/\s+/g, " ");
        if (normalized && destinations.length < maxDestinations) {
          const matched = VIETNAM_DESTINATIONS.find(
            (d) => d.name.toLowerCase() === normalized.toLowerCase(),
          );
          const slug = matched
            ? matched.id
            : normalized.toLowerCase().replace(/\s+/g, "_");

          if (!selectedSet.has(slug)) {
            onAdd(slug);
            setInputValue("");
          } else {
            setInputValue("");
          }
        }
      }
    },
    [destinations.length, inputValue, maxDestinations, onAdd, selectedSet],
  );

  const handleSelectDestination = useCallback(
    (slug: string) => {
      const dest = VIETNAM_DESTINATIONS.find((d) => d.id === slug);
      if (!dest?.isAvailable) return;
      if (destinations.length < maxDestinations && !selectedSet.has(slug)) {
        onAdd(slug);
        setInputValue("");
      }
    },
    [destinations.length, maxDestinations, onAdd, selectedSet],
  );

  const handleBadgeRemove = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const slug = (e.currentTarget as HTMLButtonElement).dataset.slug;
      if (slug) onRemove(slug);
    },
    [onRemove],
  );

  const handleCardClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const slug = (e.currentTarget as HTMLDivElement).dataset.slug;
      if (slug) handleSelectDestination(slug);
    },
    [handleSelectDestination],
  );

  const canAddMore = destinations.length < maxDestinations;

  // All 8 cards stay in grid; filter only by search query (no removal on select).
  const visibleDestinations = useMemo(
    () =>
      VIETNAM_DESTINATIONS.filter(
        (dest) =>
          !inputValue ||
          dest.name.toLowerCase().includes(inputValue.toLowerCase()),
      ),
    [inputValue],
  );

  return (
    <div className="space-y-6">
      {/* Selected destinations — display names resolved from slugs */}
      {destinations.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
          {destinations.map((slug) => (
            <Badge
              key={slug}
              variant="secondary"
              className="text-base py-2 px-4 bg-pink-100 text-pink-900 hover:bg-pink-200"
            >
              {SLUG_TO_NAME[slug] ?? slug}
              <button
                data-slug={slug}
                onClick={handleBadgeRemove}
                className="ml-2 hover:text-pink-700"
              >
                <X className="h-4 w-4" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
          <div className="text-3xl">✈️</div>
          <Input
            type="text"
            placeholder={
              canAddMore
                ? "Tell our AI where you want to go (press Enter to add)"
                : `Maximum ${maxDestinations} destinations reached`
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!canAddMore}
            className="flex-1 bg-white text-lg"
          />
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        {canAddMore && (
          <p className="text-sm text-gray-600 text-center">
            You can add up to {maxDestinations} destinations. AI will optimize
            the route.
            {destinations.length > 0 &&
              ` (${destinations.length}/${maxDestinations} added)`}
          </p>
        )}
      </div>

      {/* Destination grid — always visible when canAddMore, filtered by query */}
      {canAddMore && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Popular destinations
          </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {visibleDestinations.map((dest, index) => {
                const isSelected = selectedSet.has(dest.id);
                return (
                  <Card
                    key={dest.id}
                    data-slug={dest.id}
                    className={cn(
                      "overflow-hidden transition-shadow relative",
                      isSelected
                        ? "border-2 border-pink-500 ring-2 ring-pink-100"
                        : "border border-transparent",
                      dest.isAvailable && !isSelected
                        ? "cursor-pointer"
                        : !dest.isAvailable
                          ? "cursor-not-allowed"
                          : "",
                    )}
                    onClick={handleCardClick}
                  >
                    <div className="relative h-32">
                      <Image
                        src={dest.image}
                        alt={dest.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 224px"
                        className="object-cover rounded-t-xl"
                        priority={index === 0}
                      />
                    </div>
                    {!dest.isAvailable && (
                      <Badge className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px]">
                        Coming Soon
                      </Badge>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{dest.name}</h3>
                      <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 min-h-8 cursor-default">
                        {dest.description}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
        </div>
      )}
    </div>
  );
}
