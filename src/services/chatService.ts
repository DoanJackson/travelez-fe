import { AuthCookies } from '@/lib/cookie'; 
import { BASE_URL } from '@/constants/api';
import { SendMessagePayload, ConversationListResponse, MessageListResponse } from '@/types/chat';
import { handleUnauthorized } from '@/lib/auth-utils';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = AuthCookies.getToken(); 
  const headers: HeadersInit = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  const data = await response.json().catch(() => null);

  if (!response.ok) {

    if (response.status === 401) {
      handleUnauthorized(401);
    }
    const errorMessage = data?.message || `Chat API Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data;
}

export const chatService = {
  getConversations: async (size = 15, nextCursor: string | null = null): Promise<ConversationListResponse> => {
    const params = new URLSearchParams({ size: size.toString() });
    if (nextCursor) params.append('nextCursor', nextCursor);
    
    return fetchWithAuth(`/api/chat/conversations?${params.toString()}`);
  },

  getMessages: async (conversationId: number, size = 20, lastMessageId: number | null = null): Promise<MessageListResponse> => {
    const params = new URLSearchParams({ size: size.toString() });
    if (lastMessageId) params.append('lastMessageId', lastMessageId.toString());
    
    return fetchWithAuth(`/api/chat/conversations/${conversationId}/messages?${params.toString()}`);
  },

  getMembers: async (conversationId: number) => {
    return fetchWithAuth(`/api/chat/conversations/${conversationId}/members`);
  },

  sendMessage: async (payload: SendMessagePayload) => {
    const formData = new FormData();
    if (payload.conversationId) formData.append('conversationId', payload.conversationId.toString());
    if (payload.receiverId) formData.append('receiverId', payload.receiverId.toString());
    formData.append('content', payload.content);

    const token = AuthCookies.getToken();
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData, 
    });

    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },
};