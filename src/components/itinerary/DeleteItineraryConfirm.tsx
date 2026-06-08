"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteItineraryConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  itineraryTitle: string | null;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteItineraryConfirm({
  isOpen,
  onClose,
  itineraryTitle,
  onConfirm,
  isDeleting,
}: DeleteItineraryConfirmProps) {
  if (!itineraryTitle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] w-full rounded-2xl p-6 gap-5 shadow-xl border border-slate-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete itinerary?
          </DialogTitle>
          <DialogDescription>
            &apos;{itineraryTitle}&apos; will be permanently deleted. This
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
