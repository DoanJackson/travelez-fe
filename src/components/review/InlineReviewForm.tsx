"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Camera, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { StarRating } from "@/components/review/StarRating";
import { useMutation } from "@tanstack/react-query";
import { createReview } from "@/services/reviewService";
import { useFileUpload } from "@/hooks/use-file-upload";
import type { ApiError, BaseResponse } from "@/types/api";
import type { ReviewData, ReviewLocation } from "@/types/review";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// ─── Props ─────────────────────────────────────────────────────────────────

interface InlineReviewFormProps {
  /** The location being reviewed. Null = locked/empty state. */
  location: ReviewLocation | null;
  /** Gates the form — stars, textarea, and submit are disabled when false. */
  isAuthenticated: boolean;
  /** Called after all local state is reset, e.g. to clear the selected location in the parent. */
  onReset?: () => void;
  /** Called immediately when the server confirms the submission, before the success screen. */
  onSuccess?: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function InlineReviewForm({ location, isAuthenticated, onReset, onSuccess }: InlineReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  // Local UI state — controls the success screen. Not server state, so stays as useState.
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isSubmitted) return;
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ec4899", "#f9a8d4", "#3b82f6", "#ffffff"],
      scalar: 1.1,
    });
  }, [isSubmitted]);

  const [
    { files, errors: uploadErrors },
    { openFileDialog, removeFile, clearFiles, getInputProps },
  ] = useFileUpload({
    accept: "image/*",
    multiple: true,
    maxFiles: MAX_FILES,
    maxSize: MAX_FILE_SIZE,
  });

  // Revoke all object URLs when the component unmounts to prevent memory leaks.
  // clearFiles() internally calls URL.revokeObjectURL on every preview URL.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => clearFiles(), []);

  const MAX_CHARS = 500;
  const charsLeft = MAX_CHARS - reviewText.length;

  // Extract File instances from the hook state for the FormData payload.
  const selectedFiles = files
    .map((f) => f.file)
    .filter((f): f is File => f instanceof File);

  const isFormValid =
    rating > 0 &&
    reviewText.trim().length > 0 &&
    location !== null &&
    isAuthenticated;

  const submitMutation = useMutation<BaseResponse<ReviewData>, ApiError, void>({
    mutationFn: () =>
      createReview(location!.id, { content: reviewText, rating, files: selectedFiles }),
    onSuccess: () => { setIsSubmitted(true); onSuccess?.(); },
  });

  function handleSubmit() {
    if (!isFormValid) return;
    submitMutation.mutate();
  }

  function handleReset() {
    setRating(0);
    setReviewText("");
    setIsSubmitted(false);
    submitMutation.reset();
    clearFiles();
    onReset?.();
  }

  // ── Success state ────────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <section className="max-w-3xl mx-auto w-full bg-white rounded-xl border border-slate-200 shadow-sm p-10 flex flex-col items-center gap-5 text-center">
        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Send className="size-7 text-primary" />
        </div>
        <div>
          <p className="text-xl font-bold text-slate-900 mb-1">
            Review submitted!
          </p>
          <p className="text-sm text-slate-500">
            Thanks for sharing your experience
            {location ? ` at ${location.name}` : ""}.
          </p>
        </div>
        <StarRating value={rating} readOnly size={24} />
        <Button
          variant="outline"
          onClick={handleReset}
          className="mt-2 rounded-full px-6"
        >
          Write another review
        </Button>
      </section>
    );
  }

  // ── Form state ───────────────────────────────────────────────────────────
  return (
    <section className="max-w-3xl mx-auto w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-8 space-y-7">
        {/* ── Star Rating — always visible ── */}
        <div className="text-center space-y-4">
          <p className="text-lg font-bold text-slate-900">
            How was your experience
            {location ? (
              <>
                {" at "}
                <span className="text-primary">{location.name}</span>
              </>
            ) : (
              "?"
            )}
          </p>

          {/* Hint text — only when no location selected */}
          {!location && (
            <p className="text-sm text-slate-400">
              Search for a destination above to get started.
            </p>
          )}

          <div className="flex justify-center">
            <StarRating
              value={rating}
              onChange={setRating}
              size={36}
              className={cn(
                (!location || !isAuthenticated) && "opacity-40 pointer-events-none",
              )}
            />
          </div>

          {rating > 0 && (
            <p className="text-sm text-slate-500 font-medium">
              {["", "Poor", "Fair", "Good", "Great", "Excellent!"][rating]}
            </p>
          )}
        </div>

        {/* ── Progressive Disclosure — only shown when location is selected ── */}
        {location && (
          <>
            {/* Review textarea */}
            <div className="space-y-2">
              <Textarea
                value={reviewText}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) {
                    setReviewText(e.target.value);
                  }
                }}
                disabled={!isAuthenticated || submitMutation.isPending}
                placeholder="Share the details of your visit..."
                className={cn(
                  "min-h-[160px] resize-none text-base",
                  "bg-slate-50 border-slate-200",
                  "focus-visible:ring-primary/40 focus-visible:border-primary",
                  "rounded-xl transition-all placeholder:text-slate-400",
                )}
              />
              {/* Character counter */}
              <div className="flex justify-end">
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    charsLeft < 50
                      ? "text-amber-500 font-semibold"
                      : "text-slate-400",
                  )}
                >
                  {reviewText.length} / {MAX_CHARS}
                </span>
              </div>
            </div>

            {/* Actions row */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Hidden file input wired through the hook */}
                <input {...getInputProps()} className="sr-only" />

                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 rounded-xl border-primary text-primary hover:bg-primary/5"
                  aria-label="Add photos to your review"
                  onClick={openFileDialog}
                  disabled={!isAuthenticated || submitMutation.isPending}
                >
                  <Camera className="size-4" />
                  Add Photos
                  {files.length > 0 && (
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      ({files.length}/{MAX_FILES})
                    </span>
                  )}
                </Button>

                <Button
                  type="button"
                  disabled={!isFormValid || submitMutation.isPending}
                  onClick={handleSubmit}
                  className="gap-2 rounded-xl px-8 font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                >
                  {submitMutation.isPending ? (
                    <>
                      <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </div>

              {/* Upload validation errors */}
              {uploadErrors.length > 0 && (
                <p className="text-sm text-red-500">{uploadErrors[0]}</p>
              )}

              {/* Submission error */}
              {submitMutation.error && (
                <p className="text-sm text-red-500">
                  {submitMutation.error.message}
                </p>
              )}

              {/* Thumbnail previews */}
              {files.length > 0 && (
                <div
                  className="flex flex-wrap gap-2"
                  role="list"
                  aria-label="Selected photos"
                >
                  {files.map((f) => (
                    <div
                      key={f.id}
                      role="listitem"
                      className="relative group size-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0"
                    >
                      {f.preview && (
                        // next/image cannot handle blob: URLs from URL.createObjectURL
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={f.preview}
                          alt={f.file.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(f.id)}
                        aria-label={`Remove ${f.file.name}`}
                        className={cn(
                          "absolute top-0.5 right-0.5 size-4 rounded-full",
                          "bg-black/60 hover:bg-black/80 transition-colors",
                          "flex items-center justify-center",
                          "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
                          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white",
                        )}
                      >
                        <X className="size-2.5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
