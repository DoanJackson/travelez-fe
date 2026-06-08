// src/app/(admin)/admin/page.tsx
"use client"

import { useEffect, useState } from "react"
import { ActivityTable } from "@/components/admin/ActivityTable"
import { StatCards } from "@/components/admin/StatCards"
import { adminService } from "@/services/adminService"
import type { Activity, StatCard } from "@/types/admin"

export default function AdminPage() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getDashboardActivities("ALL", 0, 10),
        ]);

        if (statsRes?.success && statsRes?.data) {
          const data = statsRes.data;
          setStats([
            {
              label: "Total Users",
              value: data.totalUsers?.count?.toString() || "0",
              subtitle: `${(data.totalUsers?.growthPercent || 0) >= 0 ? "+" : ""}${data.totalUsers?.growthPercent || 0}%`,
              variant: "default",
            },
            {
              label: "New Content",
              value: data.newContent?.count?.toString() || "0",
              subtitle: `${(data.newContent?.growthPercent || 0) >= 0 ? "+" : ""}${data.newContent?.growthPercent || 0}%`,
              variant: "default",
            },
            {
              label: "Pending Reports",
              value: data.pendingReports?.count?.toString() || "0",
              subtitle: "Awaiting admin review", 
              variant: "default",
            },
            {
              label: "Locked Accounts",
              value: data.lockedAccounts?.count?.toString() || "0",
              subtitle: "Due to policy violations",
              variant: "default",
            },
          ]);
        }

        if (activitiesRes?.success && activitiesRes?.data) {
          setActivities(activitiesRes.data.content);
        } else if (activitiesRes?.data?.content) {
          setActivities(activitiesRes.data.content);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) return <div className="p-10">Loading Dashboard Data...</div>;

  return (
    <>
      <div className="border-b border-slate-200 bg-white px-10 pb-6 pt-10">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Admin Console
        </h1>
        <p className="mt-1 text-sm text-slate-500">Last 30 Days</p>
      </div>

      <div className="space-y-8 px-10 py-8">
        <StatCards cards={stats} />
        <ActivityTable activities={activities} />
      </div>
    </>
  )
}