"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function MyItinerariesHeader() {
  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        {/* Left side: Title and text */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Trips
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Your collection of planned journeys.
          </p>
          <p className="text-sm text-gray-500">
            Capture your adventures. Continue where you left off.
          </p>
        </div>

        {/* Right side: CTA button */}
        {/* <div className="flex justify-center md:justify-end">
          <Button
            asChild
            size="lg"
          >
            <Link href="/planning">
              <Plus className="mr-2 h-5 w-5" />
              Start a new journey
            </Link>
          </Button>
        </div> */}
      </div>
    </div>
  );
}
