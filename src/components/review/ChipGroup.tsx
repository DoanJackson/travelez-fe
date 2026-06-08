"use client";

import { cn } from "@/lib/utils";

interface ChipGroupProps<T extends string> {
  /** Section label shown above the chip row. */
  label: string;
  /** All selectable options — pass an `as const` array to preserve literal types. */
  options: readonly T[];
  /** Currently selected value, or null for no selection. */
  value: T | null;
  /** Called when the user clicks a chip. */
  onChange: (value: T) => void;
  className?: string;
}

/**
 * Generic single-select chip/pill row.
 * Works for any string union — TravelerType, BudgetTier, etc.
 *
 * @example
 * <ChipGroup
 *   label="Who did you travel with?"
 *   options={TRAVELER_TYPES}
 *   value={travelerType}
 *   onChange={setTravelerType}
 * />
 */
export function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: ChipGroupProps<T>) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {/* Label — not a <label> element since there's no single input to associate with */}
      <span
        className="text-xs font-semibold text-gray-500 uppercase tracking-wider select-none"
        aria-hidden="true"
      >
        {label}
      </span>

      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={isActive}
              className={cn(
                // Base: pill shape + transitions
                "px-4 py-1.5 rounded-full text-sm font-medium",
                "transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1",
                // Active state
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/25 scale-[1.03]"
                  : // Inactive state
                    "border border-gray-200 bg-white text-gray-600 hover:border-primary/50 hover:text-primary",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
