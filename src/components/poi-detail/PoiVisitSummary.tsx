import { Clock, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PoiVisitSummaryProps {
  duration: string;
  entryFee: string;
}

const FALLBACK = "Check on-site";

export function PoiVisitSummary({ duration, entryFee }: PoiVisitSummaryProps) {
  const rows = [
    { label: "Duration", value: duration, Icon: Clock },
    { label: "Entry fee", value: entryFee, Icon: DollarSign },
  ].filter(({ value }) => value && value !== FALLBACK);

  if (rows.length === 0) return null;

  return (
    <Card className="rounded-xl border bg-background p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Visit Summary</h3>
      <div className="space-y-3">
        {rows.map(({ label, value, Icon }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{label}</span>
            <div className="flex items-center gap-1.5">
              <Icon className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
