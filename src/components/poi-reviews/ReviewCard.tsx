import { useState } from "react";
import { Star, ThumbsUp, Heart, Zap, ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ApiReview } from "@/types/review";

interface ReviewCardProps {
  review: ApiReview;
}

type ReactionType = "helpful" | "love" | "wow";

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [reactions, setReactions] = useState({ helpful: 0, love: 0, wow: 0 });
  const [localReactions, setLocalReactions] = useState({
    helpful: false,
    love: false,
    wow: false,
  });

  function handleReaction(type: ReactionType) {
    setLocalReactions((prev) => {
      const wasActive = prev[type];
      setReactions((r) => ({
        ...r,
        [type]: r[type] + (wasActive ? -1 : 1),
      }));
      return { ...prev, [type]: !wasActive };
    });
  }

  const isExternal = !!review.externalName;
  const displayName = isExternal
    ? review.externalName!
    : (review.author?.fullName ?? "TravelEZ User");
  const displayAvt = isExternal
    ? (review.externalAvt ?? "")
    : (review.author?.avatar ?? "");

  const photoCount = (review.medias ?? []).filter(
    (m) => m.type === "IMAGE",
  ).length;

  return (
    <Card className="rounded-xl border bg-background p-4 hover:shadow-sm hover:-translate-y-[1px] transition-all">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={displayAvt || undefined} alt={displayName} />
          <AvatarFallback className="bg-pink-100 text-pink-600 font-semibold">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between mb-1.5">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {displayName}
                </h4>
                {isExternal && (
                  <span className="text-[10px] text-gray-400 font-medium">
                    • External review
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(review.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 ${
                    star <= review.rating
                      ? "text-amber-500 fill-amber-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-2">
            {review.content}
          </p>

          {/* Photo count badge */}
          {photoCount > 0 && (
            <Badge variant="outline" className="text-xs py-0.5 gap-1 mb-3">
              <ImageIcon className="h-3 w-3" />
              {photoCount} photo{photoCount > 1 ? "s" : ""}
            </Badge>
          )}

          {/* Reactions */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => handleReaction("helpful")}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                localReactions.helpful
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Helpful ({reactions.helpful})
            </button>
            <button
              onClick={() => handleReaction("love")}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                localReactions.love
                  ? "text-red-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Heart className="h-3.5 w-3.5" />
              Love ({reactions.love})
            </button>
            <button
              onClick={() => handleReaction("wow")}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                localReactions.wow
                  ? "text-amber-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              Wow ({reactions.wow})
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
