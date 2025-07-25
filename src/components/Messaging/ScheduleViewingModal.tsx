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
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { useMessaging } from '../../hooks';
import { MessageType } from '../../types/messaging';

interface ScheduleViewingModalProps {
  opened: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  recipientId: string;
  recipientName: string;
  conversationId: string;
}

const ScheduleViewingModal: React.FC<ScheduleViewingModalProps> = ({ 
  opened, 
  onClose,
  propertyId,
  propertyTitle,
  recipientId,
  recipientName,
  conversationId
}) => {
  const { sendMessage } = useMessaging();
  
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const timeString = `${formattedHour}:${formattedMinute}`;
        slots.push({ value: timeString, label: timeString });
      }
    }
    return slots;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time) return;
    
    setIsSubmitting(true);
    
    try {
      // Format the appointment date and time
      const appointmentDate = new Date(date);
      const [hours, minutes] = time.split(':').map(Number);
      appointmentDate.setHours(hours, minutes);
      
      // Create appointment message content
      const appointmentContent = `I would like to schedule a viewing for ${propertyTitle} on ${appointmentDate.toLocaleDateString()} at ${time}.${note ? `\n\nNote: ${note}` : ''}`;
      
      // Send the appointment message
      await sendMessage({
        conversationId,
        content: appointmentContent,
        type: MessageType.APPOINTMENT
      });
      
      // Reset form and close modal
      setDate(null);
      setTime('');
      setNote('');
      onClose();
    } catch (error) {
      console.error('Failed to schedule viewing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form when modal closes
  const handleClose = () => {
    setDate(null);
    setTime('');
    setNote('');
    onClose();
  };
  
  return (
    <Modal 
      opened={opened} 
      onClose={handleClose} 
      title={<Title order={4}>Schedule a Viewing</Title>}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Property"
            value={propertyTitle}
            disabled
          />
          
          <DatePickerInput
            label="Date"
            placeholder="Select a date"
            value={date}
            onChange={setDate}
            required
            minDate={new Date()}
            clearable={false}
          />
          
          <Select
            label="Time"
            placeholder="Select a time"
            data={generateTimeSlots()}
            value={time}
            onChange={(value) => setTime(value || '')}
            required
            searchable
          />
          
          <Textarea
            label="Additional Notes (Optional)"
            placeholder="Any specific requirements or questions..."
            value={note}
            onChange={(e) => setNote(e.currentTarget.value)}
            minRows={2}
            maxRows={4}
            autosize
          />
          
          <Group justify="flex-end">
            <Button variant="subtle" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={!date || !time}>
              Request Viewing
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default ScheduleViewingModal;