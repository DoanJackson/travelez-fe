"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
  label?: string;
  placeholder?: string;
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  disabled?: boolean;
  minDate?: Date;
};

export function DatePicker({
  label,
  placeholder = "Select date",
  date,
  onDateChange,
  disabled = false,
  minDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      {/* <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="trip-date"
            type="button"
            variant="outline"
            disabled={disabled}
            className="w-full justify-between rounded-full border-2 border-pink-100 bg-white font-normal"
          >
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {date ? format(date, "PPP") : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </span>
            <ChevronDownIcon className="h-4 w-4 opacity-60" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto overflow-hidden rounded-2xl border border-gray-100 p-0 shadow-lg"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              onDateChange(d)
              setOpen(false)
            }}
            disabled={(date) => {
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              if (date < today) return true
              if (minDate && date < minDate) return true
              return false
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover> */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              onDateChange(newDate);
              setOpen(false);
            }}
            disabled={(checkDate) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (checkDate < today) return true;
              if (minDate && checkDate < minDate) return true;
              return false;
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
