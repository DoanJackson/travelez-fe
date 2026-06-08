"use client";

import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import type { PostDetail, PostFeedPage } from "@/types/post";

interface UseFollowUserOptions {
  postNumericId?: number;
}

export function useFollowUser({ postNumericId }: UseFollowUserOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isFollowing }: { userId: number; isFollowing: boolean }) =>
      isFollowing ? userService.unfollowUser(userId) : userService.followUser(userId),

    onMutate: async ({ userId, isFollowing }) => {
      const nextFollowed = !isFollowing;

      // Cancel in-flight refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ["posts", "feed"] });
      if (postNumericId) {
        await queryClient.cancelQueries({ queryKey: ["post", postNumericId] });
      }

      // Snapshot before mutation for rollback
      const previousFeed = queryClient.getQueryData<InfiniteData<PostFeedPage>>(["posts", "feed"]);
      const previousDetail = postNumericId
        ? queryClient.getQueryData<PostDetail>(["post", postNumericId])
        : undefined;

      // Optimistically patch the infinite feed cache
      // PostFeedPage.content is PostDetail[] — traversal is pages[n].content[m]
      queryClient.setQueryData<InfiniteData<PostFeedPage>>(["posts", "feed"], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            content: page.content.map((post) =>
              post.author.userId === userId
                ? { ...post, followed: nextFollowed }
                : post,
            ),
          })),
        };
      });

      // Optimistically patch the detail cache (modal source of truth)
      if (postNumericId && previousDetail) {
        queryClient.setQueryData<PostDetail>(["post", postNumericId], {
          ...previousDetail,
          followed: nextFollowed,
        });
      }

      return { previousFeed, previousDetail };
    },

    onError: (_err, _vars, context) => {
      // Restore both caches to pre-mutation state
      if (context?.previousFeed) {
        queryClient.setQueryData(["posts", "feed"], context.previousFeed);
      }
      if (postNumericId && context?.previousDetail) {
        queryClient.setQueryData(["post", postNumericId], context.previousDetail);
      }
    },

    onSettled: () => {
      // Background refetch for eventual consistency
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
    },
  });
}
