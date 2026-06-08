"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Activity } from "@/types/itinerary"
import { AlertTriangle } from "lucide-react"

interface DeleteActivityConfirmProps {
  isOpen: boolean
  onClose: () => void
  activity: Activity | null
  onConfirm: () => void
}

export function DeleteActivityConfirm({
  isOpen,
  onClose,
  activity,
  onConfirm,
}: DeleteActivityConfirmProps) {
  if (!activity) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Activity
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove "{activity.title}" from your itinerary?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

