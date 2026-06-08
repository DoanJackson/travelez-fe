import { BaseResponse } from "./api";

export interface User {
  id?: number;
  userId?: string | number;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface ChatMessage {
  id: number;
  content: string;
  sender: User;
  createdAt: string;
  files?: string[];
  conversationId?: number;
}

export interface Conversation {
  id: number;
  name?: string;
  avatarUrl?: string;
  updatedAt?: string;
  lastMessageSender?: User;
  lastMessageContent?: string;
  lastMessageMediaCount?: number;
  unreadCount: number;
  isGroup?: boolean;
  members?: User[];
}

export interface SendMessagePayload {
  conversationId?: number;
  receiverId?: number;
  content: string; 
}

export interface CursorResponse<T> {
  content: T[];
  nextCursor?: string | number | null;
  hasNext: boolean;
}

export type ConversationListResponse = BaseResponse<CursorResponse<Conversation>>;
export type MessageListResponse = BaseResponse<CursorResponse<ChatMessage>>;