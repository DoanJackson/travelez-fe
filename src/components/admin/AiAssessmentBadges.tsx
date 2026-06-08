import { Badge } from "@/components/ui/badge"

interface AiAssessmentBadgesProps {
  violations: string[]
}

export function AiAssessmentBadges({ violations }: AiAssessmentBadgesProps) {
  if (violations.length === 0) return null

  return (
    <section className="space-y-3">
      <p className="text-sm font-semibold text-slate-700">
        AI Assessment: Potential Violations
      </p>
      <div className="flex flex-wrap gap-2">
        {violations.map((v) => (
          <Badge key={v} variant="destructive">
            {v.replace(/_/g, " ")}
          </Badge>
        ))}
      </div>
    </section>
  )
}
