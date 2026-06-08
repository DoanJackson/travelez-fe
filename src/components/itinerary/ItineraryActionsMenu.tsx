"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Users, CalendarSync, Trash2, Loader2, CalendarCheck, Share2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { exportCalendar } from "@/services/itineraryService";
import type { IntegrationStatus } from "@/types/profile";
import type { ApiError } from "@/types/api";

interface ItineraryActionsMenuProps {
  itineraryId: number;
  integrationStatus: IntegrationStatus | undefined;
  calendarSyncedAt: string | null | undefined;
  isStatusLoading: boolean;
  onShare: () => void;
  onCollaborators: () => void;
  onDelete: () => void;
  onSyncSuccess?: () => void;
  isPreview: boolean;
}

export function ItineraryActionsMenu({
  itineraryId,
  integrationStatus,
  calendarSyncedAt,
  isStatusLoading,
  onShare,
  onCollaborators,
  onDelete,
  onSyncSuccess,
  isPreview,
}: ItineraryActionsMenuProps) {
  const [syncing, setSyncing] = useState(false);

  const handleCalendarSync = async () => {
    setSyncing(true);
    try {
      const { oauthUrl } = await exportCalendar(itineraryId);
      if (oauthUrl) {
        window.location.href = oauthUrl;
      } else {
        toast.success("Syncing to Google Calendar…", {
          description: "Activities will appear in your calendar shortly.",
        });
        onSyncSuccess?.();
      }
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.status === 400) {
        toast.info("Already synced to Google Calendar.");
      } else {
        toast.error(apiErr.message ?? "Calendar sync failed.");
      }
    } finally {
      setSyncing(false);
    }
  };

  const isSynced = !!calendarSyncedAt;

  const isLinkedWithScope =
    !!integrationStatus?.isGoogleLinked && !!integrationStatus?.hasCalendarScope;

  const syncLabel = (() => {
    if (isStatusLoading || syncing) return null;
    if (isSynced) {
      try {
        return `Synced · ${format(new Date(calendarSyncedAt!), "MMM d, yyyy")}`;
      } catch {
        return "Synced";
      }
    }
    if (isLinkedWithScope) return "Sync to Google Calendar";
    return "Connect Google Calendar";
  })();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label="More actions">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {/* Sharing */}
        <DropdownMenuItem onClick={onShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share itinerary
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCollaborators}>
          <Users className="mr-2 h-4 w-4" />
          Manage collaborators
        </DropdownMenuItem>

        {/* Integrations */}
        <DropdownMenuSeparator />
        {isStatusLoading || syncing ? (
          <DropdownMenuItem disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {syncing ? "Syncing…" : "Loading…"}
          </DropdownMenuItem>
        ) : isSynced ? (
          <DropdownMenuItem disabled className="text-muted-foreground">
            <CalendarCheck className="mr-2 h-4 w-4 text-green-500" />
            {syncLabel}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleCalendarSync}>
            <CalendarSync className="mr-2 h-4 w-4" />
            {syncLabel}
          </DropdownMenuItem>
        )}

        {/* Danger zone */}
        {!isPreview && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete itinerary
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
