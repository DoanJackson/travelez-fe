"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/community/PostCard";
import PostDetailModal from "@/components/community/PostDetailModal";
import PostCreationModal from "@/components/community/PostCreationModal";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileReviewCard } from "@/components/profile/ProfileReviewCard";
import { ProfileEmptyNudge } from "@/components/profile/ProfileEmptyNudge";
import { postDetailToCommunityPost } from "@/lib/adapters/post";
import { apiReviewToProfileReview } from "@/lib/adapters/review";
import { syncNavUser } from "@/lib/nav-user";
import type { CommunityPost } from "@/types/post";
import type { ProfileReview, UserProfileResponseData } from "@/types/profile";
import { userService } from "@/services/userService";
import { getUserById } from "@/services/userService";
import { getPostsByUserId } from "@/services/postService";
import { getReviewsByUserId } from "@/services/reviewService";
import { getUserPublicItineraries } from "@/services/itineraryService";
import type { PublicItinerarySummary, SharedItinerarySummary } from "@/types/itinerary";
import { ItineraryCard } from "@/components/itineraries/ItineraryCard";
import { toast } from "sonner";

interface ProfileTemplateProps {
  viewedUserId: number;
  isOwnProfile: boolean;
  loggedInUserId?: number;
  initialData?: UserProfileResponseData;
}

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

function seedName(data: UserProfileResponseData): string {
  return data.fullName || data.username || "Traveler";
}

export default function ProfileTemplate({
  viewedUserId,
  isOwnProfile,
  loggedInUserId,
  initialData,
}: ProfileTemplateProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [profileName, setProfileName] = useState(() =>
    initialData ? seedName(initialData) : ""
  );
  const [profileUsername, setProfileUsername] = useState(initialData?.username ?? "");
  const [profileInitials, setProfileInitials] = useState(() =>
    initialData ? deriveInitials(seedName(initialData)) : ""
  );
  const [profileRole, setProfileRole] = useState(initialData?.role ?? "");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | undefined>(
    initialData?.avatar?.url ?? undefined
  );
  const [followerCount, setFollowerCount] = useState<number | undefined>(initialData?.followerCount);
  const [followingCount, setFollowingCount] = useState<number | undefined>(initialData?.followingCount);
  const [isFollowing, setIsFollowing] = useState(initialData?.followedByMe ?? false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  const [reviews, setReviews] = useState<ProfileReview[]>([]);
  const [reviewsPage, setReviewsPage] = useState(0);
  const [reviewsTotalPages, setReviewsTotalPages] = useState(1);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const [activeTab, setActiveTab] = useState("reviews");
  const [itineraries, setItineraries] = useState<PublicItinerarySummary[]>([]);
  const [itinerariesPage, setItinerariesPage] = useState(0);
  const [itineraresTotalPages, setItineraresTotalPages] = useState(1);
  const [isLoadingItineraries, setIsLoadingItineraries] = useState(false);
  const [itinerariesLoaded, setItinerariesLoaded] = useState(false);

  const handleFollow = async () => {
    const prevFollowing = isFollowing;
    const prevCount = followerCount ?? 0;
    setIsFollowing(!prevFollowing);
    setFollowerCount(prevCount + (prevFollowing ? -1 : 1));
    try {
      await (prevFollowing
        ? userService.unfollowUser(viewedUserId)
        : userService.followUser(viewedUserId));
    } catch {
      setIsFollowing(prevFollowing);
      setFollowerCount(prevCount);
      toast.error("Failed to update follow status.");
    } finally {
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
    }
  };

  const handleMessage = () => {
    router.push(`/messages?receiverId=${viewedUserId}`);
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleAvatarChange = async (file: File) => {
    setIsUploadingAvatar(true);
    try {
      const media = await userService.updateUserAvatar(file);
      setProfileAvatarUrl(media.url);
      syncNavUser(profileName, media.url);
      toast.success("Avatar updated.");
    } catch {
      toast.error("Failed to update avatar.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const fetchItineraries = useCallback(async (uid: number, page: number) => {
    setIsLoadingItineraries(true);
    try {
      const res = await getUserPublicItineraries(uid, page, 9);
      setItineraries((prev) => page === 0 ? res.data.content : [...prev, ...res.data.content]);
      setItineraresTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to load itineraries.");
    } finally {
      setIsLoadingItineraries(false);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "itineraries" && !itinerariesLoaded) {
      setItinerariesLoaded(true);
      fetchItineraries(viewedUserId, 0);
    }
  };

  const fetchReviews = useCallback(async (uid: number, page: number) => {
    setIsLoadingReviews(true);
    try {
      const res = await getReviewsByUserId(uid, { page, size: 10, sortField: "id", sortDirection: "DESC" });
      const mapped = res.data.content.map(apiReviewToProfileReview);
      setReviews((prev) => page === 0 ? mapped : [...prev, ...mapped]);
      setReviewsTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to load reviews.");
    } finally {
      setIsLoadingReviews(false);
    }
  }, []);

  useEffect(() => {
    if (!viewedUserId) return;

    const fetchSecondary = async () => {
      if (!initialData) {
        // No SSR data (e.g. client-side navigation without server prefetch) — fetch profile
        try {
          const data = await getUserById(viewedUserId);
          const name = seedName(data);
          setProfileName(name);
          setProfileUsername(data.username);
          setProfileRole(data.role);
          setProfileAvatarUrl(data.avatar?.url ?? undefined);
          setFollowerCount(data.followerCount);
          setFollowingCount(data.followingCount);
          setIsFollowing(data.followedByMe);
          setProfileInitials(deriveInitials(name));
          if (isOwnProfile) syncNavUser(name, data.avatar?.url ?? null);
        } catch {
          toast.error("Failed to load profile.");
        }
      } else if (isOwnProfile) {
        syncNavUser(profileName, initialData.avatar?.url ?? null);
      }

      fetchReviews(viewedUserId, 0);

      try {
        const details = await getPostsByUserId(viewedUserId, "createdAt", "DESC", 0, 20);
        setPosts(details.map(postDetailToCommunityPost));
      } catch {
        setPosts([]);
      }
    };

    fetchSecondary();
  }, [viewedUserId, isOwnProfile, fetchReviews, initialData]); // eslint-disable-line react-hooks/exhaustive-deps

  const reviewTabLabel = isOwnProfile ? "My Reviews" : "Reviews";
  const postTabLabel = isOwnProfile ? "My Posts" : "Posts";
  const itineraryTabLabel = isOwnProfile ? "My Itineraries" : "Itineraries";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <ProfileHeader
          name={profileName}
          username={profileUsername}
          bio=""
          initials={profileInitials}
          role={profileRole}
          avatarUrl={profileAvatarUrl}
          followerCount={followerCount}
          followingCount={followingCount}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          isUploadingAvatar={isOwnProfile ? isUploadingAvatar : false}
          onEditProfile={() => router.push("/profile/edit")}
          onAvatarChange={isOwnProfile ? handleAvatarChange : undefined}
          onFollow={!isOwnProfile ? handleFollow : undefined}
          onMessage={!isOwnProfile ? handleMessage : undefined}
        />

        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
          <div className="sticky top-16 z-10 bg-gray-50 flex items-end justify-between border-b border-gray-200">
            <TabsList className="justify-start rounded-none h-auto bg-transparent p-0">
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:text-pink-600 data-[state=active]:shadow-none data-[state=active]:bg-transparent pb-3 px-0 mr-8 text-slate-500 hover:text-slate-700"
              >
                {reviewTabLabel}
              </TabsTrigger>
              <TabsTrigger
                value="posts"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:text-pink-600 data-[state=active]:shadow-none data-[state=active]:bg-transparent pb-3 px-0 mr-8 text-slate-500 hover:text-slate-700"
              >
                {postTabLabel}
              </TabsTrigger>
              <TabsTrigger
                value="itineraries"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:text-pink-600 data-[state=active]:shadow-none data-[state=active]:bg-transparent pb-3 px-0 text-slate-500 hover:text-slate-700"
              >
                {itineraryTabLabel}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Reviews tab */}
          <TabsContent value="reviews" className="mt-6">
            <div className="flex flex-col gap-4">
              {isLoadingReviews && reviews.length === 0 && (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-28 bg-white rounded-xl border border-gray-200" />
                  ))}
                </div>
              )}
              {reviews.map((review) => (
                <ProfileReviewCard
                  key={review.id}
                  review={review}
                  onDelete={isOwnProfile
                    ? () => setReviews((prev) => prev.filter((r) => r.id !== review.id))
                    : undefined
                  }
                />
              ))}
              {reviews.length === 0 && !isLoadingReviews && (
                <ProfileEmptyNudge
                  message={isOwnProfile
                    ? "Explore more places and share your experience with the community."
                    : "This user hasn't written any reviews yet."
                  }
                  ctaLabel={isOwnProfile ? "Write a Review →" : "Explore Places →"}
                  ctaHref={isOwnProfile ? "/reviews" : "/discover"}
                />
              )}
              {reviewsPage + 1 < reviewsTotalPages && (
                <div className="mt-2 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoadingReviews}
                    onClick={() => {
                      const next = reviewsPage + 1;
                      setReviewsPage(next);
                      fetchReviews(viewedUserId, next);
                    }}
                  >
                    {isLoadingReviews ? "Loading…" : "Load More"}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Posts tab */}
          <TabsContent value="posts" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {isOwnProfile && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsCreateModalOpen(true)}
                  onKeyDown={(e) => e.key === "Enter" && setIsCreateModalOpen(true)}
                  className="flex flex-col items-center justify-center gap-3 min-h-[300px] rounded-xl border-2 border-dashed border-pink-200 bg-white text-pink-400 hover:border-pink-400 hover:text-pink-500 hover:bg-pink-50 transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center justify-center size-12 rounded-full bg-pink-50 border-2 border-pink-200 transition-colors">
                    <Plus className="size-6" />
                  </div>
                  <span className="text-sm font-semibold">Write a Post</span>
                </div>
              )}

              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  numericId={post.numericId}
                  currentUserId={loggedInUserId}
                  onClick={() => setSelectedPost(post)}
                  onDelete={isOwnProfile ? () => handleDeletePost(post.id) : undefined}
                />
              ))}
            </div>
          </TabsContent>

          {/* Itineraries tab */}
          <TabsContent value="itineraries" className="mt-6">
            <div className="flex flex-col gap-4">
              {isLoadingItineraries && itineraries.length === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl bg-white border border-gray-200 overflow-hidden">
                      <div className="h-40 bg-gray-200" />
                      <div className="p-4 space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {itineraries.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {itineraries.map((item, index) => (
                    <ItineraryCard
                      key={item.id}
                      index={index}
                      itinerary={item as SharedItinerarySummary}
                      isReadOnly={true}
                    />
                  ))}
                </div>
              )}
              {itineraries.length === 0 && !isLoadingItineraries && (
                <ProfileEmptyNudge
                  message={isOwnProfile
                    ? "You haven't shared any itineraries publicly yet."
                    : "This user hasn't shared any itineraries yet."
                  }
                  ctaLabel={isOwnProfile ? "My Itineraries →" : "Explore Itineraries →"}
                  ctaHref={isOwnProfile ? "/my-itineraries" : "/discover"}
                />
              )}
              {itinerariesPage + 1 < itineraresTotalPages && (
                <div className="mt-2 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoadingItineraries}
                    onClick={() => {
                      const next = itinerariesPage + 1;
                      setItinerariesPage(next);
                      fetchItineraries(viewedUserId, next);
                    }}
                  >
                    {isLoadingItineraries ? "Loading…" : "Load More"}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {isOwnProfile && (
        <PostCreationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            getPostsByUserId(viewedUserId, "createdAt", "DESC", 0, 20)
              .then((details) => setPosts(details.map(postDetailToCommunityPost)))
              .catch(() => {});
          }}
        />
      )}

      {selectedPost && (
        <PostDetailModal
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          post={selectedPost}
          numericId={selectedPost.numericId}
          currentUserId={loggedInUserId}
        />
      )}
    </div>
  );
}
