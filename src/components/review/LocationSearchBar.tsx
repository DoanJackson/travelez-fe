"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, CheckCircle2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getPOIList } from "@/services/poiService";
import type { ReviewLocation } from "@/types/review";

interface LocationSearchBarProps {
  /** The currently confirmed/selected location. */
  selected: ReviewLocation | null;
  /** Called when the user picks a location from the dropdown. */
  onSelect: (location: ReviewLocation) => void;
  /** Called when the user clears the selection. */
  onClear: () => void;
  className?: string;
}

// Bug 3 fix: check whether the rounded value is ≥ 10, not the raw count.
// Previously, count=9950 produced "10.0k" because toFixed(1) ran before the
// >= 10000 guard — now we decide the format after rounding.
function formatReviewCount(count: number): string {
  if (count < 1000) return String(count);
  const k = count / 1000;
  return k >= 10 ? `${Math.round(k)}k` : `${k.toFixed(1)}k`;
}

function truncateAddress(address: string | undefined): string {
  if (!address) return "";
  const parts = address.split(",");
  return parts.slice(0, 2).join(",").trim();
}

// Bug 1 fix: define POI_TYPE_CONFIG inline — it was referenced but never
// imported or declared, causing a ReferenceError on every dropdown render.
interface PoiBadgeConfig {
  badgeClass: string;
}

const POI_TYPE_CONFIG: Record<string, PoiBadgeConfig> = {
  RESTAURANT: {
    badgeClass:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  },
  ATTRACTION: {
    badgeClass:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  },
  CAFE: {
    badgeClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
  SHOPPING: {
    badgeClass:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  },
};

const DEFAULT_POI_CONFIG: PoiBadgeConfig = {
  badgeClass:
    "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
};

const LISTBOX_ID = "location-search-listbox";

export function LocationSearchBar({
  selected,
  onSelect,
  onClear,
  className,
}: LocationSearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // Bug 7 fix: track keyboard-focused item index for arrow-key navigation.
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Bug 5 fix: destructure isFetching to distinguish loading vs. empty results.
  const { data: poiData, isFetching } = useQuery({
    queryKey: ["pois", "search", debouncedQuery],
    queryFn: () => getPOIList({ name: debouncedQuery, size: 8 }),
    enabled: debouncedQuery.length >= 2,
    staleTime: 0,
  });

  // Bug 4 fix: short-circuit to [] when the debounced query is too short so
  // previously fetched data (still in poiData) doesn't leak through.
  const filtered: ReviewLocation[] =
    debouncedQuery.length < 2
      ? []
      : (poiData?.data?.content ?? []).map((poi) => ({
          id: poi.id,
          name: poi.name,
          imageUrl: poi.medias?.[0]?.url ?? "",
          address: `${poi.address}`,
          poiType: poi.poiType,
          poiTypeDetail: poi.poiTypeDetail,
          rating: poi.rating,
          reviewCount: poi.reviewCount,
        }));

  function handleSelect(loc: ReviewLocation) {
    onSelect(loc);
    setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleClear() {
    onClear();
    setQuery("");
  }

  // Bug 7 fix: keyboard navigation for the combobox.
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && filtered[activeIndex]) {
          handleSelect(filtered[activeIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
      }
    },
    [isOpen, activeIndex, filtered],
  );

  // ── Confirmed selection view ──────────────────────────────────
  if (selected) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 bg-white dark:bg-slate-900",
          "border-2 border-primary rounded-xl shadow-xl shadow-primary/10",
          "px-4 py-2.5 transition-all",
          className,
        )}
      >
        <CheckCircle2 className="size-5 text-primary shrink-0" />
        <span className="flex-1 text-base font-semibold text-slate-800 dark:text-slate-100 truncate">
          {selected.name}
        </span>
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear selected location"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full p-0.5"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  // ── Search state view ─────────────────────────────────────────
  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center gap-3 bg-white dark:bg-slate-900",
          "border-2 rounded-xl shadow-xl shadow-primary/10 px-4 py-2.5 transition-all",
          isOpen
            ? "border-primary rounded-b-none shadow-none"
            : "border-slate-200 dark:border-slate-700 hover:border-primary/50",
        )}
      >
        <MapPin className="size-5 text-primary shrink-0" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
            // Only open when there is enough text for a real query
            if (e.target.value.length >= 2) setIsOpen(true);
            else setIsOpen(false);
          }}
          // Bug 9 fix: only open on focus when there's already a valid query length.
          onFocus={() => {
            if (query.length >= 2) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search for a destination to review…"
          className="flex-1 border-none shadow-none p-0 h-auto focus-visible:ring-0 text-base font-medium bg-transparent placeholder:text-slate-400"
          aria-label="Search location"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          // Bug 8 fix: link the input to the listbox via aria-controls.
          aria-controls={LISTBOX_ID}
          aria-activedescendant={
            activeIndex >= 0 ? `location-option-${activeIndex}` : undefined
          }
          role="combobox"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              // Bug 10 fix: close dropdown and return focus to input when clearing.
              setQuery("");
              setIsOpen(false);
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
        {!query && <Search className="size-4 text-slate-400 shrink-0" />}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <ul
          id={LISTBOX_ID}
          role="listbox"
          aria-label="Location suggestions"
          className="absolute z-30 left-0 right-0 bg-white dark:bg-slate-900 border-2 border-t-0 border-primary rounded-b-xl shadow-xl overflow-hidden"
        >
          {filtered.length > 0 ? (
            filtered.map((loc, index) => (
              <li
                key={loc.id}
                id={`location-option-${index}`}
                role="option"
                // Bug 6 fix: in the dropdown view, selected is always null (we returned
                // early above), so no listbox option is ever the confirmed selection.
                aria-selected={false}
              >
                <button
                  type="button"
                  onClick={() => handleSelect(loc)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 transition-colors text-left",
                    index === activeIndex
                      ? "bg-primary/10 dark:bg-primary/20"
                      : "hover:bg-primary/5 dark:hover:bg-primary/10",
                  )}
                >
                  {/* Name + address */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {loc.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {truncateAddress(loc.address)}
                    </p>
                  </div>

                  {/* Badge + rating */}
                  <div className="flex flex-col items-end gap-1 shrink-0 max-w-[120px]">
                    {loc.poiTypeDetail && (
                      <span
                        className={cn(
                          "text-[10px] font-medium px-2 py-0.5 rounded-full truncate max-w-full",
                          (
                            POI_TYPE_CONFIG[loc.poiType ?? ""] ??
                            DEFAULT_POI_CONFIG
                          ).badgeClass,
                        )}
                      >
                        {loc.poiTypeDetail}
                      </span>
                    )}
                    {loc.rating != null && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="text-amber-500 dark:text-amber-400 text-xs leading-none">
                          ★
                        </span>
                        {loc.rating.toFixed(1)}
                        {loc.reviewCount != null && (
                          <span className="text-slate-400 dark:text-slate-500">
                            ({formatReviewCount(loc.reviewCount)})
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))
          ) : (
            // Bug 5 fix: distinguish between loading and genuinely empty results.
            <li className="px-4 py-4 text-sm text-slate-400 dark:text-slate-500 text-center">
              {isFetching
                ? `Searching for “${debouncedQuery}”…`
                : debouncedQuery.length >= 2
                  ? `No locations found for “${debouncedQuery}”`
                  : "Type at least 2 characters to search"}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
