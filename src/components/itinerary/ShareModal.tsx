"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Share2 } from "lucide-react"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  onShare: (emailOrUsername: string) => void
  isLoading?: boolean
  shareError?: string | null
  shareErrorCode?: number | null
}

export function ShareModal({
  isOpen,
  onClose,
  onShare,
  isLoading,
  shareError,
  shareErrorCode,
}: ShareModalProps) {
  const [emailOrUsername, setEmailOrUsername] = useState("")

  const handleShare = () => {
    if (emailOrUsername.trim()) {
      onShare(emailOrUsername.trim())
    }
  }

  const errorMessage =
    shareErrorCode === 404
      ? "User not available."
      : shareErrorCode === 400
        ? "Cannot share: this user already has access, or you cannot share with yourself."
        : shareError ?? null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-pink-500" />
            Share Itinerary
          </DialogTitle>
          <DialogDescription>
            Share this itinerary with view-only access
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="share-username">Username</Label>
            <Input
              id="share-username"
              placeholder="Enter username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleShare()}
              aria-invalid={!!errorMessage}
            />
            {errorMessage && (
              <p
                className="text-sm text-red-600"
              >
                {errorMessage}
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
            <strong>View-only access:</strong> Recipients can view but not edit this itinerary.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleShare}
            disabled={isLoading || !emailOrUsername.trim()}
            className="bg-pink-500 hover:bg-pink-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sharing...
              </>
            ) : (
              "Share"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
