import {
  ArrowUpRight,
  BarChart3,
  DollarSign,
  MapPin,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const MARKET_STATS = [
  {
    label: "Peak Season Demand",
    value: "+34%",
    sub: "Jun–Aug vs last year",
    Icon: TrendingUp,
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    label: "Top Destination",
    value: "Da Nang",
    sub: "2,840 active listings",
    Icon: MapPin,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Avg. Booking Value",
    value: "$412",
    sub: "+8% vs Q1",
    Icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-50",
  },
] as const;

export default function MarketTrendPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Market Trends
        </h1>
        <p className="mt-1 text-sm text-slate-500">B2B Market Intelligence</p>
      </div>

      {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {MARKET_STATS.map((stat) => (
          <Card key={stat.label} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <div className={cn("rounded-lg p-2", stat.bg)}>
                <stat.Icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <p className={cn("text-3xl font-black tracking-tight", stat.color)}>
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div> */}

      <Card className="shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-50">
            <BarChart3 className="h-8 w-8 text-pink-600" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-slate-900">
              Market Trends Report
            </h2>
            <p className="max-w-xs text-sm text-slate-500">
              View destination trends, popular services, and travel statistics
              to inform your business decisions.
            </p>
          </div>
          <Button asChild className="mt-2 w-full max-w-xs">
            <Link
              href="https://datastudio.google.com/u/0/reporting/275f3bb3-074a-42c8-abfb-90009b850303/page/y4MyF"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Report
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-slate-400">
        Last updated: Oct 24, 2023 • B2B Market Intelligence
      </p>
    </div>
  );
}
