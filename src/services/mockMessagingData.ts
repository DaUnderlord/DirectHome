import { Conversation, ConversationStatus, Message, MessageType } from '../types/messaging';

// Mock user IDs
const currentUserId = 'current_user_id';
const user1Id = 'user_1';
const user2Id = 'user_2';
const user3Id = 'user_3';

// Mock property IDs
const property1Id = 'property_1';
const property2Id = 'property_2';
const property3Id = 'property_3';

// Helper function to create dates in the past
const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// Helper function to create hours ago
const hoursAgo = (hours: number): Date => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
};

// Helper function to create minutes ago
const minutesAgo = (minutes: number): Date => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date;
};

// Mock messages
export const mockMessages: Message[] = [
  // Conversation 1 messages
  {
    id: 'msg_1',
    conversationId: 'conv_1',
    senderId: user1Id,
    content: 'Hello, I am interested in your property at Lekki Phase 1. Is it still available?',
    type: MessageType.TEXT,
    readBy: { [currentUserId]: daysAgo(2), [user1Id]: daysAgo(2) },
    createdAt: daysAgo(2)
  },
  {
    id: 'msg_2',
    conversationId: 'conv_1',
    senderId: currentUserId,
    content: 'Yes, it is still available. Would you like to schedule a viewing?',
    type: MessageType.TEXT,
    readBy: { [currentUserId]: daysAgo(2), [user1Id]: daysAgo(2) },
    createdAt: daysAgo(2)
  },
  {
    id: 'msg_3',
    conversationId: 'conv_1',
    senderId: user1Id,
    content: 'That would be great. I am available this weekend.',
    type: MessageType.TEXT,
    readBy: { [currentUserId]: daysAgo(1), [user1Id]: daysAgo(1) },
    createdAt: daysAgo(1)
  },
  {
    id: 'msg_4',
    conversationId: 'conv_1',
    senderId: currentUserId,
    content: 'Perfect. How about Saturday at 2 PM?',
    type: MessageType.TEXT,
    readBy: { [currentUserId]: daysAgo(1), [user1Id]: daysAgo(1) },
    createdAt: daysAgo(1)
  },
  {
    id: 'msg_5',
    conversationId: 'conv_1',
    senderId: user1Id,
    content: 'Saturday at 2 PM works for me. See you then!',
    type: MessageType.TEXT,
    readBy: { [currentUserId]: hoursAgo(12), [user1Id]: hoursAgo(12) },
    createdAt: hoursAgo(12)
  },
  {
    id: 'msg_6',
    conversationId: 'conv_1',
    senderId: currentUserId,
    content: 'Great! Here is the address: 123 Lekki Phase 1, Lagos.',
    type: MessageType.TEXT,
    readBy: { [currentUserId]: hoursAgo(12) },
    createdAt: hoursAgo(12)
  },
  
  // Conversation 2 messages
  {
    id: 'msg_7',
    conversationId: 'conv_2',
    senderId: user2Id,
    content: 'Hi, I saw your listing for the 3 bedroom apartment in Ikeja GRA. What is the monthly rent?',
    type: MessageType.TEXT,
    readBy: { [currentUserId]: daysAgo(5), [user2Id]: daysAgo(5) },
    createdAt: daysAgo(5)
  },
  {
    id: 'msg_8',
    conversationId: 'conv_2',
    senderId: currentUserId,
    content: 'The monthly rent is ₦350,000. It includes water and security.',
    type: MessageType.TEXT,
    readBy: { [currentUserId]: daysAgo(5), [user2Id]: daysAgo(5) },
    createdAt: daysAgo(5)
  },
  {
    id: 'msg_9',
    conversationId: 'conv_2',
    senderId: user2Id,
    content: 'That sounds reasonable. Are there any additional fees?',
    type: MessageType.TEXT,
    readBy: { [currentUserId]: daysAgo(4), [user2Id]: daysAgo(4) },
    createdAt: daysAgo(4)
  },
  {
    id: 'msg_10',
    conversationId: 'conv_2',
    senderId: currentUserId,
    content: 'There is a service charge of ₦50,000 per year for maintenance of common areas.',
    type: MessageType.TEXT,
    readBy: { [currentUserId]: daysAgo(4), [user2Id]: daysAgo(4) },
    createdAt: daysAgo(4)
  },
  {
    id: 'msg_11',
    conversationId: 'conv_2',
    senderId: user2Id,
    content: 'I see. Can I schedule a viewing for next week?',
    type: MessageType.TEXT,
    readBy: { [currentUserId]: daysAgo(3) },
    createdAt: daysAgo(3)
  },
  
  // Conversation 3 messages
  {
    id: 'msg_12',
    conversationId: 'conv_3',
    senderId: user3Id,
    content: 'Hello, is the studio apartment in Yaba still available?',
    type: MessageType.TEXT,
    readBy: { [currentUserId]: hoursAgo(2), [user3Id]: hoursAgo(2) },
    createdAt: hoursAgo(2)
  },
  {
    id: 'msg_13',
    conversationId: 'conv_3',
    senderId: currentUserId,
    content: 'Yes, it is still available. Are you interested in viewing it?',
    type: MessageType.TEXT,
    readBy: { [currentUserId]: hoursAgo(2), [user3Id]: hoursAgo(2) },
    createdAt: hoursAgo(2)
  },
  {
    id: 'msg_14',
    conversationId: 'conv_3',
    senderId: user3Id,
    content: 'Yes, I would like to see it. Is tomorrow possible?',
    type: MessageType.TEXT,
    readBy: { [currentUserId]: hoursAgo(1) },
    createdAt: hoursAgo(1)
  },
  {
    id: 'msg_15',
    conversationId: 'conv_3',
    senderId: user3Id,
    content: 'Also, does it come furnished?',
    type: MessageType.TEXT,
    readBy: {},
    createdAt: minutesAgo(30)
  }
];

// Mock conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    participants: [currentUserId, user1Id],
    propertyId: property1Id,
    lastMessage: mockMessages.find(m => m.id === 'msg_6')!,
    unreadCount: { [currentUserId]: 0, [user1Id]: 1 },
    status: ConversationStatus.ACTIVE,
    createdAt: daysAgo(2),
    updatedAt: hoursAgo(12)
  },
  {
    id: 'conv_2',
    participants: [currentUserId, user2Id],
    propertyId: property2Id,
    lastMessage: mockMessages.find(m => m.id === 'msg_11')!,
    unreadCount: { [currentUserId]: 1, [user2Id]: 0 },
    status: ConversationStatus.ACTIVE,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(3)
  },
  {
    id: 'conv_3',
    participants: [currentUserId, user3Id],
    propertyId: property3Id,
    lastMessage: mockMessages.find(m => m.id === 'msg_15')!,
    unreadCount: { [currentUserId]: 2, [user3Id]: 0 },
    status: ConversationStatus.ACTIVE,
    createdAt: hoursAgo(2),
    updatedAt: minutesAgo(30)
  }
];