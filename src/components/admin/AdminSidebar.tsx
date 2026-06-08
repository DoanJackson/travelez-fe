"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldAlert,
  UserCog,
  Users,
  Shield,
  Gavel,
  Database,
  ChevronDown,
  ChevronRight,
  Flag,
  Bot,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { AuthCookies } from "@/lib/cookie"
import { toast } from "sonner"
import { disconnectGlobalStomp } from "@/hooks/chat/useStompClient"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  // { label: "Roles & Permissions", href: "/admin/roles", icon: Shield },
  // { label: "Data Management", href: "/admin/data", icon: Database },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const isModerationActive = pathname.startsWith('/admin/moderation')
  const [isModerationOpen, setIsModerationOpen] = useState(isModerationActive)

  const handleLogout = () => {
    AuthCookies.clear()
    disconnectGlobalStomp() 
    
    window.dispatchEvent(new Event("auth-change"))

    toast.success("Logged out of the administration system.", {
      className: "dark:bg-slate-900 dark:text-white dark:border-slate-800",
    })

    router.push("/system") 
    router.refresh()
  }

  return (
    <Sidebar>
      <SidebarHeader className="px-6 py-5">
        <span className="text-2xl font-black tracking-tighter text-pink-600">
          TravelEZ
        </span>
        <p className="text-xs font-medium text-sidebar-foreground/50">
          Admin Console
        </p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>

              {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild isActive={pathname === href}>
                    <Link href={href}>
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setIsModerationOpen(!isModerationOpen)}
                  isActive={isModerationActive}
                  className="justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Gavel className="h-4 w-4" />
                    <span>Content Moderation</span>
                  </div>
                  {isModerationOpen ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  )}
                </SidebarMenuButton>

                {isModerationOpen && (
                  <div className="mt-1 flex flex-col gap-1 pl-4">
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === "/admin/moderation" ||
                        (pathname.startsWith("/admin/moderation/") &&
                          !pathname.includes("ai-alerts"))
                      }
                      className="h-8 text-sm text-slate-600"
                    >
                      <Link href="/admin/moderation">
                        <Flag className="h-3.5 w-3.5 mr-1" />
                        <span>User Reports</span>
                      </Link>
                    </SidebarMenuButton>

                    <SidebarMenuButton
                      asChild
                      isActive={pathname.includes("/admin/moderation/ai-alerts")}
                      className="h-8 text-sm text-slate-600"
                    >
                      <Link href="/admin/moderation/ai-alerts">
                        <Bot className="h-3.5 w-3.5 mr-1" />
                        <span>AI Alerts</span>
                      </Link>
                    </SidebarMenuButton>
                  </div>
                )}
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="hover:bg-red-50 hover:text-red-600 data-[active=true]:bg-red-50 data-[active=true]:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}