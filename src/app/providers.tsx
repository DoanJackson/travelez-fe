"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthCookies } from "@/lib/cookie";

const GlobalNotificationListener = dynamic(
  () =>
    import("@/components/shared/GlobalNotificationListener").then((m) => ({
      default: m.GlobalNotificationListener,
    })),
  { ssr: false },
);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
          },
        },
      }),
  );

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    setIsAuthenticated(!!AuthCookies.getUserId());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {isAuthenticated && <GlobalNotificationListener />}
      {children}
    </QueryClientProvider>
  );
}
