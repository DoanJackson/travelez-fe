"use client"

import { BrainCircuit, FileText, MessageSquare, MapPin, User, AlertOctagon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { ModerationAlert } from "@/types/admin"

interface AiViolationInfoCardProps {
  alert: ModerationAlert
}

export function AiViolationInfoCard({ alert }: AiViolationInfoCardProps) {
  
  const renderTargetIcon = () => {
    switch (alert.targetType) {
      case "POST": return <FileText className="h-5 w-5 text-blue-500" />
      case "REVIEW": return <MessageSquare className="h-5 w-5 text-emerald-500" />
      case "POI": return <MapPin className="h-5 w-5 text-purple-500" />
      default: return <FileText className="h-5 w-5 text-slate-500" />
    }
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
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {renderTargetIcon()}
              <CardTitle className="text-base font-semibold text-slate-800">
                Reported {alert.targetType.charAt(0) + alert.targetType.slice(1).toLowerCase()}
              </CardTitle>
            </div>
            <span className="text-xs font-mono text-slate-400">Target ID: #{alert.targetId}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <User className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                {alert.targetAuthorName || "Unknown Author"}
              </p>
              <p className="text-xs text-slate-500">Author</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="rounded-md bg-slate-50 p-4 border border-slate-100">
            {alert.targetTitle && (
              <h4 className="font-semibold text-slate-900 mb-2">{alert.targetTitle}</h4>
            )}
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {alert.targetContent || "No content text available."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-red-50/50 pb-4 border-b border-red-100">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-red-600" />
            <CardTitle className="text-base font-semibold text-red-900">AI Analysis & Reasoning</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-5 bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Violation Type</p>
              <div>{renderViolationBadge(alert.violationType)}</div>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Confidence Score</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-800">{Math.round(alert.confidenceScore * 100)}%</span>
                <div className="h-2 w-full max-w-[120px] rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className={`h-full ${alert.confidenceScore >= 0.9 ? 'bg-red-600' : 'bg-orange-500'}`} 
                    style={{ width: `${Math.round(alert.confidenceScore * 100)}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-red-50" />

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-red-800">
              <AlertOctagon className="h-4 w-4" />
              <h4 className="text-sm font-semibold">AI Reasoning Details</h4>
            </div>
            <div className="rounded-md bg-red-50/80 p-4 border border-red-100">
              <p className="text-sm text-red-900 leading-relaxed italic">
                "{alert.reason || "The AI system flagged this content but did not provide a detailed explanation."}"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}