"use client";

import { AlertTriangle, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EstimatedBudget } from "@/types/itinerary";

interface BudgetModalProps {
  open: boolean;
  onClose: () => void;
  estimatedBudget: EstimatedBudget;
  userBudget: number;
}

function fmt(amount: number, currency: string) {
  return `${amount.toLocaleString()} ${currency}`;
}

function barPct(amount: number, total: number) {
  return total > 0 ? Math.min((amount / total) * 100, 100) : 0;
}

export function BudgetModal({
  open,
  onClose,
  estimatedBudget,
  userBudget,
}: BudgetModalProps) {
  const { total, transportation, activity, foodAndDrink, accommodation, currency } =
    estimatedBudget;

  const isOver = total > userBudget;
  const pct = Math.round((total / userBudget) * 100);
  const diff = Math.abs(userBudget - total);

  const comparisonColor = isOver ? "text-red-600" : "text-green-600";
  const barColor = isOver ? "bg-red-500" : "bg-green-500";
  const badgeCls = isOver
    ? "bg-red-100 text-red-700"
    : "bg-green-100 text-green-700";
  const badgeLabel = isOver ? "Over budget" : "Within budget";

  const breakdown = [
    {
      label: "Transportation",
      amount: transportation ?? 0,
      accent: "border-pink-400",
      bar: "bg-pink-400",
      disclaimer:
        "Includes estimated local transport between stops only. Intercity travel and flights are not included.",
    },
    {
      label: "Activities",
      amount: activity ?? 0,
      accent: "border-purple-400",
      bar: "bg-purple-400",
      disclaimer: null,
    },
    {
      label: "Food & Drink",
      amount: foodAndDrink ?? 0,
      accent: "border-amber-400",
      bar: "bg-amber-400",
      disclaimer: null,
    },
    {
      label: "Accommodation",
      amount: accommodation ?? 0,
      accent: "border-blue-400",
      bar: "bg-blue-400",
      disclaimer:
        "Accommodation suggestions are not available at this stage. This is a placeholder estimate only.",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Budget Overview</DialogTitle>
          <DialogDescription className="sr-only">Estimated costs breakdown for your trip</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* ── Comparison section ── */}
          <div className="relative rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
            {/* State badge */}
            <span
              className={`absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full ${badgeCls}`}
            >
              {badgeLabel}
            </span>

            {/* Your budget row */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Your budget</span>
              <span className="font-medium text-gray-900">
                {fmt(userBudget, currency)}
              </span>
            </div>

            {/* Estimated cost row */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estimated cost</span>
              <span className={`font-semibold ${comparisonColor}`}>
                {fmt(total, currency)}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${barColor}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>

            {/* Subtext */}
            <p className="text-xs text-gray-500">
              {isOver ? (
                <>
                  <span className="text-red-600 font-medium">
                    +{fmt(diff, currency)} over limit
                  </span>
                  {" · "}
                  {pct}% of budget used
                </>
              ) : (
                <>
                  {pct}% used
                  {" · "}
                  <span className="text-green-600 font-medium">
                    {fmt(diff, currency)} remaining
                  </span>
                </>
              )}
            </p>
          </div>

          {/* ── Cost breakdown ── */}
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-400">
              Cost breakdown
            </p>

            {breakdown.map(({ label, amount, accent, bar, disclaimer }) => (
              <div key={label} className={`border-l-4 pl-3 ${accent}`}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{label}</span>
                  <span className="font-medium text-gray-900">
                    {fmt(amount, currency)}
                  </span>
                </div>
                {/* Category proportion bar */}
                <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bar}`}
                    style={{ width: `${barPct(amount, total)}%` }}
                  />
                </div>
                {/* Disclaimer */}
                {disclaimer && (
                  <div className="mt-1.5 flex gap-1.5 items-start rounded bg-[#fefce8] border border-amber-200 px-2 py-1.5">
                    <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] italic text-gray-500 leading-snug">
                      {disclaimer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Total row ── */}
          <div className="flex justify-between items-center border-t pt-3">
            <span className="text-base font-bold text-gray-900">Total</span>
            <span className="text-base font-bold text-gray-900">
              {fmt(total, currency)}
            </span>
          </div>

          {/* ── Footer ── */}
          <div className="flex gap-2 items-start rounded-lg bg-violet-50 px-3 py-2.5">
            <Sparkles className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
            <p className="text-xs italic text-gray-500 leading-snug">
              Estimates are AI-generated based on average local prices and may
              vary.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
