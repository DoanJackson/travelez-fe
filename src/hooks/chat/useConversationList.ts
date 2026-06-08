"use client";

import { useState, useCallback, useEffect } from "react";
import { chatService } from "@/services/chatService";
import { AuthCookies } from "@/lib/cookie";
import { BASE_URL } from "@/constants/api";
import { Conversation, User } from "@/types/chat";
import { useStompClient } from "./useStompClient";
import { TOPIC_CHAT_PREFIX } from "@/constants/socket";
import { useChatStore } from "@/state/chat-store";

function normalizeUser(raw: any): User | undefined {
  if (!raw) return undefined;

  return {
    id: raw.id ?? raw.userId,
    userId: raw.userId ?? raw.id,
    username: raw.username,
    fullName: raw.fullName ?? raw.username ?? "Người dùng",
    avatarUrl: raw.avatar?.url ?? raw.avatarUrl ?? raw.avatar ?? undefined,
  };
}

function normalizeConversation(raw: any): Conversation {
  return {
    id: raw.id,
    name: raw.groupName ?? raw.name,
    avatarUrl: raw.avatar ?? undefined,
    updatedAt: raw.lastMessageAt ?? raw.updatedAt ?? "",
    lastMessageContent: raw.lastMessageContent,
    lastMessageSender: raw.lastMessageSender
      ? {
          id: raw.lastMessageSender.userId ?? raw.lastMessageSender.id,
          userId: raw.lastMessageSender.userId ?? raw.lastMessageSender.id,
          username: raw.lastMessageSender.username,
          fullName: raw.lastMessageSender.fullName,
        }
      : undefined,
    unreadCount: raw.unreadCount || 0,
    isGroup: raw.isGroup === true || raw.type === "GROUP",
    members: [],
  };
}

async function fetchUserProfile(userId: string | number) {
  const token = AuthCookies.getToken();

  const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) return undefined;

  const json = await response.json();
  return normalizeUser(json?.data);
}

async function hydrateConversation(conversation: Conversation, currentUserId: string | number | null) {
  if (conversation.isGroup) return conversation;

  try {
    const res = await chatService.getMembers(conversation.id);

    if (res?.success && res.data && Array.isArray(res.data.members)) {
      const members = res.data.members
        .map((item: any) => normalizeUser(item?.user ?? item))
        .filter(Boolean) as User[];

      const peer = members.find(
        (member) => String(member.id ?? member.userId) !== String(currentUserId)
      );

      if (peer) {
        let peerProfile = peer;

        if (!peerProfile.avatarUrl && peerProfile.id != null) {
          const profile = await fetchUserProfile(peerProfile.id);
          if (profile) {
            peerProfile = {
              ...peerProfile,
              fullName: profile.fullName ?? peerProfile.fullName,
              avatarUrl: profile.avatarUrl ?? peerProfile.avatarUrl,
            };
          }
        }

        return {
          ...conversation,
          name: peerProfile.fullName ?? peerProfile.username ?? conversation.name,
          avatarUrl: peerProfile.avatarUrl ?? conversation.avatarUrl,
          members,
        };
      }

      return {
        ...conversation,
        members,
      };
    }
  } catch (error) {
    console.error(`Failed to load members for conversation ${conversation.id}`, error);
  }

  const sender = conversation.lastMessageSender;
  if (
    sender &&
    String(sender.id ?? sender.userId) !== String(currentUserId) &&
    !conversation.name
  ) {
    return {
      ...conversation,
      name: sender.fullName ?? sender.username ?? conversation.name,
    };
  }

  return conversation;
}

export function useConversationList(activeConvId: number | null = null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const { isConnected, subscribe } = useStompClient();
  const { syncUnreadConversations, markConversationUnread, markConversationRead } = useChatStore();

  const markAsRead = useCallback((conversationId: number) => {
    setConversations((prev) =>
      prev.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv))
    );
    markConversationRead(conversationId);
  }, [markConversationRead]);

  const fetchConversations = useCallback(
    async (isLoadMore = false) => {
      if (loading || (!hasMore && isLoadMore)) return;

      try {
        setLoading(true);

        const currentUserId = AuthCookies.getUserId() ?? null;
        const cursor = isLoadMore ? nextCursor : null;
        const res = await chatService.getConversations(15, cursor);

        if (res.success && res.data) {
          const baseConversations = res.data.content.map(normalizeConversation);
          const hydratedConversations = await Promise.all(
            baseConversations.map((conversation) =>
              hydrateConversation(conversation, currentUserId)
            )
          );

          setConversations((prev) =>
            isLoadMore ? [...prev, ...hydratedConversations] : hydratedConversations
          );

          if (!isLoadMore) {
              const unreadIdsFromApi = hydratedConversations
                  .filter(c => c.unreadCount > 0)
                  .map(c => c.id);
              useChatStore.getState().syncUnreadConversations(unreadIdsFromApi);
          }

          setNextCursor(res.data.nextCursor == null ? null : String(res.data.nextCursor));
          setHasMore(Boolean(res.data.hasNext));
        }
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, nextCursor]
  );

  const updateConversationLastMessage = useCallback(
    (conversationId: number, lastMessageContent: string) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                lastMessageContent,
                updatedAt: new Date().toISOString(),
              }
            : conv
        )
      );
    },
    []
  );

  const moveConversationToTop = useCallback(
    (conversationId: number, lastMessageContent: string, isMyOwnMessage: boolean = false) => {
      setConversations((prev) => {
        const convToMove = prev.find((c) => c.id === conversationId);
        if (!convToMove) return prev;

        const isCurrentActive = conversationId === activeConvId;

        const newUnreadCount = (isCurrentActive || isMyOwnMessage) 
           ? (convToMove.unreadCount || 0)
           : (convToMove.unreadCount || 0) + 1;

        const updated = {
          ...convToMove,
          lastMessageContent,
          updatedAt: new Date().toISOString(),
          unreadCount: newUnreadCount,
        };

        return [updated, ...prev.filter((c) => c.id !== conversationId)];
      });
    },
    [activeConvId]
  );

  useEffect(() => {
    if (!isConnected || conversations.length === 0) return;

    const currentUserIdStr = AuthCookies.getUserId();
    const currentUserId = currentUserIdStr ? parseInt(currentUserIdStr, 10) : null;

    const subscriptions = conversations.map((conv) => {
      const topic = `${TOPIC_CHAT_PREFIX}${conv.id}`;
      return subscribe(topic, (msg) => {
        try {
          const socketResp = JSON.parse(msg.body);
          
          if (socketResp.type !== 'NEW_MESSAGE') return;

          const actualData = socketResp.payload || socketResp.data || socketResp;
          
          if (actualData.id !== undefined && actualData.content !== undefined) {
             const senderId = actualData.sender?.id || actualData.sender?.userId || actualData.senderId;
             const isMyMessage = currentUserId !== null && senderId === currentUserId;
            
             moveConversationToTop(conv.id, actualData.content, isMyMessage);
          }
        } catch (error) {
          console.error("Failed to parse message in Sidebar", error);
        }
      });
    });

    return () => {
      subscriptions.forEach((sub) => {
        if (sub && typeof sub.unsubscribe === "function") {
          sub.unsubscribe();
        }
      });
    };
  }, [isConnected, conversations, subscribe, moveConversationToTop]);

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    loading,
    hasMore,
    fetchConversations,
    setConversations,
    updateConversationLastMessage,
    moveConversationToTop,
    markAsRead,
  };
}