import { useCallback, useEffect, useMemo } from 'react';
import { useMessagingStore } from '../store/messagingStore';
import { 
  ConversationSearchFilters, 
  CreateConversationDto, 
  CreateMessageDto, 
  MessageSearchFilters 
} from '../types/messaging';

/**
 * Custom hook for messaging functionality
 */
export const useMessaging = () => {
  const {
    conversations,
    activeConversationId,
    conversationFilters,
    isLoadingConversations,
    conversationError,
    messages,
    messagePagination,
    messageFilters,
    isLoadingMessages,
    messageError,
    setActiveConversation,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    markMessagesAsRead,
    archiveConversation,
    deleteMessage,
    searchMessages
  } = useMessagingStore();

  // Get active conversation
  const activeConversation = useMemo(() => {
    return activeConversationId 
      ? conversations.find(c => c.id === activeConversationId) 
      : null;
  }, [activeConversationId, conversations]);

  // Get messages for active conversation
  const activeMessages = useMemo(() => {
    return activeConversationId 
      ? messages[activeConversationId] || [] 
      : [];
  }, [activeConversationId, messages]);

  // Get pagination for active conversation
  const activePagination = useMemo(() => {
    return activeConversationId 
      ? messagePagination[activeConversationId] 
      : null;
  }, [activeConversationId, messagePagination]);

  // Load more messages for active conversation
  const loadMoreMessages = useCallback(() => {
    if (activeConversationId && activePagination?.hasMore) {
      fetchMessages(
        activeConversationId, 
        activePagination.page + 1, 
        activePagination.limit
      );
    }
  }, [activeConversationId, activePagination, fetchMessages]);

  // Get total unread count across all conversations
  const totalUnreadCount = useMemo(() => {
    return conversations.reduce((total, conversation) => {
      return total + (conversation.unreadCount['current_user_id'] || 0);
    }, 0);
  }, [conversations]);

  // Auto-mark messages as read when conversation becomes active
  useEffect(() => {
    if (activeConversationId) {
      const conversation = conversations.find(c => c.id === activeConversationId);
      if (conversation && conversation.unreadCount['current_user_id'] > 0) {
        markMessagesAsRead(activeConversationId);
      }
    }
  }, [activeConversationId, conversations, markMessagesAsRead]);

  // Fetch conversations on mount if none exist
  useEffect(() => {
    if (conversations.length === 0 && !isLoadingConversations) {
      fetchConversations();
    }
  }, [conversations.length, fetchConversations, isLoadingConversations]);

  return {
    // State
    conversations,
    activeConversationId,
    activeConversation,
    activeMessages,
    activePagination,
    conversationFilters,
    isLoadingConversations,
    conversationError,
    messageFilters,
    isLoadingMessages,
    messageError,
    totalUnreadCount,
    
    // Actions
    setActiveConversation,
    fetchConversations,
    fetchMessages,
    loadMoreMessages,
    sendMessage,
    createConversation,
    markMessagesAsRead,
    archiveConversation,
    deleteMessage,
    searchMessages,
    
    // Helper methods
    getConversationById: (id: string) => conversations.find(c => c.id === id),
    getMessagesForConversation: (id: string) => messages[id] || [],
    getUnreadCountForConversation: (id: string) => {
      const conversation = conversations.find(c => c.id === id);
      return conversation ? conversation.unreadCount['current_user_id'] || 0 : 0;
    },
    filterConversations: (filters: ConversationSearchFilters) => fetchConversations(filters),
    filterMessages: (conversationId: string, filters: MessageSearchFilters) => 
      searchMessages(conversationId, filters)
  };
};