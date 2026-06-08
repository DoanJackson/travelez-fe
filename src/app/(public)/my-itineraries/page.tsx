"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiltersBar } from "@/components/itineraries/FiltersBar";
import { ItineraryGrid } from "@/components/itineraries/ItineraryGrid";
import { EmptyState } from "@/components/itineraries/EmptyState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getMyItineraries, deleteItinerary, addUserToSharedItinerary, getSharedItineraries, toggleItineraryVisibility } from "@/services/itineraryService";
import { DeleteItineraryConfirm } from "@/components/itinerary/DeleteItineraryConfirm";
import { ShareModal } from "@/components/itinerary/ShareModal";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ItinerarySummary, SharedItinerarySummary } from "@/types/itinerary";
import type { ApiError } from "@/types/api";

function getDuration(startDate: string, endDate: string): number {
  return Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000) + 1);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyItinerariesPage() {
  const router = useRouter();

  // ── API state ────────────────────────────────────────────────────────────────
  const [itineraries, setItineraries] = useState<ItinerarySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // ── Delete state ─────────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<ItinerarySummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Visibility toggle state ──────────────────────────────────────────────────
  const [pendingToggle, setPendingToggle] = useState<{
    id: number;
    title: string;
    isPublic: boolean; // the NEW desired value
  } | null>(null);
  const [isTogglingId, setIsTogglingId] = useState<number | null>(null);

  // ── Share state ──────────────────────────────────────────────────────────────
  const [shareTarget, setShareTarget] = useState<ItinerarySummary | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareErrorCode, setShareErrorCode] = useState<number | null>(null);

  // ── Tab state ────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"mine" | "shared">("mine");

  // ── Shared-with-me state ─────────────────────────────────────────────────────
  const [sharedItineraries, setSharedItineraries] = useState<SharedItinerarySummary[]>([]);
  const [sharedPage, setSharedPage] = useState(0);
  const [sharedTotalPages, setSharedTotalPages] = useState(0);
  const [isLoadingShared, setIsLoadingShared] = useState(false);
  const hasFetchedShared = useRef(false);

  const fetchSharedItineraries = useCallback(async (page: number) => {
    setIsLoadingShared(true);
    try {
      const res = await getSharedItineraries(page);
      setSharedItineraries(res.data.content);
      setSharedTotalPages(res.data.totalPages);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr?.status === 401) {
        router.push("/login?callbackUrl=/my-itineraries");
        return;
      }
      toast.error("Could not load shared itineraries.");
    } finally {
      setIsLoadingShared(false);
    }
  }, [router]);

  useEffect(() => {
    if (activeTab === "shared" && !hasFetchedShared.current) {
      hasFetchedShared.current = true;
      fetchSharedItineraries(0);
    }
  }, [activeTab, fetchSharedItineraries]);

  // ── Filter / sort state ──────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [durationFilter, setDurationFilter] = useState<string | null>(null);

  // ── Fetch itineraries ────────────────────────────────────────────────────────
  const fetchItineraries = useCallback(
    async (page: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getMyItineraries(page);
        setItineraries(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        if (apiErr?.status === 401) {
          router.push("/login?callbackUrl=/my-itineraries");
          return;
        }
        setError("Could not load your itineraries. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    fetchItineraries(currentPage);
  }, [currentPage, fetchItineraries]);

  const handleShareConfirm = useCallback(async (username: string) => {
    if (!shareTarget) return;
    setIsSharing(true);
    setShareError(null);
    setShareErrorCode(null);
    try {
      await addUserToSharedItinerary(shareTarget.id, username);
      toast.success("Shared successfully", {
        description: `"${shareTarget.title}" shared with ${username}.`,
      });
      setShareTarget(null);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setShareError(apiErr?.message ?? "Failed to share itinerary.");
      setShareErrorCode(apiErr?.status ?? null);
      // Keep the modal open so the user can correct the input
    } finally {
      setIsSharing(false);
    }
  }, [shareTarget]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    // Optimistic remove
    setItineraries((prev) => prev.filter((it) => it.id !== deleteTarget.id));
    setIsDeleting(true);
    try {
      await deleteItinerary(deleteTarget.id);
      setDeleteTarget(null);
      toast.success("Itinerary deleted", {
        description: `"${deleteTarget.title}" has been permanently deleted.`,
      });
    } catch {
      // Rollback
      setItineraries((prev) => [deleteTarget, ...prev]);
      setDeleteTarget(null);
      toast.error("Failed to delete. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget]);

  // ── Visibility toggle handlers ───────────────────────────────────────────────
  const handleToggleRequest = useCallback(
    (itinerary: ItinerarySummary, isPublic: boolean) => {
      setPendingToggle({ id: itinerary.id, title: itinerary.title, isPublic });
    },
    [],
  );

  const handleToggleConfirm = useCallback(async () => {
    if (!pendingToggle) return;
    const { id, isPublic } = pendingToggle;
    setPendingToggle(null);
    setIsTogglingId(id);

    // Optimistic update
    setItineraries((prev) =>
      prev.map((it) => (it.id === id ? { ...it, isPublic } : it)),
    );

    try {
      await toggleItineraryVisibility(id, isPublic);
      toast.success(isPublic ? "Itinerary published to community." : "Itinerary set to private.");
    } catch (err: unknown) {
      // Rollback
      setItineraries((prev) =>
        prev.map((it) => (it.id === id ? { ...it, isPublic: !isPublic } : it)),
      );
      const apiErr = err as ApiError;
      toast.error(apiErr?.message ?? "Failed to update visibility. Please try again.");
    } finally {
      setIsTogglingId(null);
    }
  }, [pendingToggle]);

  // ── Client-side filter + sort (over current page) ───────────────────────────
  const filteredAndSorted = useMemo(() => {
    let result = [...itineraries];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (it) =>
          it.title.toLowerCase().includes(query) ||
          it.destinationCities.some((l) => l.toLowerCase().includes(query)),
      );
    }

    if (durationFilter) {
      result = result.filter((it) => {
        const days = getDuration(it.startDate, it.endDate);
        if (durationFilter === "short") return days >= 1 && days <= 3;
        if (durationFilter === "medium") return days >= 4 && days <= 7;
        if (durationFilter === "long") return days > 7;
        return true;
      });
    }

    result.sort((a, b) => {
      if (sortBy === "recent")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === "duration")
        return getDuration(b.startDate, b.endDate) - getDuration(a.startDate, a.endDate);
      if (sortBy === "alphabetical") return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [itineraries, searchQuery, sortBy, durationFilter]);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-linear-to-b from-white via-pink-50/20 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "mine" | "shared")}>
          <TabsList className="mb-8">
            <TabsTrigger value="mine">My Trips</TabsTrigger>
            <TabsTrigger value="shared">
              Shared with Me
              {sharedItineraries.length > 0 && (
                <span className="ml-1.5 text-xs bg-pink-100 text-pink-600 rounded-full px-1.5 py-0.5">
                  {sharedItineraries.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── My Trips tab ── */}
          <TabsContent value="mine">
            <div className="flex flex-col min-h-[calc(100vh-200px)]">
              {isLoading && (
                <div className="flex justify-center items-center py-24">
                  <span className="size-8 rounded-full border-2 border-pink-400 border-t-transparent animate-spin" />
                </div>
              )}

              {!isLoading && error && (
                <div className="text-center py-16">
                  <p className="text-red-500 text-lg mb-4">{error}</p>
                  <Button variant="outline" onClick={() => fetchItineraries(currentPage)}>
                    Try again
                  </Button>
                </div>
              )}

              {!isLoading && !error && itineraries.length === 0 && (
                <EmptyState />
              )}

              {!isLoading && !error && itineraries.length > 0 && (
                <>
                  <FiltersBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    durationFilter={durationFilter}
                    onDurationFilterChange={setDurationFilter}
                  />

                  {filteredAndSorted.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-gray-600 text-lg mb-2">No trips found</p>
                      <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                    </div>
                  ) : (
                    <ItineraryGrid
                      itineraries={filteredAndSorted}
                      onDelete={setDeleteTarget}
                      onShare={setShareTarget}
                      onToggleVisibility={handleToggleRequest}
                    />
                  )}

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-10">
                      <Button
                        variant="outline"
                        disabled={currentPage === 0 || isLoading}
                        onClick={() => setCurrentPage((p) => p - 1)}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-500">
                        Page {currentPage + 1} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        disabled={currentPage >= totalPages - 1 || isLoading}
                        onClick={() => setCurrentPage((p) => p + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          {/* ── Shared with Me tab ── */}
          <TabsContent value="shared">
            <div className="flex flex-col min-h-[calc(100vh-200px)]">
              {isLoadingShared && (
                <div className="flex justify-center items-center py-24">
                  <span className="size-8 rounded-full border-2 border-pink-400 border-t-transparent animate-spin" />
                </div>
              )}

              {!isLoadingShared && sharedItineraries.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <p className="text-lg mb-1">No itineraries shared with you yet</p>
                  <p className="text-sm">When someone shares a trip, it will appear here.</p>
                </div>
              )}

              {!isLoadingShared && sharedItineraries.length > 0 && (
                <>
                  <ItineraryGrid
                    itineraries={sharedItineraries}
                    isReadOnly
                    showSharedBy
                  />

                  {sharedTotalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-10">
                      <Button
                        variant="outline"
                        disabled={sharedPage === 0 || isLoadingShared}
                        onClick={() => {
                          const next = sharedPage - 1;
                          setSharedPage(next);
                          fetchSharedItineraries(next);
                        }}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-500">
                        Page {sharedPage + 1} of {sharedTotalPages}
                      </span>
                      <Button
                        variant="outline"
                        disabled={sharedPage >= sharedTotalPages - 1 || isLoadingShared}
                        onClick={() => {
                          const next = sharedPage + 1;
                          setSharedPage(next);
                          fetchSharedItineraries(next);
                        }}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <DeleteItineraryConfirm
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        itineraryTitle={deleteTarget?.title ?? null}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
      <ShareModal
        isOpen={!!shareTarget}
        onClose={() => {
          setShareTarget(null);
          setShareError(null);
          setShareErrorCode(null);
        }}
        onShare={handleShareConfirm}
        isLoading={isSharing}
        shareError={shareError}
        shareErrorCode={shareErrorCode}
      />

      {/* Visibility toggle confirmation — JSX sibling portal, not nested inside any Dialog */}
      <AlertDialog open={!!pendingToggle} onOpenChange={() => setPendingToggle(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingToggle?.isPublic
                ? "Publish this itinerary to the community?"
                : "Change itinerary to Private?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingToggle?.isPublic
                ? `"${pendingToggle.title}" will become visible and searchable on the Discover feed.`
                : `"${pendingToggle?.title}" will be immediately hidden from the community feed.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!isTogglingId}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleConfirm}
              disabled={!!isTogglingId}
              className={pendingToggle?.isPublic ? "bg-pink-500 hover:bg-pink-600" : undefined}
            >
              {isTogglingId ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : pendingToggle?.isPublic ? (
                "Confirm Publish"
              ) : (
                "Confirm Private"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
