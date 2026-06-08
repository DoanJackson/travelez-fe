"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface CalendarSelectorProps {
  dateMode: "day" | "month";
  dayRange: { start: Date | null; end: Date | null };
  monthRange: { startMonth: string | null; endMonth: string | null };
  onDateModeChange: (mode: "day" | "month") => void;
  onDayRangeChange: (start: Date | null, end: Date | null) => void;
  onMonthRangeChange: (start: string | null, end: string | null) => void;
}

export default function CalendarSelector({
  dateMode,
  dayRange,
  monthRange,
  onDateModeChange,
  onDayRangeChange,
  onMonthRangeChange,
}: CalendarSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Day mode helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const handleDayClick = (day: number, monthOffset: number = 0) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + monthOffset,
      day,
    );
    date.setHours(0, 0, 0, 0);

    const todayMidnight = new Date(today);
    todayMidnight.setHours(0, 0, 0, 0);
    if (date <= todayMidnight) return;

    if (!dayRange.start || (dayRange.start && dayRange.end)) {
      // First click or resetting range
      onDayRangeChange(date, null);
    } else {
      // Second click - set end date
      if (date < dayRange.start) {
        onDayRangeChange(date, dayRange.start);
      } else {
        onDayRangeChange(dayRange.start, date);
      }
    }
  };

  const isDateInRange = (date: Date) => {
    if (!dayRange.start || !dayRange.end) return false;
    return date >= dayRange.start && date <= dayRange.end;
  };

  const isPastDate = (date: Date) => {
    return date <= today;
  };

  const renderDayCalendar = (monthOffset: number = 0) => {
    const displayMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + monthOffset,
      1,
    );
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(displayMonth);

    const monthName = displayMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    const days = [];

    // Empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        displayMonth.getFullYear(),
        displayMonth.getMonth(),
        day,
      );
      date.setHours(0, 0, 0, 0);

      const isStart = dayRange.start?.toDateString() === date.toDateString();
      const isEnd = dayRange.end?.toDateString() === date.toDateString();
      const isInRange = isDateInRange(date) && !isStart && !isEnd;
      const isToday = today.toDateString() === date.toDateString();
      const isPast = isPastDate(date);

      days.push(
        <Button
          key={day}
          variant="ghost"
          size="sm"
          onClick={() => handleDayClick(day, monthOffset)}
          disabled={isPast }
          className={`
            p-2 h-auto text-sm rounded-lg transition-colors relative
            ${isPast ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
            ${isStart || isEnd ? "bg-pink-500 text-white font-semibold hover:bg-pink-600" : ""}
            ${isInRange ? "bg-pink-100 text-pink-900 hover:bg-pink-200" : ""}
            ${isToday && !isStart && !isEnd && !isInRange && !isPast ? "ring-1 ring-pink-300" : ""}
          `}
        >
          {day}
        </Button>,
      );
    }

    return (
      <div>
        <h3 className="text-center font-semibold mb-4 text-gray-900">
          {monthName}
        </h3>
        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
            <div
              key={i}
              className="text-center text-xs text-gray-500 p-2 font-medium"
            >
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  // Month mode helpers
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  const isMonthPast = (monthIndex: number, year: number) => {
    const monthString = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    return monthString < currentYearMonth;
  };

  const handleMonthClick = (monthIndex: number) => {
    const monthString = `${currentYear}-${String(monthIndex + 1).padStart(2, "0")}`;

    // Block past months
    if (isMonthPast(monthIndex, currentYear)) return;

    if (!monthRange.startMonth) {
      // First click - select single month
      onMonthRangeChange(monthString, monthString);
    } else if (monthRange.startMonth && !monthRange.endMonth) {
      // This shouldn't happen with new logic, but handle it
      onMonthRangeChange(monthRange.startMonth, monthString);
    } else {
      // Have a complete range already, clicking again starts new selection
      // If clicking the same as start, keep it as single month
      if (monthString === monthRange.startMonth) {
        onMonthRangeChange(monthString, monthString);
      } else {
        // Start new range
        const startDate = new Date(monthRange.startMonth + "-01");
        const clickedDate = new Date(monthString + "-01");

        if (clickedDate < startDate) {
          onMonthRangeChange(monthString, monthRange.startMonth);
        } else {
          onMonthRangeChange(monthRange.startMonth, monthString);
        }
      }
    }
  };

  const isMonthInRange = (monthIndex: number) => {
    if (!monthRange.startMonth || !monthRange.endMonth) return false;

    const monthString = `${currentYear}-${String(monthIndex + 1).padStart(2, "0")}`;
    const current = new Date(monthString + "-01");
    const start = new Date(monthRange.startMonth + "-01");
    const end = new Date(monthRange.endMonth + "-01");

    return current >= start && current <= end;
  };

  // Summary text
  const getDaySummary = () => {
    if (dayRange.start && dayRange.end) {
      const diff =
        Math.ceil(
          (dayRange.end.getTime() - dayRange.start.getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1;
      const start = dayRange.start;
      const end = dayRange.end;
      const sameYear = start.getFullYear() === end.getFullYear();
      const sameMonth = start.getMonth() === end.getMonth();

      let dateStr = "";
      if (sameMonth && sameYear) {
        dateStr = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.getDate()}, ${start.getFullYear()}`;
      } else if (sameYear) {
        dateStr = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${start.getFullYear()}`;
      } else {
        dateStr = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
      }

      return `You selected ${diff} day${diff > 1 ? "s" : ""}: ${dateStr}`;
    }
    return null;
  };

  const getMonthSummary = () => {
    if (monthRange.startMonth && monthRange.endMonth) {
      const start = new Date(monthRange.startMonth + "-01");
      const end = new Date(monthRange.endMonth + "-01");

      if (monthRange.startMonth === monthRange.endMonth) {
        return `You selected: ${start.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
      } else {
        return `You selected: ${start.toLocaleDateString("en-US", { month: "long", year: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
      }
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={dateMode}
        onValueChange={(v) => onDateModeChange(v as "day" | "month")}
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="day">By Day</TabsTrigger>
          <TabsTrigger value="month">By Month</TabsTrigger>
        </TabsList>

        {/* DAY MODE */}
        <TabsContent value="day" className="space-y-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                    1,
                  ),
                )
              }
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[100px] text-center">
              Navigate months
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                    1,
                  ),
                )
              }
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Calendar grid - 2 months on desktop, 1 on mobile */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>{renderDayCalendar(0)}</div>
            <div className="hidden md:block">{renderDayCalendar(1)}</div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const start = new Date(today);
                start.setDate(start.getDate() + 1);
                const end = new Date(start);
                end.setDate(end.getDate() + 2);
                onDayRangeChange(start, end);
              }}
            >
              Weekend (3 days)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const start = new Date(today);
                start.setDate(start.getDate() + 1);
                const end = new Date(start);
                end.setDate(end.getDate() + 6);
                onDayRangeChange(start, end);
              }}
            >
              1 Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const start = new Date(today);
                start.setDate(start.getDate() + 1);
                const end = new Date(start);
                end.setDate(end.getDate() + 13);
                onDayRangeChange(start, end);
              }}
            >
              2 Weeks
            </Button>
          </div>

          {/* Summary */}
          {getDaySummary() ? (
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                ✓ {getDaySummary()}
              </p>
            </div>
          ) : (
            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Please select a start date and an end date
              </p>
            </div>
          )}
        </TabsContent>

        {/* MONTH MODE */}
        <TabsContent value="month" className="space-y-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentYear(currentYear - 1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-lg font-semibold text-gray-900 min-w-[100px] text-center">
              {currentYear}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentYear(currentYear + 1)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {months.map((month, index) => {
              const monthString = `${currentYear}-${String(index + 1).padStart(2, "0")}`;
              const isStart = monthRange.startMonth === monthString;
              const isEnd = monthRange.endMonth === monthString;
              const isInRange = isMonthInRange(index) && !isStart && !isEnd;
              const isPast = isMonthPast(index, currentYear);

              return (
                <Button
                  key={month}
                  variant="outline"
                  onClick={() => handleMonthClick(index)}
                  disabled={isPast}
                  className={`
                    p-4 h-auto rounded-lg text-sm font-medium transition-all
                    ${isPast ? "text-gray-300 cursor-not-allowed opacity-50" : ""}
                    ${isStart || isEnd ? "bg-pink-500 text-white border-pink-500 hover:bg-pink-600" : ""}
                    ${isInRange ? "bg-pink-100 text-pink-900 border-pink-200 hover:bg-pink-200" : ""}
                    ${!isStart && !isEnd && !isInRange && !isPast ? "bg-gray-50 hover:bg-gray-100 text-gray-700" : ""}
                  `}
                >
                  {month.substring(0, 3)}
                </Button>
              );
            })}
          </div>

          <p className="text-xs text-center text-gray-500">
            Click a month to select it. Click another month to create a range.
          </p>

          {/* Summary */}
          {getMonthSummary() ? (
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                ✓ {getMonthSummary()}
              </p>
            </div>
          ) : (
            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Please select your travel month(s)
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
