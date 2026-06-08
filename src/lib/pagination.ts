export type PageItem = number | "ellipsis"

/**
 * Builds a compact page list with ellipsis for gaps larger than 1.
 * Always includes page 1, the last page, and the current page ±1.
 * A gap of exactly 1 inserts the missing page directly instead of an ellipsis.
 */
export function buildPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pageSet = new Set<number>([1, totalPages])
  for (let p = Math.max(1, currentPage - 1); p <= Math.min(totalPages, currentPage + 1); p++) {
    pageSet.add(p)
  }

  const sorted = [...pageSet].sort((a, b) => a - b)
  const result: PageItem[] = []
  let prev = 0

  for (const page of sorted) {
    const gap = page - prev
    if (gap > 2) {
      result.push("ellipsis")
    } else if (gap === 2) {
      result.push(prev + 1)
    }
    result.push(page)
    prev = page
  }

  return result
}
