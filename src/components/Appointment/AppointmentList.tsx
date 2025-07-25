import React, { useState } from 'react';
import { 
  Badge, 
  Box, 
  Button, 
  Group, 
  Loader, 
  Paper, 
  Select, 
  Stack, 
  Table, 
  Text, 
  TextInput, 
  useMantineTheme 
} from '@mantine/core';
import { 
  IconCalendar, 
  IconSearch, 
  IconSortAscending, 
  IconSortDescending 
} from '@tabler/icons-react';
import { useAppointment } from '../../hooks';
import { AppointmentStatus, AppointmentType } from '../../types/appointment';
import { format } from 'date-fns';

interface AppointmentListProps {
  onSelectAppointment: (appointmentId: string) => void;
  isLoading: boolean;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ 
  onSelectAppointment,
  isLoading
}) => {
  const theme = useMantineTheme();
  const { 
    filteredAppointments, 
    formatAppointmentDate,
    formatAppointmentTime
  } = useAppointment();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Filter and sort appointments
  const getFilteredAppointments = () => {
    let filtered = [...filteredAppointments];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(appointment => 
        appointment.notes?.toLowerCase().includes(query) ||
        appointment.type.toLowerCase().includes(query) ||
        appointment.status.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(appointment => 
        appointment.status === statusFilter
      );
    }
    
    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter(appointment => 
        appointment.type === typeFilter
      );
    }
    
    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.startTime).getTime();
      const dateB = new Date(b.startTime).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    return filtered;
  };
  
  // Get status badge color
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED:
        return 'green';
      case AppointmentStatus.PENDING:
        return 'yellow';
      case AppointmentStatus.RESCHEDULED:
        return 'blue';
      case AppointmentStatus.CANCELLED:
        return 'red';
      case AppointmentStatus.COMPLETED:
        return 'gray';
      case AppointmentStatus.MISSED:
        return 'violet';
      default:
        return 'gray';
    }
  };
  
  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter(null);
    setTypeFilter(null);
  };
  
  const appointments = getFilteredAppointments();
  
  if (isLoading) {
    return (
      <Box ta="center" py="xl">
        <Loader />
        <Text mt="md">Loading appointments...</Text>
      </Box>
    );
  }
  
  return (
    <Stack>
      {/* Filters */}
      <Paper p="md" withBorder mb="md">
        <Group mb="md">
          <TextInput
            placeholder="Search appointments"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            style={{ flex: 1 }}
            leftSection={<IconSearch size={16} />}
          />
          
          <Select
            placeholder="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            data={[
              { value: '', label: 'All Statuses' },
              ...Object.values(AppointmentStatus).map(status => ({
                value: status,
                label: status.charAt(0).toUpperCase() + status.slice(1)
              }))
            ]}
            clearable
          />
          
          <Select
            placeholder="Type"
            value={typeFilter}
            onChange={setTypeFilter}
            data={[
              { value: '', label: 'All Types' },
              ...Object.values(AppointmentType).map(type => ({
                value: type,
                label: type.charAt(0).toUpperCase() + type.slice(1)
              }))
            ]}
            clearable
          />
          
          <Button 
            variant="subtle" 
            onClick={toggleSortDirection}
            leftSection={
              sortDirection === 'asc' 
                ? <IconSortAscending size={16} /> 
                : <IconSortDescending size={16} />
            }
          >
            {sortDirection === 'asc' ? 'Oldest First' : 'Newest First'}
          </Button>
          
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Group>
        
        <Group>
          <Text size="sm">
            <strong>{appointments.length}</strong> appointments found
          </Text>
        </Group>
      </Paper>
      
      {/* Appointments list */}
      {appointments.length > 0 ? (
        <Box style={{ overflowX: 'auto' }}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date & Time</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Notes</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {appointments.map(appointment => (
                <Table.Tr key={appointment.id}>
                  <Table.Td>
                    <Group gap="xs">
                      <IconCalendar size={16} />
                      <div>
                        <Text size="sm">{formatAppointmentDate(appointment.startTime)}</Text>
                        <Text size="xs" c="dimmed">
                          {formatAppointmentTime(appointment.startTime)} - {formatAppointmentTime(appointment.endTime)}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text transform="capitalize">
                      {appointment.type}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text lineClamp={2} size="sm">
                      {appointment.notes || 'No notes'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Button 
                      variant="light" 
                      size="xs"
                      onClick={() => onSelectAppointment(appointment.id)}
                    >
                      View Details
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>
      ) : (
        <Paper p="xl" withBorder ta="center">
          <Text c="dimmed">No appointments found</Text>
          <Button variant="subtle" mt="md" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Paper>
      )}
    </Stack>
  );
};

export default AppointmentList;