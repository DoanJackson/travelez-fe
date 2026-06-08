"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { ModerationHeader } from "@/components/admin/ModerationHeader"
import { ModerationTable } from "@/components/admin/ModerationTable"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  fetchModerationReports,
  fetchModerationSummary,
  type ModerationPage,
  type ModerationSummary,
} from "@/services/moderationService"
import type { ReportStatus, ViolationCategory } from "@/types/admin"

type TabValue = ReportStatus
type CategoryFilter = ViolationCategory | "ALL"

const DEFAULT_PAGE_SIZE = 10

function ModerationQueueFallback() {
  return (
    <>
      <div className="border-b border-slate-200 bg-white px-10 pb-6 pt-10">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-2 h-4 w-36" />
      </div>
      <div className="px-10 py-8 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    </>
  )
}

// Isolated into its own component so useSearchParams() is always
// inside a <Suspense> boundary — required for static pre-rendering.
function ModerationQueueContent() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const tab = (searchParams.get("tab") ?? "pending") as TabValue
  const search = searchParams.get("search") ?? ""
  const category = (searchParams.get("category") ?? "ALL") as CategoryFilter
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"))

  const [data, setData] = useState<ModerationPage>({ reports: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE })
  const [summary, setSummary] = useState<ModerationSummary>({ pendingCount: 0, resolvedCount: 0 })

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([k, v]) => params.set(k, v))
      if ("tab" in updates) params.set("page", "1")
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  useEffect(() => {
    fetchModerationSummary().then(setSummary)
  }, [])

  useEffect(() => {
    fetchModerationReports({
      status: tab,
      category,
      search,
      page,
      pageSize: DEFAULT_PAGE_SIZE,
    }).then(setData)
  }, [tab, category, search, page])

  function handleTabChange(value: string) {
    updateParams({ tab: value })
  }

  function handleSearchChange(value: string) {
    updateParams({ search: value, page: "1" })
  }

  function handleCategoryChange(value: CategoryFilter) {
    updateParams({ category: value, page: "1" })
  }

  function handleReview(id: string) {
    const report = data.reports.find(r => r.id === id) as any
    if (report && report.authorId) {
      router.push(`/admin/moderation/${id}?authorId=${report.authorId}&authorName=${encodeURIComponent(report.author.name)}&status=${report.status}&postStatus=${report.postStatus}`)
    } else {
      router.push(`/admin/moderation/${id}`)
    }
  }

  return (
    <>
      <ModerationHeader
        pendingCount={summary.pendingCount}
        resolvedCount={summary.resolvedCount}
      />

      <div className="px-10 py-8">
        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="pending">
              Pending Reviews ({summary.pendingCount})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved History ({summary.resolvedCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <ModerationTable
              reports={data.reports}
              total={data.total}
              search={search}
              category={category}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onReview={handleReview}
            />
          </TabsContent>

          <TabsContent value="resolved">
            <ModerationTable
              reports={data.reports}
              total={data.total}
              search={search}
              category={category}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onReview={handleReview}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default function ModerationQueuePage() {
  return (
    <Suspense fallback={<ModerationQueueFallback />}>
      <ModerationQueueContent />
    </Suspense>
  )
}
