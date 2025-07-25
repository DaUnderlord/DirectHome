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
import { mockConversations, mockMessages } from '../services/mockMessagingData';

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
            // In a real app, this would be an API call
            // For now, we'll use mock data
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            
            // Filter conversations based on filters
            let filteredConversations = [...mockConversations];
            
            if (filters.propertyId) {
              filteredConversations = filteredConversations.filter(
                c => c.propertyId === filters.propertyId
              );
            }
            
            if (filters.participantId) {
              filteredConversations = filteredConversations.filter(
                c => c.participants.includes(filters.participantId!)
              );
            }
            
            if (filters.status) {
              filteredConversations = filteredConversations.filter(
                c => c.status === filters.status
              );
            }
            
            set({ 
              conversations: filteredConversations,
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
            // In a real app, this would be an API call
            // For now, we'll use mock data
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            
            // Filter messages for this conversation
            const conversationMessages = mockMessages.filter(
              m => m.conversationId === conversationId
            );
            
            // Calculate pagination
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedMessages = conversationMessages.slice(startIndex, endIndex);
            const total = conversationMessages.length;
            
            set(state => ({ 
              messages: { 
                ...state.messages,
                [conversationId]: page === 1 
                  ? paginatedMessages 
                  : [...(state.messages[conversationId] || []), ...paginatedMessages]
              },
              messagePagination: {
                ...state.messagePagination,
                [conversationId]: {
                  page,
                  limit,
                  total,
                  hasMore: endIndex < total
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
          const { conversationId, content, type, attachments } = messageData;
          
          try {
            // In a real app, this would be an API call
            // For now, we'll simulate sending a message
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            
            // Create a new message
            const newMessage: Message = {
              id: `msg_${Date.now()}`,
              conversationId,
              senderId: 'current_user_id', // In a real app, this would come from auth context
              content,
              type,
              attachments: attachments?.map(a => ({
                ...a,
                id: `attachment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                createdAt: new Date()
              })),
              readBy: { 'current_user_id': new Date() },
              createdAt: new Date()
            };
            
            // Update the messages state
            set(state => ({
              messages: {
                ...state.messages,
                [conversationId]: [
                  ...(state.messages[conversationId] || []),
                  newMessage
                ]
              }
            }));
            
            // Update the conversation with the new last message
            set(state => ({
              conversations: state.conversations.map(conv => 
                conv.id === conversationId
                  ? { ...conv, lastMessage: newMessage, updatedAt: new Date() }
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
          const { participantIds, propertyId, initialMessage } = data;
          
          try {
            // In a real app, this would be an API call
            // For now, we'll simulate creating a conversation
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            
            // Create a new message for the conversation
            const newMessage: Message = {
              id: `msg_${Date.now()}`,
              conversationId: `conv_${Date.now()}`,
              senderId: 'current_user_id', // In a real app, this would come from auth context
              content: initialMessage.content,
              type: initialMessage.type,
              attachments: initialMessage.attachments?.map(a => ({
                ...a,
                id: `attachment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                createdAt: new Date()
              })),
              readBy: { 'current_user_id': new Date() },
              createdAt: new Date()
            };
            
            // Create a new conversation
            const newConversation: Conversation = {
              id: newMessage.conversationId,
              participants: [...participantIds, 'current_user_id'], // Include current user
              propertyId,
              lastMessage: newMessage,
              unreadCount: participantIds.reduce((acc, id) => {
                acc[id] = 1;
                return acc;
              }, {} as Record<string, number>),
              status: ConversationStatus.ACTIVE,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            // Update state
            set(state => ({
              conversations: [newConversation, ...state.conversations],
              messages: {
                ...state.messages,
                [newConversation.id]: [newMessage]
              },
              activeConversationId: newConversation.id
            }));
            
            return newConversation.id;
          } catch (error) {
            set({ 
              conversationError: error instanceof Error ? error.message : 'Failed to create conversation'
            });
            return null;
          }
        },
        
        markMessagesAsRead: async (conversationId) => {
          try {
            // In a real app, this would be an API call
            // For now, we'll simulate marking messages as read
            await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
            
            const currentUserId = 'current_user_id'; // In a real app, this would come from auth context
            
            // Update messages to mark them as read
            set(state => ({
              messages: {
                ...state.messages,
                [conversationId]: (state.messages[conversationId] || []).map(msg => ({
                  ...msg,
                  readBy: {
                    ...msg.readBy,
                    [currentUserId]: new Date()
                  }
                }))
              },
              // Update conversation unread count
              conversations: state.conversations.map(conv => 
                conv.id === conversationId
                  ? { 
                      ...conv, 
                      unreadCount: {
                        ...conv.unreadCount,
                        [currentUserId]: 0
                      }
                    }
                  : conv
              )
            }));
          } catch (error) {
            set({ 
              messageError: error instanceof Error ? error.message : 'Failed to mark messages as read'
            });
          }
        },
        
        archiveConversation: async (conversationId) => {
          try {
            // In a real app, this would be an API call
            // For now, we'll simulate archiving a conversation
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            
            // Update conversation status
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
            // In a real app, this would be an API call
            // For now, we'll simulate deleting a message
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            
            // Mark the message as deleted
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
            if (conversation?.lastMessage.id === messageId) {
              // Find the new last message
              const conversationMessages = get().messages[conversationId] || [];
              const newLastMessage = conversationMessages
                .filter(m => !m.isDeleted && m.id !== messageId)
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
              
              if (newLastMessage) {
                set(state => ({
                  conversations: state.conversations.map(conv => 
                    conv.id === conversationId
                      ? { ...conv, lastMessage: newLastMessage }
                      : conv
                  )
                }));
              }
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
            // In a real app, this would be an API call
            // For now, we'll simulate searching messages
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            
            // Get all messages for this conversation
            const allMessages = mockMessages.filter(m => m.conversationId === conversationId);
            
            // Apply filters
            let filteredMessages = [...allMessages];
            
            if (filters.query) {
              const query = filters.query.toLowerCase();
              filteredMessages = filteredMessages.filter(
                m => m.content.toLowerCase().includes(query)
              );
            }
            
            if (filters.startDate) {
              filteredMessages = filteredMessages.filter(
                m => m.createdAt >= filters.startDate!
              );
            }
            
            if (filters.endDate) {
              filteredMessages = filteredMessages.filter(
                m => m.createdAt <= filters.endDate!
              );
            }
            
            if (filters.messageTypes && filters.messageTypes.length > 0) {
              filteredMessages = filteredMessages.filter(
                m => filters.messageTypes!.includes(m.type)
              );
            }
            
            // Sort by date (newest first)
            filteredMessages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            
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