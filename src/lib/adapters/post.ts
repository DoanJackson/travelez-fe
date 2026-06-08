import { formatDistanceToNow } from "date-fns";
import type { CommunityPost, PostCategory } from "@/types/post";
import type { PostDetail } from "@/types/post";

function toCategory(topicTag: string): PostCategory {
  if (!topicTag) return "Tips";
  const tag = topicTag.toUpperCase();
  if (tag.includes("ITINERARY") || tag.includes("TRIP")) return "Itineraries";
  if (tag.includes("PHOTO") || tag.includes("IMAGE")) return "Photos";
  return "Tips";
}

export function postDetailToCommunityPost(p: PostDetail): CommunityPost {
  return {
    id: String(p.id),
    numericId: p.id,
    location: p.poiSummary?.address ?? "",
    poiSummary: p.poiSummary
      ? { id: p.poiSummary.id, name: p.poiSummary.name }
      : null,
    itinerarySummary: p.itinerarySummary,
    author: {
      name: p.author.fullName,
      username: p.author.username,
      avatarUrl: p.author.avatar ?? "",
      userId: p.author.userId,
    },
    timeAgo: formatDistanceToNow(new Date(p.createdAt), { addSuffix: true }),
    createdAt: new Date(p.createdAt).getTime(),
    title: p.title,
    body: p.content,
    images: p.medias.map((m) => m.url),
    likes: p.reactionCount,
    comments: p.commentCount,
    comments_data: [],
    isLiked: p.reactedByMe,
    isSaved: false,
    followed: p.followed,
    category: toCategory(p.topicTag),
  };
}
