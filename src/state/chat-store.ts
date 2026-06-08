import { create } from 'zustand';

interface ChatState {
  unreadConversationIds: number[];
  syncUnreadConversations: (ids: number[]) => void;
  markConversationUnread: (id: number) => void;
  markConversationRead: (id: number) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  unreadConversationIds: [],
  
  syncUnreadConversations: (incomingIds) => set((state) => {
    const merged = Array.from(new Set([...state.unreadConversationIds, ...incomingIds]));
    return { unreadConversationIds: merged };
  }),
  
  markConversationUnread: (id) => set((state) => ({
    unreadConversationIds: state.unreadConversationIds.includes(id)
      ? state.unreadConversationIds
      : [...state.unreadConversationIds, id]
  })),
  
  markConversationRead: (id) => set((state) => ({
    unreadConversationIds: state.unreadConversationIds.filter((cid) => cid !== id)
  })),
}));