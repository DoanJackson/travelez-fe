"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  MoreHorizontal,
  CornerDownRight,
  Flag,
  Compass,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { postService } from "@/services/postService";
import { useFollowUser } from "@/hooks/useFollowUser";
import { ReportDialog } from "@/components/community/ReportDialog";
import type {
  PostDetail,
  PostFeedPage,
  CommentResponse,
  EditCommentPayload,
  CommunityPost,
} from "@/types/post";
import type { ApiError } from "@/types/api";
import { usePostReaction } from "@/hooks/usePostReaction";

// ── CommentRow ──────────────────────────────────────────────────────────────

interface CommentRowProps {
  comment: CommentResponse;
  currentUserId?: number;
  onDelete: (id: number) => void;
  onReply: (comment: CommentResponse) => void;
  onEdit: (
    commentId: number,
    newContent: string,
    keptMediaIds: number[],
  ) => void;
  depth?: number;
}

function CommentRow({
  comment,
  currentUserId,
  onDelete,
  onReply,
  onEdit,
  depth = 0,
}: CommentRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const { data: repliesData, isLoading: loadingReplies } = useQuery({
    queryKey: ["comments", comment.id, "replies"],
    queryFn: () => postService.getReplies(comment.id),
    enabled: isExpanded && comment.childCommentCount > 0,
  });

  const replies = repliesData?.content ?? [];
  const isOwner =
    currentUserId !== undefined && currentUserId === comment.author.userId;
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  const handleSaveEdit = () => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    onEdit(
      comment.id,
      trimmed,
      comment.medias.map((m) => m.id),
    );
    setIsEditing(false);
  };

  return (
    <div className={cn("flex gap-3", depth > 0 && "ml-9 mt-2")}>
      <Avatar className="size-8 shrink-0 mt-0.5">
        <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold">
          {comment.author.fullName[0]?.toUpperCase() ?? "?"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="group/comment bg-slate-50 dark:bg-slate-800/60 rounded-2xl rounded-tl-none px-4 py-3">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <div className="flex items-baseline gap-2 flex-wrap min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {comment.author.fullName}
              </span>
              <span className="text-[10px] text-slate-400 shrink-0">
                {timeAgo}
              </span>
            </div>
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="Comment options"
                    className="opacity-0 group-hover/comment:opacity-100 transition-opacity flex items-center justify-center size-5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 shrink-0"
                  >
                    <MoreHorizontal className="size-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-28">
                  <DropdownMenuItem
                    onClick={() => {
                      setIsEditing(true);
                      setEditText(comment.content);
                    }}
                    className="cursor-pointer text-xs"
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(comment.id)}
                    className="cursor-pointer text-xs text-destructive focus:text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSaveEdit();
                  }
                  if (e.key === "Escape") setIsEditing(false);
                }}
                className="w-full text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-pink-300"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={!editText.trim()}
                  className="text-[10px] font-semibold text-white bg-pink-500 hover:bg-pink-600 disabled:opacity-40 px-2.5 py-1 rounded-full transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-[10px] font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {comment.content}
            </p>
          )}
        </div>

        {/* Action row */}
        {depth === 0 && (
          <div className="flex items-center gap-3 mt-1.5 ml-1">
            <button
              onClick={() => onReply(comment)}
              className="text-[10px] font-semibold text-slate-400 hover:text-pink-500 transition-colors flex items-center gap-1"
            >
              <CornerDownRight className="size-3" />
              Reply
            </button>
            {comment.childCommentCount > 0 && (
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="text-[10px] font-semibold text-slate-400 hover:text-pink-500 transition-colors"
              >
                {isExpanded
                  ? "Hide replies"
                  : `▾ ${comment.childCommentCount} ${comment.childCommentCount === 1 ? "reply" : "replies"}`}
              </button>
            )}
          </div>
        )}

        {/* Replies */}
        {isExpanded && (
          <div className="mt-1 space-y-2">
            {loadingReplies ? (
              <div className="flex items-center gap-2 ml-9 py-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-pink-400" />
                <span className="text-[10px] text-slate-400">
                  Loading replies…
                </span>
              </div>
            ) : (
              replies.map((reply) => (
                <CommentRow
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  onDelete={onDelete}
                  onReply={onReply}
                  onEdit={onEdit}
                  depth={1}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PostDetailModal ──────────────────────────────────────────────────────────

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: CommunityPost;
  numericId?: number;
  currentUserId?: number;
}

export default function PostDetailModal({
  isOpen,
  onClose,
  post,
  numericId,
  currentUserId,
}: PostDetailModalProps) {
  const queryClient = useQueryClient();
  const cachedDetail = numericId
    ? queryClient.getQueryData<PostDetail>(["post", numericId])
    : undefined;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<CommentResponse | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { handleReaction, isPending: isReacting } = usePostReaction({
    currentUserId,
  });

  // ── Fetch post detail ──
  const { data: detailPost, isLoading: isFetchingDetail } =
    useQuery<PostDetail>({
      queryKey: ["post", numericId],
      queryFn: () => postService.getPostById(numericId!),
      enabled: isOpen && !!numericId,
    });

  const isLiked = detailPost?.reactedByMe ?? post.isLiked;
  const likeCount = detailPost?.reactionCount ?? post.likes ?? 0;

  // ── Fetch comments (paginated) ──
  const {
    data: commentsPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: loadingComments,
  } = useInfiniteQuery({
    queryKey: ["comments", numericId],
    queryFn: ({ pageParam }) =>
      postService.getComments(numericId!, pageParam as number),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages - 1 ? lastPage.page + 1 : undefined,
    initialPageParam: 0,
    enabled: isOpen && !!numericId,
  });

  const comments = commentsPages?.pages.flatMap((p) => p.content) ?? [];
  const totalCommentCount =
    commentsPages?.pages[0]?.totalElements ?? post.comments;

  // ── Mutations ──
  const addCommentMutation = useMutation<
    void,
    ApiError,
    { content: string; parentId?: number }
  >({
    mutationFn: ({ content, parentId }) =>
      postService.createComment({ postId: numericId!, content, parentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", numericId] });
      queryClient.setQueryData<InfiniteData<PostFeedPage>>(
        ["posts", "feed"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              content: page.content.map((p) =>
                String(p.id) === String(numericId)
                  ? { ...p, commentCount: p.commentCount + 1 }
                  : p,
              ),
            })),
          };
        },
      );
      setCommentText("");
      setReplyingTo(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteCommentMutation = useMutation<void, ApiError, number>({
    mutationFn: (commentId) => postService.deleteComment(commentId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", numericId] }),
    onError: (err) => toast.error(err.message),
  });

  const editCommentMutation = useMutation<void, ApiError, EditCommentPayload>({
    mutationFn: (payload) => postService.editComment(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", numericId] }),
    onError: (err) => toast.error(err.message),
  });

  // ── Derived display values — API data takes priority over prop ──
  const displayTitle = detailPost?.title ?? post.title;
  const displayBody = detailPost?.content ?? post.body;
  const displayImages = detailPost?.medias.map((m) => m.url) ?? post.images;
  const displayAuthor = detailPost?.author.fullName ?? post.author.name;
  // null from detailPost is authoritative (no itinerary attached); only fall back
  // to the prop's value while the detail fetch hasn't resolved yet.
  const displayItinerary = detailPost !== undefined
    ? detailPost.itinerarySummary
    : post.itinerarySummary;

  const totalImages = displayImages.length;
  const hasMedia = totalImages > 0;
  const isPostOwner =
    !!currentUserId && detailPost?.author.userId === currentUserId;
  const isFollowing = detailPost?.followed ?? false;
  const authorId = detailPost?.author.userId ?? post.author.userId;
  const followMutation = useFollowUser({ postNumericId: numericId });

  const goToPrev = () =>
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);

  const goToNext = () =>
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);

  const handleSubmitComment = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!commentText.trim() || !numericId || addCommentMutation.isPending)
      return;
    addCommentMutation.mutate({
      content: commentText.trim(),
      parentId: replyingTo?.id,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "p-0 gap-0 border-none rounded-2xl shadow-2xl overflow-hidden",
          "w-[95vw] h-[88vh] max-h-[820px]",
          hasMedia ? "max-w-[1200px]" : "max-w-2xl",
          "flex flex-col md:flex-row",
          "bg-white dark:bg-slate-950",
        )}
      >
        <DialogTitle className="sr-only">Post Details</DialogTitle>
        <DialogDescription className="sr-only">
          View post details and community discussion
        </DialogDescription>

        {/* ── Custom Close Button ── */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 z-50 flex items-center justify-center size-8 rounded-full bg-black/40 hover:bg-black/65 text-white transition-colors backdrop-blur-sm"
        >
          <X className="size-4" />
        </button>

        {/* ══ LEFT COLUMN (45%) — Image Carousel ══ */}
        {hasMedia && (
          <div className="relative flex-[0_0_100%] md:flex-[0_0_45%] h-[45vw] md:h-full bg-slate-950 overflow-hidden group/mc">
            {/* Blurred ambient background */}
            <div
              className="absolute inset-0 scale-110 blur-2xl opacity-50 transition-[background-image] duration-300 pointer-events-none"
              style={{
                backgroundImage: `url("${displayImages[currentImageIndex]}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              aria-hidden
            />

            {isFetchingDetail ? (
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
              </div>
            ) : (
              <img
                key={currentImageIndex}
                src={displayImages[currentImageIndex]}
                alt={`${displayTitle} — image ${currentImageIndex + 1} of ${totalImages}`}
                className="relative z-10 w-full h-full object-contain"
              />
            )}

            {totalImages > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center size-9 rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-sm opacity-0 group-hover/mc:opacity-100 transition-all duration-150"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={goToNext}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center size-9 rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-sm opacity-0 group-hover/mc:opacity-100 transition-all duration-150"
                >
                  <ChevronRight className="size-5" />
                </button>

                <div className="absolute bottom-[4.5rem] left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                  {displayImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      aria-label={`Go to image ${idx + 1}`}
                      className={cn(
                        "rounded-full transition-all duration-200",
                        idx === currentImageIndex
                          ? "size-2.5 bg-white shadow"
                          : "size-1.5 bg-white/50 hover:bg-white/80",
                      )}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute inset-x-0 bottom-0 z-20 px-5 pt-10 pb-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
              <p className="text-white font-semibold text-sm leading-snug line-clamp-2 mb-1.5">
                {displayTitle}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-xs flex items-center gap-1">
                  <MapPin className="size-3 shrink-0" />
                  {post.location}
                </span>
                {totalImages > 1 && (
                  <span className="text-white/55 text-xs tabular-nums">
                    {currentImageIndex + 1} / {totalImages}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ RIGHT COLUMN ══ */}
        <div
          className={cn(
            "min-w-0 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950",
            hasMedia ? "flex-1 md:flex-[0_0_55%]" : "flex-1",
          )}
        >
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-6 md:p-8 space-y-5 pb-4">
              {/* Author row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="size-11 ring-2 ring-pink-100 dark:ring-pink-900/30 shrink-0">
                    <AvatarImage
                      src={post.author.avatarUrl}
                      alt={displayAuthor}
                    />
                    <AvatarFallback className="bg-[#ec4899] text-white font-bold text-sm">
                      {displayAuthor?.charAt(0)?.toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight truncate">
                      {displayAuthor}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {post.author.username} · {post.timeAgo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-3">
                  {!!currentUserId && !isPostOwner && (
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            aria-label="More options"
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded-full"
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() => setIsReportDialogOpen(true)}
                            className="cursor-pointer gap-2 text-slate-600 hover:text-red-600 focus:text-red-600"
                          >
                            <Flag className="size-4" />
                            Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        size="sm"
                        disabled={followMutation.isPending}
                        onClick={() =>
                          followMutation.mutate({
                            userId: authorId,
                            isFollowing,
                          })
                        }
                        className={cn(
                          "rounded-full font-bold text-xs px-4 h-8 transition-colors",
                          isFollowing
                            ? "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                            : "bg-pink-500 text-white hover:bg-pink-600",
                        )}
                      >
                        {followMutation.isPending
                          ? "..."
                          : isFollowing
                            ? "Following"
                            : "Follow"}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Post title */}
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                {displayTitle}
              </h1>

              {/* Post body */}
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-[1.85] whitespace-pre-line">
                {displayBody}
              </p>

              {/* Itinerary attachment widget */}
              {displayItinerary != null && (
                <Link
                  href={`/itinerary/${displayItinerary.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="block rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-800/40 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-pink-200 dark:hover:border-pink-800/40 transition-colors group/itinerary"
                >
                  {/* Row 1 — Header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Compass className="size-3.5 text-pink-400 shrink-0" />
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover/itinerary:text-pink-500 transition-colors">
                        {displayItinerary.title}
                      </span>
                    </div>
                    <ChevronRight className="size-3.5 text-slate-400 group-hover/itinerary:text-pink-400 transition-colors shrink-0 ml-1" />
                  </div>

                  {/* Row 2 — Destination city badges */}
                  {displayItinerary.destinationCities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {displayItinerary.destinationCities.map((city) => (
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
                  {displayItinerary.styles.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {displayItinerary.styles.map((style) => (
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
                      {new Date(displayItinerary.startDate).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" },
                      )}
                      {" – "}
                      {new Date(displayItinerary.endDate).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </span>
                  </div>
                </Link>
              )}

              {/* Location + Category tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
                  <MapPin className="size-3 text-pink-500 shrink-0" />
                  {post.location}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-pink-50 dark:bg-pink-950/30 text-pink-500 text-xs font-bold uppercase tracking-wide">
                  {post.category}
                </span>
              </div>

              <Separator className="dark:bg-slate-800" />

              {/* ── Comments Section ── */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Comments
                  <span className="ml-1.5 text-slate-400 font-normal">
                    ({totalCommentCount})
                  </span>
                </h3>

                {/* Reply banner */}
                {replyingTo && (
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-pink-50 dark:bg-pink-950/30">
                    <span className="text-xs text-pink-500 font-medium">
                      Replying to{" "}
                      <span className="font-bold">
                        @{replyingTo.author.username}
                      </span>
                    </span>
                    <button
                      onClick={() => setReplyingTo(null)}
                      aria-label="Cancel reply"
                      className="text-pink-400 hover:text-pink-600 transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}

                {/* Comment input row */}
                <form
                  className="flex items-center gap-3"
                  onSubmit={handleSubmitComment}
                >
                  <Avatar className="size-8 shrink-0">
                    <AvatarFallback className="bg-pink-50 text-pink-500 font-bold text-xs">
                      Y
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      disabled={addCommentMutation.isPending}
                      placeholder={
                        replyingTo
                          ? `Reply to ${replyingTo.author.fullName}…`
                          : "Add a comment…"
                      }
                      className="flex-1 h-9 text-sm rounded-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-pink-300 placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={
                        !commentText.trim() ||
                        !numericId ||
                        addCommentMutation.isPending
                      }
                      aria-label="Post comment"
                      className="flex items-center justify-center size-9 rounded-full bg-pink-500 hover:bg-pink-600 text-white disabled:opacity-35 disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                      {addCommentMutation.isPending ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                      ) : (
                        <Send className="size-3.5" />
                      )}
                    </button>
                  </div>
                </form>

                {/* Comment list */}
                {loadingComments ? (
                  <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex gap-3 animate-pulse">
                        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                        <div className="flex-1 space-y-2 pt-1">
                          <div className="h-2.5 rounded bg-slate-200 dark:bg-slate-700 w-1/4" />
                          <div className="h-2.5 rounded bg-slate-200 dark:bg-slate-700 w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">
                    No comments yet. Be the first!
                  </p>
                ) : (
                  <>
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <CommentRow
                          key={comment.id}
                          comment={comment}
                          currentUserId={currentUserId}
                          onDelete={(id) => deleteCommentMutation.mutate(id)}
                          onReply={(c) => setReplyingTo(c)}
                          onEdit={(commentId, newContent, keptMediaIds) =>
                            editCommentMutation.mutate({
                              commentId,
                              content: newContent,
                              keptMediaIds,
                              newFiles: [],
                            })
                          }
                        />
                      ))}
                    </div>

                    {hasNextPage && (
                      <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="w-full mt-2 py-2 text-xs font-semibold text-pink-500 hover:text-pink-600 disabled:text-slate-400 transition-colors"
                      >
                        {isFetchingNextPage ? "Loading…" : "Load more comments"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* ══ STICKY FOOTER ══ */}
          <div className="shrink-0 flex items-center justify-between px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              {/* Like */}
              <button
                onClick={() => {
                  if (isReacting) return;
                  handleReaction({
                    postId: Number(numericId),
                    wasLiked: isLiked,
                  });
                }}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-semibold transition-colors group",
                  isLiked
                    ? "text-pink-500"
                    : "text-slate-500 hover:text-pink-400",
                )}
                aria-label={isLiked ? "Unlike" : "Like"}
              >
                <Heart
                  className={cn(
                    "size-5 transition-transform group-hover:scale-110",
                    isLiked && "fill-current",
                  )}
                />
                {(likeCount ?? 0).toLocaleString()}
              </button>

              {/* Comment count */}
              <button
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-pink-400 transition-colors group"
                aria-label="Jump to comments"
              >
                <MessageCircle className="size-5 transition-transform group-hover:scale-110" />
                {totalCommentCount}
              </button>
            </div>

            {/* Save to Itinerary */}
            {/* <Button
              onClick={() => setIsSaved((prev) => !prev)}
              size="sm"
              className={cn(
                "gap-2 rounded-full font-bold px-5 transition-all hover:-translate-y-0.5 shadow-sm",
                isSaved && "opacity-75",
              )}
              aria-label={isSaved ? "Saved to Itinerary" : "Save to Itinerary"}
            >
              <Bookmark className={cn("size-4", isSaved && "fill-current")} />
              {isSaved ? "Saved" : "Save to Itinerary"}
            </Button> */}
          </div>
        </div>
      </DialogContent>

      <ReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        postId={numericId ?? 0}
      />
    </Dialog>
  );
}
