"use client";

import { DayItinerary, Activity } from "@/types/itinerary";
import { TimelineActivityCard } from "./TimelineActivityCard";
import { TimelineTravelIndicator } from "./TimelineTravelIndicator";
import { formatVND } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CalendarX,
  Clock,
  MapPin,
  DollarSign,
  Sun,
  Cloud,
  CloudRain,
} from "lucide-react";
import type { WeatherData } from "@/types/itinerary";

function mockWeatherForDate(dateStr: string): WeatherData {
  const hash = dateStr
    .split(/\D/)
    .reduce((sum, n) => sum + parseInt(n || "0"), 0);
  const conditions = ["sunny", "cloudy", "rainy"] as const;
  const highs = [33, 31, 29];
  const lows = [28, 26, 24];
  const i = hash % 3;
  return { condition: conditions[i], tempHigh: highs[i], tempLow: lows[i] };
}

function WeatherIcon({ condition }: { condition: string }) {
  if (condition === "cloudy") return <Cloud className="h-3 w-3" />;
  if (condition === "rainy") return <CloudRain className="h-3 w-3" />;
  return <Sun className="h-3 w-3" />;
}

interface TimelineDayProps {
  day: DayItinerary;
  activeActivityId: string | null;
  dayColor: string;
  startIndex: number;
  onActivityClick: (activity: Activity) => void;
  onFindAlternatives: (activity: Activity) => void;
  onFindTours: (activity: Activity) => void;
  onDeleteActivity: (activity: Activity) => void;
  softDeletedIds?: Set<string>;
  onRestoreActivity?: (activity: Activity) => void;
}

function parsePriceVND(raw: string | number | undefined): number {
  if (raw === undefined || raw === null || raw === "") return 0;
  if (typeof raw === "number") return raw;
  const n = parseInt(raw.replace(/[^0-9]/g, ""), 10);
  return isNaN(n) ? 0 : n;
}

export function TimelineDay({
  day,
  activeActivityId,
  dayColor,
  startIndex,
  onActivityClick,
  onFindAlternatives,
  onFindTours,
  onDeleteActivity,
  softDeletedIds,
  onRestoreActivity,
}: TimelineDayProps) {
  const weather = day.weather ?? mockWeatherForDate(day.date);

  const formattedDate = new Date(day.date + "T00:00:00").toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" },
  );

  const dailyCostTotal = day.activities.reduce((sum, a) => {
    return sum + parsePriceVND(a.price);
  }, 0);

  const hasTimeRange = day.activities.length > 0;
  const hasCost = dailyCostTotal > 0;

  return (
    <section id={`day-${day.dayNumber}`} className="space-y-6 scroll-mt-32">
      {/* Day Header */}
      <div
        className="rounded-xl border border-pink-200/50 py-4 px-5 flex items-center justify-between gap-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(236,72,153,0.08), rgba(139,92,246,0.08))",
        }}
      >
        {/* Left: badge + title + date */}
        <div className="flex items-center gap-3 min-w-0">
          {/* <div
            className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
            style={{ backgroundColor: dayColor }}
          >
            {day.dayNumber}
          </div> */}
          <div className="min-w-0">
            <p className="text-gray-900 font-semibold leading-tight">
              {day.title}
            </p>
            <p className="text-gray-500 text-xs mt-0.5">{formattedDate}</p>
          </div>
        </div>

        {/* Right: stats with dividers */}
        <div className="flex items-center shrink-0 text-gray-500 text-xs">
          {hasTimeRange && (
            <>
              <Clock className="h-3 w-3 mr-1" />
              <span>
                {day.activities[0].startTime}–
                {day.activities[day.activities.length - 1].endTime}
              </span>
            </>
          )}

          <div className="w-px h-3.5 bg-gray-200 mx-2" />

          <MapPin className="h-3 w-3 mr-1" />
          <span>
            {day.activities.length} stop{day.activities.length !== 1 ? "s" : ""}
          </span>

          {hasCost && (
            <>
              <div className="w-px h-3.5 bg-gray-200 mx-2" />
              <DollarSign className="h-3 w-3 mr-1" />
              <span>{formatVND(dailyCostTotal)}</span>
            </>
          )}

          <div className="w-px h-3.5 bg-gray-200 mx-2 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-1 bg-pink-50 text-pink-600 rounded-full px-2 py-0.5">
            <WeatherIcon condition={weather.condition} />
            <span>{weather.tempHigh}°</span>
          </div>
        </div>
      </div>

      {hasCost && (
        <p className="text-[11px] text-gray-400 italic px-1">
          * Estimated activity costs for the day. Accommodation and inter-city transport not included.
        </p>
      )}

      {/* Activities List */}
      {day.activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
          <CalendarX className="h-8 w-8" />
          <p className="text-sm font-medium">
            No activities planned for this day
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {day.activities.map((activity, index) => {
            const travelIndicator = day.travelIndicators.find(
              (t) => t.id === `${activity.id}-travel`,
            );

            return (
              <div key={`${day.dayNumber}-${activity.id}-${index}`} id={activity.id}>
                <DraggableActivityCard
                  activity={activity}
                  dayNumber={day.dayNumber}
                  index={index}
                  activityIndex={startIndex + index}
                  dayColor={dayColor}
                  isActive={activeActivityId === activity.id}
                  onClick={() => onActivityClick(activity)}
                  onFindAlternatives={() => onFindAlternatives(activity)}
                  onFindTours={() => onFindTours(activity)}
                  onDelete={() => onDeleteActivity(activity)}
                  isSoftDeleted={softDeletedIds?.has(activity.id)}
                  onRestoreActivity={onRestoreActivity ? () => onRestoreActivity(activity) : undefined}
                />

                {/* Travel indicator between activities (DO NOT modify this logic) */}
                {travelIndicator && index < day.activities.length - 1 && (
                  <TimelineTravelIndicator indicator={travelIndicator} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function DraggableActivityCard({
  activity,
  dayNumber,
  index,
  activityIndex,
  dayColor,
  ...props
}: {
  activity: Activity;
  dayNumber: number;
  index: number;
  activityIndex: number;
  dayColor: string;
  isActive: boolean;
  onClick: () => void;
  onFindAlternatives: () => void;
  onFindTours: () => void;
  onDelete: () => void;
  isSoftDeleted?: boolean;
  onRestoreActivity?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: activity.id,
    data: { activity, dayNumber },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TimelineActivityCard
        activity={activity}
        activityIndex={activityIndex}
        dayColor={dayColor}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
        {...props}
      />
    </div>
  );
}
