import { Card } from "@/components/ui/card"

interface PoiOverviewSectionProps {
  overview: string
}

export function PoiOverviewSection({ overview }: PoiOverviewSectionProps) {
  return (
    <section id="overview" className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
      <Card className="rounded-xl border bg-background p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-gray-700">{overview}</p>
      </Card>
    </section>
  )
}
