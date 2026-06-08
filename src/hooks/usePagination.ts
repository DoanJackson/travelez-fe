"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { buildPageItems, type PageItem } from "@/lib/pagination"

interface UsePaginationReturn {
  page: number
  totalPages: number
  pageItems: PageItem[]
  setPage: (page: number) => void
}

export function usePagination(total: number, pageSize: number): UsePaginationReturn {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const page = Math.max(1, Number(searchParams.get("page") ?? "1"))
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageItems = buildPageItems(safePage, totalPages)

  const setPage = useCallback(
    (next: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", String(next))
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  return { page: safePage, totalPages, pageItems, setPage }
}
