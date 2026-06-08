import { BASE_URL } from "./api";

export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080/ws';

export const TOPIC_USER_PREFIX = '/topic/user.';
export const TOPIC_CHAT_PREFIX = '/topic/conversation.';

export const SOCKET_EVENT = {
  NEW_MESSAGE: 'NEW_MESSAGE',
  NEW_MESSAGE_ALERT: 'NEW_MESSAGE_ALERT',
  USER_TYPING: 'USER_TYPING',
} as const;