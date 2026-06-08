import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { StatCard } from "@/types/admin"

interface StatCardsProps {
  cards: StatCard[]
}

const VARIANT_STYLES = {
  default: {
    card: "",
    value: "text-slate-900",
    subtitle: "text-slate-500",
  },
  error: {
    card: "border-red-300 border-2",
    value: "text-red-600",
    subtitle: "text-red-500 font-bold uppercase tracking-wider text-xs",
  },
  warning: {
    card: "border-amber-300 border-2",
    value: "text-amber-600",
    subtitle: "text-amber-500",
  },
}

export function StatCards({ cards }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const styles = VARIANT_STYLES[card.variant ?? "default"]
        return (
          <Card key={card.label} className={cn("shadow-sm", styles.card)}>
            <CardHeader className="pb-2">
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
            </CardHeader>
            <CardContent>
              <p className={cn("text-4xl font-black tracking-tight", styles.value)}>
                {card.value}
              </p>
              <p className={cn("mt-1 text-xs", styles.subtitle)}>
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
