import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  Container, 
  Grid, 
  Group, 
  Paper, 
  SegmentedControl, 
  Stack, 
  Text, 
  Title 
} from '@mantine/core';
import { 
  IconCalendar, 
  IconCalendarEvent, 
  IconCalendarTime, 
  IconList 
} from '@tabler/icons-react';
import { useAppointment } from '../../hooks';
import AppointmentCalendar from './AppointmentCalendar';
import AppointmentList from './AppointmentList';
import AppointmentDetails from './AppointmentDetails';
import BookingForm from './BookingForm';
import { AppointmentStatus } from '../../types/appointment';

interface AppointmentSchedulerProps {
  propertyId?: string;
  hostId?: string;
  initialView?: 'calendar' | 'list';
  showBookingForm?: boolean;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ 
  propertyId,
  hostId,
  initialView = 'calendar',
  showBookingForm = false
}) => {
  const [view, setView] = useState<'calendar' | 'list'>(initialView);
  const [showForm, setShowForm] = useState(showBookingForm);
  
  const { 
    fetchAppointments, 
    selectedAppointment,
    selectAppointment,
    calendarView,
    setCalendarView,
    calendarDate,
    setCalendarDate,
    isLoading,
    error,
    fetchHostAvailability
  } = useAppointment();
  
  // Fetch appointments on mount
  useEffect(() => {
    const filters: any = {};
    if (propertyId) filters.propertyId = propertyId;
    if (hostId) filters.hostId = hostId;
    
    fetchAppointments(filters);
    
    // If hostId is provided, fetch host availability
    if (hostId) {
      fetchHostAvailability(hostId);
    }
  }, [fetchAppointments, fetchHostAvailability, propertyId, hostId]);
  
  // Handle booking form toggle
  const toggleBookingForm = () => {
    setShowForm(prev => !prev);
    // Clear selected appointment when toggling form
    if (selectedAppointment) {
      selectAppointment(null);
    }
  };
  
  // Handle appointment selection
  const handleAppointmentSelect = (appointmentId: string | null) => {
    selectAppointment(appointmentId);
    // Hide booking form when selecting an appointment
    if (appointmentId) {
      setShowForm(false);
    }
  };
  
  // Handle booking form close
  const handleBookingFormClose = () => {
    setShowForm(false);
  };
  
  // Handle booking form success
  const handleBookingSuccess = () => {
    setShowForm(false);
    // Refresh appointments
    const filters: any = {};
    if (propertyId) filters.propertyId = propertyId;
    if (hostId) filters.hostId = hostId;
    fetchAppointments(filters);
  };
  
  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="md">
        <Title order={2}>Appointment Scheduler</Title>
        
        <Group>
          <SegmentedControl
            value={view}
            onChange={(value: 'calendar' | 'list') => setView(value)}
            data={[
              { label: 'Calendar', value: 'calendar' },
              { label: 'List', value: 'list' }
            ]}
          />
          
          {!showForm && !selectedAppointment && (
            <Button 
              leftSection={<IconCalendarEvent size={16} />}
              onClick={toggleBookingForm}
            >
              Schedule Appointment
            </Button>
          )}
        </Group>
      </Group>
      
      {error && (
        <Paper p="md" mb="md" withBorder c="red">
          <Text>{error}</Text>
        </Paper>
      )}
      
      <Grid>
        {/* Main content area */}
        <Grid.Col span={{ base: 12, md: showForm || selectedAppointment ? 8 : 12 }}>
          {view === 'calendar' ? (
            <Card withBorder p="md">
              <Group justify="space-between" mb="md">
                <Title order={4}>Calendar View</Title>
                
                <SegmentedControl
                  value={calendarView}
                  onChange={(value: 'month' | 'week' | 'day' | 'agenda') => setCalendarView(value)}
                  data={[
                    { label: 'Month', value: 'month' },
                    { label: 'Week', value: 'week' },
                    { label: 'Day', value: 'day' },
                    { label: 'Agenda', value: 'agenda' }
                  ]}
                  size="xs"
                />
              </Group>
              
              <AppointmentCalendar 
                onSelectAppointment={handleAppointmentSelect}
                onDateChange={setCalendarDate}
                view={calendarView}
                date={calendarDate}
                isLoading={isLoading}
              />
            </Card>
          ) : (
            <Card withBorder p="md">
              <Group justify="space-between" mb="md">
                <Title order={4}>Appointments List</Title>
                
                <SegmentedControl
                  value="all"
                  data={[
                    { label: 'All', value: 'all' },
                    { label: 'Upcoming', value: 'upcoming' },
                    { label: 'Past', value: 'past' }
                  ]}
                  size="xs"
                />
              </Group>
              
              <AppointmentList 
                onSelectAppointment={handleAppointmentSelect}
                isLoading={isLoading}
              />
            </Card>
          )}
        </Grid.Col>
        
        {/* Sidebar for booking form or appointment details */}
        {(showForm || selectedAppointment) && (
          <Grid.Col span={{ base: 12, md: 4 }}>
            {showForm ? (
              <Card withBorder p="md">
                <Title order={4} mb="md">Schedule Appointment</Title>
                <BookingForm 
                  propertyId={propertyId}
                  hostId={hostId}
                  onClose={handleBookingFormClose}
                  onSuccess={handleBookingSuccess}
                />
              </Card>
            ) : selectedAppointment ? (
              <Card withBorder p="md">
                <Group justify="space-between" mb="md">
                  <Title order={4}>Appointment Details</Title>
                  <Button 
                    variant="subtle" 
                    onClick={() => handleAppointmentSelect(null)}
                    size="sm"
                  >
                    Close
                  </Button>
                </Group>
                <AppointmentDetails 
                  appointmentId={selectedAppointment.id}
                  onStatusChange={() => {
                    // Refresh appointments after status change
                    const filters: any = {};
                    if (propertyId) filters.propertyId = propertyId;
                    if (hostId) filters.hostId = hostId;
                    fetchAppointments(filters);
                  }}
                />
              </Card>
            ) : null}
          </Grid.Col>
        )}
      </Grid>
    </Container>
  );
};

export default AppointmentScheduler;