"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { StarRating } from "@/components/review/StarRating";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { deleteReview } from "@/services/reviewService";
import type { ProfileReview } from "@/types/profile";
import type { ReviewMedia } from "@/types/review";

interface ProfileReviewCardProps {
  review: ProfileReview;
  onDelete?: () => void;
}

export function ProfileReviewCard({ review, onDelete }: ProfileReviewCardProps) {
  const { poi, rating, content, createdAt } = review;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = (() => {
    try {
      return format(new Date(createdAt), "MMM d, yyyy");
    } catch {
      return createdAt;
    }
  })();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteReview(review.id);
      toast.success("Review deleted.");
      onDelete?.();
    } catch {
      toast.error("Failed to delete review.");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden flex flex-col sm:flex-row",
          "transition-all duration-200 hover:translate-x-0.5 border-l-4 border-l-transparent hover:border-l-pink-500",
        )}
      >
        {/* POI image */}
        <div className="relative w-full sm:w-40 h-[120px] sm:h-auto shrink-0 overflow-hidden bg-slate-100">
          {poi.imageUrl ? (
            <Image
              src={poi.imageUrl}
              alt={poi.name}
              fill
              sizes="(max-width: 640px) 100vw, 160px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-200" />
          )}
        </div>

        {/* Content */}
        <div className="flex grow flex-col justify-between p-5">
          <div>
            <div className="mb-1 flex items-start justify-between gap-2">
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                {poi.name}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1 shrink-0"
                    aria-label="More options"
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <StarRating value={rating} readOnly size={14} className="mb-2" />

            <p className="text-sm text-slate-500 italic leading-relaxed line-clamp-2">
              &ldquo;{content}&rdquo;
            </p>

            {/* Review images — show all medias including index 0 (which also
                populates poi.imageUrl as a thumbnail). Showing the full set
                here gives the user a complete view of what they uploaded;
                the left thumbnail is a separate display slot. */}
            {review.medias.filter((m): m is ReviewMedia => m.type === "IMAGE").length > 0 && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-1">
                {review.medias
                  .filter((m): m is ReviewMedia => m.type === "IMAGE")
                  .slice(0, 4)
                  .map((m) => (
                    <div key={m.id} className="relative aspect-square overflow-hidden rounded">
                      <Image
                        src={m.url}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 25vw, 80px"
                        className="object-cover"
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="mt-4">
            <span className="text-xs text-slate-400">Reviewed on {formattedDate}</span>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete review?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The review will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
