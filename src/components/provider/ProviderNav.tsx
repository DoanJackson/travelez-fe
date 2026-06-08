"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const NAV_ITEMS = [
  { label: "Market Trends", href: "/provider/market-trend", icon: TrendingUp },
  { label: "AI Assist", href: "/provider/ai-assist", icon: Bot },
]

export function ProviderNav() {
  const pathname = usePathname()

  return (
    <Card className="shadow-sm">
      <CardHeader className="px-4 pb-2 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Provider Tools
        </p>
      </CardHeader>
      <CardContent className="px-2 pb-3">
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-pink-50 text-pink-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  pathname === href ? "text-pink-500" : "text-slate-400"
                )}
              />
              {label}
            </Link>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}
