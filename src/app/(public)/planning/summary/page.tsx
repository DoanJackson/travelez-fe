"use client";

import { useRouter } from "next/navigation";
import { useTripPlanningStore } from "@/state/planning-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Palette,
  Edit2,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function SummaryPage() {
  const router = useRouter();
  const {
    destinations,
    dateMode,
    getFormattedDateRange,
    tripType,
    withPets,
    withKids,
    getFormattedBudget,
    travelStyles,
    extraPreferences,
    customNote,
    setCustomNote,
    setComingFromSummary,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    isStep4Valid,
  } = useTripPlanningStore();

  const allValid =
    isStep1Valid() && isStep2Valid() && isStep3Valid() && isStep4Valid();

  const handleEdit = (step: number) => {
    setComingFromSummary(true, 6);
    router.push(`/planning/step${step}`);
  };

  const handleCreateItinerary = () => {
    if (!allValid) return;
    router.push("/planning/loading");
  };

  const handleBack = () => {
    router.push("/planning/step5");
  };

  const getTripTypeLabel = () => {
    if (!tripType) return "Not set";

    const labels = {
      solo: "Solo",
      partner: "Partner",
      friends: "Friends",
      family: "Family",
    };

    let label = labels[tripType] || tripType;

    const extras = [];
    if (withPets) extras.push("with pets");
    if (withKids) extras.push("with kids");

    if (extras.length > 0) {
      label += ` (${extras.join(", ")})`;
    }

    return label;
  };

  return (
    <>
        {/* Status badge */}
        <div className="mt-8 mb-6 flex items-center justify-center">
          {allValid ? (
            <Badge variant="success" className="px-4 py-2 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4 mr-2 inline" />
              All set! Ready to generate itinerary
            </Badge>
          ) : (
            <Badge variant="warning" className="px-4 py-2 text-sm font-medium">
              Some details are missing
            </Badge>
          )}
        </div>

        {/* Summary Cards */}
        <div className="space-y-4 mb-8">
          {/* Destinations */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-pink-500" />
                  <h3 className="font-semibold text-gray-900">Destinations</h3>
                </div>
                {destinations.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {destinations.map((dest, idx) => (
                      <Badge key={idx} variant="location" className="text-sm">
                        {dest}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Not set</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(1)}
                className="ml-4 flex-shrink-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Dates */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-pink-500" />
                  <h3 className="font-semibold text-gray-900">Travel Dates</h3>
                </div>
                <p className="text-gray-700">{getFormattedDateRange()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Mode: {dateMode === "day" ? "By Day" : "By Month"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(2)}
                className="ml-4 flex-shrink-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Companions */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-pink-500" />
                  <h3 className="font-semibold text-gray-900">Trip Type</h3>
                </div>
                <p className="text-gray-700">{getTripTypeLabel()}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(3)}
                className="ml-4 flex-shrink-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Budget */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-5 w-5 text-pink-500" />
                  <h3 className="font-semibold text-gray-900">Budget</h3>
                </div>
                <p className="text-gray-700">
                  {getFormattedBudget() || "Not set"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Per person</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(4)}
                className="ml-4 flex-shrink-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Travel Styles */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="h-5 w-5 text-pink-500" />
                  <h3 className="font-semibold text-gray-900">Travel Style</h3>
                </div>
                {travelStyles.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {travelStyles.map((style, idx) => (
                      <Badge key={idx} variant="style" className="text-sm">
                        {style}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-3">
                    No styles selected
                  </p>
                )}

                {extraPreferences && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-1 font-medium">
                      Additional Preferences:
                    </p>
                    <p className="text-sm text-gray-700">{extraPreferences}</p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(5)}
                className="ml-4 flex-shrink-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Custom Note */}
        <Card className="p-6 mb-8">
          <Label
            htmlFor="customNote"
            className="text-base font-semibold mb-2 block"
          >
            Additional notes{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </Label>
          <p className="text-sm text-gray-600 mb-4">
            Any last-minute details or special requests for your itinerary
          </p>
          <Textarea
            id="customNote"
            placeholder="E.g., I want to visit museums in the morning, prefer local street food over restaurants..."
            value={customNote || ""}
            onChange={(e) => setCustomNote(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button
            variant="secondary"
            onClick={handleBack}
            className="order-2 sm:order-1"
            size="lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleCreateItinerary}
            disabled={!allValid}
            size="lg"
            className="order-1 sm:order-2"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Generate AI Itinerary
          </Button>
        </div>

        {!allValid && (
          <p className="text-center text-sm text-yellow-700 mt-4">
            Please complete all required fields before generating your itinerary
          </p>
        )}
    </>
  );
}
