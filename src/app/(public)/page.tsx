import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { Hero } from "@/components/home/Hero";
import { StandardItineraries } from "@/components/home/StandardItineraries";
import { HowItWorks } from "@/components/home/HowItWorks";
import { SocialProof } from "@/components/home/SocialProof";
import { FinalCTA } from "@/components/home/FinalCTA";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "TravelEZ - AI-Powered Travel Planner for Vietnam",
};

export default function HomePage() {
  return (
    <div className={playfairDisplay.variable}>
      <Hero />
      <StandardItineraries />
      <HowItWorks />
      <SocialProof />
      <FinalCTA />
    </div>
  );
}
