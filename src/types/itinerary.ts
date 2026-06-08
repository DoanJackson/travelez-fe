// ─── Backend API Contracts ────────────────────────────────────────────────────
import type { BaseResponse, PaginatedData } from "./api";

export type { BaseResponse, PaginatedData }; // re-export for existing consumers

// ─── Request ──────────────────────────────────────────────────────────────────

export interface ItineraryCreationRequest {
  destinationCities: string[]; // Official DB province names e.g. ["Thành phố Hồ Chí Minh"]
  startDate: string; // ISO format e.g. "2025-11-11"
  endDate: string; // ISO format e.g. "2025-11-13"
  budget: number;
  styles: string[];
  specialNotes?: string;
  companion: string;
  hasKids: boolean;
  hasPets: boolean;
}

// ─── List view (GET /api/itineraries) ─────────────────────────────────────────

export type ItineraryStatus = "PLANNING" | "ONGOING" | "COMPLETED" | "CANCELLED";

/**
 * Lightweight summary shape returned in the itinerary list.
 * Does NOT include full day-by-day activity details.
 */
export interface ItinerarySummary {
  id: number;                    // int64 permanent PK
  title: string;
  styles: string[];
  status: ItineraryStatus;
  destinationCities: string[];   // e.g. ["Hà Nội", "Đà Nẵng"]
  startDate: string;             // ISO date "2025-11-11"
  endDate: string;               // ISO date "2025-11-13"
  createdAt: string;             // ISO datetime
  isPublic?: boolean;
}

export type ItinerariesApiResponse = BaseResponse<
  PaginatedData<ItinerarySummary>
>;

// ─── Shared-with-me list (GET /api/management/itineraries/shared-with-me) ────

export interface SharedItinerarySummary extends ItinerarySummary {
  ownerUsername: string;
}

export type SharedItinerariesApiResponse = BaseResponse<
  PaginatedData<SharedItinerarySummary>
>;

export interface PublicItinerarySummary extends ItinerarySummary {
  ownerUsername?: string;
}

export type PublicItinerariesApiResponse = BaseResponse<
  PaginatedData<PublicItinerarySummary>
>;

// ─── Collaboration types (GET /api/management/itineraries/{id}/shared-users) ──

export interface SharedUserItem {
  userId: number;
  username: string;
  avatarUrl: string;
  sharedAt: string; // ISO datetime
}

export type SharedUsersPageResponse = BaseResponse<PaginatedData<SharedUserItem>>;
export type SharedUsersSearchResponse = BaseResponse<SharedUserItem[]>;

// ─── Detail view (GET /api/itineraries/:id) ───────────────────────────────────

export type ItineraryApiResponse = BaseResponse<ItineraryData>;

export interface EstimatedBudget {
  total: number;
  transportation?: number;
  activity?: number;
  foodAndDrink?: number;
  accommodation?: number;
  currency: string;
}

// ─── Shared backend DTO shapes ─────────────────────────────────────────────────

export interface ActivityDTO {
  id: number;
  activityName: string;
  title: string;
  startTime: string;
  endTime: string;
  address: string;
  aiTip?: string;
  image: string;
  price: string | number;
  activityType: string;
  lat: number | null;
  lng: number | null;
}

export interface DayDTO {
  dayIndex: number;
  date: string;
  activities: ActivityDTO[];
}

export interface ItineraryResponseBase {
  tempId: string;
  tripTitle: string;
  destinationCities: string[];
  estimatedBudget?: EstimatedBudget;
  days: DayDTO[];
  userId?: number;         // owner's DB id; present on saved itineraries, absent on temp/generated responses
  calendarSyncedAt?: string | null; // ISO timestamp string e.g. "2026-06-06T16:29:09.400676"; null when not yet synced
}

export interface ItineraryData extends ItineraryResponseBase {
  hasKids: boolean;
  hasPets: boolean;
  companion: string;
  styles: string[];
  specialNotes?: string;
}

// ─── Generate response (POST /api/itineraries/generate) ───────────────────────

export interface ItineraryGenerateResponse extends ItineraryResponseBase {
  reasoningSummary: string;
}

// ─── Save request (POST /api/itineraries/save) ────────────────────────────────

export interface ItinerarySaveRequest {
  createRequest: ItineraryCreationRequest & { specialNotes?: string };
  aiResult: {
    tempId: string;
    tripTitle: string;
    destinationCities: string[];
    reasoningSummary: string;
    estimatedBudget?: EstimatedBudget;
    days: DaySaveDTO[]; // uses ActivitySaveDTO so id may be null for POI-less activities
  };
}

// ─── Save-request DTO shapes (allow null id for activities without a DB POI ref) ──

export interface ActivitySaveDTO extends Omit<ActivityDTO, "id"> {
  id: number | null; // null when the activity has no persistent backend POI id
}

export interface DaySaveDTO extends Omit<DayDTO, "activities"> {
  activities: ActivitySaveDTO[];
}

// ─── Replan request (POST /api/itineraries/replan) ────────────────────────────

export interface ItineraryReplanRequest {
  feedbackNotes: string;
  rejectedPoiIds: number[];
  previousItinerary: ItineraryData;
  destinationCities: string[];
  startDate: string;
  endDate: string;
  budget: number;
  styles: string[];
  companion: string;
  hasKids: boolean;
  hasPets: boolean;
  specialNotes?: string;
}

// ─── UI Layer Types ────────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  /** Display name derived from the backend title field. */
  title: string;
  /**
   * The canonical backend `activityName` field, preserved separately so it can
   * be round-tripped exactly to the save payload without going through the
   * `title || activityName` fallback logic.
   */
  activityName?: string;
  startTime: string;
  endTime: string;
  price?: string | number;
  address: string;
  image: string;
  aiTip?: string;
  activityType?: string;
  lat: number | null;
  lng: number | null;
}

export interface TravelIndicator {
  id: string;
  type: "walk" | "taxi" | "bus" | "train";
  duration: string;
}

export interface WeatherData {
  condition: "sunny" | "cloudy" | "rainy";
  tempHigh: number;
  tempLow: number;
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  date: string;
  activities: Activity[];
  travelIndicators: TravelIndicator[];
  weather?: WeatherData;
}

export interface Itinerary {
  id: string;
  tripTitle: string;
  location: string;
  startDate: string;
  endDate: string;
  duration: string;
  budget: string;
  tripType: string;
  estimatedBudget?: EstimatedBudget;
  reasoningSummary?: string;
  days: DayItinerary[];
  hasUnsavedChanges?: boolean;
  travelerId?: number; // numeric DB owner ID; undefined for unsaved/temp itineraries
  calendarSyncedAt?: string | null;
}

