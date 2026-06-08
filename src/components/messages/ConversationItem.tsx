"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Conversation } from "@/types/chat";
import { getLastMessagePreview, formatMessageTime } from "@/utils/chat-utils";
import { useChatStore } from "@/state/chat-store";
import { useEffect } from "react";

interface ConversationItemProps {
  conversation: Conversation;
  currentUserId: string | number;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, currentUserId, isActive, onClick }: ConversationItemProps) {

  const unreadConversationIds = useChatStore(state => state.unreadConversationIds);
  const markConversationUnread = useChatStore((state) => state.markConversationUnread);

  const hasUnread = unreadConversationIds.includes(conversation.id) || (conversation.unreadCount || 0) > 0;
  
  useEffect(() => {
    if ((conversation.unreadCount || 0) > 0 && !unreadConversationIds.includes(conversation.id)) {
       markConversationUnread(conversation.id);
    }
  }, [conversation.unreadCount, conversation.id, unreadConversationIds, markConversationUnread]);
  
  const previewText = getLastMessagePreview(conversation, currentUserId);
  const timeText = formatMessageTime(conversation.updatedAt);
  let displayName = conversation.name || "Người dùng";
  let avatarUrl = conversation.avatarUrl;

  if (!conversation.name && conversation.members && conversation.members.length > 0) {
    const other = conversation.members.find(m => String(m.id ?? m.userId) !== String(currentUserId));
    if (other) {
      displayName = other.fullName ?? other.username ?? displayName;
      avatarUrl = other.avatarUrl ?? avatarUrl;
    } else if (conversation.lastMessageSender && String(conversation.lastMessageSender.userId ?? conversation.lastMessageSender.id) !== String(currentUserId)) {
      displayName = conversation.lastMessageSender.fullName ?? displayName;
      avatarUrl = conversation.avatarUrl ?? avatarUrl;
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-colors mx-2",
        isActive ? "bg-primary/10" : "hover:bg-muted",
        hasUnread && !isActive ? "bg-slate-50" : ""
      )}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h4 className={cn(
            "text-sm truncate",
            hasUnread ? "font-bold text-foreground" : "font-semibold text-foreground/80"
          )}>
            {displayName}
          </h4>
          <span className={cn(
            "text-[10px]",
            hasUnread ? "text-primary font-bold" : "text-muted-foreground"
          )}>
            {timeText}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <p className={cn(
            "text-xs truncate flex-1 mr-2",
            hasUnread ? "text-slate-900 font-medium" : "text-muted-foreground"
          )}>
            {previewText}
          </p>
          
          {hasUnread && (
            <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)] shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
}