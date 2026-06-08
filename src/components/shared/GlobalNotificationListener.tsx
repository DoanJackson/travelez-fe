"use client";

import { useEffect } from "react";
import { useStompClient } from "@/hooks/chat/useStompClient";
import { AuthCookies } from "@/lib/cookie";
import { TOPIC_USER_PREFIX } from "@/constants/socket";
import { useChatStore } from "@/state/chat-store";
import { usePathname } from "next/navigation";

export function GlobalNotificationListener() {
  const { isConnected, subscribe } = useStompClient();
  const markConversationUnread = useChatStore((state) => state.markConversationUnread);
  const pathname = usePathname();

  useEffect(() => {
    const userId = AuthCookies.getUserId();
    if (!isConnected || !userId) return;

    const topic = `${TOPIC_USER_PREFIX}${userId}`;
    const subscription = subscribe(topic, (msg) => {
      try {
        const rawData = JSON.parse(msg.body);
        const actualData = rawData.data || rawData.payload || rawData;
        const convId = actualData.conversationId;
        
        if (convId && !pathname.includes('/messages')) {
          markConversationUnread(convId);
        }
      } catch (error) {
        console.error("Global socket parse error:", error);
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [isConnected, subscribe, markConversationUnread, pathname]);

  return null;
}