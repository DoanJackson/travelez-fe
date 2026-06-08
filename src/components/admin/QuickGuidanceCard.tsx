import { Lightbulb } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const GUIDANCE_ITEMS = [
  { 
    label: "Reject Report (Content is safe)", 
    description: "The report is invalid or the post is a genuine travel review. Select this to discard the report and keep the content visible." 
  },
  { 
    label: "Ban Post & Penalize (Policy violation)", 
    description: "The post contains spam, misinformation, or harassment. Select this to hide the post from the community and flag the author's account." 
  },
]

export function QuickGuidanceCard() {
  return (
    <Card className="border-l-4 border-l-amber-400">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          Quick Guidance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {GUIDANCE_ITEMS.map(({ label, description }) => (
          <div key={label} className="flex gap-2 text-sm">
            <span className="mt-0.5 shrink-0 font-bold text-amber-500">•</span>
            <p className="text-slate-600">
              <strong className="text-slate-800">{label}:</strong> {description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}