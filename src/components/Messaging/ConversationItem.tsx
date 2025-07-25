import React from 'react';
import { 
  Avatar, 
  Badge, 
  Box, 
  Group, 
  Paper, 
  Text, 
  useMantineTheme 
} from '@mantine/core';
import { Conversation, MessageType } from '../../types/messaging';
import { formatDistanceToNow } from 'date-fns';
import { IconCalendarEvent, IconFile, IconPhoto } from '@tabler/icons-react';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ 
  conversation, 
  isActive, 
  onClick 
}) => {
  const theme = useMantineTheme();
  const unreadCount = conversation.unreadCount['current_user_id'] || 0;
  const hasUnread = unreadCount > 0;
  
  // In a real app, we would get this from the user profile
  const otherParticipant = {
    id: conversation.participants.find(id => id !== 'current_user_id') || '',
    name: conversation.participants.find(id => id !== 'current_user_id') === 'user_1' 
      ? 'John Smith' 
      : conversation.participants.find(id => id !== 'current_user_id') === 'user_2'
        ? 'Mary Johnson'
        : 'David Williams',
    avatar: `https://i.pravatar.cc/150?u=${conversation.participants.find(id => id !== 'current_user_id')}`
  };

  // Format the last message preview
  const getMessagePreview = () => {
    const { lastMessage } = conversation;
    
    if (lastMessage.isDeleted) {
      return 'This message was deleted';
    }
    
    switch (lastMessage.type) {
      case MessageType.TEXT:
        return lastMessage.content;
      case MessageType.IMAGE:
        return 'Sent an image';
      case MessageType.DOCUMENT:
        return 'Sent a document';
      case MessageType.APPOINTMENT:
        return 'Sent an appointment request';
      case MessageType.SYSTEM:
        return lastMessage.content;
      default:
        return lastMessage.content;
    }
  };

  // Get message icon based on type
  const getMessageIcon = () => {
    const { lastMessage } = conversation;
    
    switch (lastMessage.type) {
      case MessageType.IMAGE:
        return <IconPhoto size={14} />;
      case MessageType.DOCUMENT:
        return <IconFile size={14} />;
      case MessageType.APPOINTMENT:
        return <IconCalendarEvent size={14} />;
      default:
        return null;
    }
  };

  // Format the timestamp
  const formatTimestamp = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Paper
      p="md"
      withBorder={!isActive}
      bg={isActive ? theme.colors.blue[0] : undefined}
      radius={0}
      onClick={onClick}
      style={{ 
        cursor: 'pointer',
        borderBottom: `1px solid ${theme.colors.gray[3]}`,
      }}
    >
      <Group wrap="nowrap" gap="md">
        <Avatar src={otherParticipant.avatar} radius="xl" size="md">
          {otherParticipant.name.charAt(0)}
        </Avatar>
        
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" wrap="nowrap">
            <Text fw={hasUnread ? 700 : 500} lineClamp={1}>
              {otherParticipant.name}
            </Text>
            <Text size="xs" c="dimmed">
              {formatTimestamp(conversation.lastMessage.createdAt)}
            </Text>
          </Group>
          
          <Group gap="xs" mt={4}>
            {getMessageIcon()}
            <Text 
              size="sm" 
              c={hasUnread ? "dark" : "dimmed"} 
              fw={hasUnread ? 600 : 400}
              lineClamp={1}
              style={{ flex: 1, minWidth: 0 }}
            >
              {conversation.lastMessage.senderId === 'current_user_id' && (
                <Text span c="dimmed">You: </Text>
              )}
              {getMessagePreview()}
            </Text>
            
            {hasUnread && (
              <Badge size="sm" variant="filled" color="blue" radius="xl">
                {unreadCount}
              </Badge>
            )}
          </Group>
          
          {conversation.propertyId && (
            <Text size="xs" c="dimmed" mt={4} lineClamp={1}>
              Re: {conversation.propertyId === 'property_1' 
                ? '3 Bedroom Apartment in Lekki Phase 1' 
                : conversation.propertyId === 'property_2'
                  ? '2 Bedroom Flat in Ikeja GRA'
                  : 'Studio Apartment in Yaba'}
            </Text>
          )}
        </Box>
      </Group>
    </Paper>
  );
};

export default ConversationItem;