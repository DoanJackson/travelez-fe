"use client"

import { useState, useCallback, useEffect } from "react"
import { DndContext, DragEndEvent, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { DayItinerary, Activity } from "@/types/itinerary"
import { TimelineDay } from "./TimelineDay"
import { TimelineActivityCard } from "./TimelineActivityCard"

interface ActivityMeta {
  globalIndex: number;
  dayColor: string;
}

interface TimelineContainerProps {
  days: DayItinerary[]
  activeActivityId: string | null
  activityMeta: Map<string, ActivityMeta>
  onActivityClick: (activity: Activity) => void
  onFindAlternatives: (activity: Activity) => void
  onFindTours: (activity: Activity) => void
  onDeleteActivity: (activity: Activity) => void
  onReorderActivities: (updatedDays: DayItinerary[]) => void
  onReady?: () => void
  softDeletedIds?: Set<string>
  onRestoreActivity?: (activity: Activity) => void
}

export default function TimelineContainer({
  days,
  activeActivityId,
  activityMeta,
  onActivityClick,
  onFindAlternatives,
  onFindTours,
  onDeleteActivity,
  onReorderActivities,
  onReady,
  softDeletedIds,
  onRestoreActivity,
}: TimelineContainerProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null)

  // Notify parent once DOM is committed so IntersectionObserver can find day elements
  useEffect(() => { onReady?.() }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const allActivityIds = days.flatMap(day => day.activities.map(a => a.id))

  const handleDragStart = useCallback((event: any) => {
    setActiveId(event.active.id)
    const activity = days
      .flatMap(d => d.activities)
      .find(a => a.id === event.active.id)
    setActiveActivity(activity || null)
  }, [days])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)
    setActiveActivity(null)

    if (!over || active.id === over.id) return

    const activeData = active.data.current as { activity: Activity; dayNumber: number }
    const overData = over.data.current as { activity: Activity; dayNumber: number }

    if (!activeData || !overData) return

    const newDays = [...days]
    
    // Remove from source day
    const sourceDayIndex = newDays.findIndex(d => d.dayNumber === activeData.dayNumber)
    const sourceDay = newDays[sourceDayIndex]
    const activityIndex = sourceDay.activities.findIndex(a => a.id === active.id)
    const [movedActivity] = sourceDay.activities.splice(activityIndex, 1)

    // Add to target day
    const targetDayIndex = newDays.findIndex(d => d.dayNumber === overData.dayNumber)
    const targetDay = newDays[targetDayIndex]
    const targetIndex = targetDay.activities.findIndex(a => a.id === over.id)
    
    if (targetDayIndex === sourceDayIndex) {
      // Same day reorder
      targetDay.activities.splice(targetIndex, 0, movedActivity)
    } else {
      // Cross-day move
      targetDay.activities.splice(targetIndex + 1, 0, movedActivity)
    }

    onReorderActivities(newDays)
  }, [days, onReorderActivities])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={allActivityIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-12">
          {days.map((day, dayIdx) => {
            // Compute the global index of the first activity in this day
            const startIndex = days
              .slice(0, dayIdx)
              .reduce((sum, d) => sum + d.activities.length, 0) + 1;
            const dayColor = activityMeta.get(day.activities[0]?.id)?.dayColor ?? "#6b7280";
            return (
              <TimelineDay
                key={day.dayNumber}
                day={day}
                activeActivityId={activeActivityId}
                dayColor={dayColor}
                startIndex={startIndex}
                onActivityClick={onActivityClick}
                onFindAlternatives={onFindAlternatives}
                onFindTours={onFindTours}
                onDeleteActivity={onDeleteActivity}
                softDeletedIds={softDeletedIds}
                onRestoreActivity={onRestoreActivity}
              />
            );
          })}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeActivity && (() => {
          const meta = activityMeta.get(activeActivity.id);
          return (
            <div className="opacity-90">
              <TimelineActivityCard
                activity={activeActivity}
                isActive={false}
                activityIndex={meta?.globalIndex ?? 0}
                dayColor={meta?.dayColor ?? "#6b7280"}
                onClick={() => {}}
                onFindAlternatives={() => {}}
                onFindTours={() => {}}
                onDelete={() => {}}
                isDragging={true}
              />
            </div>
          );
        })()}
      </DragOverlay>
    </DndContext>
  )
}

