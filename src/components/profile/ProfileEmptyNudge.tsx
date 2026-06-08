import Link from "next/link";
import { Compass } from "lucide-react";

interface ProfileEmptyNudgeProps {
  message: string;
  ctaLabel: string;
  ctaHref: string;
}

export function ProfileEmptyNudge({
  message,
  ctaLabel,
  ctaHref,
}: ProfileEmptyNudgeProps) {
  return (
    <div className="flex flex-col items-center text-center rounded-2xl border border-dashed border-pink-200 bg-pink-50 p-8">
      <Compass className="mb-4 h-8 w-8 text-pink-300" />
      <p className="mb-4 max-w-sm text-sm text-slate-500">{message}</p>
      <Link
        href={ctaHref}
        className="text-sm font-medium text-pink-500 hover:underline underline-offset-4"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
