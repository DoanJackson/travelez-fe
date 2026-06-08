"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatSidebar } from "@/components/messages/ChatSidebar";
import { MessageWindow } from "@/components/messages/MessageWindow";
import { useConversationList } from "@/hooks/chat/useConversationList";

function MessagesLayout() {
  const searchParams = useSearchParams();
  const receiverIdParam = searchParams.get("receiverId");
  
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const { conversations, loading, updateConversationLastMessage, moveConversationToTop, markAsRead } = useConversationList(activeConversationId);

  const handleSelectConversation = (id: number) => {
    setActiveConversationId(id);
    markAsRead(id);
  };

  const handleMessageSent = (conversationId: number, lastMsg: string) => {
    moveConversationToTop(conversationId, lastMsg, true); 
  };

  const handleNewMessage = (conversationId: number, lastMsg: string, isMyMessage = false) => {
    moveConversationToTop(conversationId, lastMsg, isMyMessage);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
      <div className="w-full md:w-80 border-r flex flex-col">
        <ChatSidebar
          activeId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          conversations={conversations}
          loading={loading}
        />
      </div>
      
      <div className="hidden md:flex flex-1 flex-col relative bg-slate-50">
        <MessageWindow 
          conversationId={activeConversationId} 
          receiverId={activeConversationId ? null : (receiverIdParam ? Number(receiverIdParam) : null)}
          onMessageSent={handleMessageSent}
          onNewMessage={handleNewMessage}
        />
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Đang tải hộp thoại...</div>}>
      <MessagesLayout />
    </Suspense>
  )
}