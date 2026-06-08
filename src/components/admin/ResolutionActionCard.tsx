import { CheckCircle, Ban, RefreshCcw, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReportStatus } from "@/types/admin"

interface ResolutionActionCardProps {
  status: ReportStatus
  postStatus?: string
  onApprove: () => void
  onDeletePenalize: () => void
  onUnban?: () => void
}

export function ResolutionActionCard({
  status,
  postStatus,
  onApprove,
  onDeletePenalize,
  onUnban,
}: ResolutionActionCardProps) {
  
  const isResolved = status === "resolved"
  const isBanned = postStatus?.toUpperCase() === "BANNED" 


  return (
    <Card>
      <CardHeader className="bg-slate-50/50 pb-3">
        <CardTitle className="text-sm font-semibold">Moderation Action</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {isResolved ? (
          <>
            <div className="mb-4 rounded-md bg-slate-100 p-2 text-center text-xs font-medium text-slate-600">
              ✓ Report series has been closed
            </div>
            
            {isBanned ? (
              <div className="space-y-3 rounded-lg border border-red-100 bg-red-50 p-4">
                <p className="text-center text-sm font-medium text-red-800">
                  This post is currently BANNED.
                </p>
                {onUnban && (
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 border-red-200 bg-white text-red-600 hover:bg-red-50"
                    onClick={onUnban}
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Unban Post (Restore)
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-emerald-700">
                <ShieldCheck className="h-6 w-6 text-emerald-500" />
                <p className="text-center text-sm font-medium">
                  Post is active and visible to public.
                </p>
                <span className="text-[10px] text-slate-400">(Debug postStatus: {postStatus || "undefined"})</span>
              </div>
            )}
          </>
        ) : (
          <>
            <Button variant="outline" className="w-full justify-start gap-2 border-slate-300 font-medium text-slate-700 hover:bg-slate-50" onClick={onApprove}>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              Reject Report (Keep Content)
            </Button>
            <Button variant="destructive" className="w-full justify-start gap-2 font-medium" onClick={onDeletePenalize}>
              <Ban className="h-4 w-4" />
              Ban Post & Penalize
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}