import { useCallback } from "react";
import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { toast } from "sonner";
import { postService } from "@/services/postService";
import type { PostDetail, PostFeedPage } from "@/types/post";

/**
 * Applies a patch to a single PostDetail entry inside any InfiniteData feed structure.
 * Generic over P (the page type) so callers retain full type safety through setQueryData.
 */
function patchInfinitePost<P extends { content?: Array<{ id: number | string; likes?: number; reactionCount?: number; reactedByMe?: boolean }> }>(
  old: InfiniteData<P> | undefined,
  postId: number | string,
  wasLiked: boolean
): InfiniteData<P> | undefined {
  if (!old) return old;

  return {
    ...old,
    pages: old.pages.map((page) => {
      const patchedContent = page.content?.map((p) => {
        if (String(p.id) !== String(postId)) return p;

        const current = Number(p.likes ?? p.reactionCount ?? 0);
        const next = wasLiked ? Math.max(0, current - 1) : current + 1;

        return { ...p, reactedByMe: !wasLiked, likes: next, reactionCount: next };
      }) ?? [];

      return { ...page, content: patchedContent };
    }),
  } as InfiniteData<P>;
}

export interface ReactionPayload {
  postId: number;
  wasLiked: boolean;
}

interface UsePostReactionOptions {
  currentUserId: number | undefined;
}

/**
 * Centralized reaction hook using TanStack useMutation.
 *
 * postId and wasLiked are passed at the call-site (not captured at init) to prevent
 * stale closure bugs when a parent component stays mounted but changes post context.
 *
 * onMutate patches the cache synchronously before the API call, giving instant UI feedback
 * with zero local state. onError rolls back all snapshots atomically.
 */
export function usePostReaction({ currentUserId }: UsePostReactionOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ postId }: ReactionPayload) =>
      postService.toggleReaction({ targetType: "POST", targetId: postId }),

    onMutate: async ({ postId, wasLiked }) => {
      // Cancel in-flight refetches that would overwrite our optimistic patch
      await queryClient.cancelQueries({ queryKey: ["posts", "feed"] });
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      // Snapshot all relevant caches for atomic rollback
      const previousFeed = queryClient.getQueryData<InfiniteData<PostFeedPage>>(["posts", "feed"]);
      const previousDetail = queryClient.getQueryData<PostDetail>(["post", postId]);
      const searchSnapshots = queryClient.getQueriesData<InfiniteData<PostFeedPage>>({
        queryKey: ["posts", "search"],
      });

      // Patch feed cache
      queryClient.setQueryData<InfiniteData<PostFeedPage>>(
        ["posts", "feed"],
        (old) => patchInfinitePost<PostFeedPage>(old, postId, wasLiked),
      );

      // Patch all active search result caches
      searchSnapshots.forEach(([key]) =>
        queryClient.setQueryData<InfiniteData<PostFeedPage>>(
          key,
          (old) => patchInfinitePost<PostFeedPage>(old, postId, wasLiked),
        ),
      );

      // Patch the single post detail cache (not feed-shaped)
      // Uses Number() + nullish coalescing to guard against undefined/stringified/aliased fields
      queryClient.setQueryData<any>(["post", postId], (old: any) => {
        if (!old) return old;
        const currentLikes = Number(old.reactionCount ?? old.likes ?? 0);
        const newLikes = wasLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
        return {
          ...old,
          reactedByMe: !wasLiked,
          reactionCount: newLikes,
          likes: newLikes,
        };
      });

      return { previousFeed, previousDetail, searchSnapshots };
    },

    onError: (_err, { postId }, context) => {
      // Restore every cache snapshot atomically
      if (context?.previousFeed !== undefined) {
        queryClient.setQueryData(["posts", "feed"], context.previousFeed);
      }
      if (context?.previousDetail !== undefined) {
        queryClient.setQueryData(["post", postId], context.previousDetail);
      }
      context?.searchSnapshots.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );
      toast.error("Failed to update reaction.");
    },
  });

  const handleReaction = useCallback(
    ({ postId, wasLiked }: ReactionPayload) => {
      if (!currentUserId) {
        toast.info("Please sign in to like posts.");
        return;
      }
      if (mutation.isPending) return;
      mutation.mutate({ postId, wasLiked });
    },
    [currentUserId, mutation],
  );

  return { handleReaction, isPending: mutation.isPending };
}
