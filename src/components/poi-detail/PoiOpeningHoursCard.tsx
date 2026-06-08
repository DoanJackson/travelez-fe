import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OpeningHour {
  day: string;
  hours: string;
}

interface ReviewsDistribution {
  oneStar: number;
  twoStar: number;
  threeStar: number;
  fourStar: number;
  fiveStar: number;
}

interface PoiOpeningHoursCardProps {
  openingHour: OpeningHour[];
  reviewsDistribution: ReviewsDistribution;
  additionalInfo: Record<string, unknown>;
}

// Match today against the backend's Vietnamese day names
const VI_DAY_MAP: Record<number, string> = {
  0: "Chủ Nhật",
  1: "Thứ Hai",
  2: "Thứ Ba",
  3: "Thứ Tư",
  4: "Thứ Năm",
  5: "Thứ Sáu",
  6: "Thứ Bảy",
};

export function PoiOpeningHoursCard({
  openingHour,
  reviewsDistribution,
  additionalInfo,
}: PoiOpeningHoursCardProps) {
  const todayViName = VI_DAY_MAP[new Date().getDay()];

  const dist = reviewsDistribution;
  const total =
    dist.fiveStar + dist.fourStar + dist.threeStar + dist.twoStar + dist.oneStar;
  const ratingRows = [
    { label: "5", count: dist.fiveStar },
    { label: "4", count: dist.fourStar },
    { label: "3", count: dist.threeStar },
    { label: "2", count: dist.twoStar },
    { label: "1", count: dist.oneStar },
  ];

  const amenities = Object.entries(additionalInfo ?? {})
    .filter(([, v]) => v === true)
    .map(([k]) => k);

  return (
    <Card className="rounded-xl border bg-background p-5 space-y-5">
      {/* Opening Hours — flat list */}
      {openingHour.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Opening Hours</h4>
          <div className="space-y-1.5">
            {openingHour.map(({ day, hours }) => {
              const isToday = day === todayViName;
              return (
                <div key={day} className="flex justify-between text-sm">
                  <span className={isToday ? "font-semibold text-gray-900" : "text-gray-500"}>
                    {day}
                  </span>
                  <span
                    className={
                      isToday
                        ? "font-semibold text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {hours}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rating Distribution */}
      {total > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Rating Distribution</h4>
          <div className="space-y-1.5">
            {ratingRows.map(({ label, count }) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 w-6 shrink-0">
                    <span className="text-xs text-gray-600">{label}</span>
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-500 w-8 text-right shrink-0">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Amenities */}
      {amenities.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {amenities.map((item) => (
              <Badge key={item} variant="secondary" className="text-xs px-2.5 py-1">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
