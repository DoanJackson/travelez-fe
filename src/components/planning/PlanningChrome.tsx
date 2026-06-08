"use client";

import { usePathname } from "next/navigation";
import StepIndicator from "@/components/planning/StepIndicator";

export default function PlanningChrome() {
  const pathname = usePathname();
  const stepMatch = pathname.match(/\/step(\d+)$/);
  const isSummary = pathname.endsWith("/summary");
  const currentStep = stepMatch ? Number(stepMatch[1]) : isSummary ? 6 : 0;
  const showChrome = currentStep > 0;

  const title = isSummary ? "Review Your Trip" : "Plan Your Trip";
  const subtitle = isSummary
    ? "Check your details before we generate your personalized itinerary"
    : "We'll create the perfect itinerary for you";

  return (
    <div className={!showChrome ? "hidden" : undefined}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>
      <StepIndicator currentStep={currentStep} />
    </div>
  );
}
