import React, { useEffect } from 'react';
import { 
  AppShell, 
  Box, 
  Loader, 
  Text, 
  Title, 
  useMantineTheme 
} from '@mantine/core';
import { useMessaging } from '../../hooks';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import EmptyState from './EmptyState';

interface MessageCenterProps {
  propertyId?: string;
  recipientId?: string;
}

const MessageCenter: React.FC<MessageCenterProps> = ({ propertyId, recipientId }) => {
  const theme = useMantineTheme();
  const { 
    conversations, 
    activeConversationId, 
    activeConversation,
    isLoadingConversations, 
    conversationError,
    setActiveConversation,
    fetchConversations
  } = useMessaging();

  // Fetch conversations on mount or when filters change
  useEffect(() => {
    const filters = {};
    if (propertyId) Object.assign(filters, { propertyId });
    if (recipientId) Object.assign(filters, { participantId: recipientId });
    
    fetchConversations(filters);
  }, [fetchConversations, propertyId, recipientId]);

  // Handle error state
  if (conversationError) {
    return (
      <Box p="md" ta="center">
        <Title order={3} c="red.7" mb="md">Error Loading Messages</Title>
        <Text>{conversationError}</Text>
        <Text mt="md">
          <span 
            style={{ cursor: 'pointer', color: theme.colors.blue[6] }}
            onClick={() => fetchConversations()}
          >
            Click here
          </span> to try again.
        </Text>
      </Box>
    );
  }

  // Handle loading state
  if (isLoadingConversations && conversations.length === 0) {
    return (
      <Box p="xl" ta="center">
        <Loader size="lg" />
        <Text mt="md">Loading conversations...</Text>
      </Box>
    );
  }

  return (
    <AppShell
      navbar={{ 
        width: 320, 
        breakpoint: 'sm', 
        collapsed: { mobile: activeConversationId !== null } 
      }}
      padding={0}
    >
      <AppShell.Navbar p={0} withBorder>
        <ConversationList 
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversation}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        {activeConversationId && activeConversation ? (
          <MessageThread conversation={activeConversation} />
        ) : (
          <EmptyState 
            title="Select a conversation"
            description="Choose a conversation from the list or start a new one."
            icon="message"
          />
        )}
      </AppShell.Main>
    </AppShell>
  );
};

export default MessageCenter;