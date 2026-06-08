"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Users, UserX, Loader2, Search, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useDebounce } from "@/hooks/useDebounce"
import {
  getSharedUsers,
  searchSharedUsers,
  removeUserFromSharedItinerary,
} from "@/services/itineraryService"
import type { SharedUserItem } from "@/types/itinerary"
import type { ApiError } from "@/types/api"

interface CollaboratorsModalProps {
  isOpen: boolean
  onClose: () => void
  itineraryId: number
  isOwner: boolean
}

function formatSharedAt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function userInitials(username: string): string {
  return username.slice(0, 2).toUpperCase()
}

export function CollaboratorsModal({
  isOpen,
  onClose,
  itineraryId,
  isOwner,
}: CollaboratorsModalProps) {
  // ── Member list state ────────────────────────────────────────────────────
  const [members, setMembers] = useState<SharedUserItem[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  const [membersError, setMembersError] = useState<string | null>(null)

  // ── Kick state ───────────────────────────────────────────────────────────
  const [kickTarget, setKickTarget] = useState<SharedUserItem | null>(null)
  const [isKicking, setIsKicking] = useState(false)

  // ── Inline search state (owner-only) ─────────────────────────────────────
  const [searchKeyword, setSearchKeyword] = useState("")
  const debouncedKeyword = useDebounce(searchKeyword, 300)
  const [searchResults, setSearchResults] = useState<SharedUserItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // ── Fetch member list ────────────────────────────────────────────────────
  const fetchMembers = useCallback(async (page: number) => {
    setIsLoadingMembers(true)
    setMembersError(null)
    try {
      const res = await getSharedUsers(itineraryId, page)
      setMembers(res.data.content)
      setTotalPages(res.data.totalPages)
      setTotalElements(res.data.totalElements)
      setCurrentPage(page)
    } catch (err: unknown) {
      const apiErr = err as ApiError
      if (apiErr?.status === 403) return  // non-owner: hide silently
      setMembersError("Could not load collaborators.")
    } finally {
      setIsLoadingMembers(false)
    }
  }, [itineraryId])

  // ── Lazy-load: fetch only when modal opens; reset on close ───────────────
  useEffect(() => {
    if (!isOpen) {
      setMembers([])
      setCurrentPage(0)
      setTotalPages(0)
      setTotalElements(0)
      setMembersError(null)
      setSearchKeyword("")
      setSearchResults([])
      setShowDropdown(false)
      return
    }
    if (itineraryId > 0) {
      fetchMembers(0)
    }
  }, [isOpen, itineraryId]) // itineraryId guards against stale 0 during parent load

  // ── Debounced keyword search ─────────────────────────────────────────────
  useEffect(() => {
    if (debouncedKeyword.trim().length < 2) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    let cancelled = false
    setIsSearching(true)
    searchSharedUsers(itineraryId, debouncedKeyword.trim())
      .then((res) => {
        if (cancelled) return
        setSearchResults(res.data)
        setShowDropdown(true)
      })
      .catch(() => {
        if (cancelled) return
        toast.error("Search failed. Please try again.")
        setShowDropdown(false)
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false)
      })

    return () => { cancelled = true }
  }, [debouncedKeyword, itineraryId])

  // ── Click-outside closes search dropdown ─────────────────────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // ── Kick handler (optimistic, no auto re-fetch in catch) ─────────────────
  const handleKick = useCallback(async () => {
    if (!kickTarget || !isOwner) return

    const evicted = kickTarget
    setKickTarget(null)
    setIsKicking(true)

    // Optimistic removal
    setMembers((prev) => prev.filter((m) => m.userId !== evicted.userId))
    setTotalElements((prev) => Math.max(0, prev - 1))

    try {
      await removeUserFromSharedItinerary(itineraryId, evicted.username)
      toast.success(`@${evicted.username} has been removed.`)
    } catch (err: unknown) {
      const apiErr = err as ApiError
      if (apiErr?.status === 404) {
        // Member already gone server-side — optimistic removal is correct.
        // No re-fetch: avoids an infinite loop if the endpoint is broken.
        toast.info(`@${evicted.username} is no longer a collaborator.`)
      } else if (apiErr?.status === 403) {
        // Rollback
        setMembers((prev) => [evicted, ...prev])
        setTotalElements((prev) => prev + 1)
        toast.error("You don't have permission to remove this member.")
      } else {
        // Rollback for generic errors
        setMembers((prev) => [evicted, ...prev])
        setTotalElements((prev) => prev + 1)
        toast.error(apiErr?.message ?? "Failed to remove member. Please try again.")
      }
    } finally {
      setIsKicking(false)
    }
  }, [kickTarget, isOwner, itineraryId])

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Primary Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-pink-500" />
              Collaborators
              {totalElements > 0 && (
                <span className="ml-1 text-xs font-normal text-gray-400">
                  ({totalElements})
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Manage who has access to this itinerary
            </DialogDescription>
          </DialogHeader>

          <Separator className="shrink-0" />

          {/* Scrollable body — flex-1 + overflow-y-auto prevents layout overflow */}
          <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-1">
            {/* Debounced search — owner only */}
            {isOwner && (
              <div ref={searchContainerRef} className="relative">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                  <Input
                    className="pl-8 h-8 text-sm"
                    placeholder="Search members to remove..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onFocus={() => {
                      if (searchResults.length > 0) setShowDropdown(true)
                    }}
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-gray-400" />
                  )}
                </div>

                {showDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-md overflow-hidden">
                    {searchResults.length === 0 ? (
                      <p className="px-3 py-2 text-sm text-gray-500">No members found.</p>
                    ) : (
                      searchResults.map((user) => (
                        <div
                          key={user.userId}
                          className="flex items-center justify-between px-3 py-2 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar className="h-6 w-6 shrink-0">
                              <AvatarImage src={user.avatarUrl} alt={user.username} />
                              <AvatarFallback className="text-xs">
                                {userInitials(user.username)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium truncate">@{user.username}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                            onClick={() => {
                              setShowDropdown(false)
                              setSearchKeyword("")
                              setKickTarget(user)
                            }}
                          >
                            <UserX className="h-3.5 w-3.5 mr-1" />
                            Remove
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Member list */}
            {isLoadingMembers ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : membersError ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 min-h-[160px] text-center">
                <AlertTriangle className="h-8 w-8 text-red-400 shrink-0" />
                <p className="text-sm text-red-500 max-w-[240px]">{membersError}</p>
                <Button size="sm" variant="outline" onClick={() => fetchMembers(currentPage)}>
                  Try again
                </Button>
              </div>
            ) : members.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No collaborators yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {members.map((member) => (
                  <li
                    key={member.userId}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarImage src={member.avatarUrl} alt={member.username} />
                        <AvatarFallback className="text-xs">
                          {userInitials(member.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">@{member.username}</p>
                        <p className="text-xs text-gray-400">
                          Added {formatSharedAt(member.sharedAt)}
                        </p>
                      </div>
                    </div>

                    {isOwner && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                        aria-label={`Remove @${member.username}`}
                        onClick={() => setKickTarget(member)}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pagination — pinned below the scroll area */}
          {totalPages > 1 && (
            <div className="shrink-0 flex items-center justify-between pt-2 border-t">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2"
                disabled={currentPage === 0 || isLoadingMembers}
                onClick={() => fetchMembers(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-gray-400">
                {currentPage + 1} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2"
                disabled={currentPage >= totalPages - 1 || isLoadingMembers}
                onClick={() => fetchMembers(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Kick AlertDialog — JSX sibling of Dialog, NOT nested inside DialogContent.
          Both use Radix portals (render to document.body), so they are DOM siblings
          at body level. No competing focus traps; Radix focus-scope stack gives
          the AlertDialog priority when it opens on top of the Dialog.             */}
      <AlertDialog open={!!kickTarget} onOpenChange={() => setKickTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove @{kickTarget?.username}?</AlertDialogTitle>
            <AlertDialogDescription>
              They will immediately lose access to this itinerary. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isKicking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleKick}
              disabled={isKicking}
              className="bg-red-500 hover:bg-red-600"
            >
              {isKicking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
