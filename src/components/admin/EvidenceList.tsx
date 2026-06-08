// src/components/admin/EvidenceList.tsx
import { Users, AlertTriangle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { ReportEvidence } from "@/types/admin"

interface EvidenceListProps {
  items: ReportEvidence[]
}

const VIOLATION_COLORS: Record<string, string> = {
  SPAM: "bg-red-100 text-red-700",
  HARASSMENT: "bg-orange-100 text-orange-700",
  HATE_SPEECH: "bg-destructive text-destructive-foreground",
  FALSE_INFORMATION: "bg-yellow-100 text-yellow-700",
  INAPPROPRIATE_CONTENT: "bg-violet-100 text-violet-700",
  INTELLECTUAL_PROPERTY_INFRINGEMENT: "bg-blue-100 text-blue-700",
  OTHER: "bg-slate-100 text-slate-700",
}

export function EvidenceList({ items }: EvidenceListProps) {
  if (!items || items.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Report Evidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-4 text-center text-sm text-slate-500">
            No pending evidence data available.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Report Evidence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => {
          const badgeClass = VIOLATION_COLORS[item.violationType?.toUpperCase() || "OTHER"] || VIOLATION_COLORS.OTHER;
          
          return (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-slate-200">
                    <AvatarImage src={item.reporter?.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {item.reporter?.fullName?.slice(0, 2).toUpperCase() || <Users className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700">
                      {item.reporter?.fullName || "Anonymous User"}
                    </span>
                    <span className="text-xs text-slate-500">Reporter</span>
                  </div>
                </div>
                
                <Badge variant="outline" className={`shrink-0 border-0 ${badgeClass}`}>
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  {item.violationType}
                </Badge>
              </div>

              {item.reasonDetail && (
                <div className="mt-1 rounded-md bg-white p-3 text-sm leading-relaxed text-slate-600 shadow-sm ring-1 ring-slate-100">
                  <span className="font-semibold text-slate-700">Detail: </span>
                  {item.reasonDetail}
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}