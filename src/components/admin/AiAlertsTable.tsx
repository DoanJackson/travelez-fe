"use client"

import { format, parseISO } from "date-fns"
import { AlertTriangle, Bot, CheckCircle, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { ModerationAlert } from "@/types/admin"

interface AiAlertsTableProps {
  alerts: ModerationAlert[]
  onReview: (alertId: number) => void
}

export function AiAlertsTable({ alerts, onReview }: AiAlertsTableProps) {
  
  const renderConfidenceScore = (score: number) => {
    const percent = Math.round(score * 100)
    let colorClass = "bg-amber-500"
    
    if (percent >= 90) colorClass = "bg-red-600"
    else if (percent >= 70) colorClass = "bg-orange-500"

    return (
      <div className="w-full flex items-center gap-2">
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div className={`h-full ${colorClass}`} style={{ width: `${percent}%` }} />
        </div>
        <span className="text-xs font-medium text-slate-600 w-8">{percent}%</span>
      </div>
    )
  }

  const renderViolationBadge = (type: string) => {
    switch (type) {
      case "KHIEU_DAM": return <Badge variant="destructive" className="bg-pink-600">Explicit Content</Badge>
      case "BAO_LUC": return <Badge variant="destructive" className="bg-red-700">Violence</Badge>
      case "CHINH_TRI": return <Badge variant="destructive" className="bg-yellow-600">Political</Badge>
      case "HANG_CAM": return <Badge variant="destructive" className="bg-purple-600">Prohibited Items</Badge>
      case "NGON_TU_THU_HET": return <Badge variant="destructive" className="bg-orange-600">Hate Speech</Badge>
      default: return <Badge variant="secondary">{type}</Badge>
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden mt-4">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-[100px] text-center">Alert ID</TableHead>
            <TableHead className="w-[140px]">Detected At</TableHead>
            <TableHead className="w-[100px] text-center">Target</TableHead>
            <TableHead className="w-[160px]">Violation Type</TableHead>
            <TableHead className="w-[200px]">AI Confidence</TableHead>
            <TableHead className="w-[120px] text-center">Status</TableHead>
            <TableHead className="w-[100px] text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-12 text-center text-slate-500">
                <div className="flex flex-col items-center justify-center gap-2">
                  <ShieldAlert className="h-8 w-8 text-slate-300" />
                  <p>No new AI moderation alerts detected.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            alerts.map((alert) => (
              <TableRow key={alert.id} className="hover:bg-slate-50/60 transition-colors">
                <TableCell className="text-center font-mono text-sm text-slate-500">
                  #{alert.id}
                </TableCell>
                <TableCell className="text-sm text-slate-600 tabular-nums">
                  {format(parseISO(alert.createdAt), "MMM d, HH:mm")}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="font-mono text-[10px] uppercase">
                    {alert.targetType}
                  </Badge>
                </TableCell>
                <TableCell>
                  {renderViolationBadge(alert.violationType)}
                </TableCell>
                <TableCell>
                  {renderConfidenceScore(alert.confidenceScore)}
                </TableCell>
                <TableCell className="text-center">
                  {alert.status === "PENDING" && (
                    <span className="flex items-center justify-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                      <AlertTriangle className="h-3 w-3" /> Pending
                    </span>
                  )}
                  {alert.status === "APPROVED" && (
                    <span className="flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                      <CheckCircle className="h-3 w-3" /> Safe
                    </span>
                  )}
                  {alert.status === "BANNED" && (
                    <span className="flex items-center justify-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">
                      <ShieldAlert className="h-3 w-3" /> Banned
                    </span>
                  )}
                  {alert.status === "AUTO_RESOLVED" && (
                    <span className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                      Closed
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    variant={alert.status === "PENDING" ? "default" : "outline"}
                    className="w-full gap-1"
                    onClick={() => onReview(alert.id)}
                  >
                    <Bot className="h-3.5 w-3.5" />
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}