"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";

import { UserDetailActions } from "@/components/admin/UserDetailActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminUserDetail } from "@/hooks/useAdminUsers";
import type { UserDetail } from "@/types/admin";

const ROLE_BADGE: Record<UserDetail["role"], string> = {
  TRAVELER: "bg-slate-50 text-slate-600 border-slate-200",
};

const STATUS_BADGE: Record<UserDetail["status"], string> = {
  ACTIVE: "bg-green-50 text-green-700 border-green-200",
  BANNED: "bg-red-50 text-red-700 border-red-200",
};

function safeFmt(iso: string | null | undefined, fmt = "MMM d, yyyy"): string {
  if (!iso) return "—";
  const d = parseISO(iso);
  return isValid(d) ? format(d, fmt) : "—";
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-slate-900 mt-0.5 break-all">{value}</p>
    </div>
  );
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const { data: user, isLoading, isError } = useAdminUserDetail(userId);

  const backButton = (
    <Button variant="ghost" size="sm" asChild>
      <Link href="/admin/users">
        <ChevronLeft className="h-4 w-4" />
        Back to Users
      </Link>
    </Button>
  );

  if (isLoading) {
    return (
      <div className="px-10 py-8 space-y-6">
        <div className="flex items-center gap-4">{backButton}</div>
        <div className="flex items-center justify-center h-48 text-sm text-slate-400 gap-2">
          <Loader2 className="size-4 animate-spin" />
          Loading user…
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="px-10 py-8 space-y-6">
        <div className="flex items-center gap-4">{backButton}</div>
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-2">
            <p className="text-lg font-semibold text-slate-900">User not found</p>
            <p className="text-sm text-slate-500">No user with ID #{id} exists in the system.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials = (user.fullName ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="px-10 py-8 space-y-6">
      {/* Page title row */}
      <div className="flex items-center gap-4">
        {backButton}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Detail</h1>
      </div>

      {/* Banned status banner */}
      {user.status === "BANNED" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <span className="font-medium">This account is banned.</span>{" "}
          Reason:{" "}
          <span className="italic text-red-500">Not available in current system logs.</span>
        </div>
      )}

      {/* Identity card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <Avatar className="size-[88px] shrink-0">
              {user.avatar?.url && (
                <AvatarImage src={user.avatar.url} alt={user.fullName} />
              )}
              <AvatarFallback className="bg-pink-100 text-pink-600 text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1.5 min-w-0">
              <h2 className="text-xl font-bold text-slate-900">{user.fullName ?? "—"}</h2>
              <p className="text-sm text-slate-500">@{user.username ?? "—"}</p>
              <p className="text-sm text-slate-500">{user.email ?? "—"}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {user.role && (
                  <Badge variant="outline" className={ROLE_BADGE[user.role]}>
                    {(user.role ?? "").charAt(0) + (user.role ?? "").slice(1).toLowerCase()}
                  </Badge>
                )}
                {user.status && (
                  <Badge variant="outline" className={STATUS_BADGE[user.status]}>
                    {(user.status ?? "").charAt(0) + (user.status ?? "").slice(1).toLowerCase()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Details card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-5">
            <InfoCell label="Full Name" value={user.fullName ?? "—"} />
            <InfoCell label="Username" value={user.username ? `@${user.username}` : "—"} />
            <InfoCell label="Email" value={user.email ?? "—"} />
            <InfoCell label="Member Since" value={safeFmt(user.createdAt)} />
            <InfoCell
              label="Gender"
              value={user.gender ? (user.gender.charAt(0) + user.gender.slice(1).toLowerCase()) : "—"}
            />
            <InfoCell label="Date of Birth" value={safeFmt(user.dob, "MMMM d, yyyy")} />
            <InfoCell label="Auth Provider" value={user.authProvider ?? "—"} />
            <InfoCell label="Last Updated" value={safeFmt(user.updatedAt)} />
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions — passes minimal props to avoid exposing excluded fields */}
      <UserDetailActions userId={userId} initialStatus={user.status} />
    </div>
  );
}
