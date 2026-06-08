"use client";

import { useRouter } from "next/navigation";
import { useTripPlanningStore } from "@/state/planning-store";
import DestinationInput from "@/components/planning/DestinationInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Step1Page() {
  const router = useRouter();
  const destinations = useTripPlanningStore((s) => s.destinations);
  const addDestination = useTripPlanningStore((s) => s.addDestination);
  const removeDestination = useTripPlanningStore((s) => s.removeDestination);
  const comingFromSummary = useTripPlanningStore((s) => s.comingFromSummary);
  const summaryReturnStep = useTripPlanningStore((s) => s.summaryReturnStep);
  const setComingFromSummary = useTripPlanningStore((s) => s.setComingFromSummary);

  const handleNext = () => {
    if (!isValid) return;

    if (comingFromSummary && summaryReturnStep === 6) {
      setComingFromSummary(false);
      router.push("/planning/summary");
    } else {
      router.push("/planning/step2");
    }
  };

  const isValid = destinations.length > 0;

  return (
    <>
      <div className="mt-8 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Where do you want to go?
        </h2>
        <p className="text-gray-600">
          Add up to 5 destinations. We'll optimize the route for you.
        </p>
      </div>

      <Card className="p-6 mb-8 transition-shadow">
        <DestinationInput
          destinations={destinations}
          onAdd={addDestination}
          onRemove={removeDestination}
          maxDestinations={5}
        />
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!isValid} size="lg">
          Next: Choose Dates
        </Button>
      </div>
    </>
  );
}
