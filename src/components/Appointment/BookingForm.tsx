import React, { useEffect, useState } from 'react';
import { 
  Alert, 
  Button, 
  Group, 
  Loader, 
  Paper, 
  Select, 
  Stack, 
  Text, 
  Textarea, 
  useMantineTheme 
} from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { useAppointment } from '../../hooks';
import { AppointmentType } from '../../types/appointment';
import { addMinutes, format, isSameDay, parse, setHours, setMinutes } from 'date-fns';
import { IconAlertCircle, IconCalendarEvent, IconCheck } from '@tabler/icons-react';

interface BookingFormProps {
  propertyId?: string;
  hostId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  propertyId,
  hostId,
  onClose,
  onSuccess
}) => {
  const theme = useMantineTheme();
  const { 
    scheduleAppointment, 
    fetchAvailabilitySlots,
    availabilitySlots,
    hostAvailability,
    isLoading
  } = useAppointment();
  
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>('');
  const [type, setType] = useState<string>(AppointmentType.VIEWING);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<{ value: string; label: string; disabled?: boolean }[]>([]);
  
  // Fetch available slots when date changes
  useEffect(() => {
    if (date && hostId) {
      fetchAvailabilitySlots(hostId, date);
    }
  }, [date, hostId, fetchAvailabilitySlots]);
  
  // Update available times when slots change
  useEffect(() => {
    if (availabilitySlots.length > 0) {
      const times = availabilitySlots.map(slot => ({
        value: format(slot.startTime, 'HH:mm'),
        label: format(slot.startTime, 'h:mm a'),
        disabled: !slot.available
      }));
      
      setAvailableTimes(times);
      
      // Reset time if previously selected time is no longer available
      if (time) {
        const isTimeAvailable = times.some(t => t.value === time && !t.disabled);
        if (!isTimeAvailable) {
          setTime('');
        }
      }
    } else {
      setAvailableTimes([]);
      setTime('');
    }
  }, [availabilitySlots, time]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!date || !time || !type) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!propertyId && !hostId) {
      setError('Property or host information is missing');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Parse time string to create start time
      const [hours, minutes] = time.split(':').map(Number);
      const startTime = setMinutes(setHours(date, hours), minutes);
      
      // Calculate end time based on appointment duration
      const duration = hostAvailability?.appointmentDuration || 30; // Default to 30 minutes
      const endTime = addMinutes(startTime, duration);
      
      // Schedule appointment
      const result = await scheduleAppointment({
        propertyId: propertyId || 'property_1', // Default property ID if not provided
        hostId: hostId || 'user_1', // Default host ID if not provided
        attendeeId: 'current_user_id', // Current user is the attendee
        startTime,
        endTime,
        notes
      });
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(result.error || 'Failed to schedule appointment');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Check if a date is disabled
  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (date < new Date()) {
      return true;
    }
    
    // If we have host availability, check if the date is blocked
    if (hostAvailability) {
      // Check if date is blocked
      const isBlocked = hostAvailability.blockedDates.some(blockedDate => 
        isSameDay(blockedDate, date)
      );
      
      if (isBlocked) return true;
      
      // Check if day of week has available slots
      const dayOfWeek = format(date, 'EEEE').toLowerCase() as keyof typeof hostAvailability.weekdayAvailability;
      const daySlots = hostAvailability.weekdayAvailability[dayOfWeek];
      
      return daySlots.length === 0;
    }
    
    return false;
  };
  
  if (success) {
    return (
      <Alert 
        icon={<IconCheck size={16} />} 
        title="Appointment Scheduled!" 
        color="green"
      >
        Your appointment has been successfully scheduled. You will receive a confirmation soon.
      </Alert>
    );
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        {error && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Error" 
            color="red"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        
        <DatePickerInput
          label="Select Date"
          placeholder="Pick a date"
          value={date}
          onChange={setDate}
          excludeDate={isDateDisabled}
          minDate={new Date()}
          maxDate={hostAvailability?.maxDaysInAdvance 
            ? addMinutes(new Date(), hostAvailability.maxDaysInAdvance * 24 * 60) 
            : undefined
          }
          required
        />
        
        <Select
          label="Select Time"
          placeholder={date ? "Pick a time" : "Select a date first"}
          data={availableTimes}
          value={time}
          onChange={(value) => setTime(value || '')}
          disabled={!date || availableTimes.length === 0}
          required
        />
        
        {date && availableTimes.length === 0 && !isLoading && (
          <Text size="sm" c="dimmed">
            No available time slots for this date. Please select another date.
          </Text>
        )}
        
        {isLoading && date && (
          <Group justify="center">
            <Loader size="sm" />
            <Text size="sm">Loading available times...</Text>
          </Group>
        )}
        
        <Select
          label="Appointment Type"
          placeholder="Select appointment type"
          data={Object.values(AppointmentType).map(type => ({
            value: type,
            label: type.charAt(0).toUpperCase() + type.slice(1)
          }))}
          value={type}
          onChange={(value) => setType(value || AppointmentType.VIEWING)}
          required
        />
        
        <Textarea
          label="Notes (Optional)"
          placeholder="Add any additional information or questions"
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
          minRows={3}
        />
        
        {hostAvailability && (
          <Paper p="xs" withBorder bg={theme.colors.gray[0]}>
            <Text size="xs" c="dimmed">
              Appointments are {hostAvailability.appointmentDuration} minutes long with a {hostAvailability.bufferTime} minute buffer between appointments.
            </Text>
          </Paper>
        )}
        
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            leftSection={<IconCalendarEvent size={16} />}
            loading={isSubmitting}
            disabled={!date || !time || !type}
          >
            Schedule Appointment
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default BookingForm;