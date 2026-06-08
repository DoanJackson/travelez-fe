import {
  MapPin,
  CalendarDays,
  Users,
  DollarSign,
  Palette,
  ClipboardList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number; // 1-6
}

const stepLabels = [
  "Destination",
  "Dates",
  "Companions",
  "Budget",
  "Style",
  "Review",
];

const STEP_ICONS: LucideIcon[] = [
  MapPin,
  CalendarDays,
  Users,
  DollarSign,
  Palette,
  ClipboardList,
];

const STEP_INDICES = Array.from({ length: 6 }, (_, i) => i);

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const totalSteps = 6;

  return (
    <div className="mb-6">
      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-center gap-2">
        {STEP_INDICES.map((index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const Icon = STEP_ICONS[index];

          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-200 flex-shrink-0
                  ${
                    isCompleted
                      ? "bg-pink-500 text-white ring-2 ring-pink-200"
                      : isActive
                        ? "bg-pink-500 text-white ring-4 ring-pink-100"
                        : "bg-gray-200 text-gray-400"
                  }
                `}
              >
                {isCompleted ? (
                  <Icon className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{stepNumber}</span>
                )}
              </div>
              {stepNumber < totalSteps && (
                <div
                  className={`
                    w-8 lg:w-12 h-0.5 mx-1
                    ${isCompleted ? "bg-pink-500" : "bg-gray-200"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile View - Horizontal Scroll with Step Labels */}
      <div className="md:hidden overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-max px-4">
          {STEP_INDICES.map((index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;
            const Icon = STEP_ICONS[index];

            return (
              <div key={stepNumber} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      transition-all duration-200
                      ${
                        isCompleted
                          ? "bg-pink-500 text-white ring-1 ring-pink-200"
                          : isActive
                            ? "bg-pink-500 text-white ring-2 ring-pink-200"
                            : "bg-gray-200 text-gray-400"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Icon className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-semibold">
                        {stepNumber}
                      </span>
                    )}
                  </div>
                  <span
                    className={`
                    text-xs whitespace-nowrap
                    ${isActive ? "text-gray-900 font-medium" : "text-gray-500"}
                  `}
                  >
                    {stepLabels[index]}
                  </span>
                </div>
                {stepNumber < totalSteps && (
                  <div
                    className={`
                      w-6 h-0.5 mx-1
                      ${isCompleted ? "bg-pink-500" : "bg-gray-200"}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop: Show step label */}
      <div className="hidden md:block text-center mt-3">
        <span className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps}:{" "}
          <span className="font-medium text-gray-900">
            {stepLabels[currentStep - 1]}
          </span>
        </span>
      </div>
    </div>
  );
}
