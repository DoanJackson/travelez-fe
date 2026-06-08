"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import {
  Menu,
  Plus,
  User,
  Bookmark,
  LogOut,
  MessageSquare,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AuthCookies } from "@/lib/cookie";
import { useChatStore } from "@/state/chat-store";
import { disconnectGlobalStomp } from "@/hooks/chat/useStompClient";

export function SiteHeader() {
  // // TODO: Replace with real auth state
  // const isAuthenticated = false
  // const user = { name: "Traveler" }

  // const pathname = usePathname()
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // const handleSignOut = () => {
  //   console.log("Sign out TODO: implement real logout")
  //   // TODO: Implement real sign out
  // }

  const unreadConversationIds = useChatStore((state) => state.unreadConversationIds);
  const unreadCount = unreadConversationIds.length;

  // Navigation items
  const navItems = [
    { label: "My Trips", href: "/my-itineraries" },
    { label: "Discover", href: "/discover" },
    { label: "Community", href: "/community" },
    { label: "Review", href: "/reviews" },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/my-itineraries" && pathname === "/my-itineraries")
      return true;
    if (href !== "/my-itineraries" && pathname?.startsWith(href)) return true;
    return false;
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; avatarUrl: string | null }>({ name: "Traveler", avatarUrl: null });
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isTransparentRoute = pathname === "/";

  // 2. Function to check localStorage and update auth state
  const checkAuthState = () => {
    const storedUser = localStorage.getItem("TRAVELEZ_CURRENT_USER");

    if (storedUser) {
      setIsAuthenticated(true);
      const userData = JSON.parse(storedUser);
      setUser({
        name: userData.fullName || userData.name || "Traveler",
        avatarUrl: userData.avatarUrl ?? null,
      });
    } else {
      setIsAuthenticated(false);
      setUser({ name: "Traveler", avatarUrl: null });
    }
  };

  // 3. useEffect to check auth state on mount and listen for auth-change events
  useEffect(() => {
    setIsMounted(true);
    // Check auth state on mount
    checkAuthState();

    // Register event listener for auth-change events
    window.addEventListener("auth-change", checkAuthState);

    // Cleanup: remove event listener to prevent memory leaks
    return () => {
      window.removeEventListener("auth-change", checkAuthState);
    };
  }, []); // Empty dependency array - only run on mount/unmount

  // Scroll listener for transparent-header mode
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = () => {
    AuthCookies.clear();
    localStorage.removeItem("TRAVELEZ_CURRENT_USER");

    // Dispatch custom event to notify other components of auth state change
    window.dispatchEvent(new Event("auth-change"));

    setIsAuthenticated(false);
    setUser({ name: "Traveler", avatarUrl: null });

    window.location.href = "/";

    const handleSignOut = () => {
      AuthCookies.clear();
      localStorage.removeItem("TRAVELEZ_CURRENT_USER");
      disconnectGlobalStomp();
    };
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isTransparentRoute && !isScrolled
          ? "bg-transparent border-b border-transparent"
          : "bg-white border-b border-slate-200 backdrop-blur-sm",
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "text-2xl font-bold transition-colors",
              isTransparentRoute && !isScrolled
                ? "text-white hover:text-white/80"
                : "text-gray-900 hover:text-gray-700",
            )}
          >
            TravelEZ
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors relative py-1",
                  isTransparentRoute && !isScrolled
                    ? isActiveRoute(item.href)
                      ? "text-white"
                      : "text-white/80 hover:text-white"
                    : isActiveRoute(item.href)
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {item.label}
                {isActiveRoute(item.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions - Right */}
          <div className="hidden lg:flex items-center gap-3">
            {isMounted && isAuthenticated ? (
              <>
                {/* Plan trip CTA */}
                <Button asChild size="default">
                  <Link href="/planning">
                    <Plus className="h-4 w-4 mr-2" />
                    Plan trip
                  </Link>
                </Button>

                {/* Messages */}
                <Link
                  href="/messages"
                  aria-label="Messages"
                  className="relative flex items-center justify-center h-9 w-9 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Notifications */}
                <Link
                  href="/notifications"
                  aria-label="Notifications"
                  className="relative flex items-center justify-center h-9 w-9 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                </Link>

                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      aria-label="Account menu"
                    >
                      <Avatar className="h-9 w-9">
                        {user.avatarUrl && (
                          <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
                        )}
                        <AvatarFallback className="bg-[#ec4899] text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-semibold">{user.name}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/saved" className="cursor-pointer">
                        <Bookmark className="mr-2 h-4 w-4" />
                        Saved
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Guest actions */}
                <Button asChild size="default">
                  <Link href="/planning">
                    <Plus className="h-4 w-4 mr-2" />
                    Plan trip
                  </Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/register">Register</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Plan trip icon button */}
            <Button variant="ghost" size="icon" asChild aria-label="Plan trip">
              <Link href="/planning">
                <Plus className="h-5 w-5" />
              </Link>
            </Button>

            {/* Mobile menu */}
            {isMounted && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription className="sr-only">Site navigation menu</SheetDescription>
                  </SheetHeader>

                  <div className="flex flex-col gap-4 mt-8">
                    {/* Navigation links */}
                    <div className="space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                            isActiveRoute(item.href)
                              ? "bg-primary/10 text-primary"
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    <Separator />

                    {isAuthenticated ? (
                      <>
                        {/* Logged-in mobile menu */}
                        <div className="space-y-2">
                          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Account
                          </p>
                          <Link
                            href="/profile"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <User className="h-4 w-4" />
                            Profile
                          </Link>
                          <Link
                            href="/saved"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Bookmark className="h-4 w-4" />
                            Saved
                          </Link>
                          <Link
                            href="/messages"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <MessageSquare className="h-5 w-5" />
                            {unreadCount > 0 && (
                              <span className="absolute top-0.5 right-0.5 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
                                {unreadCount > 99 ? '99+' : unreadCount}
                              </span>
                            )}
                          </Link>
                          <Link
                            href="/notifications"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Bell className="h-4 w-4" />
                            Notifications
                            <span className="ml-auto flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                            </span>
                          </Link>
                          <button
                            onClick={() => {
                              handleSignOut();
                              setMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Guest mobile menu */}
                        <div className="space-y-2 pt-2">
                          <Button asChild className="w-full" size="lg">
                            <Link
                              href="/login"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Login
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="secondary"
                            className="w-full"
                            size="lg"
                          >
                            <Link
                              href="/register"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Register
                            </Link>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            )}
            {!isMounted && (
               <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
               </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
