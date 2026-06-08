"use client"

import { useState } from "react"
import { CheckCircle, ShieldAlert, Lock, AlertCircle, FileText, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { AlertStatus } from "@/types/admin"

interface AiAlertActionCardProps {
  status: AlertStatus
  onApprove: (note: string) => void
  onBan: (note: string) => void
  resolvedAdminNote?: string
  resolvedModeratorName?: string
}

export function AiAlertActionCard({ status, onApprove, onBan, resolvedAdminNote, resolvedModeratorName }: AiAlertActionCardProps) {
  const [adminNote, setAdminNote] = useState("")

  const isResolved = status !== "PENDING"

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="bg-slate-50/50 pb-3 border-b border-slate-100">
        <CardTitle className="text-sm font-semibold text-slate-800">
          Moderation Action
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        
        {isResolved && (
          <div className="space-y-4">
            {/* Box trạng thái */}
            {status === "APPROVED" && (
              <div className="rounded-md border border-emerald-100 bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-700 flex flex-col items-center gap-2">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
                <span>Marked as Safe</span>
                <span className="text-xs font-normal text-emerald-600/80 mt-1">This content is visible to public.</span>
              </div>
            )}
            {status === "BANNED" && (
              <div className="rounded-md border border-red-100 bg-red-50 p-4 text-center text-sm font-medium text-red-700 flex flex-col items-center gap-2">
                <ShieldAlert className="h-6 w-6 text-red-500" />
                <span>Target Banned</span>
                <span className="text-xs font-normal text-red-600/80 mt-1">This content has been removed from public.</span>
              </div>
            )}
            {status === "AUTO_RESOLVED" && (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center text-sm font-medium text-slate-600 flex flex-col items-center gap-2">
                <Lock className="h-6 w-6 text-slate-400" />
                <span>Auto-Resolved (Closed)</span>
                <span className="text-xs font-normal text-slate-500 mt-1">This target was removed or resolved elsewhere.</span>
              </div>
            )}

            <div className="rounded-md bg-slate-50 border border-slate-100 p-3 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>Moderator: <strong>{resolvedModeratorName || "Admin"}</strong></span>
                </div>
              </div>
              <div className="space-y-1.5">
                 <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                   <FileText className="h-3.5 w-3.5" />
                   Admin Note:
                 </div>
                 <p className="text-sm text-slate-600 bg-white p-2 rounded border border-slate-100">
                   {resolvedAdminNote || "No note provided."}
                 </p>
              </div>
            </div>
          </div>
        )}

        {!isResolved && (
          <>
            <div className="space-y-2">
              <Label htmlFor="admin-note" className="text-xs font-semibold text-slate-700">
                Admin Note <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="admin-note"
                placeholder="Enter reason for your decision (Required)..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="min-h-[100px] resize-none text-sm"
              />
            </div>

            <div className="space-y-2 pt-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-slate-300 font-medium text-slate-700 hover:bg-slate-50"
                disabled={!adminNote.trim()} 
                onClick={() => onApprove(adminNote)}
              >
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Approve (Mark as Safe)
              </Button>
              
              <Button
                variant="destructive"
                className="w-full justify-start gap-2 font-medium bg-red-600 hover:bg-red-700"
                disabled={!adminNote.trim()} 
                onClick={() => onBan(adminNote)}
              >
                <ShieldAlert className="h-4 w-4" />
                Ban Target
              </Button>
            </div>
            
            <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-xs text-amber-800 border border-amber-100 mt-4">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
              <p>
                Please provide a clear admin note before making a decision. This note will be securely logged for audit purposes.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}