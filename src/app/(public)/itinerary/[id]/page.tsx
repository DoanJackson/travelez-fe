"use client";

import "./leaflet.css";
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  Suspense,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Share2,
  Loader2,
  Map as MapIcon,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  ArrowLeft,
  Info,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Pencil,
  X,
} from "lucide-react";
import {
  Itinerary,
  Activity,
  DayItinerary,
  DayDTO,
  ActivityDTO,
  ItineraryData,
  ItineraryGenerateResponse,
  ItinerarySaveRequest,
  DaySaveDTO,
  ItineraryReplanRequest,
} from "@/types/itinerary";
import {
  getItineraryById,
  getTempItinerary,
  saveItinerary,
  addUserToSharedItinerary,
  replanItinerary,
} from "@/services/itineraryService";
import { userService } from "@/services/userService";
import { ItineraryActionsMenu } from "@/components/itinerary/ItineraryActionsMenu";
import { CalendarSyncHandler } from "@/components/itinerary/CalendarSyncHandler";
import type { ApiError } from "@/types/api";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useTripPlanningStore } from "@/state/planning-store";
import { AuthCookies } from "@/lib/cookie";
import { DaySelector } from "@/components/itinerary/DaySelector";
import { MapPanel } from "@/components/itinerary/MapPanel";
import { BudgetDetailModal } from "@/components/itinerary/BudgetDetailModal";
import { AlternativeActivitiesModal } from "@/components/itinerary/AlternativeActivitiesModal";
import { ToursModal } from "@/components/itinerary/ToursModal";
import { DeleteActivityConfirm } from "@/components/itinerary/DeleteActivityConfirm";
import { DeleteItineraryConfirm } from "@/components/itinerary/DeleteItineraryConfirm";
import { deleteItinerary } from "@/services/itineraryService";
import { ShareModal } from "@/components/itinerary/ShareModal";
import { CollaboratorsModal } from "@/components/itinerary/CollaboratorsModal";
import { TipsWidget } from "@/components/itinerary/TipsWidget";
import { toast } from "sonner";
import { formatVND } from "@/lib/utils";
import { mockItinerary } from "@/lib/mock-itinerary";
import { previewItineraries } from "@/lib/mock-standard-itineraries";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Import TimelineContainer with SSR disabled to avoid dnd-kit hydration mismatch
const TimelineContainer = dynamic(
  () => import("@/components/itinerary/TimelineContainer"),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-12">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6" />
          <div className="space-y-4">
            <div className="h-48 bg-gray-100 rounded-lg" />
            <div className="h-48 bg-gray-100 rounded-lg" />
            <div className="h-48 bg-gray-100 rounded-lg" />
          </div>
        </div>
      </div>
    ),
  },
);

// ─── Travel indicator helpers ────────────────────────────────────────────
function parseMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m ?? 0);
}

function formatGap(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} hr ${m} min` : `${h} hr`;
}

function gapToTransportType(
  minutes: number,
): "walk" | "taxi" | "bus" | "train" {
  if (minutes < 10) return "walk";
  if (minutes <= 20) return "taxi";
  if (minutes <= 45) return "bus";
  return "train";
}

// ─── Mapper: ItineraryData (backend) → Itinerary (UI) ───────────────────
function mapResponseToItinerary(
  raw: ItineraryData | ItineraryGenerateResponse,
): Itinerary {
  const currency = raw.estimatedBudget?.currency ?? "VND";
  return {
    id: raw.tempId,
    tripTitle: raw.tripTitle,
    location: raw.destinationCities.join(", "),
    startDate: raw.days[0]?.date ?? "",
    endDate: raw.days[raw.days.length - 1]?.date ?? "",
    duration: `${raw.days.length} day${raw.days.length !== 1 ? "s" : ""}`,
    budget: raw.estimatedBudget
      ? `${formatVND(raw.estimatedBudget.total ?? 0)} ${currency}`
      : "",
    tripType: "",
    estimatedBudget: raw.estimatedBudget,
    reasoningSummary:
      "reasoningSummary" in raw ? raw.reasoningSummary : undefined,
    travelerId: raw.userId,
    calendarSyncedAt: raw.calendarSyncedAt,
    days: raw.days.map((day: DayDTO) => ({
      dayNumber: day.dayIndex,
      title: `Day ${day.dayIndex}`,
      date: day.date,
      activities: day.activities.map((act: ActivityDTO) => ({
        id: String(act.id),
        // Preserve activityName separately so it can be round-tripped to the
        // save payload exactly.  Use || (not ??) so an empty-string title
        // correctly falls back to activityName for display.
        activityName: act.activityName,
        title: act.title || act.activityName,
        startTime: act.startTime,
        endTime: act.endTime,
        price: act.price != null ? act.price : undefined,
        address: act.address,
        image: act.image ?? "",
        aiTip: act.aiTip,
        activityType: act.activityType,
        lat: act.lat,
        lng: act.lng,
      })),
      travelIndicators: day.activities.slice(0, -1).flatMap((act, i) => {
        const gap =
          parseMinutes(day.activities[i + 1].startTime) -
          parseMinutes(act.endTime);
        if (gap <= 0) return [];
        return [
          {
            id: `${String(act.id)}-travel`,
            type: gapToTransportType(gap),
            duration: formatGap(gap),
          },
        ];
      }),
    })),
  };
}

const DAY_COLORS = [
  "#ec4899", // Day 1 — pink
  "#3b82f6", // Day 2 — blue
  "#10b981", // Day 3 — green
  "#f59e0b", // Day 4 — amber
  "#8b5cf6", // Day 5 — purple
  "#ef4444", // Day 6 — red
  "#06b6d4", // Day 7 — cyan
];

const TRIP_TYPE_LABELS: Record<string, string> = {
  solo: "Solo",
  partner: "Couple",
  friends: "Friends",
  family: "Family",
};

export default function ItineraryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const storeTripType = useTripPlanningStore((s) => s.tripType);
  const storeBudget = useTripPlanningStore((s) => s.budget);
  const storeDestinations = useTripPlanningStore((s) => s.destinations);
  const storeDayRange = useTripPlanningStore((s) => s.dayRange);
  const storeTravelStyles = useTripPlanningStore((s) => s.travelStyles);
  const storeWithKids = useTripPlanningStore((s) => s.withKids);
  const storeWithPets = useTripPlanningStore((s) => s.withPets);
  const storeCustomNote = useTripPlanningStore((s) => s.customNote);
  const resetStore = useTripPlanningStore((s) => s.reset);
  const setDestinations = useTripPlanningStore((s) => s.setDestinations);
  const setDayRange = useTripPlanningStore((s) => s.setDayRange);
  const setTripType = useTripPlanningStore((s) => s.setTripType);
  const setWithKids = useTripPlanningStore((s) => s.setWithKids);
  const setWithPets = useTripPlanningStore((s) => s.setWithPets);
  const setBudget = useTripPlanningStore((s) => s.setBudget);
  const setCurrency = useTripPlanningStore((s) => s.setCurrency);
  const setTravelStyles = useTripPlanningStore((s) => s.setTravelStyles);
  const setCustomNote = useTripPlanningStore((s) => s.setCustomNote);
  // Replan state
  const rawItineraryRef = useRef<ItineraryData | null>(null);
  const [rejectedPoiIds, setRejectedPoiIds] = useState<Set<number>>(new Set());
  const [softDeletedIds, setSoftDeletedIds] = useState<Set<string>>(new Set());
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [replanOpen, setReplanOpen] = useState(false);
  const [isReplanning, setIsReplanning] = useState(false);
  const [replanError, setReplanError] = useState<string | null>(null);

  const [itinerary, setItinerary] = useState<Itinerary>(mockItinerary);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(1);
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isTempId, setIsTempId] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [timelineReady, setTimelineReady] = useState(false);
  // Tracks IDs whose URL change was triggered by our own save → router.replace.
  // A Set (not a single slot) survives React 18 StrictMode's double-invocation:
  // first run consumes the entry, second run finds nothing and skips correctly.
  const savedIdSetRef = useRef<Set<string>>(new Set());

  // Stable numeric ID derived from the URL param — never 0 for a real saved itinerary.
  // Using params.id directly avoids the race where itinerary.id is still null
  // (raw.tempId from mapResponseToItinerary) while the DB fetch is in-flight.
  const _rawParamId = Array.isArray(params.id) ? params.id[0] : params.id;
  const numericItineraryId = Number(_rawParamId) > 0 ? Number(_rawParamId) : 0;

  // Modal states
  const [alternativesModal, setAlternativesModal] = useState<{
    isOpen: boolean;
    activity: Activity | null;
  }>({
    isOpen: false,
    activity: null,
  });
  const [toursModal, setToursModal] = useState<{
    isOpen: boolean;
    activity: Activity | null;
  }>({
    isOpen: false,
    activity: null,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    activity: Activity | null;
  }>({
    isOpen: false,
    activity: null,
  });
  const [shareModal, setShareModal] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareErrorCode, setShareErrorCode] = useState<number | null>(null);
  const [collaboratorsOpen, setCollaboratorsOpen] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isOwner = useMemo(() => {
    if (!isMounted) return false;
    const myId = AuthCookies.getUserId();
    if (!myId || myId === "undefined" || !itinerary.travelerId) return false;
    if (!myId || myId === "undefined" || !itinerary.travelerId) return false;
    return Number(myId) === Number(itinerary.travelerId);
  }, [itinerary.travelerId, isMounted]);
  const { data: integrationStatus, isLoading: isIntegrationLoading } = useQuery(
    {
      queryKey: ["integrations", "me"],
      queryFn: () => userService.getIntegrations(),
      enabled: isOwner && !isTempId,
      staleTime: 5 * 60 * 1000,
    },
  );

  const [deleteItineraryOpen, setDeleteItineraryOpen] = useState(false);
  const [isDeletingItinerary, setIsDeletingItinerary] = useState(false);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [mobileMapOpen, setMobileMapOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(true);

  // Load itinerary data based on id parameter
  useEffect(() => {
    // params.id is string | string[] in Next.js 14 — normalise before use
    const rawId = params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id || id === "new") {
      // Dev/demo fallback: no real id yet
      setItinerary({ ...mockItinerary });
      setHasUnsavedChanges(true);
      setIsTempId(true);
      return;
    }

    if (id.startsWith("preview-")) {
      setItinerary(previewItineraries[id] ?? { ...mockItinerary });
      setIsPreview(true);
      setIsTempId(false);
      setHasUnsavedChanges(false);
      return;
    }

    // Skip re-fetch when this id change was triggered by our own save → router.replace.
    // Using a Set (not a single slot) so React 18 StrictMode's double-invocation of
    // effects also finds the entry on the second run and skips correctly.
    if (savedIdSetRef.current.has(id)) {
      savedIdSetRef.current.delete(id);
      return;
    }

    // Fetch real data from backend
    setIsLoadingData(true);
    setFetchError(null);

    // tempIds are non-numeric (e.g. "trip_abc123"); numeric ids are saved itineraries
    const tempId = isNaN(Number(id));
    setIsTempId(tempId);

    const handleSuccess = (data: ItineraryData | ItineraryGenerateResponse) => {
      rawItineraryRef.current = data as ItineraryData;
      setItinerary(mapResponseToItinerary(data));
      setHasUnsavedChanges(false);
    };
    const handleError = (err: unknown) => {
      const message =
        err instanceof Error
          ? err.message
          : ((err as { message?: string })?.message ??
            "Failed to load itinerary.");
      setFetchError(message);
    };
    const handleFinally = () => setIsLoadingData(false);

    // Back-fills the Zustand store from a saved itinerary's API response so that
    // handleReplan has valid criteria on F5 / direct-link access (store is otherwise empty).
    // Only valid for ItineraryData (numeric IDs) — ItineraryGenerateResponse lacks these fields.
    const syncStoreFromItineraryData = (data: ItineraryData) => {
      setDestinations(data.destinationCities);

      const startStr = data.days[0]?.date;
      const endStr = data.days[data.days.length - 1]?.date;
      if (startStr && endStr) {
        setDayRange(
          new Date(startStr + "T00:00:00"),
          new Date(endStr + "T00:00:00"),
        );
      }

      if (data.companion) {
        setTripType(
          data.companion as "solo" | "partner" | "friends" | "family",
        );
      }
      setWithKids(data.hasKids);
      setWithPets(data.hasPets);

      if (data.estimatedBudget?.total) {
        setBudget(data.estimatedBudget.total);
        if (data.estimatedBudget.currency === "USD") setCurrency("USD");
      }

      if (data.styles?.length) {
        setTravelStyles(data.styles);
      }

      if (data.specialNotes) {
        setCustomNote(data.specialNotes);
      }
    };

    if (tempId) {
      getTempItinerary(id)
        .then((response) => handleSuccess(response.data))
        .catch(handleError)
        .finally(handleFinally);
    } else {
      getItineraryById(Number(id))
        .then((response) => {
          if (!response?.data) throw new Error("Empty response from server");
          syncStoreFromItineraryData(response.data);
          handleSuccess(response.data);
        })
        .catch(handleError)
        .finally(handleFinally);
    }
  }, [params.id]);

  const handleTimelineReady = useCallback(() => setTimelineReady(true), []);

  const handleSyncSuccess = useCallback(() => {
    // Optimistically mark as synced so the CalendarCheck icon appears immediately.
    // The backend processes the sync asynchronously, so a re-fetch right now would
    // still return calendarSyncedAt: null and leave the button in the wrong state.
    setItinerary((prev) => ({
      ...prev,
      calendarSyncedAt: prev.calendarSyncedAt ?? new Date().toISOString(),
    }));
  }, []);

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: saveItinerary,
    onSuccess: (response) => {
      const newId = response.data;
      if (!newId) {
        toast.error("Save failed. Server returned no ID.");
        return;
      }
      const savedId = String(newId);

      // Prime the cache so a future useQuery(['itinerary', savedId]) hits instantly
      const myUserId = AuthCookies.getUserId();
      const primed: Itinerary = {
        ...itinerary,
        id: savedId,
        // Set travelerId immediately so isOwner becomes true without waiting for refetch.
        // Temp itineraries don't have travelerId in the backend response.
        travelerId: myUserId ? Number(myUserId) : itinerary.travelerId,
      };
      queryClient.setQueryData(["itinerary", savedId], primed);

      // Update local state with the new ID (all other fields stay intact)
      setItinerary(primed);
      setHasUnsavedChanges(false);
      setIsTempId(false);

      // Clear the global planning store so stale draft data cannot trigger
      // a second save if the user navigates back to a cached version of this page.
      resetStore();

      // Navigate to the permanent URL.
      // savedIdSetRef prevents the useEffect from re-fetching on the id change.
      // router.refresh() invalidates the Next.js App Router client cache so that
      // pressing Back never restores a stale React subtree with isTempId=true.
      if (savedId !== itinerary.id) {
        savedIdSetRef.current.add(savedId);
        router.replace(`/itinerary/${savedId}`);
        router.refresh();
      }

      toast.success("Saved successfully", {
        description: "Your itinerary has been saved.",
      });
    },
    onError: (err: unknown) => {
      console.error("[handleSave] caught error:", err);
      toast.error("Save failed. Please try again.");
    },
  });

  // Auto-detect visible day using IntersectionObserver
  // Depends on timelineReady so it only runs after TimelineContainer has
  // committed its DOM — eliminating the race with the dynamic import.
  useEffect(() => {
    if (!timelineReady) return;

    const observers: IntersectionObserver[] = [];

    console.log("[IO] setting up observers");
    itinerary.days.forEach((day) => {
      const element = document.getElementById(`day-${day.dayNumber}`);
      if (!element) {
        console.log("[IO] element NOT FOUND for day", day.dayNumber);
        return;
      }
      console.log("[IO] observing element:", element, "for day", day.dayNumber);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log("[IO] activeDay →", day.dayNumber);
              setActiveDay(day.dayNumber);
            }
          });
        },
        { threshold: 0, rootMargin: "-10% 0px -80% 0px" },
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [itinerary.days, timelineReady]);

  const scrollToDay = useCallback((dayNumber: number) => {
    const element = document.getElementById(`day-${dayNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleDaySelect = useCallback(
    (dayNumber: number) => {
      scrollToDay(dayNumber);
      setActiveDay(dayNumber);
    },
    [scrollToDay],
  );

  const handleActivityClick = useCallback((activity: Activity) => {
    setActiveActivityId(activity.id);

    // Scroll activity into view if needed
    const activityElement = document.getElementById(activity.id);
    if (activityElement) {
      activityElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const handleMarkerClick = useCallback((activity: Activity) => {
    setActiveActivityId(activity.id);

    const activityElement = document.getElementById(activity.id);
    if (activityElement) {
      activityElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const handleReorderActivities = useCallback((updatedDays: DayItinerary[]) => {
    setItinerary((prev) => ({ ...prev, days: updatedDays }));
    setHasUnsavedChanges(true);
  }, []);

  const handleReplaceActivity = useCallback(
    (oldActivityId: string, newActivity: Activity) => {
      setItinerary((prev) => ({
        ...prev,
        days: prev.days.map((day) => ({
          ...day,
          activities: day.activities.map((a) =>
            a.id === oldActivityId ? { ...newActivity, id: oldActivityId } : a,
          ),
        })),
      }));
      setHasUnsavedChanges(true);
    },
    [],
  );

  const handleDeleteActivity = useCallback((activity: Activity) => {
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map((day) => ({
        ...day,
        activities: day.activities.filter((a) => a.id !== activity.id),
      })),
    }));
    setHasUnsavedChanges(true);
    toast.success("Activity deleted", {
      description: `"${activity.title}" has been removed from your itinerary.`,
    });
  }, []);

  const handleSoftDeleteActivity = useCallback((activity: Activity) => {
    const numericId = Number(activity.id);
    setSoftDeletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(activity.id)) {
        next.delete(activity.id);
      } else {
        next.add(activity.id);
      }
      return next;
    });
    if (!isNaN(numericId)) {
      setRejectedPoiIds((prev) => {
        const next = new Set(prev);
        if (prev.has(numericId)) {
          next.delete(numericId);
        } else {
          next.add(numericId);
        }
        return next;
      });
    }
  }, []);

  const handleReplan = useCallback(async () => {
    if (!rawItineraryRef.current) {
      toast.warning("Cannot replan a preview itinerary. Save it first.");
      return;
    }
    if (!feedbackNotes.trim() || isReplanning) return;

    setIsReplanning(true);
    setReplanError(null);
    try {
      const payload: ItineraryReplanRequest = {
        feedbackNotes: feedbackNotes.trim(),
        rejectedPoiIds: [...rejectedPoiIds],
        previousItinerary: rawItineraryRef.current,
        destinationCities:
          storeDestinations.length > 0
            ? storeDestinations
            : itinerary.location.split(", "),
        startDate: storeDayRange.start
          ? storeDayRange.start.toISOString().split("T")[0]
          : itinerary.startDate,
        endDate: storeDayRange.end
          ? storeDayRange.end.toISOString().split("T")[0]
          : itinerary.endDate,
        budget: storeBudget ?? 0,
        styles: storeTravelStyles,
        companion: storeTripType ?? "",
        hasKids: storeWithKids ?? false,
        hasPets: storeWithPets ?? false,
        ...(storeCustomNote ? { specialNotes: storeCustomNote } : {}),
      };
      const res = await replanItinerary(payload);
      rawItineraryRef.current = res.data;
      setItinerary(mapResponseToItinerary(res.data));
      setRejectedPoiIds(new Set());
      setSoftDeletedIds(new Set());
      setFeedbackNotes("");
      setReplanOpen(false);
      setHasUnsavedChanges(true);
      toast.success("Itinerary updated!", {
        description: "Your replan is ready.",
      });
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message ??
        "Replan failed. Please try again.";
      setReplanError(msg);
    } finally {
      setIsReplanning(false);
    }
  }, [
    feedbackNotes,
    rejectedPoiIds,
    isReplanning,
    itinerary,
    storeBudget,
    storeDayRange,
    storeDestinations,
    storeTravelStyles,
    storeTripType,
    storeWithKids,
    storeWithPets,
    storeCustomNote,
  ]);

  const handleSave = useCallback(() => {
    // Prevent redundant saves: already a permanent ID, in-flight, or already succeeded
    if (!isTempId || saveMutation.isPending || saveMutation.isSuccess) return;

    if (!AuthCookies.getToken()) {
      const returnUrl = encodeURIComponent(pathname);
      toast.error("Please log in to save your itinerary", {
        action: {
          label: "Log in",
          onClick: () => router.push(`/login?returnUrl=${returnUrl}`),
        },
      });
      return;
    }

    // Reverse-map UI Itinerary → ItinerarySaveRequest
    const body: ItinerarySaveRequest = {
      createRequest: {
        destinationCities:
          storeDestinations.length > 0
            ? storeDestinations
            : itinerary.location.split(", "),
        budget: storeBudget ?? 0,
        startDate: storeDayRange.start
          ? storeDayRange.start.toISOString().split("T")[0]
          : itinerary.startDate,
        endDate: storeDayRange.end
          ? storeDayRange.end.toISOString().split("T")[0]
          : itinerary.endDate,
        styles: storeTravelStyles,
        companion: storeTripType ?? "",
        hasKids: storeWithKids ?? false,
        hasPets: storeWithPets ?? false,
        ...(storeCustomNote ? { specialNotes: storeCustomNote } : {}),
      },
      aiResult: {
        tempId: itinerary.id,
        tripTitle: itinerary.tripTitle,
        destinationCities: itinerary.location.split(", "),
        reasoningSummary: itinerary.reasoningSummary ?? "",
        estimatedBudget: itinerary.estimatedBudget,
        days: itinerary.days.map(
          (day): DaySaveDTO => ({
            dayIndex: day.dayNumber,
            date: day.date,
            activities: day.activities.map((a) => {
              const numericId = Number(a.id);
              return {
                // Null-safe: NaN (e.g. non-numeric placeholder IDs) becomes null so
                // the backend can handle missing POI references gracefully instead of
                // receiving a JSON null serialised from NaN.
                id: Number.isNaN(numericId) ? null : numericId,
                // Round-trip the original backend field name exactly; fall back to
                // the display title only if activityName was never set.
                activityName: a.activityName ?? a.title,
                title: a.title,
                startTime: a.startTime,
                endTime: a.endTime,
                address: a.address,
                aiTip: a.aiTip ?? "",
                image: a.image,
                price: a.price !== undefined ? String(a.price) : "0",
                activityType: a.activityType ?? "OTHER",
                lat: a.lat,
                lng: a.lng,
              };
            }),
          }),
        ),
      },
    };

    saveMutation.mutate(body);
  }, [
    itinerary,
    pathname,
    router,
    storeDestinations,
    storeDayRange,
    storeTravelStyles,
    storeTripType,
    storeBudget,
    storeWithKids,
    storeWithPets,
    storeCustomNote,
    saveMutation,
  ]);

  const handleShare = useCallback(
    async (username: string) => {
      setIsSharing(true);
      setShareError(null);
      setShareErrorCode(null);
      try {
        await addUserToSharedItinerary(numericItineraryId, username);
        toast.success("Shared successfully", {
          description: `Itinerary shared with ${username}.`,
        });
        setShareModal(false);
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        setShareError(apiErr?.message ?? "Failed to share itinerary.");
        setShareErrorCode(apiErr?.status ?? null);
        // Keep the modal open so the user can correct the input
      } finally {
        setIsSharing(false);
      }
    },
    [numericItineraryId],
  );

  const handleDeleteItinerary = useCallback(async () => {
    setIsDeletingItinerary(true);
    try {
      await deleteItinerary(Number(itinerary.id));
      toast.success("Itinerary deleted", {
        description: `"${itinerary.tripTitle}" has been permanently deleted.`,
      });
      router.push("/my-itineraries");
    } catch {
      toast.error("Failed to delete. Please try again.");
      setIsDeletingItinerary(false);
    }
  }, [itinerary.id, itinerary.tripTitle, router]);

  const getBackDestination = useCallback(() => {
    if (params.id === "new") return "/";
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (typeof id === "string" && id.startsWith("preview-")) return "/";
    return "/my-itineraries";
  }, [params.id]);

  const handleBack = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowExitConfirm(true);
    } else {
      router.push(getBackDestination());
    }
  }, [hasUnsavedChanges, router, getBackDestination]);

  const confirmExit = useCallback(() => {
    setShowExitConfirm(false);
    router.push(getBackDestination());
  }, [router, getBackDestination]);

  const activityMeta = useMemo(() => {
    const map = new Map<string, { globalIndex: number; dayColor: string }>();
    let counter = 1;
    itinerary.days.forEach((day, dayIdx) => {
      const color = DAY_COLORS[dayIdx % DAY_COLORS.length];
      day.activities.forEach((a) => {
        map.set(a.id, { globalIndex: counter++, dayColor: color });
      });
    });
    return map;
  }, [itinerary.days]);

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-600 text-sm">Loading your itinerary…</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm px-4">
          <p className="text-2xl">😞</p>
          <h2 className="text-xl font-bold text-gray-900">
            Failed to load itinerary
          </h2>
          <p className="text-gray-600 text-sm">{fetchError}</p>
          <Button
            onClick={() => router.push("/my-itineraries")}
            variant="outline"
          >
            Back to My Itineraries
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 flex gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="-ml-2 mt-1 shrink-0"
                onClick={handleBack}
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-2 group">
                  {isEditingTitle ? (
                    <input
                      autoFocus
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      onBlur={() => {
                        const trimmed = titleInput.trim();
                        if (trimmed && trimmed !== itinerary.tripTitle) {
                          setItinerary((prev) => ({
                            ...prev,
                            tripTitle: trimmed,
                          }));
                          setHasUnsavedChanges(true);
                        } else {
                          setTitleInput(itinerary.tripTitle);
                        }
                        setIsEditingTitle(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                        if (e.key === "Escape") {
                          setTitleInput(itinerary.tripTitle);
                          setIsEditingTitle(false);
                        }
                      }}
                      className="text-2xl md:text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-pink-400 outline-none w-full"
                    />
                  ) : (
                    <>
                      <h4
                        className="text-2xl md:text-3xl font-bold text-gray-900 cursor-pointer"
                        onClick={() => {
                          setTitleInput(itinerary.tripTitle);
                          setIsEditingTitle(true);
                        }}
                      >
                        {itinerary.tripTitle}
                      </h4>
                      <button
                        onClick={() => {
                          setTitleInput(itinerary.tripTitle);
                          setIsEditingTitle(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100 shrink-0"
                        aria-label="Edit title"
                      >
                        <Pencil className="h-4 w-4 text-gray-400" />
                      </button>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{itinerary.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {itinerary.startDate} - {itinerary.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{itinerary.duration}</span>
                  </div>
                  {itinerary.estimatedBudget && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span
                        className="text-pink-500 inline-flex items-center gap-0.5 underline cursor-pointer"
                        onClick={() => setBudgetModalOpen(true)}
                      >
                        {itinerary.budget}
                        <Info className="h-3 w-3" />
                      </span>
                    </div>
                  )}
                  {storeTripType && (
                    <Badge variant="secondary" className="font-normal">
                      {TRIP_TYPE_LABELS[storeTripType] ?? storeTripType}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {isTempId && (
                <>
                  <Badge
                    variant="outline"
                    className="text-yellow-600 border-yellow-600"
                  >
                    Unsaved changes
                  </Badge>
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    disabled={saveMutation.isPending}
                  >
                    {saveMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {saveMutation.isPending ? "Saving…" : "Save"}
                  </Button>
                </>
              )}
              {isOwner && isTempId && (
                <Button variant="outline" onClick={() => setShareModal(true)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
              {isOwner && !isTempId && (
                <ItineraryActionsMenu
                  itineraryId={numericItineraryId}
                  integrationStatus={integrationStatus}
                  calendarSyncedAt={itinerary.calendarSyncedAt}
                  isStatusLoading={isIntegrationLoading}
                  onShare={() => setShareModal(true)}
                  onCollaborators={() => setCollaboratorsOpen(true)}
                  onDelete={() => setDeleteItineraryOpen(true)}
                  onSyncSuccess={handleSyncSuccess}
                  isPreview={isPreview}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 2 Column Layout */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[55fr_45fr] lg:gap-6">
          {/* Left Column - Scrollable Timeline */}
          <div id="itinerary-timeline" className="space-y-8">
            {/* Mobile Day Selector — visible only below lg, scrolls with timeline */}
            <div className="lg:hidden -mx-4 px-4 overflow-x-auto no-scrollbar">
              <DaySelector
                days={itinerary.days.map((d) => ({
                  dayNumber: d.dayNumber,
                  title: d.title,
                  date: d.date,
                  activityCount: d.activities.length,
                }))}
                activeDay={activeDay}
                onDaySelect={handleDaySelect}
              />
            </div>
            {/* Trip Context — AI reasoning + tips, collapsed by default */}
            <div className="rounded-xl border border-purple-100 bg-violet-50 overflow-hidden">
              <button
                onClick={() => setContextOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-semibold text-purple-900">
                    AI Trip Context
                  </span>
                </div>
                {contextOpen ? (
                  <ChevronUp className="h-4 w-4 text-purple-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-purple-400" />
                )}
              </button>
              {contextOpen && (
                <div className="px-4 pb-4 space-y-4 border-t border-purple-100">
                  {itinerary.reasoningSummary && (
                    <p className="text-sm text-purple-800/80 leading-relaxed pt-3">
                      {itinerary.reasoningSummary}
                    </p>
                  )}
                  <TipsWidget />
                </div>
              )}
            </div>

            {isReplanning ? (
              <div className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>
            ) : (
              <TimelineContainer
                days={itinerary.days}
                activeActivityId={activeActivityId}
                activityMeta={activityMeta}
                onActivityClick={handleActivityClick}
                onFindAlternatives={(activity) =>
                  setAlternativesModal({ isOpen: true, activity })
                }
                onFindTours={(activity) =>
                  setToursModal({ isOpen: true, activity })
                }
                onDeleteActivity={(activity) =>
                  setDeleteModal({ isOpen: true, activity })
                }
                onReorderActivities={handleReorderActivities}
                onReady={handleTimelineReady}
                softDeletedIds={softDeletedIds}
                onRestoreActivity={handleSoftDeleteActivity}
              />
            )}
          </div>

          {/* Right Column - Sticky Sidebar (Desktop Only) */}
          <aside className="hidden lg:block mt-8 lg:mt-0 lg:sticky lg:top-28 lg:self-start space-y-2 relative">
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto no-scrollbar">
              <DaySelector
                days={itinerary.days.map((d) => ({
                  dayNumber: d.dayNumber,
                  title: d.title,
                  date: d.date,
                  activityCount: d.activities.length,
                }))}
                activeDay={activeDay}
                onDaySelect={handleDaySelect}
              />
            </div>

            {/* isolate traps Leaflet's internal z-indexes (200–700) inside their own
                stacking context so they cannot paint over the FAB siblings below */}
            <div className="isolate">
              <MapPanel
                days={itinerary.days}
                activeDay={activeDay}
                activeActivityId={activeActivityId}
                onMarkerClick={handleMarkerClick}
                activityMeta={activityMeta}
              />
            </div>

            {/* Replan FAB + chatbox — direct children of the relative aside,
                positioned above Leaflet's internal stacking context */}
            {!isPreview && (
              <>
                {replanOpen && (
                  <div className="absolute bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl p-5 border border-slate-100 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-sm bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                        <Sparkles className="size-4 text-pink-500" />
                        AI Replan
                      </div>
                      <button
                        onClick={() => setReplanOpen(false)}
                        className="rounded-full p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Close replan panel"
                      >
                        <X className="size-4" />
                      </button>
                    </div>

                    {rejectedPoiIds.size > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs text-slate-500 self-center">
                          Marked for removal:
                        </span>
                        {[...softDeletedIds].map((id) => (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="text-xs bg-pink-100 text-pink-700"
                          >
                            Activity {id}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Textarea
                      rows={3}
                      className="resize-none text-sm"
                      placeholder="Describe the changes you'd like… e.g. 'Replace lunch with a seafood restaurant, add a beach visit in the afternoon.'"
                      value={feedbackNotes}
                      onChange={(e) => setFeedbackNotes(e.target.value)}
                      disabled={isReplanning}
                    />

                    {replanError && (
                      <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                        {replanError}
                      </p>
                    )}

                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        className="gap-1.5 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                        onClick={handleReplan}
                        disabled={!feedbackNotes.trim() || isReplanning}
                      >
                        {isReplanning ? (
                          <>
                            <span className="size-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                            Replanning…
                          </>
                        ) : (
                          <>
                            <Sparkles className="size-3.5" />
                            Replan
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* FAB trigger */}
                <button
                  onClick={() => setReplanOpen((o) => !o)}
                  className="absolute bottom-6 right-6 z-50 flex items-center gap-2 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-full px-5 py-3 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Sparkles className="size-5" />
                  AI Replan
                  {rejectedPoiIds.size > 0 && (
                    <span className="bg-white text-purple-700 font-bold size-5 rounded-full flex items-center justify-center text-xs leading-none">
                      {rejectedPoiIds.size}
                    </span>
                  )}
                </button>
              </>
            )}
          </aside>
        </div>
      </div>

      {/* Mobile Map Button & Sheet */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <Sheet open={mobileMapOpen} onOpenChange={setMobileMapOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="bg-pink-500 hover:bg-pink-600 shadow-lg rounded-full h-14 w-14"
            >
              <MapIcon className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh]">
            <SheetHeader className="sr-only">
              <SheetTitle>Map view</SheetTitle>
              <SheetDescription>
                Interactive map showing itinerary locations
              </SheetDescription>
            </SheetHeader>
            <div className="h-full pb-8">
              <MapPanel
                days={itinerary.days}
                activeDay={activeDay}
                activeActivityId={activeActivityId}
                onMarkerClick={handleMarkerClick}
                activityMeta={activityMeta}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile Actions Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          {isTempId && (
            <>
              <Badge
                variant="outline"
                className="text-yellow-600 border-yellow-600 text-xs"
              >
                Unsaved
              </Badge>
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="flex-1"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {saveMutation.isPending ? "Saving…" : "Save"}
              </Button>
            </>
          )}
          {isOwner && isTempId && (
            <Button
              variant="outline"
              onClick={() => setShareModal(true)}
              className="flex-1"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
          {isOwner && !isTempId && (
            <ItineraryActionsMenu
              itineraryId={numericItineraryId}
              integrationStatus={integrationStatus}
              calendarSyncedAt={itinerary.calendarSyncedAt}
              isStatusLoading={isIntegrationLoading}
              onShare={() => setShareModal(true)}
              onCollaborators={() => setCollaboratorsOpen(true)}
              onDelete={() => setDeleteItineraryOpen(true)}
              onSyncSuccess={handleSyncSuccess}
              isPreview={isPreview}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <AlternativeActivitiesModal
        isOpen={alternativesModal.isOpen}
        onClose={() => setAlternativesModal({ isOpen: false, activity: null })}
        originalActivity={alternativesModal.activity}
        onReplace={(newActivity) => {
          if (alternativesModal.activity) {
            handleReplaceActivity(alternativesModal.activity.id, newActivity);
          }
        }}
      />

      <ToursModal
        isOpen={toursModal.isOpen}
        onClose={() => setToursModal({ isOpen: false, activity: null })}
        activity={toursModal.activity}
      />

      <DeleteActivityConfirm
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, activity: null })}
        activity={deleteModal.activity}
        onConfirm={() => {
          if (deleteModal.activity) {
            handleDeleteActivity(deleteModal.activity);
          }
        }}
      />

      <ShareModal
        isOpen={shareModal}
        onClose={() => {
          setShareModal(false);
          setShareError(null);
          setShareErrorCode(null);
        }}
        onShare={handleShare}
        isLoading={isSharing}
        shareError={shareError}
        shareErrorCode={shareErrorCode}
      />

      <CollaboratorsModal
        isOpen={collaboratorsOpen}
        onClose={() => setCollaboratorsOpen(false)}
        itineraryId={numericItineraryId}
        isOwner={isOwner}
      />

      <DeleteItineraryConfirm
        isOpen={deleteItineraryOpen}
        onClose={() => setDeleteItineraryOpen(false)}
        itineraryTitle={itinerary.tripTitle}
        onConfirm={handleDeleteItinerary}
        isDeleting={isDeletingItinerary}
      />

      {itinerary.estimatedBudget && (
        <BudgetDetailModal
          open={budgetModalOpen}
          onClose={() => setBudgetModalOpen(false)}
          estimatedBudget={itinerary.estimatedBudget}
        />
      )}

      <Suspense fallback={null}>
        <CalendarSyncHandler itineraryId={numericItineraryId} />
      </Suspense>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in your itinerary. Are you sure you want
              to leave? All unsaved progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmExit}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Discard & Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
