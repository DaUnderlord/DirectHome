import React, { useState } from 'react';
import { 
  ActionIcon, 
  Badge, 
  Box, 
  Button, 
  Divider, 
  Group, 
  Input, 
  ScrollArea, 
  Stack, 
  Text, 
  Title 
} from '@mantine/core';
import { 
  IconPlus, 
  IconSearch, 
  IconX 
} from '@tabler/icons-react';
import { Conversation } from '../../types/messaging';
import ConversationItem from './ConversationItem';
import EmptyState from './EmptyState';
import NewConversationModal from './NewConversationModal';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ 
  conversations, 
  activeConversationId, 
  onSelectConversation 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false);

  // Filter conversations based on search query
  const filteredConversations = searchQuery.trim() === '' 
    ? conversations 
    : conversations.filter(conversation => {
        // In a real app, we would search through participant names and property details
        // For now, just search through the last message content
        return conversation.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
      });

  return (
    <Stack h="100%" gap={0}>
      <Box p="md">
        <Group justify="space-between" mb="md">
          <Title order={4}>Messages</Title>
          <ActionIcon 
            variant="light" 
            color="blue" 
            onClick={() => setIsNewConversationModalOpen(true)}
          >
            <IconPlus size={18} />
          </ActionIcon>
        </Group>

        <Input
          placeholder="Search messages..."
          leftSection={<IconSearch size={16} />}
          rightSection={
            searchQuery ? (
              <ActionIcon size="sm" onClick={() => setSearchQuery('')}>
                <IconX size={14} />
              </ActionIcon>
            ) : null
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          mb="xs"
        />
      </Box>

      <Divider />

      <ScrollArea h="100%" scrollbarSize={6}>
        {filteredConversations.length > 0 ? (
          <Stack gap={0}>
            {filteredConversations.map(conversation => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onClick={() => onSelectConversation(conversation.id)}
              />
            ))}
          </Stack>
        ) : (
          <Box p="xl">
            {searchQuery ? (
              <EmptyState
                title="No results found"
                description={`No conversations match "${searchQuery}"`}
                icon="search"
                action={
                  <Button variant="light" onClick={() => setSearchQuery('')}>
                    Clear search
                  </Button>
                }
              />
            ) : (
              <EmptyState
                title="No conversations yet"
                description="Start a new conversation to connect with property owners or seekers."
                icon="message"
                action={
                  <Button onClick={() => setIsNewConversationModalOpen(true)}>
                    Start a conversation
                  </Button>
                }
              />
            )}
          </Box>
        )}
      </ScrollArea>

      <NewConversationModal
        opened={isNewConversationModalOpen}
        onClose={() => setIsNewConversationModalOpen(false)}
      />
    </Stack>
  );
};

export default ConversationList;