import React from 'react';
import { 
  Avatar, 
  Box, 
  Group, 
  Menu, 
  Paper, 
  Text, 
  useMantineTheme 
} from '@mantine/core';
import { 
  IconCalendarEvent, 
  IconCheck, 
  IconChecks, 
  IconCopy, 
  IconDotsVertical, 
  IconFile, 
  IconPhoto, 
  IconTrash 
} from '@tabler/icons-react';
import { Message, MessageType } from '../../types/messaging';
import { formatDistanceToNow } from 'date-fns';
import { useMessaging } from '../../hooks';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName: string;
  senderAvatar?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwn, 
  senderName,
  senderAvatar
}) => {
  const theme = useMantineTheme();
  const { deleteMessage } = useMessaging();
  
  // Format the timestamp
  const formatTimestamp = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  // Get read status
  const getReadStatus = () => {
    const readCount = Object.keys(message.readBy).length;
    if (readCount === 0) return null;
    
    return readCount > 1 ? (
      <IconChecks size={14} color={theme.colors.blue[6]} />
    ) : (
      <IconCheck size={14} color={theme.colors.gray[6]} />
    );
  };
  
  // Handle message deletion
  const handleDelete = () => {
    deleteMessage(message.id, message.conversationId);
  };
  
  // Handle message copy
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };
  
  // Render message content based on type
  const renderMessageContent = () => {
    switch (message.type) {
      case MessageType.TEXT:
        return <Text>{message.content}</Text>;
        
      case MessageType.IMAGE:
        return (
          <Box>
            <Box 
              mb="xs" 
              style={{ 
                borderRadius: theme.radius.sm,
                overflow: 'hidden',
                maxWidth: 300
              }}
            >
              <img 
                src="https://picsum.photos/seed/img1/300/200" 
                alt="Shared image" 
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  display: 'block'
                }} 
              />
            </Box>
            {message.content && <Text>{message.content}</Text>}
          </Box>
        );
        
      case MessageType.DOCUMENT:
        return (
          <Box>
            <Paper 
              p="sm" 
              withBorder 
              mb="xs"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm
              }}
            >
              <IconFile size={24} />
              <div>
                <Text size="sm" fw={500}>Document.pdf</Text>
                <Text size="xs" c="dimmed">PDF • 2.4 MB</Text>
              </div>
            </Paper>
            {message.content && <Text>{message.content}</Text>}
          </Box>
        );
        
      case MessageType.APPOINTMENT:
        return (
          <Box>
            <Paper 
              p="sm" 
              withBorder 
              mb="xs"
              bg={theme.colors.blue[0]}
            >
              <Group mb="xs">
                <IconCalendarEvent size={24} color={theme.colors.blue[6]} />
                <Text fw={600}>Viewing Appointment</Text>
              </Group>
              <Text size="sm">Saturday, July 15, 2023 at 2:00 PM</Text>
              <Text size="xs" c="dimmed" mt={4}>
                3 Bedroom Apartment in Lekki Phase 1
              </Text>
            </Paper>
            {message.content && <Text>{message.content}</Text>}
          </Box>
        );
        
      case MessageType.SYSTEM:
        return (
          <Text size="sm" fs="italic" c="dimmed">
            {message.content}
          </Text>
        );
        
      default:
        return <Text>{message.content}</Text>;
    }
  };
  
  // Deleted message
  if (message.isDeleted) {
    return (
      <Box 
        style={{ 
          textAlign: isOwn ? 'right' : 'left',
          maxWidth: '80%',
          alignSelf: isOwn ? 'flex-end' : 'flex-start',
          margin: isOwn ? '0 0 0 auto' : '0 auto 0 0'
        }}
      >
        <Text size="sm" fs="italic" c="dimmed">
          {message.content}
        </Text>
      </Box>
    );
  }
  
  return (
    <Box 
      style={{ 
        maxWidth: '80%',
        alignSelf: isOwn ? 'flex-end' : 'flex-start',
        margin: isOwn ? '0 0 0 auto' : '0 auto 0 0'
      }}
    >
      {!isOwn && (
        <Group gap="xs" mb={4}>
          <Avatar src={senderAvatar} size="sm" radius="xl">
            {senderName.charAt(0)}
          </Avatar>
          <Text size="sm" fw={500}>{senderName}</Text>
        </Group>
      )}
      
      <Group gap="xs" align="flex-end" wrap="nowrap">
        <Paper 
          p="sm" 
          radius="md" 
          bg={isOwn ? theme.colors.blue[1] : theme.white}
          withBorder={!isOwn}
          style={{
            borderBottomRightRadius: isOwn ? 0 : undefined,
            borderBottomLeftRadius: !isOwn ? 0 : undefined
          }}
        >
          {renderMessageContent()}
        </Paper>
        
        <Menu position="bottom-end" withArrow withinPortal>
          <Menu.Target>
            <IconDotsVertical 
              size={16} 
              style={{ 
                cursor: 'pointer',
                opacity: 0.6,
                '&:hover': { opacity: 1 }
              }} 
            />
          </Menu.Target>
          
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconCopy size={14} />} onClick={handleCopy}>
              Copy message
            </Menu.Item>
            {isOwn && (
              <Menu.Item 
                leftSection={<IconTrash size={14} />} 
                color="red" 
                onClick={handleDelete}
              >
                Delete message
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </Group>
      
      <Group gap="xs" mt={4} justify={isOwn ? 'flex-end' : 'flex-start'}>
        <Text size="xs" c="dimmed">
          {formatTimestamp(message.createdAt)}
        </Text>
        {isOwn && getReadStatus()}
      </Group>
    </Box>
  );
};

export default MessageBubble;