"use client"

import { useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import {
  CheckCircle2,
  Clock,
  FileText,
  Lightbulb,
  Paperclip,
  Send,
  Sparkles,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  improveItinerary,
  getEnhancementHistoryDetail,
  getEnhancementHistories,
  deleteEnhancementHistory,
} from "@/services/providerServices"
import type { AnalysisResult, EnhancementHistorySummary } from "@/types/provider"

function AnalysisTabs({ result }: { result: AnalysisResult }) {
  return (
    <Tabs defaultValue="pros">
      <TabsList className="mb-4">
        <TabsTrigger value="pros">Pros ({result.itineraryPros.length})</TabsTrigger>
        <TabsTrigger value="gaps">Gaps ({result.experienceGaps.length})</TabsTrigger>
        <TabsTrigger value="enhancements">
          Enhancements ({result.actionableEnhancements.length})
        </TabsTrigger>
        <TabsTrigger value="suggested">
          Suggested ({result.suggestedAdditions.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pros">
        {result.itineraryPros.length === 0 ? (
          <p className="text-sm italic text-slate-400">No highlights found.</p>
        ) : (
          <ul className="space-y-2">
            {result.itineraryPros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-500" />
                {pro}
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="gaps">
        {result.experienceGaps.length === 0 ? (
          <p className="text-sm italic text-slate-400">No gaps identified.</p>
        ) : (
          <ul className="space-y-2">
            {result.experienceGaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-500" />
                {gap}
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="enhancements">
        {result.actionableEnhancements.length === 0 ? (
          <p className="text-sm italic text-slate-400">No enhancements suggested.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">POI</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">Insight Type</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">Evidence</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide">Advice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.actionableEnhancements.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-slate-900">{item.poiName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        {item.insightType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{item.evidence}</TableCell>
                    <TableCell className="text-sm text-slate-700">{item.advice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>

      <TabsContent value="suggested">
        {result.suggestedAdditions.length === 0 ? (
          <p className="text-sm italic text-slate-400">No additions suggested.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {result.suggestedAdditions.map((s, i) => (
              <Badge
                key={i}
                variant="outline"
                className="bg-pink-50 text-pink-700 border-pink-200 text-sm py-1 px-3"
              >
                {s.proposedPoi}
              </Badge>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

export default function AiAssistPage() {
  const [prompt, setPrompt] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const [liveResult, setLiveResult] = useState<AnalysisResult | null>(null)
  const [resultLoading, setResultLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [histories, setHistories] = useState<EnhancementHistorySummary[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [expandedDetails, setExpandedDetails] = useState<Record<number, AnalysisResult>>({})
  const [fetchingDetailIds, setFetchingDetailIds] = useState<Record<number, boolean>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getEnhancementHistories(0, 20)
      .then((res) => setHistories(res.data.content))
      .catch(() => {})
      .finally(() => setHistoryLoading(false))
  }, [])

  function acceptFile(file: File) {
    setSelectedFile(file)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) acceptFile(file)
  }

  async function handleSubmit() {
    if (!selectedFile || !prompt.trim() || resultLoading) return
    setResultLoading(true)
    setLiveResult(null)
    setSubmitError(null)
    try {
      const postRes = await improveItinerary(selectedFile, prompt)
      const newId = postRes.data
      const getRes = await getEnhancementHistoryDetail(newId)
      setLiveResult(getRes.data.analysisResult)
      // Prepend the new summary to the history list
      setHistories((prev) => [
        {
          id: newId,
          originalFileName: selectedFile.name,
          providerPrompt: prompt,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ])
      // Cache the result so the accordion row renders instantly if expanded
      setExpandedDetails((prev) => ({ ...prev, [newId]: getRes.data.analysisResult }))
    } catch {
      setSubmitError("AI analysis failed. Please try again.")
    } finally {
      setResultLoading(false)
    }
  }

  async function handleAccordionChange(value: string) {
    if (!value) return
    const id = Number(value)
    if (expandedDetails[id] || fetchingDetailIds[id]) return
    setFetchingDetailIds((prev) => ({ ...prev, [id]: true }))
    try {
      const res = await getEnhancementHistoryDetail(id)
      setExpandedDetails((prev) => ({ ...prev, [id]: res.data.analysisResult }))
    } catch {
      // silently fail; user can collapse and re-expand to retry
    } finally {
      setFetchingDetailIds((prev) => ({ ...prev, [id]: false }))
    }
  }

  async function handleDelete(e: React.MouseEvent, id: number) {
    e.stopPropagation()
    await deleteEnhancementHistory(id).catch(() => {})
    setHistories((prev) => prev.filter((h) => h.id !== id))
    setExpandedDetails((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Assist</h1>
        <p className="mt-1 text-sm text-slate-500">Powered by TravelEZ Intelligence</p>
      </div>

      {/* Input Card */}
      <Card className="shadow-sm">
        <CardContent className="space-y-4 pt-6">
          {/* File drop zone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Itinerary file <span className="text-pink-500">*</span>
            </label>

            {selectedFile ? (
              <div className="flex items-center gap-3 rounded-lg border border-pink-200 bg-pink-50 px-4 py-2.5">
                <FileText className="size-4 shrink-0 text-pink-500" />
                <span className="flex-1 truncate text-sm font-medium text-slate-700">
                  {selectedFile.name}
                </span>
                <button
                  onClick={() => setSelectedFile(null)}
                  aria-label="Remove file"
                  className="rounded-full p-0.5 text-slate-400 hover:text-red-500"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed py-5 transition-colors",
                  isDragOver
                    ? "border-pink-400 bg-pink-50"
                    : "border-slate-200 hover:border-pink-300 hover:bg-pink-50/40"
                )}
              >
                <Paperclip className="size-5 text-slate-400" />
                <p className="text-sm text-slate-500">Click to upload or drag &amp; drop</p>
                <p className="text-xs text-slate-400">PDF, DOCX, TXT</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) acceptFile(file)
                e.target.value = ""
              }}
            />
          </div>

          {/* Prompt textarea */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Your instructions <span className="text-pink-500">*</span>
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to improve, e.g. 'Optimize for senior travelers with mobility concerns and add local food experiences.'"
              rows={4}
              className="resize-none focus-visible:ring-pink-300"
            />
          </div>

          {submitError && (
            <p className="text-sm text-red-500">{submitError}</p>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || !prompt.trim() || resultLoading}
              className="gap-2"
            >
              {resultLoading ? "Analyzing…" : "Analyze Itinerary"}
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Analysis Result Panel */}
      <div className="rounded-xl border border-slate-200 border-l-4 border-l-pink-400 bg-white shadow-sm">
        <p className="px-6 pt-5 pb-0 text-xs font-semibold uppercase tracking-wider text-pink-500">
          AI Analysis
        </p>

        {resultLoading ? (
          <div className="space-y-3 px-6 py-5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : liveResult ? (
          <div className="px-6 pb-6 pt-4">
            <AnalysisTabs result={liveResult} />
          </div>
        ) : (
          <p className="px-6 py-5 text-sm italic text-slate-400">
            Upload an itinerary file and enter instructions, then click Analyze to see structured AI insights here.
          </p>
        )}
      </div>

      {/* Recent Requests Accordion */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
          <Clock className="size-4 text-slate-400" />
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Recent Requests
          </p>
        </div>

        {historyLoading ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-4">
                <Skeleton className="size-8 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-1/3" />
                  <Skeleton className="h-3 w-1/5" />
                </div>
              </div>
            ))}
          </div>
        ) : histories.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm italic text-slate-400">
            No requests yet. Submit an itinerary above to get started.
          </p>
        ) : (
          <Accordion type="single" collapsible onValueChange={handleAccordionChange}>
            {histories.map((item) => (
              <AccordionItem key={item.id} value={String(item.id)} className="px-1">
                <div className="relative flex items-center w-full">
                  <AccordionTrigger className="w-full pr-14 px-4 hover:no-underline">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-pink-50">
                        <FileText className="size-4 text-pink-500" />
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {item.originalFileName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {format(new Date(item.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(e, item.id)
                    }}
                    aria-label="Delete history"
                    className="absolute right-12 z-10 shrink-0 rounded-md p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <AccordionContent className="px-4 pb-5">
                  {fetchingDetailIds[item.id] ? (
                    <div className="space-y-2 pt-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ) : expandedDetails[item.id] ? (
                    <AnalysisTabs result={expandedDetails[item.id]} />
                  ) : (
                    <p className="text-sm italic text-slate-400">
                      Failed to load analysis. Collapse and expand to retry.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Bottom tips row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-pink-100 bg-pink-50 shadow-sm md:col-span-2">
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="shrink-0 rounded-xl bg-pink-500 p-3 text-white">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h4 className="mb-1 font-bold text-slate-800">
                Pro-Tip for Optimizing Itineraries
              </h4>
              <p className="text-sm text-slate-600">
                Include specific traveler demographics (e.g., &ldquo;seniors with mobility
                concerns&rdquo; or &ldquo;foodie couples&rdquo;) for more tailored suggestions
                from the AI engine.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center gap-2 pt-6 text-center">
            <Sparkles className="h-12 w-12 text-pink-500" />
            <h4 className="font-bold text-slate-800">Premium Insights</h4>
            <p className="text-xs text-slate-500">
              Unlock trend forecasting and localized risk assessments for every route.
            </p>
            <Button variant="link" className="mt-1 text-pink-600">
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
