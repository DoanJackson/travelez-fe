import { Suspense } from "react";
import { CalendarCallbackInner } from "@/components/itinerary/CalendarCallbackInner";
import { Loader2 } from "lucide-react";

function FullPageSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-slate-600">
      <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
      <p className="text-sm font-medium">Connecting to Google Calendar…</p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <CalendarCallbackInner />
    </Suspense>
  );
}
