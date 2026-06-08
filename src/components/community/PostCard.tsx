"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Trash2,
  Flag,
  Compass,
  Calendar,
} from "lucide-react";
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
import { toast } from "sonner";
import { postService } from "@/services/postService";
import { cn } from "@/lib/utils";
import type { CommunityPost } from "@/types/post";
import { usePostReaction } from "@/hooks/usePostReaction";
import { ReportDialog } from "@/components/community/ReportDialog";

const CATEGORY_STYLES: Record<string, string> = {
  Itineraries:
    "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  Tips: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  Photos:
    "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
};

interface PostCardProps {
  post: CommunityPost;
  numericId?: number;
  currentUserId?: number;
  onClick?: () => void;
  onDelete?: () => void;
}

export function PostCard({
  post,
  numericId,
  currentUserId,
  onClick,
  onDelete,
}: PostCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const { handleReaction, isPending: isReacting } = usePostReaction({
    currentUserId,
  });

  const isOwner = !!currentUserId && post.author.userId === currentUserId;

  const handleDelete = async () => {
    if (!numericId) return;
    setIsDeleting(true);
    try {
      await postService.deletePost(numericId);
      toast.success("Post deleted.");
      onDelete?.();
    } catch {
      toast.error("Failed to delete post.");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const totalImages = post.images.length;

  const goToPrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  return (
    <Card className="overflow-hidden dark:bg-slate-900 dark:border-slate-800">
      {/* Post Header */}
      <div className="p-5 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="inline-flex"
        >
          <Link
            href={`/profile/${post.author.userId}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-3 group/author"
          >
            <div
              className="relative size-10 rounded-full ring-2 ring-pink-100 dark:ring-pink-900/40 shrink-0"
              aria-label={`${post.author.name}'s avatar`}
            >
              <div className="absolute inset-0 rounded-full bg-[#ec4899] flex items-center justify-center text-white font-bold text-sm select-none">
                {post.author.name?.charAt(0).toUpperCase() ?? "?"}
              </div>
              {post.author.avatarUrl && !avatarError && (
                <img
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  className="absolute inset-0 w-full h-full object-cover rounded-full"
                  onError={() => setAvatarError(true)}
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-slate-900 dark:text-white font-bold text-sm leading-tight group-hover/author:text-pink-500 group-hover/author:underline transition-colors">
                {post.author.name}
              </span>
              <span className="text-slate-500 text-xs">{post.timeAgo}</span>
            </div>
          </Link>
        </motion.div>
        {!!currentUserId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full p-1"
                aria-label="More options"
              >
                <MoreHorizontal className="size-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {isOwner && (
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              )}
              {!isOwner && (
                <DropdownMenuItem
                  onClick={() => setIsReportDialogOpen(true)}
                  className="cursor-pointer gap-2 text-slate-600 hover:text-red-600 focus:text-red-600"
                >
                  <Flag className="size-4" />
                  Report
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Clickable area: Carousel + Content → opens PostDetailModal */}
      <div onClick={onClick} className="cursor-pointer group/content">
        {/* Image Carousel */}
        {totalImages > 0 && (
          <div className="relative w-full aspect-[16/9] group/carousel overflow-hidden bg-gray-100 dark:bg-slate-800">
            {/* Image Strip */}
            <div
              className="flex w-full h-full transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {post.images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="w-full h-full flex-shrink-0 bg-center bg-no-repeat bg-cover"
                  style={{ backgroundImage: `url("${imgUrl}")` }}
                  aria-label={`Post image ${idx + 1} of ${totalImages}`}
                />
              ))}
            </div>

            {/* Image Counter Badge */}
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {currentImageIndex + 1}/{totalImages}
            </div>

            {/* Navigation Arrows */}
            {totalImages > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrev();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-white dark:hover:bg-slate-900 shadow-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-white dark:hover:bg-slate-900 shadow-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}

            {/* Pagination Dots */}
            {totalImages > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {post.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "rounded-full transition-all duration-200",
                      idx === currentImageIndex
                        ? "size-2.5 bg-white shadow-sm"
                        : "size-1.5 bg-white/50 hover:bg-white/75",
                    )}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Post Content */}
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={cn(
                "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                CATEGORY_STYLES[post.category] ?? "bg-primary/10 text-primary",
              )}
            >
              {post.category}
            </span>
            {(post.likes > 100 || post.comments > 20) && (
              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                🔥 Trending
              </span>
            )}
            {(post.poiSummary?.name || post.location) && (
              <span className="text-slate-400 text-xs flex items-center gap-1 max-w-[180px]">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">
                  {post.poiSummary?.name ?? post.location}
                </span>
              </span>
            )}
          </div>

          <p className="text-lg font-bold text-slate-900 dark:text-white mb-1 leading-snug transition-colors duration-150 group-hover/content:text-pink-500">
            {post.title}
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
            {post.body}
          </p>
          <span className="text-xs text-pink-500 font-medium mt-1 inline-block">
            Read more
          </span>

          {/* Itinerary attachment widget */}
          {post.itinerarySummary != null && (
            <Link
              href={`/itinerary/${post.itinerarySummary.id}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-1 block rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-800/40 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-pink-200 dark:hover:border-pink-800/40 transition-colors group/itinerary"
            >
              {/* Row 1 — Header */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Compass className="size-3.5 text-pink-400 shrink-0" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover/itinerary:text-pink-500 transition-colors">
                    {post.itinerarySummary.title}
                  </span>
                </div>
                <ChevronRight className="size-3.5 text-slate-400 group-hover/itinerary:text-pink-400 transition-colors shrink-0 ml-1" />
              </div>

              {/* Row 2 — Destination city badges */}
              {post.itinerarySummary.destinationCities.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {post.itinerarySummary.destinationCities.map((city) => (
                    <span
                      key={city}
                      className="text-[10px] bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full px-2 py-0.5"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              )}

              {/* Row 3 — Style chips */}
              {post.itinerarySummary.styles.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {post.itinerarySummary.styles.map((style) => (
                    <span
                      key={style}
                      className="text-[10px] bg-pink-50 dark:bg-pink-950/30 text-pink-500 rounded-full px-2 py-0.5"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              )}

              {/* Row 4 — Date footer */}
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Calendar className="size-3 shrink-0" />
                <span>
                  {new Date(post.itinerarySummary.startDate).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" },
                  )}
                  {" – "}
                  {new Date(post.itinerarySummary.endDate).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" },
                  )}
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
      {/* end clickable wrapper */}

      {/* Actions — outside clickable wrapper to prevent bubbling */}
      <div className="flex items-center justify-between m-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-5">
          {/* Like */}
          <motion.button
            onClick={() =>
              numericId &&
              handleReaction({ postId: numericId, wasLiked: post.isLiked })
            }
            whileTap={{ scale: 1.35 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            disabled={isReacting}
            className={cn(
              "flex items-center gap-2 transition-colors group",
              post.isLiked
                ? "text-pink-500"
                : "text-slate-500 hover:text-pink-400",
            )}
            aria-label={post.isLiked ? "Unlike post" : "Like post"}
          >
            <Heart
              className={cn(
                "size-5 transition-all duration-150",
                post.isLiked && "fill-current",
              )}
            />
            <span className="text-sm font-semibold">{post.likes}</span>
          </motion.button>

          {/* Comment */}
          <button
            className="flex items-center gap-2 text-slate-500 hover:text-pink-400 transition-colors group"
            aria-label="View comments"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <MessageCircle className="size-5 transition-transform group-hover:scale-110" />
            <span className="text-sm font-semibold">{post.comments}</span>
          </button>
        </div>

        {/* Bookmark */}
        {/* <button
          onClick={() => setIsSaved((prev) => !prev)}
          className={cn(
            "transition-colors group",
            isSaved ? "text-pink-500" : "text-slate-400 hover:text-pink-400",
          )}
          aria-label={isSaved ? "Unsave post" : "Save post"}
        >
          <Bookmark
            className={cn(
              "size-5 transition-transform group-hover:scale-110",
              isSaved && "fill-current",
            )}
          />
        </button> */}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post will be permanently
              removed.
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

      <ReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        postId={numericId ?? 0}
      />
    </Card>
  );
}
