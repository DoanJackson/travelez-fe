"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Clock,
  DollarSign,
  MapPin,
  Sparkles,
  MoreHorizontal,
  GripVertical,
  ExternalLink,
  Landmark,
  Utensils,
  Coffee,
  Leaf,
  Building,
  Music,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";
import { Activity } from "@/types/itinerary";
import { cn, formatVND } from "@/lib/utils";
import { Button } from "../ui/button";

const ACTIVITY_TYPE_STYLE: Record<
  string,
  { bg: string; icon: React.ReactNode }
> = {
  ATTRACTION: {
    bg: "bg-pink-50",
    icon: <Landmark className="h-8 w-8 text-pink-400" />,
  },
  RESTAURANT: {
    bg: "bg-amber-50",
    icon: <Utensils className="h-8 w-8 text-amber-400" />,
  },
  CAFE_DESSERT: {
    bg: "bg-green-50",
    icon: <Coffee className="h-8 w-8 text-green-400" />,
  },
  NATURE: {
    bg: "bg-blue-50",
    icon: <Leaf className="h-8 w-8 text-blue-400" />,
  },
  RELIGIOUS: {
    bg: "bg-purple-50",
    icon: <Building className="h-8 w-8 text-purple-400" />,
  },
  NIGHTLIFE: {
    bg: "bg-indigo-50",
    icon: <Music className="h-8 w-8 text-indigo-400" />,
  },
  SHOPPING: {
    bg: "bg-orange-50",
    icon: <ShoppingBag className="h-8 w-8 text-orange-400" />,
  },
};
const DEFAULT_STYLE = {
  bg: "bg-gray-100",
  icon: <MapPin className="h-8 w-8 text-gray-400" />,
};

interface TimelineActivityCardProps {
  activity: Activity;
  isActive: boolean;
  activityIndex: number;
  dayColor: string;
  onClick: () => void;
  onFindAlternatives: () => void;
  onFindTours: () => void;
  onDelete: () => void;
  dragHandleProps?: any;
  isDragging?: boolean;
  isSoftDeleted?: boolean;
  onRestoreActivity?: () => void;
}

export function TimelineActivityCard({
  activity,
  isActive,
  activityIndex,
  dayColor,
  onClick,
  onFindAlternatives,
  onFindTours,
  onDelete,
  dragHandleProps,
  isDragging,
  isSoftDeleted,
  onRestoreActivity,
}: TimelineActivityCardProps) {

  return (
    <div className="relative">
    <Card
      className={cn(
        "overflow-hidden transition-all cursor-pointer hover:shadow-lg",
        isActive && "ring-2 ring-pink-500 shadow-lg",
        isDragging && "opacity-50 shadow-2xl scale-105",
        isSoftDeleted && "opacity-40 blur-[0.5px] pointer-events-none select-none",
      )}
      onClick={onClick}
    >
      <div className="flex gap-4 p-4">
        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className="flex items-start pt-2 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>

        {/* Number Badge */}
        <div
          className="flex items-center self-center shrink-0"
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            color: "#6b7280",
            fontWeight: 700,
            fontSize: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {activityIndex}
        </div>

        {/* Image */}
        {(() => {
          const typeStyle =
            ACTIVITY_TYPE_STYLE[activity.activityType ?? ""] ?? DEFAULT_STYLE;
          return (
            <div
              className={cn(
                "w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden",
                !activity.image && typeStyle.bg,
              )}
            >
              {activity.image ? (
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {typeStyle.icon}
                </div>
              )}
            </div>
          );
        })()}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2 flex items-center gap-1">
              {activity.title}
              <span
                // title="View place details"
                className="hover:bg-pink-50 rounded-full p-0.5 cursor-pointer shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`/poi/${activity.id}`, "_blank");
                }}
              >
                <ExternalLink className="h-4 w-4 text-pink-400" />
              </span>
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onFindAlternatives();
                  }}
                >
                  Find alternatives
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onFindTours();
                  }}
                >
                  Tours at this place
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-red-600"
                >
                  Delete this activity
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {activity.startTime} - {activity.endTime}
              </span>
            </div>

            {activity.price !== undefined && activity.price !== "" && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>
                  {typeof activity.price === "number"
                    ? formatVND(activity.price)
                    : activity.price} - Estimated cost depending on preferences.
                </span>
              </div>
            )}

            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{activity.address}</span>
            </div>

            {activity.aiTip && (
              <div className="flex items-start gap-2 bg-purple-50 border border-purple-200 rounded-lg p-2 mt-2">
                <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="text-purple-900 text-xs">
                  {activity.aiTip}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>

    {isSoftDeleted && onRestoreActivity && (
      <button
        onClick={(e) => { e.stopPropagation(); onRestoreActivity(); }}
        className="absolute top-2 right-2 z-10 rounded-full bg-white/90 p-1.5 shadow text-slate-500 hover:text-pink-600 pointer-events-auto transition-colors"
        aria-label="Restore activity"
        title="Undo removal"
      >
        <RotateCcw className="size-4" />
      </button>
    )}
    </div>
  );
}
