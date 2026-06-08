"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SearchX, PlusCircle } from "lucide-react";
import { SidebarLeft } from "@/components/community/SidebarLeft";
import { SidebarRight } from "@/components/community/SidebarRight";
import { PostCard } from "@/components/community/PostCard";
import { Button } from "@/components/ui/button";
import { trendingDestinations, topTravelers } from "@/lib/mock-community";
import type { CommunityPost, PostCategory } from "@/types/post";
import PostCreationModal from "@/components/community/PostCreationModal";
import PostDetailModal from "@/components/community/PostDetailModal";
import { AuthCookies } from "@/lib/cookie";
import { postService, getPosts } from "@/services/postService";
import { postDetailToCommunityPost } from "@/lib/adapters/post";
import type { PostFeedPage } from "@/types/post";
import type { InfiniteData } from "@tanstack/react-query";

// ── Skeleton for search loading state ────────────────────────────────────────
function PostCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-pulse bg-white dark:bg-slate-900">
      <div className="h-48 bg-slate-200 dark:bg-slate-700 w-full" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16" />
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  const [activeCategory, setActiveCategory] = useState<PostCategory | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>(
    undefined,
  );
  const [activeSearch, setActiveSearch] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data: feedData,
    isLoading: isFeedLoading,
    isError: isFeedError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    PostFeedPage,
    Error,
    InfiniteData<PostFeedPage>,
    string[],
    number | undefined
  >({
    queryKey: ["posts", "feed"],
    queryFn: ({ pageParam }) => getPosts(10, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext && lastPage.nextCursor != null
        ? Number(lastPage.nextCursor)
        : undefined,
  });

  const allPosts: CommunityPost[] = (feedData?.pages ?? [])
    .flatMap((page) => page.content)
    .map(postDetailToCommunityPost);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const {
    data: searchData,
    isLoading: isSearching,
    isError: searchError,
  } = useQuery({
    queryKey: ["posts", "search", activeSearch, activeCategory],
    queryFn: () =>
      postService.searchPosts({
        keyword: activeSearch,
        sortDirection: "DESC",
        size: 20,
        topicTag: activeCategory ?? undefined,
      }),
    enabled: !!activeSearch,
  });

  // Auth + URL hydration on mount
  useEffect(() => {
    setIsMounted(true);
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("TRAVELEZ_CURRENT_USER"));
      const rawId = AuthCookies.getUserId();
      const numId = Number(rawId);
      setCurrentUserId(isNaN(numId) || numId === 0 ? undefined : numId);
    };
    checkAuth();
    window.addEventListener("auth-change", checkAuth);

    // Hydrate search state from URL on first load
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setSearchQuery(q);
      setActiveSearch(q);
    }

    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  const filteredPosts = allPosts
    .filter(
      (post) => activeCategory === null || post.category === activeCategory,
    )
    .sort((a, b) => {
      if (sortBy === "popular") return b.likes - a.likes;
      return b.createdAt - a.createdAt;
    });

  const handleOpenDetail = (post: CommunityPost) => {
    setSelectedPost(post);
    setIsDetailModalOpen(true);
  };

  const handleDeletePost = useCallback(
    (postId: string) => {
      queryClient.setQueryData<InfiniteData<PostFeedPage>>(
        ["posts", "feed"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              content: page.content.filter((p) => String(p.id) !== postId),
            })),
          };
        },
      );
    },
    [queryClient],
  );

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    setActiveSearch(trimmed);
    const params = new URLSearchParams(window.location.search);
    trimmed ? params.set("q", trimmed) : params.delete("q");
    router.replace(`/community?${params.toString()}`, { scroll: false });
  };

  const handleClear = () => {
    setSearchQuery("");
    setActiveSearch("");
    const params = new URLSearchParams(window.location.search);
    params.delete("q");
    router.replace(`/community?${params.toString()}`, { scroll: false });
  };

  const searchResultCount = (searchData ?? []).length;

  return (
    <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start">
        <SidebarLeft
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          onClear={handleClear}
          sortBy={sortBy}
          onSortChange={setSortBy}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onCreatePost={
            isMounted && isAuthenticated
              ? () => setIsModalOpen(true)
              : undefined
          }
        />

        <PostCreationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
          }}
        />

        {/* Main Feed */}
        <section className="col-span-1 lg:col-span-6 flex flex-col gap-6 w-full">
          {activeSearch !== "" ? (
            isSearching ? (
              <div className="flex flex-col gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            ) : searchError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
                  Search failed.
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                  Please try again.
                </p>
              </div>
            ) : searchResultCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <SearchX className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                <div className="space-y-1">
                  <p className="text-slate-700 dark:text-slate-200 text-base font-semibold">
                    No posts found for &ldquo;{activeSearch}&rdquo;
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm">
                    Try different keywords, or be the first to write about it.
                  </p>
                </div>
                {isAuthenticated && (
                  <Button
                    size="sm"
                    className="gap-2 mt-2"
                    onClick={() => {
                      handleClear();
                      setIsModalOpen(true);
                    }}
                  >
                    <PlusCircle className="size-4" />
                    Create a post
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Result count */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {searchResultCount}
                    </span>{" "}
                    result{searchResultCount !== 1 ? "s" : ""} for{" "}
                    <span className="font-semibold text-pink-500">
                      &ldquo;{activeSearch}&rdquo;
                    </span>
                  </p>
                </div>
                {(searchData ?? [])
                  .map(postDetailToCommunityPost)
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      numericId={post.numericId}
                      currentUserId={currentUserId}
                      onClick={() => handleOpenDetail(post)}
                      onDelete={() => handleDeletePost(post.id)}
                    />
                  ))}
              </>
            )
          ) : isFeedLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
            </div>
          ) : isFeedError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
                Failed to load posts.
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                Please refresh the page.
              </p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
                No posts yet.
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                Be the first to share!
              </p>
            </div>
          ) : (
            <>
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  numericId={post.numericId}
                  currentUserId={currentUserId}
                  onClick={() => handleOpenDetail(post)}
                  onDelete={() => handleDeletePost(post.id)}
                />
              ))}
              <div ref={sentinelRef} className="h-4" />
              {isFetchingNextPage && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500" />
                </div>
              )}
            </>
          )}
        </section>

        {selectedPost && (
          <PostDetailModal
            key={selectedPost?.id}
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedPost(null);
            }}
            post={selectedPost}
            numericId={selectedPost.numericId}
            currentUserId={currentUserId}
          />
        )}

        {/* <SidebarRight
          trendingDestinations={trendingDestinations}
          topTravelers={topTravelers}
        /> */}
      </div>
    </main>
  );
}
