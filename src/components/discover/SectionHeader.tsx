import { LucideIcon } from "lucide-react"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
}

export function SectionHeader({ title, subtitle, icon: Icon }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        {Icon && <Icon className="h-8 w-8 text-pink-600" />}
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-600">
          {subtitle}
        </p>
      )}
    </div>
  )
}
