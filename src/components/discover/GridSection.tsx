import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GridSectionProps {
  children: ReactNode
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  gap?: number
  className?: string
}

export function GridSection({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 6,
  className 
}: GridSectionProps) {
  const gridClasses = cn(
    "grid",
    `gap-${gap}`,
    `grid-cols-${columns.mobile}`,
    columns.tablet && `sm:grid-cols-${columns.tablet}`,
    columns.desktop && `lg:grid-cols-${columns.desktop}`,
    className
  )

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}
