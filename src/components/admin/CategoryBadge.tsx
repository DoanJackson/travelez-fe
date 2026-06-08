import { Badge } from "@/components/ui/badge"
import type { ViolationCategory } from "@/types/admin"

interface CategoryBadgeConfig {
  variant: "destructive" | "warning" | "secondary" | "outline"
  label: string
}

const CATEGORY_BADGE_MAP: Record<ViolationCategory, CategoryBadgeConfig> = {
  spam: { variant: "destructive", label: "Spam" },
  fraud: { variant: "warning", label: "Fraud" },
  hate_speech: { variant: "destructive", label: "Hate Speech" },
  inappropriate: { variant: "secondary", label: "Inappropriate" },
  misinformation: { variant: "outline", label: "Misinformation" },
}

interface CategoryBadgeProps {
  category: ViolationCategory
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const { variant, label } = CATEGORY_BADGE_MAP[category]
  return <Badge variant={variant}>{label}</Badge>
}
