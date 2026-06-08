import { AuthCookies } from "@/lib/cookie"
import type {
  ModerationReport,
  ModerationReportDetail,
  ReportStatus,
  ResolutionAction,
  ViolationCategory,
} from "@/types/admin"
import { API_ENDPOINTS } from "@/constants/api"

export interface ModerationFilters {
  status?: ReportStatus
  category?: ViolationCategory | "ALL"
  search?: string
  page?: number
  pageSize?: number
}

export interface ModerationPage {
  reports: ModerationReport[]
  total: number
  page: number
  pageSize: number
}

export interface ModerationSummary {
  pendingCount: number
  resolvedCount: number
}

export async function fetchModerationReports(
  filters: ModerationFilters = {}
): Promise<ModerationPage> {
  const { status, page = 1, pageSize = 10 } = filters
  const showAll = status === "resolved" 

  const params = new URLSearchParams({
    showAll: String(showAll),
    page: String(page - 1),
    size: String(pageSize),
    sort: "latestReportedAt,desc"
  })
  
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/reports/reported-items?${params.toString()}`
  
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${AuthCookies.getToken()}` },
    cache: "no-store", 
  })

  if (!response.ok) throw new Error("Failed to fetch reports")
  
  const res = await response.json()
  let rawContent = res.data.content || []
  let totalElements = res.data.totalElements

  if (status === "pending") {
    rawContent = rawContent.filter((item: any) => item.pendingReportCount > 0)
  } else if (status === "resolved") {
    rawContent = rawContent.filter((item: any) => item.pendingReportCount === 0)
    

    try {
      const pendingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/reports/reported-items?showAll=false&page=0&size=1`, {
        headers: { Authorization: `Bearer ${AuthCookies.getToken()}` },
        cache: "no-store"
      })
      const pendingData = await pendingRes.json()
      const pendingCount = pendingData.data?.totalElements || 0
      totalElements = Math.max(0, totalElements - pendingCount)
    } catch (e) {
      console.error("Lỗi lấy pending count cho phân trang", e)
    }
  }

  const reports: ModerationReport[] = rawContent.map((item: any) => ({
    id: item.postId.toString(),
    date: item.latestReportedAt || item.firstReportedAt,
    authorId: item.authorId,
    author: {
      name: item.authorName || "Unknown",
      avatarUrl: undefined, 
    },
    category: "spam" as ViolationCategory, 
    reportCount: item.reportCount,
    status: item.pendingReportCount === 0 ? "resolved" : "pending",
    postStatus: item.postStatus
  }))

  return { reports, total: totalElements, page, pageSize }
}

export async function fetchModerationSummary(): Promise<ModerationSummary> {
  const [resPending, resAll] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/reports/reported-items?showAll=false&page=0&size=1`, {
      headers: { Authorization: `Bearer ${AuthCookies.getToken()}` },
      cache: "no-store"
    }).then(r => r.json()),
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/reports/reported-items?showAll=true&page=0&size=1`, {
      headers: { Authorization: `Bearer ${AuthCookies.getToken()}` },
      cache: "no-store"
    }).then(r => r.json())
  ])

  const pendingCount = resPending?.data?.totalElements || 0
  const allCount = resAll?.data?.totalElements || 0

  return { 
    pendingCount: pendingCount, 
    resolvedCount: Math.max(0, allCount - pendingCount) 
  }
}

export async function fetchModerationReportById(
  id: string,
  passedAuthorId?: string | null,
  passedAuthorName?: string | null,
  passedStatus?: "pending" | "resolved",
  passedPostStatus?: string | null
): Promise<ModerationReportDetail | null> {
  const statusQuery = passedStatus === "resolved" ? "" : "status=PENDING&"
  const urlReport = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/reports/posts/${id}?${statusQuery}page=0&size=50`
  const urlPost = `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.POSTS.GET_POST_DETAIL(Number(id))}`

  const [reportResponse, postResponse] = await Promise.allSettled([
    fetch(urlReport, { headers: { Authorization: `Bearer ${AuthCookies.getToken()}` } }),
    fetch(urlPost, { headers: { Authorization: `Bearer ${AuthCookies.getToken()}` } }),
  ])

  if (reportResponse.status === "rejected" || !reportResponse.value.ok) return null
  
  const resReport = await reportResponse.value.json()
  const dataReport = resReport.data

  let postContent = "Nội dung bài viết không tồn tại hoặc đã bị xoá ẩn (Banned)."
  let postImages: string[] = []
  let postStatus = passedPostStatus || "UNKNOWN"
  
  let authorId = passedAuthorId || null
  let authorName = passedAuthorName || "Unknown user"
  let authorAvatar = undefined
  let authorSince = "Unknown"

  if (postResponse.status === "fulfilled" && postResponse.value.ok) {
    const resPost = await postResponse.value.json()
    postContent = resPost.data?.content || postContent
    postImages = resPost.data?.images?.map((img: any) => img.url || img) || []

    if (postStatus === "UNKNOWN") {
       postStatus = resPost.data?.status || resPost.data?.postStatus || "PUBLISHED"
    }
    
    if (!authorId) {
       authorId = resPost.data?.author?.userId || resPost.data?.userId || resPost.data?.authorId || resPost.data?.user?.id
    }
  }

  if (authorId) {
    try {
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.USER.GET_USER_BY_ID(Number(authorId))}`, 
        { headers: { Authorization: `Bearer ${AuthCookies.getToken()}` } }
      )
      if (userRes.ok) {
        const userData = await userRes.json()
        const user = userData.data
        authorName = user.fullName || user.username || authorName
        authorAvatar = user.avatar?.url || user.avatar
        
        if (user.createdAt || user.dob) {
           authorSince = new Date(user.createdAt || user.dob).getFullYear().toString()
        }
      }
    } catch (e) {
      console.error("Failed to fetch user data for report", e)
    }
  }

  const evidences = (dataReport.reports?.content || []).map((r: any) => ({
     reporterCount: 1,
     violationType: r.reason || "OTHER",
     reasonDetail: r.reasonDetail,
     reporter: r.reporter
  }))

  return {
    id,
    date: new Date().toISOString(),
    author: { name: authorName, avatarUrl: authorAvatar },
    category: "spam",
    reportCount: dataReport.totalReports,
    status: passedStatus || "pending",
    content: postContent,
    images: postImages,
    authorSince,
    postStatus: postStatus,
    aiViolations: [], 
    evidence: evidences,
  }
}

export async function resolveReport(
  id: string,
  action: ResolutionAction | "unban",
  reason?: string
): Promise<void> {
  let url = ""
  let method = ""
  let body = {}

  if (action === "approve") {
    url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/reports/reject`
    method = "POST"
    body = { targetType: "POST", targetId: Number(id) }
  } else if (action === "hide" || action === "delete_penalize") {
    url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts/${id}/ban`
    method = "POST"
    body = { reason: reason || "Moderator removed due to policy violation." } 
  } else if (action === "unban") {
    url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts/${id}/unban`
    method = "POST"
    body = {}
  } else {
    return
  }

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AuthCookies.getToken()}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Failed to resolve report with action: ${action}`)
  }
}

export async function fetchAiAlerts(page = 0, size = 50) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort: "createdAt,desc"
    });
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/moderation/alerts?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AuthCookies.getToken()}`,
      },
    });

    if (!response.ok) {
      console.warn(`[ModerationService] Failed to fetch AI alerts: ${response.status}`);
      return { data: { content: [] } };
    }
    return await response.json();
  } catch (error) {
    console.error("[ModerationService] Network error fetching AI alerts:", error);
    return { data: { content: [] } };
  }
}

export async function fetchAiAlertById(id: string | number) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/moderation/alerts/${id}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AuthCookies.getToken()}`,
      },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("[ModerationService] Error fetching alert detail:", error);
    return null;
  }
}

export async function reviewAiAlert(id: string | number, action: "approve" | "ban", adminNote: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/moderation/alerts/${id}/${action}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AuthCookies.getToken()}`,
    },
    body: JSON.stringify({ adminNote }),
  });

  if (!response.ok) {
    throw new Error(`Failed to ${action} alert`);
  }
  return await response.json();
}