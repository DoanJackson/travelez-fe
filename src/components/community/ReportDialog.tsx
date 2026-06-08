"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { reportService } from "@/services/reportService";
import type { ReportReason } from "@/types/report";

const DETAIL_MAX = 500;

const REPORT_REASONS: { label: string; value: ReportReason }[] = [
  { label: "Spam or misleading",                value: "SPAM" },
  { label: "Harassment or bullying",            value: "HARASSMENT" },
  { label: "Hate speech",                       value: "HATE_SPEECH" },
  { label: "False information",                 value: "FALSE_INFORMATION" },
  { label: "Inappropriate content",             value: "INAPPROPRIATE_CONTENT" },
  { label: "Intellectual property violation",   value: "INTELLECTUAL_PROPERTY_INFRINGEMENT" },
  { label: "Other",                             value: "OTHER" },
];

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
}

export function ReportDialog({ isOpen, onClose, postId }: ReportDialogProps) {
  const [reason, setReason] = useState<ReportReason | "">("");
  const [reasonDetail, setReasonDetail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOther = reason === "OTHER";
  const isValid = !!reason && (!isOther || reasonDetail.trim().length > 0);

  const resetForm = () => {
    setReason("");
    setReasonDetail("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!isValid || !reason) return;
    setIsSubmitting(true);
    try {
      await reportService.sendReport({
        targetType: "POST",
        targetId: postId,
        reason,
        reasonDetail: reasonDetail.trim(),
        files: [],
      });
      toast.success("Thank you for your report. We will review it shortly.");
      handleClose();
    } catch {
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Report Post</DialogTitle>
          <DialogDescription>
            Select the reason that best describes the problem.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-4">
          <RadioGroup
            value={reason}
            onValueChange={(v) => setReason(v as ReportReason)}
            className="space-y-2"
          >
            {REPORT_REASONS.map(({ label, value }) => (
              <div key={value} className="flex items-center gap-3">
                <RadioGroupItem value={value} id={value} />
                <Label
                  htmlFor={value}
                  className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer leading-snug"
                >
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="space-y-1">
            <Textarea
              placeholder={
                isOther
                  ? "Please describe the issue (required)…"
                  : "Add more details (optional)…"
              }
              value={reasonDetail}
              onChange={(e) =>
                setReasonDetail(e.target.value.slice(0, DETAIL_MAX))
              }
              className="resize-none min-h-[80px] text-sm"
              disabled={isSubmitting}
            />
            <p className="text-xs text-slate-400 text-right">
              {reasonDetail.length}/{DETAIL_MAX}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Submitting…
              </span>
            ) : (
              "Submit Report"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
