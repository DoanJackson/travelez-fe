import type { Metadata } from "next"

import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { ProviderNav } from "@/components/provider/ProviderNav"

export const metadata: Metadata = {
  title: "Provider Portal - TravelEZ",
}

export default function ProviderGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row">
            <aside className="w-full shrink-0 md:w-56">
              <ProviderNav />
            </aside>
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
