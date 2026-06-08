import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { ModerationReportDetail } from "@/types/admin"

interface ViolationCardProps {
  report: ModerationReportDetail
}

export function ViolationCard({ report }: ViolationCardProps) {
  return (
    <Card className="overflow-hidden border-l-4 border-l-destructive">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={report.author.avatarUrl} alt={report.author.name} />
              <AvatarFallback>{report.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-slate-900">{report.author.name}</p>
              <p className="text-xs text-slate-500">Member since {report.authorSince}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
          Reported Content
        </p>
        <blockquote className="border-l-2 border-slate-200 bg-slate-50 p-4 text-base italic leading-relaxed text-slate-700">
          &ldquo;{report.content}&rdquo;
        </blockquote>

        {report.images && report.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {report.images.map((img, idx) => (
              <div key={idx} className="aspect-square overflow-hidden rounded-md border border-slate-200">
                <img 
                  src={img} 
                  alt="Post evidence" 
                  className="h-full w-full object-cover" 
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}