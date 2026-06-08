"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { X, Camera, MapPin, Tag, Route, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { postService, getUserPublicItineraries } from "@/services/postService";
import { semanticSearchPOIs } from "@/services/poiService";
import { AuthCookies } from "@/lib/cookie";
import type { POIResponseData } from "@/types/poi";
import type { ItinerarySummary } from "@/types/post";

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface ImageEntry {
  file: File;
  preview: string;
}

interface EditMode {
  postId: number;
  title: string;
  content: string;
  existingMedias: { id: number; url: string }[];
}

interface PostCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: {
    title: string;
    content: string;
    previewUrls: string[];
  }) => void;
  editMode?: EditMode;
}

export default function PostCreationModal({
  isOpen,
  onClose,
  onSuccess,
  editMode,
}: PostCreationModalProps) {
  const resolvedUserId = useMemo(() => {
    const raw = AuthCookies.getUserId();
    const n = Number(raw);
    return isNaN(n) || n === 0 ? undefined : n;
  }, []);
  const [title, setTitle] = useState(editMode?.title ?? "");
  const [content, setContent] = useState(editMode?.content ?? "");
  const [topic, setTopic] = useState("");
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [existingMedias, setExistingMedias] = useState<
    { id: number; url: string }[]
  >(editMode?.existingMedias ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({
    title: false,
    content: false,
    topic: false,
  });

  // Itinerary picker state
  const [selectedItinerary, setSelectedItinerary] =
    useState<ItinerarySummary | null>(null);
  const [showItineraryPicker, setShowItineraryPicker] = useState(false);

  const { data: userItineraries, isLoading: isLoadingItineraries } = useQuery({
    queryKey: ["user-public-itineraries", resolvedUserId],
    queryFn: () => getUserPublicItineraries(resolvedUserId!),
    enabled: !!resolvedUserId && !editMode,
    staleTime: 60 * 1000,
  });

  // POI autocomplete state
  const [selectedPoi, setSelectedPoi] = useState<POIResponseData | null>(null);
  const [poiSearchQuery, setPoiSearchQuery] = useState("");
  const [debouncedPoiQuery, setDebouncedPoiQuery] = useState("");
  const [isPoiDropdownOpen, setIsPoiDropdownOpen] = useState(false);
  const poiDropdownRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form fields when editMode changes (modal re-opened for a different post)
  useEffect(() => {
    if (editMode) {
      setTitle(editMode.title);
      setContent(editMode.content);
      setExistingMedias(editMode.existingMedias);
    }
  }, [editMode?.postId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Revoke all preview URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce POI search query
  useEffect(() => {
    const id = setTimeout(() => setDebouncedPoiQuery(poiSearchQuery), 300);
    return () => clearTimeout(id);
  }, [poiSearchQuery]);

  // Close POI dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        poiDropdownRef.current &&
        !poiDropdownRef.current.contains(e.target as Node)
      ) {
        setIsPoiDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // POI suggestions query
  const { data: poiOptions, isFetching: isPoiSearching } = useQuery({
    queryKey: ["poi-autocomplete", debouncedPoiQuery],
    queryFn: () => semanticSearchPOIs(debouncedPoiQuery, undefined, 8),
    enabled: debouncedPoiQuery.length >= 2,
    staleTime: 60 * 1000,
  });

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTopic("");
    setSelectedPoi(null);
    setSelectedItinerary(null);
    setShowItineraryPicker(false);
    setPoiSearchQuery("");
    setDebouncedPoiQuery("");
    setIsPoiDropdownOpen(false);
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setExistingMedias([]);
    setIsSubmitting(false);
    setTouched({ title: false, content: false, topic: false });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleRemoveExistingMedia = (id: number) => {
    setExistingMedias((prev) => prev.filter((m) => m.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";

    const remaining = MAX_FILES - images.length - existingMedias.length;
    if (remaining <= 0) {
      toast.error(`You can upload up to ${MAX_FILES} images.`);
      return;
    }

    const valid: ImageEntry[] = [];
    for (const file of selected.slice(0, remaining)) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`"${file.name}" exceeds the ${MAX_FILE_SIZE_MB} MB limit.`);
        continue;
      }
      valid.push({ file, preview: URL.createObjectURL(file) });
    }

    if (selected.length > remaining) {
      toast.error(
        `Only ${remaining} more image(s) can be added (max ${MAX_FILES}).`,
      );
    }

    if (valid.length > 0) {
      setImages((prev) => [...prev, ...valid]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const isFormValid = useMemo(() => {
    const base = title.trim().length > 0 && content.trim().length >= 10;
    if (editMode) return base;
    return base && topic.trim().length > 0;
  }, [title, content, topic, editMode]);

  const handlePost = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      if (editMode) {
        await postService.updatePost({
          postId: editMode.postId,
          title: title.trim(),
          content: content.trim(),
          keptMediaIds: existingMedias.map((m) => m.id),
          newFiles: images.map((img) => img.file),
        });
        toast.success("Post updated!");
      } else {
        await postService.createPost({
          title: title.trim(),
          content: content.trim(),
          files: images.map((img) => img.file),
          poiId: selectedPoi?.id,
          itineraryId: selectedItinerary?.id,
          topicTag: topic.toUpperCase(),
          status: "PUBLISHED",
        });
        toast.success("Post published!");
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#ec4899", "#f9a8d4", "#3b82f6", "#ffffff"],
          scalar: 1.1,
        });
      }
      onSuccess?.({
        title: title.trim(),
        content: content.trim(),
        previewUrls: images.map((img) => img.preview),
      });
      resetForm();
      onClose();
    } catch {
      toast.error("Failed to publish post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px] p-0 overflow-hidden border-none bg-white dark:bg-slate-900 shadow-2xl">
        <DialogHeader className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <DialogTitle className="text-xl font-bold tracking-tight">
            {editMode ? "Edit Post" : "Create New Travel Post"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Share your travel experience with the community
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col p-6 gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Title Input */}
          <div className="flex flex-col gap-1">
            <Input
              placeholder="Title of your post..."
              className="text-lg font-medium h-12 border-slate-200 focus:ring-primary/50"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, title: true }))}
              disabled={isSubmitting}
            />
            {touched.title && title.trim().length === 0 && (
              <p className="text-xs text-red-500">Title is required.</p>
            )}
          </div>

          {/* Context Row: Location & Topic */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* POI Autocomplete */}
            <div className="relative flex-1" ref={poiDropdownRef}>
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 z-10 pointer-events-none" />

              {selectedPoi ? (
                <div className="pl-12 pr-10 h-12 flex items-center bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md text-sm">
                  <span className="truncate font-medium text-slate-800 dark:text-slate-100">
                    {selectedPoi.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPoi(null);
                      setPoiSearchQuery("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Clear selected place"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <Input
                  placeholder="Search a place…"
                  className="pl-12 h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200"
                  value={poiSearchQuery}
                  onChange={(e) => {
                    setPoiSearchQuery(e.target.value);
                    setIsPoiDropdownOpen(true);
                  }}
                  onFocus={() => {
                    if (poiSearchQuery.length >= 2) setIsPoiDropdownOpen(true);
                  }}
                  disabled={isSubmitting}
                  aria-label="Search for a place"
                  aria-expanded={isPoiDropdownOpen}
                  aria-autocomplete="list"
                />
              )}

              {isPoiDropdownOpen && !selectedPoi && (
                <div
                  role="listbox"
                  aria-label="Place suggestions"
                  className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                >
                  {isPoiSearching ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="size-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : debouncedPoiQuery.length < 2 ? (
                    <p className="text-center text-sm text-slate-400 py-4">
                      Type at least 2 characters…
                    </p>
                  ) : (poiOptions ?? []).length === 0 ? (
                    <p className="text-center text-sm text-slate-400 py-4">
                      No places found.
                    </p>
                  ) : (
                    (poiOptions ?? []).map((poi) => (
                      <button
                        key={poi.id}
                        type="button"
                        role="option"
                        onClick={() => {
                          setSelectedPoi(poi);
                          setPoiSearchQuery("");
                          setIsPoiDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-col gap-0.5"
                      >
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {poi.name}
                        </span>
                        <span className="text-xs text-slate-400 truncate">
                          {poi.address}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <Select
                value={topic}
                onValueChange={setTopic}
                onOpenChange={(open) => {
                  if (!open) setTouched((t) => ({ ...t, topic: true }));
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger className="h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 pl-12 relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tips">Tips</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="itinerary">Itinerary</SelectItem>
                </SelectContent>
              </Select>
              {!editMode && touched.topic && topic.trim().length === 0 && (
                <p className="text-xs text-red-500">Please select a topic.</p>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-col gap-2 relative">
            <Textarea
              placeholder="Tell us about it..."
              className="min-h-[180px] p-4 text-base resize-none border-slate-200 pb-8"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, content: true }))}
              maxLength={3000}
              disabled={isSubmitting}
            />
            <span className="absolute bottom-3 right-4 text-xs text-slate-400">
              {content.length}/3000
            </span>
            {touched.content && content.trim().length < 10 && (
              <p className="text-xs text-red-500">
                Content must be at least 10 characters ({content.trim().length}
                /10).
              </p>
            )}
            <p className="text-sm text-slate-500">
              Tip: Use{" "}
              <span className="text-primary font-semibold">#hashtags</span> to
              categorize your post
            </p>
          </div>

          {/* Media Section */}
          <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Button row */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                className="w-fit gap-2 h-10 border-slate-200 shadow-sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={
                  isSubmitting ||
                  images.length + existingMedias.length >= MAX_FILES
                }
                type="button"
              >
                <Camera className="size-5" />
                Add Photos
              </Button>

              {!editMode && (
                <Button
                  variant="outline"
                  className="w-fit gap-2 h-10 border-slate-200 shadow-sm"
                  onClick={() => setShowItineraryPicker((prev) => !prev)}
                  disabled={isSubmitting}
                  type="button"
                >
                  <Route className="size-5" />
                  {selectedItinerary ? "Change Itinerary" : "Attach Itinerary"}
                </Button>
              )}
            </div>

            {/* Collapsible itinerary picker panel */}
            {!editMode && showItineraryPicker && !selectedItinerary && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 overflow-hidden max-h-60 overflow-y-auto">
                {isLoadingItineraries ? (
                  <div className="space-y-px">
                    {[0, 1].map((i) => (
                      <div
                        key={i}
                        className="px-4 py-3 animate-pulse flex flex-col gap-1.5"
                      >
                        <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                        <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                        <div className="flex gap-1">
                          <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
                          <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (userItineraries?.content ?? []).length === 0 ? (
                  <p className="text-center text-sm text-slate-400 py-6">
                    No public itineraries found. Make an itinerary public first.
                  </p>
                ) : (
                  (userItineraries?.content ?? []).map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => {
                        setSelectedItinerary(it);
                        setShowItineraryPicker(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white dark:hover:bg-slate-800 transition-colors flex flex-col gap-1 border-b border-slate-100 dark:border-slate-700 last:border-0"
                    >
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
                        {it.title}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="size-3 shrink-0" />
                        {format(new Date(it.startDate), "MMM d")} –{" "}
                        {format(new Date(it.endDate), "MMM d, yyyy")}
                      </span>
                      {it.destinationCities.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {it.destinationCities.map((city) => (
                            <span
                              key={city}
                              className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full px-2 py-0.5"
                            >
                              {city}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Selected itinerary confirmation strip */}
            {!editMode && selectedItinerary && (
              <div className="flex items-center gap-3 rounded-xl border border-pink-200 bg-pink-50/50 dark:bg-pink-950/20 dark:border-pink-900/40 px-4 py-2.5">
                <Route className="size-4 text-pink-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {selectedItinerary.title}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {selectedItinerary.destinationCities
                      .slice(0, 3)
                      .join(" · ")}
                    {selectedItinerary.destinationCities.length > 3 ? " …" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItinerary(null)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  aria-label="Remove itinerary attachment"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}

            {(existingMedias.length > 0 || images.length > 0) && (
              <div className="flex flex-wrap gap-3">
                {existingMedias.map((media) => (
                  <div
                    key={`existing-${media.id}`}
                    className="relative size-16 rounded-lg overflow-hidden border border-slate-200 group"
                  >
                    <img
                      src={media.url}
                      alt="Existing media"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingMedia(media.id)}
                      disabled={isSubmitting}
                      className="absolute top-1 right-1 size-5 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-opacity opacity-0 group-hover:opacity-100"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative size-16 rounded-lg overflow-hidden border border-slate-200 group"
                  >
                    <img
                      src={img.preview}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      disabled={isSubmitting}
                      className="absolute top-1 right-1 size-5 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-opacity opacity-0 group-hover:opacity-100"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-black dark:text-white"
          >
            Cancel
          </Button>
          <Button
            className="px-8 hover:bg-primary/90 shadow-md"
            onClick={handlePost}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                {editMode ? "Saving…" : "Posting…"}
              </span>
            ) : editMode ? (
              "Save changes"
            ) : (
              "Post"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
