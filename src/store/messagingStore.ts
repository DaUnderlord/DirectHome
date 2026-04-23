import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  Conversation, 
  ConversationSearchFilters, 
  ConversationStatus, 
  CreateConversationDto, 
  CreateMessageDto, 
  Message, 
  MessagePagination, 
  MessageSearchFilters 
} from '../types/messaging';
import { messagingService } from '../services/messagingService';
import { supabase } from '../lib/supabase';

// Helper to map database message to frontend type (for search)
const mapDbMessageToMessage = (dbMsg: any): Message => {
  const readBy: Record<string, Date> = {};
  (dbMsg.message_read_receipts || []).forEach((receipt: any) => {
    readBy[receipt.user_id] = new Date(receipt.read_at);
  });
  
  return {
    id: dbMsg.id,
    conversationId: dbMsg.conversation_id,
    senderId: dbMsg.sender_id,
    content: dbMsg.content,
    type: dbMsg.type,
    attachments: dbMsg.attachments || [],
    readBy,
    isDeleted: dbMsg.is_deleted || false,
    deletedAt: dbMsg.deleted_at ? new Date(dbMsg.deleted_at) : undefined,
    createdAt: new Date(dbMsg.created_at),
    updatedAt: new Date(dbMsg.updated_at)
  };
};

interface MessagingState {
  // Conversations
  conversations: Conversation[];
  activeConversationId: string | null;
  conversationFilters: ConversationSearchFilters;
  isLoadingConversations: boolean;
  conversationError: string | null;
  
  // Messages
  messages: Record<string, Message[]>;
  messagePagination: Record<string, MessagePagination>;
  messageFilters: MessageSearchFilters;
  isLoadingMessages: boolean;
  messageError: string | null;
  
  // Actions
  setActiveConversation: (conversationId: string | null) => void;
  fetchConversations: (filters?: ConversationSearchFilters) => Promise<void>;
  fetchMessages: (conversationId: string, page?: number, limit?: number) => Promise<void>;
  sendMessage: (messageData: CreateMessageDto) => Promise<void>;
  createConversation: (data: CreateConversationDto) => Promise<string | null>;
  markMessagesAsRead: (conversationId: string) => Promise<void>;
  archiveConversation: (conversationId: string) => Promise<void>;
  deleteMessage: (messageId: string, conversationId: string) => Promise<void>;
  searchMessages: (conversationId: string, filters: MessageSearchFilters) => Promise<void>;
}

export const useMessagingStore = create<MessagingState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        conversations: [],
        activeConversationId: null,
        conversationFilters: {},
        isLoadingConversations: false,
        conversationError: null,
        
        messages: {},
        messagePagination: {},
        messageFilters: {},
        isLoadingMessages: false,
        messageError: null,
        
        // Actions
        setActiveConversation: (conversationId) => {
          set({ activeConversationId: conversationId });
          
          // If we have a conversation ID and no messages loaded yet, fetch them
          if (conversationId && !get().messages[conversationId]) {
            get().fetchMessages(conversationId);
          }
        },
        
        fetchConversations: async (filters = {}) => {
          set({ 
            isLoadingConversations: true, 
            conversationError: null,
            conversationFilters: { ...get().conversationFilters, ...filters }
          });
          
          try {
            // Use real messaging service
            const response = await messagingService.fetchConversations(filters);
            
            if (!response.success) {
              set({ 
                conversationError: response.error || 'Failed to fetch conversations',
                isLoadingConversations: false 
              });
              return;
            }
            
            set({ 
              conversations: response.conversations,
              isLoadingConversations: false 
            });
          } catch (error) {
            set({ 
              conversationError: error instanceof Error ? error.message : 'Failed to fetch conversations',
              isLoadingConversations: false 
            });
          }
        },
        
        fetchMessages: async (conversationId, page = 1, limit = 20) => {
          set(state => ({ 
            isLoadingMessages: true, 
            messageError: null,
            messagePagination: { 
              ...state.messagePagination,
              [conversationId]: state.messagePagination[conversationId] || { 
                page, 
                limit, 
                total: 0,
                hasMore: true
              }
            }
          }));
          
          try {
            // Use real messaging service
            const response = await messagingService.fetchMessages(conversationId, page, limit);
            
            if (!response.success) {
              set({ 
                messageError: response.error || 'Failed to fetch messages',
                isLoadingMessages: false 
              });
              return;
            }
            
            set(state => ({ 
              messages: { 
                ...state.messages,
                [conversationId]: page === 1 
                  ? response.messages 
                  : [...(state.messages[conversationId] || []), ...response.messages]
              },
              messagePagination: {
                ...state.messagePagination,
                [conversationId]: {
                  page,
                  limit,
                  total: response.total,
                  hasMore: response.hasMore
                }
              },
              isLoadingMessages: false 
            }));
            
            // If this is the active conversation, mark messages as read
            if (get().activeConversationId === conversationId) {
              get().markMessagesAsRead(conversationId);
            }
          } catch (error) {
            set({ 
              messageError: error instanceof Error ? error.message : 'Failed to fetch messages',
              isLoadingMessages: false 
            });
          }
        },
        
        sendMessage: async (messageData) => {
          const { conversationId } = messageData;
          
          try {
            // Use real messaging service
            const response = await messagingService.sendMessage(messageData);
            
            if (!response.success || !response.message) {
              set({ 
                messageError: response.error || 'Failed to send message'
              });
              return;
            }
            
            // Update the messages state
            set(state => ({
              messages: {
                ...state.messages,
                [conversationId]: [
                  ...(state.messages[conversationId] || []),
                  response.message!
                ]
              }
            }));
            
            // Update the conversation with the new last message
            set(state => ({
              conversations: state.conversations.map(conv => 
                conv.id === conversationId
                  ? { ...conv, lastMessage: response.message!, updatedAt: new Date() }
                  : conv
              )
            }));
          } catch (error) {
            set({ 
              messageError: error instanceof Error ? error.message : 'Failed to send message'
            });
          }
        },
        
        createConversation: async (data) => {
          try {
            // Use real messaging service
            const response = await messagingService.createConversation(data);
            
            if (!response.success || !response.conversationId) {
              set({ 
                conversationError: response.error || 'Failed to create conversation'
              });
              return null;
            }
            
            // Refresh conversations list
            await get().fetchConversations(get().conversationFilters);
            
            // Set as active conversation
            set({ activeConversationId: response.conversationId });
            
            return response.conversationId;
          } catch (error) {
            set({ 
              conversationError: error instanceof Error ? error.message : 'Failed to create conversation'
            });
            return null;
          }
        },
        
        markMessagesAsRead: async (conversationId) => {
          try {
            // Use real messaging service
            const response = await messagingService.markMessagesAsRead(conversationId);
            
            if (!response.success) {
              set({ 
                messageError: response.error || 'Failed to mark messages as read'
              });
              return;
            }
            
            // Refresh conversations to update unread counts
            await get().fetchConversations(get().conversationFilters);
          } catch (error) {
            set({ 
              messageError: error instanceof Error ? error.message : 'Failed to mark messages as read'
            });
          }
        },
        
        archiveConversation: async (conversationId) => {
          try {
            // Use real messaging service
            const response = await messagingService.archiveConversation(conversationId);
            
            if (!response.success) {
              set({ 
                conversationError: response.error || 'Failed to archive conversation'
              });
              return;
            }
            
            // Update conversation status locally
            set(state => ({
              conversations: state.conversations.map(conv => 
                conv.id === conversationId
                  ? { ...conv, status: ConversationStatus.ARCHIVED }
                  : conv
              ),
              // If this was the active conversation, clear it
              activeConversationId: state.activeConversationId === conversationId 
                ? null 
                : state.activeConversationId
            }));
          } catch (error) {
            set({ 
              conversationError: error instanceof Error ? error.message : 'Failed to archive conversation'
            });
          }
        },
        
        deleteMessage: async (messageId, conversationId) => {
          try {
            // Use real messaging service
            const response = await messagingService.deleteMessage(messageId);
            
            if (!response.success) {
              set({ 
                messageError: response.error || 'Failed to delete message'
              });
              return;
            }
            
            // Mark the message as deleted locally
            set(state => ({
              messages: {
                ...state.messages,
                [conversationId]: (state.messages[conversationId] || []).map(msg => 
                  msg.id === messageId
                    ? { ...msg, isDeleted: true, content: 'This message has been deleted', deletedAt: new Date() }
                    : msg
                )
              }
            }));
            
            // If this was the last message in the conversation, update the conversation
            const conversation = get().conversations.find(c => c.id === conversationId);
            if (conversation?.lastMessage?.id === messageId) {
              // Refresh conversations to get updated last message
              await get().fetchConversations(get().conversationFilters);
            }
          } catch (error) {
            set({ 
              messageError: error instanceof Error ? error.message : 'Failed to delete message'
            });
          }
        },
        
        searchMessages: async (conversationId, filters) => {
          set({ 
            isLoadingMessages: true, 
            messageError: null,
            messageFilters: filters
          });
          
          try {
            // Build query
            let query = supabase
              .from('messages')
              .select(`
                *,
                message_read_receipts (user_id, read_at)
              `)
              .eq('conversation_id', conversationId)
              .eq('is_deleted', false);
            
            // Apply filters
            if (filters.query) {
              query = query.ilike('content', `%${filters.query}%`);
            }
            
            if (filters.startDate) {
              query = query.gte('created_at', filters.startDate.toISOString());
            }
            
            if (filters.endDate) {
              query = query.lte('created_at', filters.endDate.toISOString());
            }
            
            if (filters.messageTypes && filters.messageTypes.length > 0) {
              query = query.in('type', filters.messageTypes);
            }
            
            // Sort by date (oldest first)
            query = query.order('created_at', { ascending: true });
            
            const { data, error } = await query;
            
            if (error) {
              console.error('Error searching messages:', error);
              throw error;
            }
            
            const filteredMessages = (data || []).map(mapDbMessageToMessage);
            
            set(state => ({ 
              messages: { 
                ...state.messages,
                [conversationId]: filteredMessages
              },
              messagePagination: {
                ...state.messagePagination,
                [conversationId]: {
                  page: 1,
                  limit: filteredMessages.length,
                  total: filteredMessages.length,
                  hasMore: false
                }
              },
              isLoadingMessages: false 
            }));
          } catch (error) {
            set({ 
              messageError: error instanceof Error ? error.message : 'Failed to search messages',
              isLoadingMessages: false 
            });
          }
        }
      }),
      {
        name: 'messaging-store',
        partialize: (state) => ({
          // Only persist these fields
          activeConversationId: state.activeConversationId,
          conversationFilters: state.conversationFilters,
          messageFilters: state.messageFilters
        })
      }
    )
  )
);