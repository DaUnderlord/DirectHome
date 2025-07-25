import React, { useState } from 'react';
import { 
  Button, 
  Group, 
  Modal, 
  Select, 
  Stack, 
  Textarea, 
  TextInput, 
  Title 
} from '@mantine/core';
import { useMessaging } from '../../hooks';
import { MessageType } from '../../types/messaging';

interface NewConversationModalProps {
  opened: boolean;
  onClose: () => void;
  initialRecipientId?: string;
  initialPropertyId?: string;
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({ 
  opened, 
  onClose,
  initialRecipientId,
  initialPropertyId
}) => {
  const { createConversation } = useMessaging();
  
  const [recipientId, setRecipientId] = useState<string | null>(initialRecipientId || null);
  const [propertyId, setPropertyId] = useState<string | null>(initialPropertyId || null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock data for recipients and properties
  // In a real app, this would come from the user and property stores
  const recipients = [
    { value: 'user_1', label: 'John Smith' },
    { value: 'user_2', label: 'Mary Johnson' },
    { value: 'user_3', label: 'David Williams' }
  ];
  
  const properties = [
    { value: 'property_1', label: '3 Bedroom Apartment in Lekki Phase 1' },
    { value: 'property_2', label: '2 Bedroom Flat in Ikeja GRA' },
    { value: 'property_3', label: 'Studio Apartment in Yaba' }
  ];
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipientId || !message.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await createConversation({
        participantIds: [recipientId],
        propertyId: propertyId || undefined,
        initialMessage: {
          content: message.trim(),
          type: MessageType.TEXT
        }
      });
      
      // Reset form and close modal
      setRecipientId(null);
      setPropertyId(null);
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form when modal closes
  const handleClose = () => {
    setRecipientId(initialRecipientId || null);
    setPropertyId(initialPropertyId || null);
    setMessage('');
    onClose();
  };
  
  return (
    <Modal 
      opened={opened} 
      onClose={handleClose} 
      title={<Title order={4}>New Conversation</Title>}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <Select
            label="Recipient"
            placeholder="Select a recipient"
            data={recipients}
            value={recipientId}
            onChange={setRecipientId}
            required
            searchable
            nothingFoundMessage="No recipients found"
            disabled={!!initialRecipientId}
          />
          
          <Select
            label="Property (Optional)"
            placeholder="Select a property"
            data={properties}
            value={propertyId}
            onChange={setPropertyId}
            clearable
            searchable
            nothingFoundMessage="No properties found"
            disabled={!!initialPropertyId}
          />
          
          <Textarea
            label="Message"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
            required
            minRows={3}
            maxRows={6}
            autosize
          />
          
          <Group justify="flex-end">
            <Button variant="subtle" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={!recipientId || !message.trim()}>
              Send Message
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default NewConversationModal;