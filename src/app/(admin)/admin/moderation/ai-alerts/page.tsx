"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Loader2 } from "lucide-react"

import { AiAlertsTable } from "@/components/admin/AiAlertsTable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ModerationAlert } from "@/types/admin"
import { fetchAiAlerts } from "@/services/moderationService"

export default function AiAlertsListPage() {
  const router = useRouter()
  const [alerts, setAlerts] = useState<ModerationAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAlerts = async () => {
      setIsLoading(true);
      const res = await fetchAiAlerts();
      
      if (res && res.data && res.data.content) {
        setAlerts(res.data.content);
      }
      setIsLoading(false);
    };

    loadAlerts();
  }, []);

  const handleReview = (id: number) => {
    router.push(`/admin/moderation/ai-alerts/${id}`)
  }

  const pendingAlerts = alerts.filter(alert => alert.status === "PENDING")
  const resolvedAlerts = alerts.filter(alert => alert.status !== "PENDING")

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-indigo-600" />
            AI Moderation Alerts
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Automated alerts flagged by Gemini Multimodal AI. Review and take action.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-indigo-500" />
          <p>Loading AI Alerts...</p>
        </div>
      ) : (
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-4">
            <TabsTrigger value="pending" className="relative">
              Pending Review
              {pendingAlerts.length > 0 && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-100 text-[11px] font-bold text-pink-600">
                  {pendingAlerts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-0 border-none p-0 outline-none">
            <AiAlertsTable alerts={pendingAlerts} onReview={handleReview} />
          </TabsContent>
          
          <TabsContent value="resolved" className="mt-0 border-none p-0 outline-none">
            <AiAlertsTable alerts={resolvedAlerts} onReview={handleReview} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}