import type { City } from "@/lib/mock-discover-data"
import { CityCard } from "@/components/discover/CityCard"
import { FilterPills } from "@/components/discover/FilterPills"
import { SectionHeader } from "@/components/discover/SectionHeader"
import type { FilterOption } from "@/types/discover"

const cityFilters: FilterOption[] = [
  { id: "all", label: "All" },
  { id: "north", label: "North" },
  { id: "central", label: "Central" },
  { id: "south", label: "South" },
  { id: "nature", label: "Nature" },
  { id: "foodie", label: "Foodie" },
  { id: "cultural", label: "Cultural" },
]

export interface CitiesSectionProps {
  cities: City[]
  savedCities: Set<string>
  followedCities: Set<string>
  activeFilter: string
  onFilterChange: (filter: string) => void
  onSaveCity: (cityId: string) => void
  onFollowCity: (cityId: string) => void
  isSearching?: boolean
  searchError?: string | null
  isActiveSearch?: boolean
}

export function CitiesSection({
  cities,
  savedCities,
  followedCities,
  activeFilter,
  onFilterChange,
  onSaveCity,
  onFollowCity,
  isSearching = false,
  searchError = null,
  isActiveSearch = false,
}: CitiesSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Places to visit in Vietnam"
          subtitle="Explore cities and regions based on vibe and popularity."
        />

        {!isActiveSearch && (
          <div className="mb-8">
            <FilterPills
              filters={cityFilters}
              activeFilter={activeFilter}
              onFilterChange={onFilterChange}
            />
          </div>
        )}

        {isSearching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : searchError ? (
          <p className="text-sm text-red-500 py-8 text-center">{searchError}</p>
        ) : cities.length === 0 && isActiveSearch ? (
          <p className="text-sm text-slate-500 py-8 text-center">
            No places found for your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cities.map((city, index) => (
              <CityCard
                key={city.id}
                city={city}
                isSaved={savedCities.has(city.id)}
                isFollowed={followedCities.has(city.id)}
                onSave={() => onSaveCity(city.id)}
                onFollow={() => onFollowCity(city.id)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
