import { ReviewHero } from "@/components/review/ReviewHero";
import { RecentReviewsSection } from "@/components/review/RecentReviewsSection";

export const metadata = {
  title: "Review Hub | TravelEZ",
  description:
    "Write a travel review and share your experiences with the TravelEZ community.",
};

export default function ReviewPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <ReviewHero />
      <RecentReviewsSection />
    </main>
  );
}
