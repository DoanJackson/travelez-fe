"use client";

import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConversationItem } from "./ConversationItem";
import { AuthCookies } from "@/lib/cookie";
import { Conversation } from "@/types/chat";
import { useChatStore } from "@/state/chat-store";

interface ChatSidebarProps {
  activeId: number | null;
  onSelectConversation: (id: number) => void;
  conversations: Conversation[];
  loading: boolean;
}

export function ChatSidebar({ activeId, onSelectConversation, conversations, loading }: ChatSidebarProps) {
  const currentUserId = AuthCookies.getUserId() || "0";
  const markConversationRead = useChatStore((state) => state.markConversationRead);

  const handleSelectConversation = (id: number) => {
    markConversationRead(id);
    
    if (onSelectConversation) {
      onSelectConversation(id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-r">
      {/* Header & Search */}
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Messages</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search messages..." 
            className="pl-9 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {loading && conversations.length === 0 ? (
          <div className="flex justify-center items-center p-8 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary opacity-50" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center text-muted-foreground p-4 text-sm mt-4">
            Không có cuộc trò chuyện nào
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              currentUserId={currentUserId}
              isActive={conv.id === activeId}
              onClick={() => handleSelectConversation(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}