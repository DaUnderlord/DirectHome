import React, { useEffect, useRef, useState } from 'react';
import { 
  ActionIcon, 
  Avatar, 
  Box, 
  Button, 
  Divider, 
  Group, 
  Loader, 
  Paper, 
  ScrollArea, 
  Stack, 
  Text, 
  TextInput, 
  Title, 
  useMantineTheme 
} from '@mantine/core';
import { 
  IconArrowLeft, 
  IconCalendarPlus, 
  IconInfoCircle, 
  IconPaperclip, 
  IconSend 
} from '@tabler/icons-react';
import { Conversation, MessageType } from '../../types/messaging';
import { useMessaging } from '../../hooks';
import MessageBubble from './MessageBubble';
import ScheduleViewingModal from './ScheduleViewingModal';

interface MessageThreadProps {
  conversation: Conversation;
}

const MessageThread: React.FC<MessageThreadProps> = ({ conversation }) => {
  const theme = useMantineTheme();
  const [messageText, setMessageText] = useState('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  
  const { 
    activeMessages, 
    isLoadingMessages, 
    loadMoreMessages, 
    activePagination,
    sendMessage,
    setActiveConversation
  } = useMessaging();

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [activeMessages.length]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (messageText.trim() === '') return;
    
    sendMessage({
      conversationId: conversation.id,
      content: messageText.trim(),
      type: MessageType.TEXT
    });
    
    setMessageText('');
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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

  // Property details (in a real app, this would come from the property store)
  const propertyDetails = conversation.propertyId 
    ? {
        id: conversation.propertyId,
        title: conversation.propertyId === 'property_1' 
          ? '3 Bedroom Apartment in Lekki Phase 1' 
          : conversation.propertyId === 'property_2'
            ? '2 Bedroom Flat in Ikeja GRA'
            : 'Studio Apartment in Yaba'
      }
    : null;

  return (
    <Stack h="100%" gap={0}>
      {/* Header */}
      <Paper p="md" radius={0} withBorder style={{ borderTop: 0, borderLeft: 0, borderRight: 0 }}>
        <Group justify="space-between">
          <Group>
            <ActionIcon 
              variant="subtle" 
              color="gray" 
              onClick={() => setActiveConversation(null)}
              visibleFrom="sm"
            >
              <IconArrowLeft size={18} />
            </ActionIcon>
            
            <Avatar src={otherParticipant.avatar} radius="xl">
              {otherParticipant.name.charAt(0)}
            </Avatar>
            
            <div>
              <Text fw={600}>{otherParticipant.name}</Text>
              {propertyDetails && (
                <Text size="xs" c="dimmed">
                  Re: {propertyDetails.title}
                </Text>
              )}
            </div>
          </Group>
          
          <Group>
            {propertyDetails && (
              <Button 
                variant="light" 
                size="xs" 
                leftSection={<IconCalendarPlus size={16} />}
                onClick={() => setIsScheduleModalOpen(true)}
              >
                Schedule Viewing
              </Button>
            )}
            
            <ActionIcon variant="subtle" color="gray">
              <IconInfoCircle size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </Paper>
      
      {/* Messages */}
      <ScrollArea 
        h="100%" 
        viewportRef={viewportRef} 
        scrollbarSize={6} 
        scrollHideDelay={500}
        onScrollPositionChange={({ y }) => {
          // Load more messages when scrolling to top
          if (y === 0 && activePagination?.hasMore) {
            loadMoreMessages();
          }
        }}
      >
        <Box p="md" ref={scrollAreaRef}>
          {/* Loading indicator for pagination */}
          {isLoadingMessages && activePagination && activePagination.page > 1 && (
            <Box ta="center" py="md">
              <Loader size="sm" />
            </Box>
          )}
          
          {/* Property context */}
          {propertyDetails && (
            <Paper withBorder p="md" radius="md" mb="xl" bg={theme.colors.gray[0]}>
              <Group justify="space-between">
                <div>
                  <Text fw={600}>{propertyDetails.title}</Text>
                  <Text size="sm" c="dimmed">
                    This conversation is about this property
                  </Text>
                </div>
                <Button 
                  variant="light" 
                  size="xs" 
                  component="a" 
                  href={`/property/${propertyDetails.id}`}
                  target="_blank"
                >
                  View Property
                </Button>
              </Group>
            </Paper>
          )}
          
          {/* Messages */}
          <Stack gap="md">
            {activeMessages.map((message, index) => {
              // Check if we should show date divider
              const showDateDivider = index === 0 || (
                new Date(message.createdAt).toDateString() !== 
                new Date(activeMessages[index - 1].createdAt).toDateString()
              );
              
              return (
                <React.Fragment key={message.id}>
                  {showDateDivider && (
                    <Divider 
                      label={new Date(message.createdAt).toLocaleDateString()} 
                      labelPosition="center"
                      my="md"
                    />
                  )}
                  
                  <MessageBubble 
                    message={message} 
                    isOwn={message.senderId === 'current_user_id'}
                    senderName={
                      message.senderId === 'current_user_id' 
                        ? 'You' 
                        : otherParticipant.name
                    }
                    senderAvatar={
                      message.senderId === 'current_user_id' 
                        ? undefined 
                        : otherParticipant.avatar
                    }
                  />
                </React.Fragment>
              );
            })}
          </Stack>
        </Box>
      </ScrollArea>
      
      {/* Message input */}
      <Paper p="md" radius={0} withBorder style={{ borderBottom: 0, borderLeft: 0, borderRight: 0 }}>
        <Group align="flex-end">
          <TextInput
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.currentTarget.value)}
            onKeyDown={handleKeyPress}
            style={{ flex: 1 }}
            autoComplete="off"
            rightSection={
              <ActionIcon color="gray" variant="subtle">
                <IconPaperclip size={18} />
              </ActionIcon>
            }
          />
          
          <Button 
            onClick={handleSendMessage} 
            disabled={messageText.trim() === ''}
            rightSection={<IconSend size={16} />}
          >
            Send
          </Button>
        </Group>
      </Paper>
      
      {/* Schedule viewing modal */}
      {propertyDetails && (
        <ScheduleViewingModal
          opened={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          propertyId={propertyDetails.id}
          propertyTitle={propertyDetails.title}
          recipientId={otherParticipant.id}
          recipientName={otherParticipant.name}
          conversationId={conversation.id}
        />
      )}
    </Stack>
  );
};

export default MessageThread;