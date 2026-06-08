"use client";

import { useState } from "react";
import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { toast } from "sonner";

import type { UserStatus } from "@/types/admin";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateUserStatus } from "@/hooks/useAdminUsers";

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

interface Props {
  userId: number;
  initialStatus: UserStatus;
}

export function UserDetailActions({ userId, initialStatus }: Props) {
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const effectiveReason = selectedReason === OTHER ? customReason : selectedReason;

  const { mutate: updateStatus, isPending } = useUpdateUserStatus();
  const isBanned = initialStatus === "BANNED";
  const reasonOptions = isBanned ? UNBAN_REASONS : BAN_REASONS;

  function openDialog() {
    setSelectedReason("");
    setCustomReason("");
    setIsBanDialogOpen(true);
  }

  function closeDialog() {
    setIsBanDialogOpen(false);
    setSelectedReason("");
    setCustomReason("");
  }

  function handleBanConfirm() {
    const action = isBanned ? "UNBAN" : "BAN";
    updateStatus(
      { userId, payload: { action, reason: effectiveReason } },
      {
        onSuccess: () => {
          const verb = action === "BAN" ? "banned" : "unbanned";
          toast.success(`User has been ${verb}.`);
          closeDialog();
        },
        onError: (e) => toast.error(e.message),
      }
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button
              variant="outline"
              onClick={openDialog}
              className={
                isBanned
                  ? "gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                  : "gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              }
            >
              {isBanned ? (
                <>
                  <ShieldCheck className="size-4" />
                  Unban User
                </>
              ) : (
                <>
                  <ShieldOff className="size-4" />
                  Ban User
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ban / Unban confirmation */}
      <AlertDialog open={isBanDialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isBanned ? "Unban this user?" : "Ban this user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isBanned
                ? "This user will regain access to their account and all platform features."
                : "This user will lose access to their account. This action can be reversed later."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Reason picker */}
          <div className="px-1 space-y-3">
            <p className="text-sm font-medium text-slate-700">
              {isBanned ? "Reason for reinstatement" : "Reason for ban"}
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
                  <RadioGroupItem value={option} id={`detail-reason-${option}`} />
                  <Label
                    htmlFor={`detail-reason-${option}`}
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
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBanConfirm}
              disabled={!effectiveReason.trim() || isPending}
              className={isBanned ? "" : "bg-red-600 hover:bg-red-700 focus:ring-red-600"}
            >
              {isPending && <Loader2 className="size-4 animate-spin mr-1" />}
              {isBanned ? "Unban" : "Ban"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
