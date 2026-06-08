"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import type { TrendingDestination, TopTraveler } from "@/types/post";

interface SidebarRightProps {
  trendingDestinations: TrendingDestination[];
  topTravelers: TopTraveler[];
}

export function SidebarRight({
  trendingDestinations,
  topTravelers,
}: SidebarRightProps) {
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>(
    () => Object.fromEntries(topTravelers.map((t) => [t.id, t.isFollowing])),
  );

  const toggleFollow = (id: string) => {
    setFollowingMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="hidden lg:flex lg:col-span-3 flex-col gap-5 sticky top-24">
      {/* Trending Destinations */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
        <h3 className="text-slate-900 dark:text-white font-bold text-base mb-4">
          Trending Destinations
        </h3>
        <div className="flex flex-col gap-3">
          {trendingDestinations.map((dest) => (
            <a
              key={dest.id}
              href="#"
              className="flex justify-between items-center group"
            >
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-pink-500 transition-colors">
                  {dest.name}
                </span>
                <span className="text-xs text-slate-500">
                  {dest.postsCount}
                </span>
              </div>
              <TrendingUp className="size-4 text-slate-400 group-hover:text-pink-400 transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* Top Travelers */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
        <h3 className="text-slate-900 dark:text-white font-bold text-base mb-4">
          Top Travelers
        </h3>
        <div className="flex flex-col gap-4">
          {topTravelers.map((traveler) => (
            <div
              key={traveler.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="relative size-9 rounded-full ring-2 ring-pink-100 dark:ring-pink-900/40 flex-shrink-0"
                  aria-label={`${traveler.name}'s profile picture`}
                >
                  <div className="absolute inset-0 rounded-full bg-[#ec4899] flex items-center justify-center text-white font-bold text-sm select-none">
                    {traveler.name.charAt(0).toUpperCase()}
                  </div>
                  {traveler.avatarUrl && (
                    <img
                      src={traveler.avatarUrl}
                      alt={traveler.name}
                      className="absolute inset-0 w-full h-full object-cover rounded-full"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {traveler.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {traveler.username}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleFollow(traveler.id)}
                className={`text-xs font-bold transition-colors ${
                  followingMap[traveler.id]
                    ? "text-slate-400 hover:text-slate-500"
                    : "text-pink-500 hover:text-pink-600"
                }`}
              >
                {followingMap[traveler.id] ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
