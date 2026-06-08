"use client";

import { useState, useCallback, useEffect } from "react";
import { chatService } from "@/services/chatService";
import { ChatMessage, SendMessagePayload } from "@/types/chat";
import { useStompClient } from "./useStompClient";
import { TOPIC_CHAT_PREFIX } from "@/constants/socket";
import { AuthCookies } from "@/lib/cookie";

interface SocketEvent<T> {
  type: "NEW_MESSAGE" | "NEW_MESSAGE_ALERT" | "MESSAGE_RECALLED";
  payload: T;
}

interface UseMessageWindowProps {
  conversationId: number | null;
  receiverId?: number;
  onConversationCreated?: (newConversationId: number) => void;
  onRefreshSidebar?: () => void;
  onNewMessage?: (conversationId: number, lastMessageContent: string, isMyOwnMessage: boolean) => void;
}

function normalizeBackendMessage(m: any): ChatMessage {
  return {
    id: m.id ?? m.messageId, 
    content: m.content,
    conversationId: m.conversationId,
    createdAt: m.createdAt,
    files: Array.isArray(m.medias) ? m.medias.map((md: any) => md.url) : [],
    sender: {
      id: m.sender?.id ?? m.sender?.userId,
      userId: m.sender?.userId ?? m.sender?.id,
      username: m.sender?.username,
      fullName: m.sender?.fullName,
      avatarUrl: m.sender?.avatar?.url ?? m.sender?.avatarUrl ?? undefined,
    },
  };
}

export function useMessageWindow({ 
  conversationId, 
  receiverId,
  onConversationCreated,
  onRefreshSidebar,
  onNewMessage
}: UseMessageWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeConvId, setActiveConvId] = useState<number | null>(conversationId);
  
  const { isConnected, subscribe } = useStompClient();

  useEffect(() => {
    if (conversationId) {
      setActiveConvId(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!activeConvId) return;

    async function loadInitialMessages() {
      setLoading(true);
      try {
        const res = await chatService.getMessages(activeConvId as number, 50);
        if (res.success && res.data) {
          const normalized = res.data.content.map(normalizeBackendMessage).reverse();
          setMessages(normalized);
        }
      } catch (error) {
        console.error("Failed to load messages", error);
      } finally {
        setLoading(false);
      }
    }

    loadInitialMessages();
  }, [activeConvId]);

  useEffect(() => {
    if (!isConnected || !activeConvId) return;

    const topic = `${TOPIC_CHAT_PREFIX}${activeConvId}`;
    
    const subscription = subscribe(topic, (msg) => {
      try {
        const socketResp = JSON.parse(msg.body);
        const actualData = socketResp.payload || socketResp.data || socketResp;
        console.log("📥 [STOMP Nhận]:", socketResp.type, actualData);

        // 1. KỊCH BẢN THU HỒI TIN NHẮN
        if (socketResp.type === 'MESSAGE_RECALLED') {
          const targetId = actualData.messageId || actualData.id;
          setMessages((prev) => prev.map(m => 
            m.id === targetId 
              ? { ...m, content: "Tin nhắn đã bị thu hồi" } 
              : m
          ));
          return; // Gặp thu hồi thì break
        }

        // 2. KỊCH BẢN CÓ TIN NHẮN MỚI
        if (socketResp.type === 'NEW_MESSAGE') {
          // Check sender logic
          const currentUserIdStr = AuthCookies.getUserId();
          const currentUserId = currentUserIdStr ? parseInt(currentUserIdStr, 10) : null;
          const senderId = actualData.sender?.id || actualData.sender?.userId || actualData.senderId;
          const isMyOwnMessage = currentUserId !== null && senderId === currentUserId;

          const newMsg = normalizeBackendMessage(actualData);
          
          setMessages(prev => {
            const isDuplicate = prev.some(m => m.id === newMsg.id);
            if (isDuplicate) return prev;
            return [...prev, newMsg];
          });

          if (activeConvId && typeof onNewMessage === 'function') {
            onNewMessage(activeConvId, newMsg.content, isMyOwnMessage);
          }
        }
        
      } catch (error) {
        console.error("❌ Lỗi khi parse dữ liệu WebSocket:", error);
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [isConnected, activeConvId, subscribe]);

  const sendMessage = useCallback(async (payload: SendMessagePayload) => {
    try {
      const res = await chatService.sendMessage(payload);
      
      if (res.success) {
        const sentMsg = normalizeBackendMessage(res.data);
        setMessages(prev => [...prev, sentMsg]);
        
        if (receiverId && sentMsg && (sentMsg as any).conversationId) {
          const newConvId = (sentMsg as any).conversationId;
          setActiveConvId(newConvId);
          onConversationCreated?.(newConvId);
        }
        
        onRefreshSidebar?.();
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Send message failed", error);
      return false;
    }
  }, [receiverId, onConversationCreated, onRefreshSidebar]);

  return {
    messages,
    loading,
    sendMessage,
    activeConvId
  };
}