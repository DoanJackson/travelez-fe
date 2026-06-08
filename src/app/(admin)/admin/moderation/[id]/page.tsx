"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

import { AiAssessmentBadges } from "@/components/admin/AiAssessmentBadges"
import { EvidenceList } from "@/components/admin/EvidenceList"
import { QuickGuidanceCard } from "@/components/admin/QuickGuidanceCard"
import { ResolutionActionCard } from "@/components/admin/ResolutionActionCard"
import { ViolationCard } from "@/components/admin/ViolationCard"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  fetchModerationReportById,
  resolveReport,
} from "@/services/moderationService"
import type { ModerationReportDetail, ResolutionAction } from "@/types/admin"
import { useSearchParams } from "next/navigation"

const RESOLUTION_LABELS: Record<ResolutionAction, string> = {
  approve: "Content approved successfully.",
  hide: "Content hidden from public view.",
  delete_penalize: "Content deleted and penalty applied.",
}

interface PageProps {
  params: Promise<{ id: string }>
}

function DetailSkeleton() {
  return (
    <div className="grid grid-cols-10 gap-10">
      <div className="col-span-10 space-y-6 lg:col-span-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
      <div className="col-span-10 space-y-4 lg:col-span-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-44 w-full rounded-xl" />
      </div>
    </div>
  )
}

export default function ModerationDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const router = useRouter()

  const [report, setReport] = useState<ModerationReportDetail | null>(null)
  const [pendingAction, setPendingAction] = useState<ResolutionAction | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [banReason, setBanReason] = useState("")

  useEffect(() => {
    const passedAuthorId = searchParams.get("authorId")
    const passedAuthorName = searchParams.get("authorName")
    const passedStatus = searchParams.get("status") as any
    const passedPostStatus = searchParams.get("postStatus")

    fetchModerationReportById(id, passedAuthorId, passedAuthorName, passedStatus, passedPostStatus).then(setReport)
  }, [id, searchParams])

  async function executeAction(action: ResolutionAction | "unban", reason?: string) {
    await resolveReport(id, action, reason)
    const successMsg = action === "unban" ? "Post unbanned successfully." : RESOLUTION_LABELS[action as ResolutionAction]
    toast.success(successMsg)

    if (action === "unban") {
      setReport(prev => prev ? { ...prev, postStatus: "PUBLISHED" } : null)
    } else {
      router.back()
    }
  }

  function handleDeletePenalize() {
    setPendingAction("delete_penalize")
    setIsConfirmOpen(true)
  }

  async function handleConfirm() {
    if (!pendingAction) return
    setIsConfirmOpen(false)
    await executeAction(pendingAction, banReason)
    setPendingAction(null)
    setBanReason("")
  }

  return (
    <div className="px-10 py-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/moderation">Moderation Queue</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Report #{id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page title row */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
          Back to Queue
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Report Details
        </h1>
      </div>

      {/* Loading state */}
      {!report && <DetailSkeleton />}

      {/* Main content */}
      {report && (
        <div className="grid grid-cols-10 gap-10">
          {/* Left column */}
          <div className="col-span-10 space-y-6 lg:col-span-6">
            <ViolationCard report={report} />
            <AiAssessmentBadges violations={report.aiViolations} />
            <EvidenceList items={report.evidence} />
          </div>

          {/* Right column — sticky */}
          <div className="col-span-10 lg:col-span-4">
            <div className="sticky top-6 space-y-4">
              <QuickGuidanceCard />
              <ResolutionActionCard
                status={report.status}
                postStatus={report.postStatus}
                onApprove={() => executeAction("approve")}
                // onHide={() => executeAction("hide")}
                onDeletePenalize={handleDeletePenalize}
                onUnban={() => executeAction("unban")}
              />
            </div>
          </div>
        </div>
      )}

      {/* Destructive confirmation dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &amp; Penalize?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the content and applies a penalty to the author.
              This action cannot be undone.
            </AlertDialogDescription>
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">Reason for banning:</label>
              <Textarea
                placeholder="E.g., Spam content, Fake review..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="w-full"
              />
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setPendingAction(null)
              setBanReason("")
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={!banReason.trim()}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
