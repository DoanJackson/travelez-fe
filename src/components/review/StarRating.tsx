"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  /** Currently selected rating (1–5). 0 means unrated. */
  value: number;
  /** Called with the new rating when the user clicks a star. */
  onChange?: (rating: number) => void;
  /** When true, no hover/click interaction — used for display-only cards. */
  readOnly?: boolean;
  /** Icon size in pixels. Defaults to 28. */
  size?: number;
  /** Extra className on the container. */
  className?: string;
}

const STARS = [1, 2, 3, 4, 5];

export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 28,
  className,
}: StarRatingProps) {
  // hoverRating: 0 = not hovering, 1–5 = which star the cursor is over
  const [hoverRating, setHoverRating] = useState(0);

  // What the user currently sees highlighted: hover preview takes priority
  const displayRating = hoverRating > 0 ? hoverRating : value;

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      // Reset hover state when cursor leaves the whole row
      onMouseLeave={() => !readOnly && setHoverRating(0)}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={
        readOnly ? `Rating: ${value} out of 5` : `Select a rating out of 5`
      }
    >
      {STARS.map((star) => {
        const isFilled = star <= displayRating;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            aria-pressed={value === star}
            onClick={() => {
              if (!readOnly) onChange?.(star);
            }}
            onMouseEnter={() => {
              if (!readOnly) setHoverRating(star);
            }}
            className={cn(
              "transition-transform duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded",
              !readOnly && "hover:scale-110 cursor-pointer",
              readOnly && "cursor-default pointer-events-none",
            )}
          >
            <Star
              size={size}
              strokeWidth={1.5}
              className={cn(
                "transition-colors duration-100",
                isFilled
                  ? "text-primary fill-primary"
                  : "text-slate-300 dark:text-slate-600 fill-none",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
