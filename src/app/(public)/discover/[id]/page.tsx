"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  CloudSun,
  Wallet,
  Clock,
  UtensilsCrossed,
  ChevronRight,
  MapPin,
  BookOpen,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getCityBySlug,
  getCityGuides,
  getCityHeroImages,
  CityGuide,
} from "@/lib/mock-city-detail";
import {
  transformToPOI,
  transformToDiningVenue,
  transformToExperience,
} from "@/lib/poi-transform";
import { useSemanticPOIs } from "@/hooks/useSemanticPOIs";
import type { SemanticFilterConfig } from "@/hooks/useSemanticPOIs";
import { POI, DiningVenue, Experience } from "@/types/discover";
import { POICard } from "@/components/discover/POICard";
import { ExperienceCard } from "@/components/discover/ExperienceCard";
import { DiningCard } from "@/components/discover/DiningCard";
import { FilterPills } from "@/components/discover/FilterPills";
import { SectionHeader } from "@/components/discover/SectionHeader";
import { CityMap } from "@/components/discover/CityMap";
import { CityHeroCarousel } from "@/components/discover/CityHeroCarousel";
import { PlanTripPanel } from "@/components/discover/PlanTripPanel";
import { FilterOption } from "@/types/discover";

type TabValue =
  | "overview"
  | "attractions"
  | "dining"
  | "experiences"
  | "guides";

const attractionFilters: FilterOption[] = [
  { id: "All", label: "All" },
  { id: "Historical & Cultural", label: "Historical & Cultural" },
  { id: "Nature & Views", label: "Nature & Views" },
  { id: "Spiritual & Sacred", label: "Spiritual & Sacred" },
  { id: "Local Life & Hidden Gems", label: "Local Life & Hidden Gems" },
  { id: "Nightlife", label: "Nightlife" },
];

const ATTRACTION_FILTER_CONFIGS: Record<string, SemanticFilterConfig> = {
  All: {
    query:
      "A diverse mix of iconic historical landmarks, cultural sites, and beautiful hidden gems",
  },
  "Historical & Cultural": {
    query:
      "Historical monuments, heritage architecture, museums, and cultural landmarks",
  },
  "Nature & Views": {
    query:
      "Beautiful parks, outdoor nature spots, scenic viewpoints, and relaxing natural landscapes",
    poiType: "NATURE",
  },
  "Spiritual & Sacred": {
    query:
      "Sacred temples, historic pagodas, iconic churches, and peaceful spiritual sites for mindfulness and cultural worship",
    poiType: "RELIGIOUS",
  },
  "Local Life & Hidden Gems": {
    query:
      "Off-the-beaten-path locations, quiet local neighborhoods, unique hidden gems, and authentic local life",
  },
  Nightlife: {
    query:
      "Vibrant nightlife, entertainment centers, walking streets, and evening activities",
    poiType: "NIGHTLIFE",
  },
};

const diningFilters: FilterOption[] = [
  { id: "All", label: "All" },
  { id: "Local Suggestions", label: "Local Suggestions" },
  { id: "Michelin & Fine Dining", label: "Michelin & Fine Dining" },
  { id: "Fusion & Global", label: "Fusion & Global" },
  { id: "Cafe Culture", label: "Cafe Culture" },
];

const DINING_FILTER_CONFIGS: Record<string, SemanticFilterConfig> = {
  All: {
    query:
      "Top-rated dining experiences ranging from authentic local Vietnamese street food to modern fusion cuisine and Michelin-recommended restaurants",
  },
  "Local Suggestions": {
    query:
      "Authentic traditional Vietnamese family meals, local favorites like cơm mâm, and highly-rated local eateries",
    poiType: "RESTAURANT",
  },
  "Michelin & Fine Dining": {
    query:
      "Michelin-recommended restaurants, premium fine dining, and upscale culinary experiences",
    poiType: "RESTAURANT",
  },
  "Fusion & Global": {
    query:
      "Modern Vietnamese fusion cuisine, high-quality Japanese, Western, and Asian international restaurants",
    poiType: "RESTAURANT",
  },
  "Cafe Culture": {
    query:
      "Trendy local cafes, specialty coffee shops, and beautiful spaces for relaxing or working",
    poiType: "CAFE_DESSERT",
  },
};

const experienceFilters: FilterOption[] = [
  { id: "All", label: "All" },
  { id: "Local Fashion Brands", label: "Local Fashion Brands" },
  { id: "Creative Workshops", label: "Creative Workshops" },
  { id: "Traditional & Souvenirs", label: "Traditional & Souvenirs" },
];

const SHOPPING_EXPERIENCE_FILTER_CONFIGS: Record<string, SemanticFilterConfig> =
  {
    All: {
      query:
        "Unique local experiences including trendy Vietnamese fashion brands, creative artisan workshops, and authentic cultural souvenirs",
    },
    "Local Fashion Brands": {
      query:
        "Trendy local fashion brands, boutique clothing stores, and independent Vietnamese designer shops",
      poiType: "SHOPPING",
    },
    "Creative Workshops": {
      query:
        "Hands-on creative experiences, artisan workshops like pottery making, painting, and crafting",
      poiType: "OTHER",
    },
    "Traditional & Souvenirs": {
      query:
        "Authentic local markets, specialty regional goods, and traditional handmade souvenirs",
      poiType: "SHOPPING",
    },
  };

export default function CityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState<TabValue>("overview");
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [savedPOIs, setSavedPOIs] = useState<Set<string>>(new Set());
  const [savedDining, setSavedDining] = useState<Set<string>>(new Set());
  const [attractionFilter, setAttractionFilter] = useState("All");
  const [diningFilter, setDiningFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [showStickyTitle, setShowStickyTitle] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Section refs for scrolling
  const overviewRef = useRef<HTMLElement>(null);
  const attractionsRef = useRef<HTMLElement>(null);
  const diningRef = useRef<HTMLElement>(null);
  const experiencesRef = useRef<HTMLElement>(null);
  const guidesRef = useRef<HTMLElement>(null);

  // Get city data (synchronous — resolved before effects run)
  const city = getCityBySlug(id);
  const guides = getCityGuides(id);
  const heroImages = getCityHeroImages(id);

  // Scroll detection for sticky title reveal
  React.useEffect(() => {
    const handleScroll = () => {
      setShowStickyTitle(window.scrollY > 450);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Semantic search — re-fetches on filter change, caches previous results
  const attractionConfig = ATTRACTION_FILTER_CONFIGS[attractionFilter];
  const diningConfig = DINING_FILTER_CONFIGS[diningFilter];
  const experienceConfig = SHOPPING_EXPERIENCE_FILTER_CONFIGS[experienceFilter];

  const { data: attractionPois = [], isPending: poisLoading } = useSemanticPOIs(
    city?.placeId,
    attractionConfig,
    (raw) => raw.map(transformToPOI),
  );

  const { data: diningVenues = [], isPending: diningLoading } = useSemanticPOIs(
    city?.placeId,
    diningConfig,
    (raw) => raw.map(transformToDiningVenue),
  );

  const { data: experiences = [], isPending: experiencesLoading } =
    useSemanticPOIs(
      city?.placeId,
      experienceConfig,
      (raw) => raw.map(transformToExperience),
      8,
    );

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm px-4">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-pink-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Coming soon</h1>
          <p className="text-gray-600 mb-6">
            We&apos;re building content for this destination. Check back soon!
          </p>
          <Button onClick={() => router.push("/discover")}>
            Explore other destinations
          </Button>
        </div>
      </div>
    );
  }

  // Callbacks
  const handleTabChange = useCallback((value: string) => {
    const tabValue = value as TabValue;
    setActiveTab(tabValue);

    const refs: Record<TabValue, React.RefObject<HTMLElement | null>> = {
      overview: overviewRef,
      attractions: attractionsRef,
      dining: diningRef,
      experiences: experiencesRef,
      guides: guidesRef,
    };

    const targetRef = refs[tabValue];
    if (targetRef.current) {
      const offset = 120;
      const top = targetRef.current.offsetTop - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const handleSaveCity = useCallback(() => {
    setIsSaved((prev) => !prev);
  }, []);

  const handleFollowCity = useCallback(() => {
    setIsFollowed((prev) => !prev);
  }, []);

  const handleShare = useCallback(() => {
    console.log("Share city:", city.name);
  }, [city.name]);

  const handleSavePOI = useCallback((poiId: string) => {
    setSavedPOIs((prev) => {
      const newSet = new Set(prev);
      newSet.has(poiId) ? newSet.delete(poiId) : newSet.add(poiId);
      return newSet;
    });
  }, []);

  const handleSaveDining = useCallback((diningId: string) => {
    setSavedDining((prev) => {
      const newSet = new Set(prev);
      newSet.has(diningId) ? newSet.delete(diningId) : newSet.add(diningId);
      return newSet;
    });
  }, []);

  const handleCreateItinerary = useCallback(() => {
    const queryParams = new URLSearchParams();
    queryParams.set("city", city.id);
    if (startDate) queryParams.set("startDate", startDate.toISOString());
    if (endDate) queryParams.set("endDate", endDate.toISOString());
    router.push(`/planning?${queryParams.toString()}`);
  }, [city.id, startDate, endDate, router]);

  const handlePlanWithoutDates = useCallback(() => {
    router.push(`/planning?city=${city.id}`);
  }, [city.id, router]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Carousel */}
      <CityHeroCarousel
        cityName={city.name}
        images={heroImages}
        tags={city.tags}
        placesCount={city.placesCount}
        reviewsCount={city.reviewsCount}
        isSaved={isSaved}
        isFollowed={isFollowed}
        onSave={handleSaveCity}
        onFollow={handleFollowCity}
        onShare={handleShare}
      />

      {/* Sticky Tabs Navigation */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {/* City Name - Animated */}
            <div
              className={`transition-all duration-300 ease-in-out font-bold text-lg text-gray-900 whitespace-nowrap ${
                showStickyTitle
                  ? "w-auto opacity-100"
                  : "w-0 opacity-0 overflow-hidden"
              }`}
            >
              {city.name}
            </div>
            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="flex-1 w-full"
            >
              <TabsList className="w-full justify-start h-12 bg-transparent border-0 overflow-x-auto">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="attractions"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500"
                >
                  Top Attractions
                </TabsTrigger>
                <TabsTrigger
                  value="dining"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500"
                >
                  Dining
                </TabsTrigger>
                {!experiencesLoading && experiences.length > 0 && (
                  <TabsTrigger
                    value="experiences"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500"
                  >
                    Shopping & More
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="guides"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500"
                >
                  Travel Guides
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Expandable search trigger */}
            <div className="ml-auto flex items-center shrink-0">
              {searchOpen ? (
                <div className="flex items-center gap-1">
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        const qs = new URLSearchParams({
                          placeId: String(city.placeId),
                          cityName: city.name,
                          q: searchQuery.trim(),
                        });
                        setSearchOpen(false);
                        setSearchQuery("");
                        router.push(`/search?${qs.toString()}`);
                      }
                      if (e.key === "Escape") {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }
                    }}
                    placeholder={`Search in ${city.name}…`}
                    className="w-40 sm:w-56 pl-3 pr-2 py-1.5 rounded-full bg-gray-100 text-sm
                               focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
                  />
                  <button
                    onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-full text-gray-500 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                  aria-label="Search places"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <OverviewSection ref={overviewRef} city={city} />

      {/* Map & Plan Trip Combined Section */}
      <MapAndPlanSection
        cityName={city.name}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onCreateItinerary={handleCreateItinerary}
        onPlanWithoutDates={handlePlanWithoutDates}
      />

      {/* Attractions Section */}
      <AttractionsSection
        ref={attractionsRef}
        cityId={id}
        placeId={city.placeId}
        cityName={city.name}
        pois={attractionPois}
        savedPOIs={savedPOIs}
        filter={attractionFilter}
        onFilterChange={setAttractionFilter}
        onSavePOI={handleSavePOI}
      />

      {/* Dining Section */}
      <DiningSection
        ref={diningRef}
        cityId={id}
        placeId={city.placeId}
        cityName={city.name}
        venues={diningVenues}
        savedVenues={savedDining}
        filter={diningFilter}
        onFilterChange={setDiningFilter}
        onSaveVenue={handleSaveDining}
      />

      {/* Experiences Section */}
      <ExperiencesSection
        cityId={id}
        placeId={city.placeId}
        ref={experiencesRef}
        cityName={city.name}
        experiences={experiences}
        isLoading={experiencesLoading}
        filter={experienceFilter}
        onFilterChange={setExperienceFilter}
        filterOptions={experienceFilters}
      />

      {/* Guides Section */}
      <GuidesSection ref={guidesRef} cityName={city.name} guides={guides} />
    </div>
  );
}

// Section Components
const OverviewSection = React.forwardRef<
  HTMLElement,
  { city: ReturnType<typeof getCityBySlug> }
>(({ city }, ref) => {
  if (!city) return null;
  return (
    <section ref={ref} id="overview" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* About */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About {city.name}
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-4xl">
            {city.description}
          </p>
        </div>

        {/* Quick Facts */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Facts</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Best time to visit
                  </h4>
                  <p className="text-sm text-gray-600">
                    {city.quickFacts.bestTime}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start gap-3">
                <CloudSun className="h-5 w-5 text-sky-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Weather</h4>
                  <p className="text-sm text-gray-600">
                    {city.quickFacts.weather}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start gap-3">
                <Wallet className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Average daily budget
                  </h4>
                  <p className="text-sm text-gray-600">
                    {city.quickFacts.budget}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Recommended stay
                  </h4>
                  <p className="text-sm text-gray-600">
                    {city.quickFacts.recommendedStay}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Popular travel styles
            </h4>
            <div className="flex flex-wrap gap-2">
              {city.quickFacts.popularStyles.map((style: string) => (
                <Badge key={style} variant="style">
                  {style}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
OverviewSection.displayName = "OverviewSection";

interface MapAndPlanSectionProps {
  cityName: string;
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onCreateItinerary: () => void;
  onPlanWithoutDates: () => void;
}

function MapAndPlanSection(props: MapAndPlanSectionProps) {
  const { cityName } = props;

  return (
    <section id="map" className="pt-4 pb-4 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Column - Takes 2/3 width on desktop */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Map & Location
            </h3>
            <CityMap cityName={cityName} />
          </div>

          {/* Plan Trip Panel - Sticky on desktop */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Plan Your Trip
              </h3>
              <PlanTripPanel {...props} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface AttractionsSectionProps {
  cityId: string;
  placeId: number;
  cityName: string;
  pois: POI[];
  savedPOIs: Set<string>;
  filter: string;
  onFilterChange: (filter: string) => void;
  onSavePOI: (id: string) => void;
}

const AttractionsSection = React.forwardRef<
  HTMLElement,
  AttractionsSectionProps
>(
  (
    {
      cityId,
      placeId,
      cityName,
      pois,
      savedPOIs,
      filter,
      onFilterChange,
      onSavePOI,
    },
    ref,
  ) => {
    return (
      <section ref={ref} id="attractions" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={`Top attractions in ${cityName}`}
            subtitle="Must-see places based on traveler reviews"
          />

          <div className="mb-8">
            <FilterPills
              filters={attractionFilters}
              activeFilter={filter}
              onFilterChange={onFilterChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {pois.map((poi, index) => (
              <POICard
                key={poi.id}
                poi={poi}
                isSaved={savedPOIs.has(poi.id)}
                onSave={() => onSavePOI(poi.id)}
                index={index}
              />
            ))}
          </div>

          <div className="flex justify-center">
            {(() => {
              const cfg = ATTRACTION_FILTER_CONFIGS[filter];
              const qs = new URLSearchParams({ placeId: String(placeId), cityName, filter });
              if (cfg?.poiType) qs.set("type", cfg.poiType);
              return (
                <Button asChild variant="outline" size="lg" className="px-8">
                  <Link href={`/search?${qs.toString()}`}>
                    View more attractions
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              );
            })()}
          </div>
        </div>
      </section>
    );
  },
);
AttractionsSection.displayName = "AttractionsSection";

interface DiningSectionProps {
  cityId: string;
  placeId: number;
  cityName: string;
  venues: DiningVenue[];
  savedVenues: Set<string>;
  filter: string;
  onFilterChange: (filter: string) => void;
  onSaveVenue: (id: string) => void;
}

const DiningSection = React.forwardRef<HTMLElement, DiningSectionProps>(
  (
    {
      placeId,
      cityName,
      venues,
      savedVenues,
      filter,
      onFilterChange,
      onSaveVenue,
    },
    ref,
  ) => {
    return (
      <section ref={ref} id="dining" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={`Where to eat & drink in ${cityName}`}
            subtitle="Local cuisine, street food, cafés, and popular dining spots"
            icon={UtensilsCrossed}
          />

          <div className="mb-8">
            <FilterPills
              filters={diningFilters}
              activeFilter={filter}
              onFilterChange={onFilterChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue, index) => (
              <DiningCard
                key={venue.id}
                venue={venue}
                href={`/poi/${venue.id}`}
                isSaved={savedVenues.has(venue.id)}
                onSave={() => onSaveVenue(venue.id)}
                index={index}
              />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            {(() => {
              const cfg = DINING_FILTER_CONFIGS[filter];
              const qs = new URLSearchParams({ placeId: String(placeId), cityName, filter });
              if (cfg?.poiType) qs.set("type", cfg.poiType);
              return (
                <Button asChild variant="outline" size="lg" className="px-8">
                  <Link href={`/search?${qs.toString()}`}>
                    View more dining
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              );
            })()}
          </div>
        </div>
      </section>
    );
  },
);
DiningSection.displayName = "DiningSection";

interface ExperiencesSectionProps {
  cityName: string;
  experiences: Experience[];
  cityId: string;
  placeId: number;
  isLoading?: boolean;
  filter: string;
  onFilterChange: (filter: string) => void;
  filterOptions: FilterOption[];
}

const ExperiencesSection = React.forwardRef<
  HTMLElement,
  ExperiencesSectionProps
>(
  (
    {
      cityName,
      experiences,
      placeId,
      isLoading,
      filter,
      onFilterChange,
      filterOptions,
    },
    ref,
  ) => {
    if (!isLoading && experiences.length === 0) return null;
    return (
      <section ref={ref} id="experiences" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={`Shopping & More in ${cityName}`}
            subtitle="Markets, shops, and other local spots"
          />

          <div className="mb-8">
            <FilterPills
              filters={filterOptions}
              activeFilter={filter}
              onFilterChange={onFilterChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {experiences.map((experience, index) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                href={`/poi/${experience.id}`}
                index={index}
              />
            ))}
          </div>
          <div className="flex justify-center mt-12">
            {(() => {
              const cfg = SHOPPING_EXPERIENCE_FILTER_CONFIGS[filter];
              const qs = new URLSearchParams({ placeId: String(placeId), cityName, filter });
              if (cfg?.poiType) qs.set("type", cfg.poiType);
              return (
                <Button asChild variant="outline" size="lg" className="px-8">
                  <Link href={`/search?${qs.toString()}`}>
                    View more shopping
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              );
            })()}
          </div>
        </div>
      </section>
    );
  },
);
ExperiencesSection.displayName = "ExperiencesSection";

const GuidesSection = React.forwardRef<
  HTMLElement,
  { cityName: string; guides: CityGuide[] }
>(({ cityName, guides }, ref) => (
  <section ref={ref} id="guides" className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        title={`Travel guides for ${cityName}`}
        subtitle="Expert tips and local insights"
        icon={BookOpen}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {guides.map((guide) => (
          <GuidePhotoCard key={guide.id} guide={guide} />
        ))}
      </div>
    </div>
  </section>
));
GuidesSection.displayName = "GuidesSection";

function GuidePhotoCard({ guide }: { guide: CityGuide }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative aspect-3/4 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300">
      {!imgError && guide.imageUrl ? (
        <Image
          src={guide.imageUrl}
          alt={guide.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgError(true)}
          unoptimized
        />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-pink-100 to-pink-200 flex items-center justify-center">
          <BookOpen className="h-10 w-10 text-pink-400" />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
        {guide.readTime && (
          <span className="text-white/70 text-xs mb-1">{guide.readTime}</span>
        )}
        <h3 className="text-white font-semibold text-sm sm:text-base leading-snug line-clamp-3">
          {guide.title}
        </h3>
        {guide.author && (
          <p className="text-white/60 text-xs mt-1">{guide.author}</p>
        )}
      </div>
    </div>
  );
}
