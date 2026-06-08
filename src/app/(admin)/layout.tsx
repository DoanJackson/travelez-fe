import type { Metadata } from "next"

import { AdminSidebar } from "@/components/admin/AdminSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "Admin Dashboard - TravelEZ",
}

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset className="bg-slate-50">
        <header className="flex h-14 items-center border-b border-slate-200 bg-white px-4">
          <SidebarTrigger className="text-slate-500 hover:text-slate-900" />
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
