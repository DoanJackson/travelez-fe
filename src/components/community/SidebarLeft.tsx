"use client";

import { useState } from "react";
import {
  Search,
  X,
  PlusCircle,
  Clock,
  Flame,
  Map,
  Lightbulb,
  Camera,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { PostCategory } from "@/types/post";

interface SidebarLeftProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch?: () => void;
  onClear?: () => void;
  sortBy: "newest" | "popular";
  onSortChange: (value: "newest" | "popular") => void;
  activeCategory: PostCategory | null;
  onCategoryChange: (category: PostCategory | null) => void;
  onCreatePost?: () => void;
}

const CATEGORIES: { label: PostCategory; icon: React.ReactNode }[] = [
  { label: "Itineraries", icon: <Map className="size-4" /> },
  { label: "Tips", icon: <Lightbulb className="size-4" /> },
  { label: "Photos", icon: <Camera className="size-4" /> },
];

export function SidebarLeft({
  searchQuery,
  onSearchChange,
  onSearch,
  onClear,
  sortBy,
  onSortChange,
  activeCategory,
  onCategoryChange,
  onCreatePost,
}: SidebarLeftProps) {
  return (
    <aside className="hidden lg:flex lg:col-span-3 flex-col gap-5 sticky top-24">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search community..."
          aria-label="Search community posts"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch?.();
          }}
          className="pl-9 pr-9 rounded-full border-gray-200 bg-white dark:bg-slate-900 focus-visible:ring-pink-300 h-11"
        />
        {searchQuery && (
          <button
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Create Post — only shown to authenticated users */}
      {onCreatePost && (
        <Button
          variant="default"
          size="lg"
          className="w-full gap-2 font-bold shadow-sm hover:scale-[1.02] transition-transform"
          onClick={onCreatePost}
        >
          <PlusCircle className="size-5" />
          Create Post
        </Button>
      )}

      {/* Sort By */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
        <h3 className="text-slate-900 dark:text-white font-bold mb-3 text-sm">
          Sort By
        </h3>
        <Tabs
          value={sortBy}
          onValueChange={(v) => onSortChange(v as "newest" | "popular")}
        >
          <TabsList className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-10 p-1">
            <TabsTrigger
              value="newest"
              className="flex-1 rounded-full text-xs font-semibold gap-1.5 data-[state=active]:bg-white data-[state=active]:text-pink-500 data-[state=active]:shadow-sm"
            >
              <Clock className="size-3.5" />
              Newest
            </TabsTrigger>
            <TabsTrigger
              value="popular"
              className="flex-1 rounded-full text-xs font-semibold gap-1.5 data-[state=active]:bg-white data-[state=active]:text-pink-500 data-[state=active]:shadow-sm"
            >
              <Flame className="size-3.5" />
              Popular
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Categories */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
        <h3 className="text-slate-900 dark:text-white font-bold mb-3 text-sm">
          Categories
        </h3>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() =>
                onCategoryChange(activeCategory === label ? null : label)
              }
              className={cn(
                "flex items-center gap-3 w-full p-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                activeCategory === label
                  ? "bg-pink-50 dark:bg-pink-950/30 text-pink-500 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white",
              )}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
