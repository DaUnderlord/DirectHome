import { supabase } from '../lib/supabase';
import {
  Conversation,
  ConversationSearchFilters,
  ConversationStatus,
  CreateConversationDto,
  CreateMessageDto,
  Message,
  MessageSearchFilters,
  MessageType
} from '../types/messaging';

// Map database conversation to frontend type
const mapDbConversationToConversation = (dbConv: any): Conversation => {
  // Get participants
  const participants = (dbConv.conversation_participants || []).map((p: any) => p.user_id);
  
  // Get last message
  const lastMessage = dbConv.messages && dbConv.messages.length > 0
    ? mapDbMessageToMessage(dbConv.messages[0])
    : undefined;
  
  // Calculate unread counts
  const unreadCount: Record<string, number> = {};
  (dbConv.conversation_participants || []).forEach((p: any) => {
    unreadCount[p.user_id] = p.unread_count || 0;
  });
  
  return {
    id: dbConv.id,
    propertyId: dbConv.property_id,
    participants,
    lastMessage: lastMessage!,
    unreadCount,
    status: dbConv.status as ConversationStatus,
    createdAt: new Date(dbConv.created_at),
    updatedAt: new Date(dbConv.updated_at),
    property: dbConv.properties ? {
      id: dbConv.properties.id,
      title: dbConv.properties.title,
      location: {
        address: dbConv.properties.address,
        city: dbConv.properties.city,
        state: dbConv.properties.state,
        zipCode: dbConv.properties.zip_code || '',
        country: dbConv.properties.country || 'Nigeria'
      },
      images: (dbConv.properties as any).property_images || []
    } : undefined
  };
};

// Map database message to frontend type
const mapDbMessageToMessage = (dbMsg: any): Message => {
  // Parse read_by from message_read_receipts
  const readBy: Record<string, Date> = {};
  (dbMsg.message_read_receipts || []).forEach((receipt: any) => {
    readBy[receipt.user_id] = new Date(receipt.read_at);
  });
  
  return {
    id: dbMsg.id,
    conversationId: dbMsg.conversation_id,
    senderId: dbMsg.sender_id,
    content: dbMsg.content,
    type: dbMsg.type as MessageType,
    attachments: dbMsg.attachments || [],
    readBy,
    isDeleted: dbMsg.is_deleted || false,
    deletedAt: dbMsg.deleted_at ? new Date(dbMsg.deleted_at) : undefined,
    createdAt: new Date(dbMsg.created_at),
    updatedAt: new Date(dbMsg.updated_at)
  };
};

export const messagingService = {
  /**
   * Fetch conversations with filters
   */
  fetchConversations: async (filters: ConversationSearchFilters = {}) => {
    try {
      let query = supabase
        .from('conversations')
        .select(`
          *,
          properties (
            id,
            title,
            address,
            city,
            property_images (url, is_primary)
          ),
          conversation_participants (
            user_id,
            unread_count
          ),
          messages (
            *,
            message_read_receipts (user_id, read_at)
          )
        `)
        .order('updated_at', { ascending: false })
        .limit(1, { foreignTable: 'messages' }); // Get only the last message

      // Apply filters
      if (filters.propertyId) {
        query = query.eq('property_id', filters.propertyId);
      }

      if (filters.participantId) {
        // Filter by participant - need to join through conversation_participants
        query = query.contains('conversation_participants', [{ user_id: filters.participantId }]);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }

      const conversations = (data || []).map(mapDbConversationToConversation);

      return {
        conversations,
        success: true
      };
    } catch (error) {
      console.error('Conversation fetch failed:', error);
      return {
        conversations: [],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch conversations'
      };
    }
  },

  /**
   * Fetch messages for a conversation
   */
  fetchMessages: async (conversationId: string, page: number = 1, limit: number = 20) => {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('messages')
        .select(`
          *,
          message_read_receipts (user_id, read_at)
        `, { count: 'exact' })
        .eq('conversation_id', conversationId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      const messages = (data || []).map(mapDbMessageToMessage).reverse(); // Reverse to show oldest first

      return {
        messages,
        total: count || 0,
        hasMore: (count || 0) > to + 1,
        success: true
      };
    } catch (error) {
      console.error('Message fetch failed:', error);
      return {
        messages: [],
        total: 0,
        hasMore: false,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch messages'
      };
    }
  },

  /**
   * Send a message
   */
  sendMessage: async (messageData: CreateMessageDto) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Insert message
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: messageData.conversationId,
          sender_id: user.id,
          content: messageData.content,
          type: messageData.type || 'text',
          attachments: messageData.attachments || []
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      // Update conversation updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', messageData.conversationId);

      // Increment unread count for other participants
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id, unread_count')
        .eq('conversation_id', messageData.conversationId)
        .neq('user_id', user.id);

      if (participants) {
        for (const participant of participants) {
          await supabase
            .from('conversation_participants')
            .update({ unread_count: (participant.unread_count || 0) + 1 })
            .eq('conversation_id', messageData.conversationId)
            .eq('user_id', participant.user_id);
        }
      }

      return {
        message: mapDbMessageToMessage(message),
        success: true
      };
    } catch (error) {
      console.error('Message send failed:', error);
      return {
        message: null,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send message'
      };
    }
  },

  /**
   * Create a new conversation
   */
  createConversation: async (data: CreateConversationDto) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          property_id: data.propertyId,
          status: 'active'
        })
        .select()
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        throw convError;
      }

      // Add participants (current user + other participants)
      const allParticipants = [...data.participantIds, user.id];
      const participantInserts = allParticipants.map(userId => ({
        conversation_id: conversation.id,
        user_id: userId,
        unread_count: userId === user.id ? 0 : 1 // Others start with 1 unread
      }));

      const { error: partError } = await supabase
        .from('conversation_participants')
        .insert(participantInserts);

      if (partError) {
        console.error('Error adding participants:', partError);
        // Rollback conversation creation
        await supabase.from('conversations').delete().eq('id', conversation.id);
        throw partError;
      }

      // Send initial message if provided
      if (data.initialMessage) {
        await messagingService.sendMessage({
          conversationId: conversation.id,
          content: data.initialMessage.content,
          type: data.initialMessage.type || 'text',
          attachments: data.initialMessage.attachments
        });
      }

      return {
        conversationId: conversation.id,
        success: true
      };
    } catch (error) {
      console.error('Conversation creation failed:', error);
      return {
        conversationId: null,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create conversation'
      };
    }
  },

  /**
   * Mark messages as read
   */
  markMessagesAsRead: async (conversationId: string) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get all unread messages in this conversation
      const { data: messages } = await supabase
        .from('messages')
        .select('id')
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .is('message_read_receipts.user_id', null);

      if (messages && messages.length > 0) {
        // Create read receipts
        const receipts = messages.map(msg => ({
          message_id: msg.id,
          user_id: user.id
        }));

        await supabase
          .from('message_read_receipts')
          .insert(receipts);
      }

      // Reset unread count for current user
      await supabase
        .from('conversation_participants')
        .update({ unread_count: 0 })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);

      return {
        success: true
      };
    } catch (error) {
      console.error('Mark as read failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mark messages as read'
      };
    }
  },

  /**
   * Archive a conversation
   */
  archiveConversation: async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ status: 'archived' })
        .eq('id', conversationId);

      if (error) {
        console.error('Error archiving conversation:', error);
        throw error;
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Conversation archive failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to archive conversation'
      };
    }
  },

  /**
   * Delete a message
   */
  deleteMessage: async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
          content: 'This message has been deleted'
        })
        .eq('id', messageId);

      if (error) {
        console.error('Error deleting message:', error);
        throw error;
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Message deletion failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete message'
      };
    }
  }
};

export default messagingService;
