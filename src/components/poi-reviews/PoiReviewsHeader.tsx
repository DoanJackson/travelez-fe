import Link from "next/link";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PoiReviewsHeaderProps {
  id: string;
  poiName: string;
  address: string;
  ratingAvg: number;
  totalReviews: number;
  actionButton?: React.ReactNode;
}

export function PoiReviewsHeader({
  id,
  poiName,
  address,
  ratingAvg,
  totalReviews,
  actionButton,
}: PoiReviewsHeaderProps) {
  return (
    <>
      {/* Back link */}
      <Link
        href={`/poi/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {poiName}
      </Link>

      {/* POI Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{poiName}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4" />
            <span>{address}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <span className="text-2xl font-bold text-gray-900">
                {ratingAvg}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(ratingAvg)
                      ? "text-amber-500 fill-amber-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({totalReviews.toLocaleString()} reviews)
            </span>
          </div>
        </div>
        {actionButton && <div className="shrink-0 mt-1">{actionButton}</div>}
      </div>

      {/* Traveler Consensus */}
      <Card className="rounded-xl border bg-gradient-to-br from-pink-50 to-blue-50 p-5 mb-6">
        {/* Tiêu đề giữ nguyên */}
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Traveler Consensus
        </h3>
        
        {/* Khung chứa nội dung mờ và chữ Coming Soon */}
        <div className="relative">
          {/* Nội dung bị làm mờ và vô hiệu hóa tương tác */}
          <div className="blur-[4px] opacity-60 select-none pointer-events-none">
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Most visitors praise the stunning French colonial architecture and
              romantic atmosphere, especially during the golden hour. The red brick
              facade and twin bell towers are iconic landmarks. However, many note
              that parts may be under renovation, and it can get crowded during
              weekends and holidays.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-white/80">
                📷 Great for photography
              </Badge>
              <Badge variant="secondary" className="bg-white/80">
                🌅 Romantic atmosphere
              </Badge>
              <Badge variant="secondary" className="bg-white/80">
                ⏰ Best in early morning
              </Badge>
              <Badge variant="secondary" className="bg-white/80">
                🏗️ Check for renovations
              </Badge>
            </div>
          </div>

          {/* Lớp overlay chứa chữ Coming Soon căn giữa */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white/90 text-pink-600 border border-pink-200 shadow-sm px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase backdrop-blur-sm">
              Coming Soon
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
