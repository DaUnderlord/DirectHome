import { User } from './auth';
import { Property } from './property';

/**
 * Enum for message types
 */
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  DOCUMENT = 'document',
  APPOINTMENT = 'appointment',
  SYSTEM = 'system'
}

/**
 * Enum for conversation status
 */
export enum ConversationStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  BLOCKED = 'blocked'
}

/**
 * Interface for message attachments
 */
export interface MessageAttachment {
  id: string;
  url: string;
  type: 'image' | 'document';
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: Date;
}

/**
 * Interface for messages
 */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  attachments?: MessageAttachment[];
  readBy: Record<string, Date>;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  isDeleted?: boolean;
}

/**
 * Interface for conversations
 */
export interface Conversation {
  id: string;
  participants: string[];
  propertyId?: string;
  property?: Property;
  lastMessage: Message;
  unreadCount: Record<string, number>;
  status: ConversationStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for conversation with participant details
 */
export interface ConversationWithDetails extends Conversation {
  participantDetails: User[];
}

/**
 * Interface for creating a new message
 */
export interface CreateMessageDto {
  conversationId: string;
  content: string;
  type: MessageType;
  attachments?: Omit<MessageAttachment, 'id' | 'createdAt'>[];
}

/**
 * Interface for creating a new conversation
 */
export interface CreateConversationDto {
  participantIds: string[];
  propertyId?: string;
  initialMessage: Omit<CreateMessageDto, 'conversationId'>;
}

/**
 * Interface for message pagination
 */
export interface MessagePagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

/**
 * Interface for message search filters
 */
export interface MessageSearchFilters {
  query?: string;
  startDate?: Date;
  endDate?: Date;
  messageTypes?: MessageType[];
}

/**
 * Interface for conversation search filters
 */
export interface ConversationSearchFilters {
  propertyId?: string;
  participantId?: string;
  status?: ConversationStatus;
}