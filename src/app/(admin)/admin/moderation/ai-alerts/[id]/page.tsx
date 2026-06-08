"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AiViolationInfoCard } from "@/components/admin/AiViolationInfoCard"
import { AiAlertActionCard } from "@/components/admin/AiAlertActionCard"
import type { ModerationAlert } from "@/types/admin"
import { toast } from "sonner"
import { fetchAiAlertById, reviewAiAlert } from "@/services/moderationService"

export default function AiAlertDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [alertData, setAlertData] = useState<ModerationAlert | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDetail = async () => {
      setIsLoading(true);
      const res = await fetchAiAlertById(id);
      
      if (res && res.data) {
        setAlertData(res.data);
      } else {
        toast.error("Unable to load detailed data for this alert");
      }
      setIsLoading(false);
    };

    loadDetail();
  }, [id]);

  const handleApprove = async (note: string) => {
    try {
      await reviewAiAlert(id, "approve", note);
      toast.success("Successfully approved the content!");
      
      if (alertData) setAlertData({ ...alertData, status: "APPROVED" });
    } catch (error) {
      toast.error("An error occurred while approving the content. Please try again.");
    }
  };

  const handleBan = async (note: string) => {
    try {
      await reviewAiAlert(id, "ban", note);
      toast.success("Successfully banned the content!");
      
      if (alertData) setAlertData({ ...alertData, status: "BANNED" });
    } catch (error) {
      toast.error("An error occurred while banning the content. Please try again.");
    }
  };

  if (isLoading || !alertData) {
    return <div className="flex h-full items-center justify-center p-12">Loading AI Analysis...</div>
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            AI Alert Details
          </h2>
          <p className="text-sm text-slate-500">
            Review content flagged by the automated moderation system.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="col-span-1 lg:col-span-8">
          <AiViolationInfoCard alert={alertData} />
        </div>

        <div className="col-span-1 lg:col-span-4">
          <div className="sticky top-6">
            <AiAlertActionCard 
              status={alertData.status} 
              onApprove={handleApprove} 
              onBan={handleBan}
              resolvedAdminNote={alertData.adminNote}
              resolvedModeratorName={alertData.reviewedBy?.fullName || alertData.reviewedBy?.username} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}