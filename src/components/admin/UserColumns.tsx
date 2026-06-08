"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowUpDown,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminUser } from "@/types/admin";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData> {
    onEditRole: (user: AdminUser) => void;
    onToggleStatus: (user: AdminUser) => void;
  }
}

const ROLE_BADGE: Record<AdminUser["role"], string> = {
  ADMIN: "bg-blue-50 text-blue-700 border-blue-200",
  PROVIDER: "bg-violet-50 text-violet-700 border-violet-200",
  TRAVELER: "bg-slate-50 text-slate-600 border-slate-200",
};

const STATUS_BADGE: Record<AdminUser["status"], string> = {
  ACTIVE: "bg-green-50 text-green-700 border-green-200",
  BANNED: "bg-red-50 text-red-700 border-red-200",
};

export const userColumns: ColumnDef<AdminUser>[] = [
  {
    accessorKey: "id",
    enableSorting: true,
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        #ID <ArrowUpDown className="size-3 ml-1" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <span className="font-mono text-sm text-slate-500">
        #{getValue<number>()}
      </span>
    ),
  },
  {
    accessorKey: "fullName",
    header: "User",
    cell: ({ row }) => {
      const u = row.original;
      const initials = (u.fullName ?? "")
        .trim()
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      return (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="size-8 shrink-0">
            {u.avatar?.url && (
              <AvatarImage src={u.avatar.url} alt={u.fullName} />
            )}
            <AvatarFallback className="bg-pink-100 text-pink-600 text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {u.fullName}
            </p>
            <p className="text-xs text-slate-500 truncate">{u.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ getValue }) => (
      <span className="text-sm text-slate-600">@{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "role",
    filterFn: "equals",
    header: "Role",
    cell: ({ getValue }) => {
      const role = getValue<AdminUser["role"]>();
      return (
        <Badge variant="outline" className={ROLE_BADGE[role]}>
          {role === "ADMIN"
            ? "Admin"
            : role === "PROVIDER"
              ? "Provider"
              : "Traveler"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    filterFn: "equals",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<AdminUser["status"]>();
      const label = status.charAt(0) + status.slice(1).toLowerCase();
      return (
        <Badge variant="outline" className={STATUS_BADGE[status]}>
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    enableSorting: true,
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Joined <ArrowUpDown className="size-3 ml-1" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <span className="text-sm text-slate-500 whitespace-nowrap">
        {format(new Date(getValue<string>()), "MMM d, yyyy")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const user = row.original;
      const isBanned = user.status === "BANNED";
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {/* <DropdownMenuItem
              onClick={() => table.options.meta?.onEditRole(user)}
              className="gap-2 cursor-pointer"
            >
              <Pencil className="size-4" />
              Edit Role
            </DropdownMenuItem> */}
            <DropdownMenuItem
              onClick={() => table.options.meta?.onToggleStatus(user)}
              className={`gap-2 cursor-pointer ${isBanned ? "text-green-600 focus:text-green-600" : "text-red-600 focus:text-red-600"}`}
            >
              {isBanned ? (
                <>
                  <ShieldCheck className="size-4" /> Unban
                </>
              ) : (
                <>
                  <ShieldOff className="size-4" /> Ban
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="gap-2 cursor-pointer">
              <Link href={`/admin/users/${user.id}`}>
                <ExternalLink className="size-4" />
                View Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
