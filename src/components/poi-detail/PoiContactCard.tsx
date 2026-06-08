import { Phone, Globe, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PoiContactCardProps {
  phoneNumber?: string | null;
  website?: string | null;
  googleMapsUrl?: string | null;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function PoiContactCard({
  phoneNumber,
  website,
  googleMapsUrl,
}: PoiContactCardProps) {
  if (!phoneNumber && !website && !googleMapsUrl) return null;

  return (
    <Card className="rounded-xl border bg-background p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Contact & Directions</h3>
      <div className="space-y-3">
        {phoneNumber && (
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center gap-3 text-sm text-gray-700 hover:text-pink-600 transition-colors"
          >
            <Phone className="h-4 w-4 text-gray-400 shrink-0" />
            <span>{phoneNumber}</span>
          </a>
        )}

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-gray-700 hover:text-pink-600 transition-colors"
          >
            <Globe className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="truncate">{getDomain(website)}</span>
          </a>
        )}

        {googleMapsUrl && (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-gray-700 hover:text-pink-600 transition-colors"
          >
            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
            <span>Open in Google Maps</span>
          </a>
        )}
      </div>
    </Card>
  );
}
