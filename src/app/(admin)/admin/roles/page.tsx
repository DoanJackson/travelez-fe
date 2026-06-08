import { format } from "date-fns";
import { UserPlus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_ADMIN_USERS } from "@/lib/mock-admin";

const staff = MOCK_ADMIN_USERS.filter((u) => u.role === "ADMIN");

export default function RolesPage() {
  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Roles &amp; Staff
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage internal administrators and moderators.
          </p>
        </div>
        <Button className="gap-2 shrink-0" disabled>
          <UserPlus className="size-4" />
          Invite Staff Member
        </Button>
      </div>

      {/* Staff table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/60">
          <span className="text-xs text-slate-500 font-medium">
            {staff.length} admin account{staff.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                {["#ID", "Staff Member", "Username", "Member Since"].map((h) => (
                  <TableHead
                    key={h}
                    className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((u) => {
                const initials = u.fullName
                  .trim()
                  .split(/\s+/)
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();
                return (
                  <TableRow key={u.id}>
                    <TableCell className="px-4 py-3.5">
                      <span className="font-mono text-sm text-slate-500">
                        #{u.id}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="size-8 shrink-0">
                          {u.avatar?.url && (
                            <AvatarImage src={u.avatar.url} alt={u.fullName} />
                          )}
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {u.fullName}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <span className="text-sm text-slate-600">
                        @{u.username}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <span className="text-sm text-slate-500 whitespace-nowrap">
                        {format(new Date(u.createdAt), "MMM d, yyyy")}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Empty state — only shown when there are no staff accounts */}
      {staff.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-blue-50">
              <UserPlus className="size-5 text-blue-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                No staff accounts yet
              </p>
              <p className="text-xs text-slate-500 max-w-xs">
                Full staff onboarding will be available once the backend roles
                API is connected.
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
