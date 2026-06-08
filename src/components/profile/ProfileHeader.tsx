"use client";

import { useRef } from "react";
import { CalendarDays, Camera, Loader2, MessageCircle, Pencil, PlaneTakeoff, UserPlus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  name: string;
  username: string;
  bio: string;
  // joinDate: string;
  initials: string;
  role: string;
  avatarUrl?: string;
  followerCount?: number;
  followingCount?: number;
  isOwnProfile: boolean;
  isFollowing?: boolean;
  isUploadingAvatar?: boolean;
  onEditProfile: () => void;
  onAvatarChange?: (file: File) => void;
  onFollow?: () => void;
  onMessage?: () => void;
}

export function ProfileHeader({
  name,
  username,
  bio,
  // joinDate,
  initials,
  role,
  avatarUrl,
  followerCount,
  followingCount,
  isOwnProfile,
  isFollowing = false,
  isUploadingAvatar = false,
  onEditProfile,
  onAvatarChange,
  onFollow,
  onMessage,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAvatarChange?.(file);
    e.target.value = "";
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Avatar className="h-[88px] w-[88px] ring-2 ring-pink-200">
            {avatarUrl && (
              <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
            )}
            <AvatarFallback className="bg-pink-100 text-pink-600 text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {isOwnProfile && (
            <>
              <button
                type="button"
                aria-label="Change avatar"
                disabled={isUploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
              >
                {isUploadingAvatar
                  ? <Loader2 className="size-5 text-white animate-spin" />
                  : <Camera className="size-5 text-white" />
                }
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={isUploadingAvatar}
                onChange={handleFileChange}
              />
            </>
          )}
        </div>

        {/* Identity */}
        <div className="grow min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900">{name}</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
              <PlaneTakeoff className="h-3 w-3" />
              {role}
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mb-2">{username}</p>
          {(followerCount !== undefined || followingCount !== undefined) && (
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-slate-900">{followerCount ?? 0}</span>
                <span className="text-xs text-slate-500">Followers</span>
              </div>
              <div className="h-3.5 w-px bg-slate-200" />
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-slate-900">{followingCount ?? 0}</span>
                <span className="text-xs text-slate-500">Following</span>
              </div>
            </div>
          )}
          <p className="text-sm text-slate-700 leading-relaxed mb-4 max-w-xl">
            {bio}
          </p>
          {/* <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Member since {joinDate}</span>
          </div> */}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          {isOwnProfile ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onEditProfile}
              className="rounded-lg"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                onClick={onFollow}
                className={cn(
                  "rounded-lg gap-1.5",
                  isFollowing
                    ? "bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100"
                    : "bg-pink-500 text-white hover:bg-pink-600",
                )}
              >
                <UserPlus className="h-4 w-4" />
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onMessage}
                className="rounded-lg gap-1.5"
              >
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
