import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Group, 
  Loader, 
  Paper, 
  Stack, 
  Text, 
  useMantineTheme 
} from '@mantine/core';
import { Calendar, DatePicker } from '@mantine/dates';
import { useAppointment } from '../../hooks';
import { AppointmentStatus } from '../../types/appointment';
import { format, isSameDay, isWithinInterval, startOfDay } from 'date-fns';

interface AppointmentCalendarProps {
  onSelectAppointment: (appointmentId: string | null) => void;
  onDateChange: (date: Date) => void;
  view: 'month' | 'week' | 'day' | 'agenda';
  date: Date;
  isLoading: boolean;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ 
  onSelectAppointment,
  onDateChange,
  view,
  date,
  isLoading
}) => {
  const theme = useMantineTheme();
  const { 
    appointments, 
    calendarEvents,
    formatAppointmentTime,
    hasAvailableSlots
  } = useAppointment();
  
  // Get appointments for the selected date
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => 
      isSameDay(appointment.startTime, date)
    );
  };
  
  // Check if a date has appointments
  const hasAppointments = (date: Date) => {
    return appointments.some(appointment => 
      isSameDay(appointment.startTime, date)
    );
  };
  
  // Get appointment status color
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED:
        return theme.colors.green[6];
      case AppointmentStatus.PENDING:
        return theme.colors.yellow[6];
      case AppointmentStatus.RESCHEDULED:
        return theme.colors.blue[6];
      case AppointmentStatus.CANCELLED:
        return theme.colors.red[6];
      case AppointmentStatus.COMPLETED:
        return theme.colors.gray[6];
      case AppointmentStatus.MISSED:
        return theme.colors.violet[6];
      default:
        return theme.colors.gray[6];
    }
  };
  
  // Render month view
  const renderMonthView = () => {
    return (
      <Calendar
        value={date}
        onChange={onDateChange}
        size="lg"
        styles={(theme) => ({
          day: {
            '&[data-has-appointments]': {
              backgroundColor: theme.colors.blue[0],
              fontWeight: 500,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '3px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: theme.colors.blue[6]
              }
            },
            '&[data-has-availability]': {
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '3px',
                right: '3px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: theme.colors.green[6]
              }
            }
          }
        })}
        renderDay={(date) => {
          const day = date.getDate();
          const hasAppts = hasAppointments(date);
          const hasAvail = hasAvailableSlots(date);
          
          return (
            <div
              data-has-appointments={hasAppts || undefined}
              data-has-availability={hasAvail || undefined}
            >
              {day}
            </div>
          );
        }}
      />
    );
  };
  
  // Render week view
  const renderWeekView = () => {
    // Get start and end of week
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    // Get all appointments for the week
    const weekAppointments = appointments.filter(appointment => 
      isWithinInterval(appointment.startTime, { start: startOfWeek, end: endOfWeek })
    );
    
    return (
      <Stack>
        <Group justify="space-between" mb="xs">
          <Text fw={500}>
            {format(startOfWeek, 'MMMM d')} - {format(endOfWeek, 'MMMM d, yyyy')}
          </Text>
          <Group>
            <Button 
              variant="subtle" 
              size="xs" 
              onClick={() => {
                const newDate = new Date(date);
                newDate.setDate(date.getDate() - 7);
                onDateChange(newDate);
              }}
            >
              Previous Week
            </Button>
            <Button 
              variant="subtle" 
              size="xs" 
              onClick={() => {
                const newDate = new Date(date);
                newDate.setDate(date.getDate() + 7);
                onDateChange(newDate);
              }}
            >
              Next Week
            </Button>
          </Group>
        </Group>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {/* Day headers */}
          {Array.from({ length: 7 }).map((_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            return (
              <Paper 
                key={`header-${i}`} 
                p="xs" 
                withBorder 
                bg={isSameDay(day, new Date()) ? theme.colors.blue[0] : undefined}
              >
                <Text ta="center" fw={500} size="sm">
                  {format(day, 'EEE')}
                </Text>
                <Text ta="center" size="xs">
                  {format(day, 'MMM d')}
                </Text>
              </Paper>
            );
          })}
          
          {/* Day cells */}
          {Array.from({ length: 7 }).map((_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            
            // Get appointments for this day
            const dayAppointments = weekAppointments.filter(appointment => 
              isSameDay(appointment.startTime, day)
            );
            
            return (
              <Paper 
                key={`day-${i}`} 
                p="xs" 
                withBorder 
                h={200} 
                style={{ overflowY: 'auto' }}
                bg={isSameDay(day, new Date()) ? theme.colors.blue[0] : undefined}
              >
                {dayAppointments.length > 0 ? (
                  <Stack gap="xs">
                    {dayAppointments.map(appointment => (
                      <Paper 
                        key={appointment.id} 
                        p="xs" 
                        withBorder 
                        style={{ 
                          borderLeft: `3px solid ${getStatusColor(appointment.status)}`,
                          cursor: 'pointer'
                        }}
                        onClick={() => onSelectAppointment(appointment.id)}
                      >
                        <Text size="xs" fw={500}>
                          {formatAppointmentTime(appointment.startTime)}
                        </Text>
                        <Text size="xs">
                          {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                        </Text>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Text size="xs" c="dimmed" ta="center" mt="md">
                    No appointments
                  </Text>
                )}
              </Paper>
            );
          })}
        </div>
      </Stack>
    );
  };
  
  // Render day view
  const renderDayView = () => {
    // Get appointments for the selected date
    const dayAppointments = getAppointmentsForDate(date);
    
    // Create time slots (9 AM to 6 PM)
    const timeSlots = Array.from({ length: 10 }).map((_, i) => {
      const hour = i + 9; // Start at 9 AM
      return {
        time: `${hour}:00`,
        hour,
        appointments: dayAppointments.filter(appointment => 
          appointment.startTime.getHours() === hour
        )
      };
    });
    
    return (
      <Stack>
        <Group justify="space-between" mb="xs">
          <Text fw={500}>
            {format(date, 'EEEE, MMMM d, yyyy')}
          </Text>
          <Group>
            <Button 
              variant="subtle" 
              size="xs" 
              onClick={() => {
                const newDate = new Date(date);
                newDate.setDate(date.getDate() - 1);
                onDateChange(newDate);
              }}
            >
              Previous Day
            </Button>
            <Button 
              variant="subtle" 
              size="xs" 
              onClick={() => {
                const newDate = new Date(date);
                newDate.setDate(date.getDate() + 1);
                onDateChange(newDate);
              }}
            >
              Next Day
            </Button>
          </Group>
        </Group>
        
        <Paper withBorder p={0}>
          {timeSlots.map((slot, i) => (
            <Box 
              key={slot.time} 
              p="sm" 
              style={{ 
                borderBottom: i < timeSlots.length - 1 ? `1px solid ${theme.colors.gray[3]}` : 'none',
                display: 'flex'
              }}
            >
              <Box w={60} mr="md">
                <Text size="sm" fw={500}>
                  {slot.time}
                </Text>
              </Box>
              
              <Box style={{ flex: 1 }}>
                {slot.appointments.length > 0 ? (
                  <Stack gap="xs">
                    {slot.appointments.map(appointment => (
                      <Paper 
                        key={appointment.id} 
                        p="xs" 
                        withBorder 
                        style={{ 
                          borderLeft: `3px solid ${getStatusColor(appointment.status)}`,
                          cursor: 'pointer'
                        }}
                        onClick={() => onSelectAppointment(appointment.id)}
                      >
                        <Group justify="space-between">
                          <Text size="sm" fw={500}>
                            {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {formatAppointmentTime(appointment.startTime)} - {formatAppointmentTime(appointment.endTime)}
                          </Text>
                        </Group>
                        {appointment.notes && (
                          <Text size="xs" lineClamp={1}>
                            {appointment.notes}
                          </Text>
                        )}
                      </Paper>
                    ))}
                  </Stack>
                ) : null}
              </Box>
            </Box>
          ))}
        </Paper>
      </Stack>
    );
  };
  
  // Render agenda view
  const renderAgendaView = () => {
    // Group appointments by date
    const appointmentsByDate = appointments.reduce((acc, appointment) => {
      const dateStr = format(appointment.startTime, 'yyyy-MM-dd');
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(appointment);
      return acc;
    }, {} as Record<string, typeof appointments>);
    
    // Sort dates
    const sortedDates = Object.keys(appointmentsByDate).sort();
    
    return (
      <Stack>
        <Group justify="space-between" mb="xs">
          <Text fw={500}>Upcoming Appointments</Text>
          <DatePicker 
            value={date} 
            onChange={(newDate) => newDate && onDateChange(newDate)} 
            size="sm"
          />
        </Group>
        
        {sortedDates.length > 0 ? (
          sortedDates.map(dateStr => {
            const dateAppointments = appointmentsByDate[dateStr];
            const appointmentDate = new Date(dateStr);
            
            return (
              <Paper key={dateStr} withBorder mb="md">
                <Box 
                  p="sm" 
                  bg={theme.colors.gray[0]} 
                  style={{ borderBottom: `1px solid ${theme.colors.gray[3]}` }}
                >
                  <Text fw={500}>
                    {format(appointmentDate, 'EEEE, MMMM d, yyyy')}
                  </Text>
                </Box>
                
                <Stack p="sm" gap="xs">
                  {dateAppointments.map(appointment => (
                    <Paper 
                      key={appointment.id} 
                      p="sm" 
                      withBorder 
                      style={{ 
                        borderLeft: `3px solid ${getStatusColor(appointment.status)}`,
                        cursor: 'pointer'
                      }}
                      onClick={() => onSelectAppointment(appointment.id)}
                    >
                      <Group justify="space-between">
                        <Text fw={500}>
                          {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                        </Text>
                        <Text size="sm" c="dimmed">
                          {formatAppointmentTime(appointment.startTime)} - {formatAppointmentTime(appointment.endTime)}
                        </Text>
                      </Group>
                      
                      {appointment.notes && (
                        <Text size="sm" mt="xs">
                          {appointment.notes}
                        </Text>
                      )}
                      
                      <Group mt="xs">
                        <Text size="xs" c="dimmed">
                          Status: {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            );
          })
        ) : (
          <Paper p="xl" withBorder ta="center">
            <Text c="dimmed">No appointments found</Text>
          </Paper>
        )}
      </Stack>
    );
  };
  
  // Render the appropriate view
  const renderView = () => {
    if (isLoading) {
      return (
        <Box ta="center" py="xl">
          <Loader />
          <Text mt="md">Loading appointments...</Text>
        </Box>
      );
    }
    
    switch (view) {
      case 'month':
        return renderMonthView();
      case 'week':
        return renderWeekView();
      case 'day':
        return renderDayView();
      case 'agenda':
        return renderAgendaView();
      default:
        return renderMonthView();
    }
  };
  
  return (
    <div>
      {renderView()}
    </div>
  );
};

export default AppointmentCalendar;