"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import lottie, { AnimationItem } from "lottie-web";

export function EmptyState() {
  const animationContainer = useRef<HTMLDivElement>(null);
  const animationInstance = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (animationContainer.current) {
      // Using a free, open-source Lottie animation
      // This is a simple travel-themed animation
      animationInstance.current = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        // Using a simple travel animation from LottieFiles (free & open source)
        path: "https://lottie.host/e9dc2c28-8c93-4ee4-925a-d7d98c5e0c2d/TdLjbT3QQb.json",
      });

      return () => {
        animationInstance.current?.destroy();
      };
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        ref={animationContainer}
        className="w-64 mb-6 opacity-80"
        aria-hidden="true"
      />

      <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
        No journeys yet
      </h2>

      <p className="text-gray-600 text-center max-w-md mb-8">
        Your adventures will appear here once you create your first trip.
      </p>

      <Button
        asChild
        size="lg"
        className="bg-pink-500 hover:bg-pink-600 text-white"
      >
        <Link href="/planning">
          <Plus className="mr-2 h-5 w-5" />
          Start a new journey
        </Link>
      </Button>
    </div>
  );
}
