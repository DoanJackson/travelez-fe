"use client";

import {
  BedDouble,
  Car,
  Landmark,
  Sparkles,
  Utensils,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EstimatedBudget } from "@/types/itinerary";
import { formatVND } from "@/lib/utils";

interface BudgetDetailModalProps {
  open: boolean;
  onClose: () => void;
  estimatedBudget: EstimatedBudget;
}

const BREAKDOWN_ITEMS = [
  {
    key: "accommodation" as const,
    label: "Accommodation",
    icon: BedDouble,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    bar: "bg-blue-400",
  },
  {
    key: "foodAndDrink" as const,
    label: "Food & Drink",
    icon: Utensils,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    bar: "bg-amber-400",
  },
  {
    key: "transportation" as const,
    label: "Transportation",
    icon: Car,
    color: "text-pink-500",
    bg: "bg-pink-50",
    border: "border-pink-200",
    bar: "bg-pink-400",
  },
  {
    key: "activity" as const,
    label: "Activities",
    icon: Landmark,
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-200",
    bar: "bg-purple-400",
  },
] as const;

export function BudgetDetailModal({
  open,
  onClose,
  estimatedBudget,
}: BudgetDetailModalProps) {
  const { total: rawTotal, currency } = estimatedBudget;
  const total = rawTotal ?? 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Estimated Budget</DialogTitle>
          <DialogDescription className="sr-only">Detailed budget estimate for this itinerary</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {BREAKDOWN_ITEMS.map(({ key, label, icon: Icon, color, bg, border, bar }) => {
            const amount = estimatedBudget[key] ?? 0;
            const pct = total > 0 ? Math.min((amount / total) * 100, 100) : 0;

            return (
              <div key={key} className={`rounded-lg border ${border} ${bg} p-3`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatVND(amount)}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/70 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}

          {/* Total */}
          <div className="flex justify-between items-center border-t pt-3 mt-1">
            <span className="text-base font-bold text-gray-900">Total</span>
            <span className="text-base font-bold text-pink-600">
              {formatVND(total)}
              <span className="text-xs font-normal text-gray-400 ml-1">{currency}</span>
            </span>
          </div>

          {/* Disclaimer */}
          <div className="flex gap-2 items-start rounded-lg bg-violet-50 border border-violet-100 px-3 py-2.5">
            <Sparkles className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
            <p className="text-xs italic text-gray-500 leading-snug">
              Note: These are estimated costs based on typical prices and may vary in real life. Always good to have a buffer!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
