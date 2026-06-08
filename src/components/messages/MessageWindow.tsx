"use client";

import { useEffect, useRef, useState } from "react";
import { Send, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageBubble } from "./MessageBubble";
import { useMessageWindow } from "@/hooks/chat/useMessageWindow";
import { chatService } from "@/services/chatService";
import { AuthCookies } from "@/lib/cookie";
import { BASE_URL } from "@/constants/api";

interface MessageWindowProps {
  conversationId: number | null;
  receiverId?: number | null;
  onMessageSent?: (conversationId: number, lastMessageContent: string) => void;
  onNewMessage?: (conversationId: number, lastMessageContent: string) => void;
}

interface PeerInfo {
  id?: number | string;
  fullName?: string;
  avatarUrl?: string;
}

function normalizeUser(raw: any): PeerInfo | undefined {
  if (!raw) return undefined;

  return {
    id: raw.id ?? raw.userId,
    fullName: raw.fullName ?? raw.username ?? "User",
    avatarUrl: raw.avatar?.url ?? raw.avatarUrl ?? raw.avatar ?? undefined,
  };
}

export function MessageWindow({
  conversationId,
  receiverId,
  onMessageSent,
  onNewMessage,
}: MessageWindowProps) {
  const currentUserId = AuthCookies.getUserId();
  const token = AuthCookies.getToken();

  const { messages, loading, sendMessage } = useMessageWindow({
    conversationId,
    receiverId: receiverId || undefined,
    onConversationCreated: (newId) => {
      console.log("Conversation created:", newId);
    },
    onNewMessage,
  });

  const [peer, setPeer] = useState<PeerInfo | null>(null);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadPeer() {
      try {
        setPeer(null);

        if (conversationId) {
          const res = await chatService.getMembers(conversationId);

          if (res?.success && res.data && Array.isArray(res.data.members)) {
            const members = res.data.members
              .map((item: any) => normalizeUser(item?.user ?? item))
              .filter(Boolean) as PeerInfo[];

            const other = members.find(
              (user) => String(user.id) !== String(currentUserId)
            );

            if (other) {
              let resolvedPeer = other;

              if (!resolvedPeer.avatarUrl && resolvedPeer.id != null) {
                const profileRes = await fetch(`${BASE_URL}/api/users/${resolvedPeer.id}`, {
                  headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  },
                });

                if (profileRes.ok) {
                  const profileJson = await profileRes.json();
                  const profileUser = normalizeUser(profileJson?.data);
                  if (profileUser) {
                    resolvedPeer = {
                      ...resolvedPeer,
                      fullName: profileUser.fullName ?? resolvedPeer.fullName,
                      avatarUrl: profileUser.avatarUrl ?? resolvedPeer.avatarUrl,
                    };
                  }
                }
              }

              setPeer(resolvedPeer);
            }
          }
          return;
        }

        if (receiverId) {
          const resp = await fetch(`${BASE_URL}/api/users/${receiverId}`, {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });

          if (resp.ok) {
            const bd = await resp.json();
            const user = normalizeUser(bd?.data);
            setPeer(user ?? null);
          }
        }
      } catch (error) {
        console.error("Failed to load peer info", error);
        setPeer(null);
      }
    }

    loadPeer();
  }, [conversationId, receiverId, currentUserId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "nearest"
    });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    if (conversationId) {
      const success = await sendMessage({ conversationId, content: inputValue });
      if (success) {
        setInputValue("");
        onMessageSent?.(conversationId, inputValue);
      }
    } else if (receiverId) {
      const success = await sendMessage({ receiverId, content: inputValue });
      if (success) {
        setInputValue("");
      }
    }
  };

  if (!conversationId && !receiverId) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 text-slate-500 flex-col gap-3">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
          <Send className="w-8 h-8 text-primary opacity-50" />
        </div>
        <p>Chọn một cuộc hội thoại hoặc bắt đầu nhắn tin mới</p>
      </div>
    );
  }

  return (
  <div className="flex flex-col h-[calc(100vh-70px)] bg-[#f8fafc] overflow-hidden">
    <div className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <Avatar>
            {peer?.avatarUrl ? <AvatarImage src={peer.avatarUrl} /> : null}
            <AvatarFallback className="bg-pink-100 text-pink-600">
              {peer?.fullName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">
              {peer?.fullName || "Tin nhắn"}
            </h3>
            <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        {loading && messages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground">Đang tải...</div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            Bắt đầu cuộc trò chuyện...
          </div>
        ) : (
          messages.map((msg, index) => {
            const messageSenderId = msg.sender?.id ?? msg.sender?.userId;
            const isMe =
              String(messageSenderId) === String(currentUserId);

            const nextSenderId = messages[index + 1]?.sender?.id ?? messages[index + 1]?.sender?.userId;
            const showAvatar =
              index === messages.length - 1 ||
              String(nextSenderId) !== String(messageSenderId);

            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isMe={isMe}
                showAvatar={showAvatar}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex items-end gap-2 bg-slate-50 border rounded-2xl p-2 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Nhập tin nhắn..."
            className="flex-1 max-h-32 min-h-10 bg-transparent border-none focus:outline-none resize-none px-3 py-2 text-sm text-slate-700 custom-scrollbar"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="h-10 w-10 p-0 rounded-full shrink-0 shadow-sm transition-transform active:scale-95 mb-0.5 mr-0.5"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}