"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { userColumns } from "@/components/admin/UserColumns";
import { useAdminUsers, useUpdateUserStatus } from "@/hooks/useAdminUsers";
import type { AdminUser, AdminUsersQuery, UserStatus } from "@/types/admin";

const OTHER = "Other (Manual specification)";

const BAN_REASONS = [
  "Spam or automated content activity",
  "Harassment or violation of community standards",
  "Fake account or identity impersonation",
  OTHER,
] as const;

const UNBAN_REASONS = [
  "Appreciation appeal approved",
  "Account cleared after administrative review",
  "False positive / System detection error rectified",
  OTHER,
] as const;

export function UserTable() {
  const router = useRouter();

  // Server-side query params
  const [query, setQuery] = useState<AdminUsersQuery>({ page: 0, size: 10 });

  // Debounced keyword: local input fires immediately; query updates after 350 ms idle
  const [keywordInput, setKeywordInput] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery((prev) => ({ ...prev, keyword: keywordInput || undefined, page: 0 }));
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [keywordInput]);

  // Table-level sorting state (drives server params)
  const [sorting, setSorting] = useState<SortingState>([]);
  useEffect(() => {
    if (sorting.length === 0) {
      setQuery((prev) => { const { sortField: _f, sortDirection: _d, ...rest } = prev; return rest; });
    } else {
      const { id, desc } = sorting[0];
      setQuery((prev) => ({ ...prev, sortField: id, sortDirection: desc ? "DESC" : "ASC", page: 0 }));
    }
  }, [sorting]);

  const { data, isLoading, isError } = useAdminUsers(query);
  const pageCount = data?.totalPages ?? 1;
  const totalElements = data?.totalElements ?? 0;
  const currentPage = query.page ?? 0;

  // Ban / unban dialog state
  const [banTarget, setBanTarget] = useState<AdminUser | null>(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const effectiveReason = selectedReason === OTHER ? customReason : selectedReason;

  const { mutate: updateStatus, isPending: isMutating } = useUpdateUserStatus();

  function openBanDialog(user: AdminUser) {
    setBanTarget(user);
    setSelectedReason("");
    setCustomReason("");
  }

  function closeBanDialog() {
    setBanTarget(null);
    setSelectedReason("");
    setCustomReason("");
  }

  function handleBanConfirm() {
    if (!banTarget) return;
    const action = banTarget.status === "BANNED" ? "UNBAN" : "BAN";
    updateStatus(
      { userId: banTarget.id, payload: { action, reason: effectiveReason } },
      {
        onSuccess: () => {
          const verb = action === "BAN" ? "banned" : "unbanned";
          toast.success(`${banTarget.fullName} has been ${verb}.`);
          closeBanDialog();
        },
        onError: (e) => toast.error(e.message),
      }
    );
  }

  const rows = data?.content ?? [];
  const isBanAction = banTarget?.status !== "BANNED";
  const reasonOptions = isBanAction ? BAN_REASONS : UNBAN_REASONS;

  const table = useReactTable({
    data: rows,
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    pageCount,
    onSortingChange: setSorting,
    state: { sorting },
    meta: {
      onEditRole: () => {},
      onToggleStatus: openBanDialog,
    },
  });

  return (
    <>
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
        <Input
          placeholder="Search name, email, or username…"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table container */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
        {/* Filter toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50/60">
          <Select
            value={query.status ?? "all"}
            onValueChange={(v) =>
              setQuery((prev) => ({
                ...prev,
                status: v === "all" ? undefined : (v as UserStatus),
                page: 0,
              }))
            }
          >
            <SelectTrigger className="w-36 h-8 text-xs bg-white">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="BANNED">Banned</SelectItem>
            </SelectContent>
          </Select>

          <span className="ml-auto text-xs text-slate-400">
            {isLoading ? "Loading…" : `${totalElements} users`}
          </span>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-40 text-sm text-slate-400 gap-2">
            <Loader2 className="size-4 animate-spin" />
            Loading users…
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex items-center justify-center h-40 text-sm text-red-500">
            Failed to load users. Please try again.
          </div>
        )}

        {!isLoading && !isError && (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="bg-slate-50 hover:bg-slate-50">
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={userColumns.length}
                    className="h-32 text-center text-sm text-slate-400"
                  >
                    No users match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-slate-50/60 cursor-pointer"
                    onClick={() => router.push(`/admin/users/${row.original.id}`)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
          <span className="text-xs text-slate-400">
            Page {currentPage + 1} of {pageCount || 1}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => setQuery((prev) => ({ ...prev, page: (prev.page ?? 0) - 1 }))}
              disabled={currentPage === 0 || isLoading}
            >
              <ChevronLeft className="size-3.5" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => setQuery((prev) => ({ ...prev, page: (prev.page ?? 0) + 1 }))}
              disabled={currentPage + 1 >= pageCount || isLoading}
            >
              Next
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Ban / Unban confirmation */}
      <AlertDialog open={!!banTarget} onOpenChange={(open) => { if (!open) closeBanDialog(); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isBanAction ? "Ban this user?" : "Unban this user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isBanAction
                ? `${banTarget?.fullName} will lose access to their account. This can be reversed later.`
                : `${banTarget?.fullName} will regain access to their account and all platform features.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Reason picker */}
          <div className="px-1 space-y-3">
            <p className="text-sm font-medium text-slate-700">
              {isBanAction ? "Reason for ban" : "Reason for reinstatement"}
              <span className="text-red-500 ml-1">*</span>
            </p>
            <RadioGroup
              value={selectedReason}
              onValueChange={(v) => {
                setSelectedReason(v);
                if (v !== OTHER) setCustomReason("");
              }}
              className="space-y-2"
            >
              {reasonOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`table-reason-${option}`} />
                  <Label
                    htmlFor={`table-reason-${option}`}
                    className="text-sm text-slate-700 cursor-pointer font-normal"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {selectedReason === OTHER && (
              <Textarea
                placeholder="Describe the reason in detail…"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="resize-none text-sm mt-1"
                rows={3}
                autoFocus
              />
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBanConfirm}
              disabled={!effectiveReason.trim() || isMutating}
              className={isBanAction ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {isMutating && <Loader2 className="size-4 animate-spin mr-1" />}
              {isBanAction ? "Ban" : "Unban"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
