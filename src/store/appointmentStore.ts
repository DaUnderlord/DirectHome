import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  Appointment, 
  AppointmentFilters, 
  AppointmentPagination, 
  AppointmentStatus, 
  AppointmentType, 
  AvailabilitySlot, 
  CalendarEvent, 
  CancelAppointmentDto, 
  CreateAppointmentDto, 
  HostAvailability, 
  UpdateAppointmentDto 
} from '../types/appointment';
import { addDays, addMinutes, format, isSameDay, parseISO, setHours, setMinutes } from 'date-fns';

// Mock data for testing
const mockAppointments: Appointment[] = [
  {
    id: 'apt_1',
    propertyId: 'property_1',
    hostId: 'user_1',
    attendeeId: 'current_user_id',
    startTime: addDays(new Date(), 2),
    endTime: addMinutes(addDays(new Date(), 2), 30),
    status: AppointmentStatus.CONFIRMED,
    type: AppointmentType.VIEWING,
    notes: 'Looking forward to showing you the property!',
    conversationId: 'conv_1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'apt_2',
    propertyId: 'property_2',
    hostId: 'user_2',
    attendeeId: 'current_user_id',
    startTime: addDays(new Date(), 5),
    endTime: addMinutes(addDays(new Date(), 5), 30),
    status: AppointmentStatus.PENDING,
    type: AppointmentType.VIEWING,
    notes: 'Please confirm if this time works for you.',
    conversationId: 'conv_2',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'apt_3',
    propertyId: 'property_3',
    hostId: 'current_user_id',
    attendeeId: 'user_3',
    startTime: addDays(new Date(), 1),
    endTime: addMinutes(addDays(new Date(), 1), 30),
    status: AppointmentStatus.PENDING,
    type: AppointmentType.VIEWING,
    conversationId: 'conv_3',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock host availability
const mockHostAvailability: HostAvailability = {
  userId: 'current_user_id',
  weekdayAvailability: {
    monday: [
      { start: '09:00', end: '12:00', available: true },
      { start: '13:00', end: '17:00', available: true }
    ],
    tuesday: [
      { start: '09:00', end: '12:00', available: true },
      { start: '13:00', end: '17:00', available: true }
    ],
    wednesday: [
      { start: '09:00', end: '12:00', available: true },
      { start: '13:00', end: '17:00', available: true }
    ],
    thursday: [
      { start: '09:00', end: '12:00', available: true },
      { start: '13:00', end: '17:00', available: true }
    ],
    friday: [
      { start: '09:00', end: '12:00', available: true },
      { start: '13:00', end: '17:00', available: true }
    ],
    saturday: [
      { start: '10:00', end: '14:00', available: true }
    ],
    sunday: []
  },
  blockedDates: [
    addDays(new Date(), 3), // Blocked date example
    addDays(new Date(), 10) // Blocked date example
  ],
  appointmentDuration: 30, // 30 minutes
  bufferTime: 15, // 15 minutes buffer between appointments
  maxDaysInAdvance: 30, // Can book up to 30 days in advance
  autoConfirm: false
};

interface AppointmentState {
  // Appointments
  appointments: Appointment[];
  filteredAppointments: Appointment[];
  selectedAppointmentId: string | null;
  appointmentFilters: AppointmentFilters;
  pagination: AppointmentPagination;
  isLoading: boolean;
  error: string | null;
  
  // Calendar
  calendarEvents: CalendarEvent[];
  calendarView: 'month' | 'week' | 'day' | 'agenda';
  calendarDate: Date;
  
  // Availability
  hostAvailability: HostAvailability | null;
  availabilitySlots: AvailabilitySlot[];
  
  // Actions
  fetchAppointments: (filters?: AppointmentFilters) => Promise<void>;
  fetchAppointmentById: (id: string) => Promise<Appointment | null>;
  createAppointment: (data: CreateAppointmentDto) => Promise<string | null>;
  updateAppointment: (id: string, data: UpdateAppointmentDto) => Promise<boolean>;
  cancelAppointment: (id: string, data: CancelAppointmentDto) => Promise<boolean>;
  confirmAppointment: (id: string) => Promise<boolean>;
  rescheduleAppointment: (id: string, startTime: Date, endTime: Date) => Promise<boolean>;
  selectAppointment: (id: string | null) => void;
  
  // Calendar actions
  setCalendarView: (view: 'month' | 'week' | 'day' | 'agenda') => void;
  setCalendarDate: (date: Date) => void;
  
  // Availability actions
  fetchHostAvailability: (hostId: string) => Promise<void>;
  updateHostAvailability: (availability: Partial<HostAvailability>) => Promise<boolean>;
  fetchAvailabilitySlots: (hostId: string, date: Date) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        appointments: [],
        filteredAppointments: [],
        selectedAppointmentId: null,
        appointmentFilters: {},
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          hasMore: false
        },
        isLoading: false,
        error: null,
        
        calendarEvents: [],
        calendarView: 'month',
        calendarDate: new Date(),
        
        hostAvailability: null,
        availabilitySlots: [],
        
        // Actions
        fetchAppointments: async (filters = {}) => {
          set({ isLoading: true, error: null, appointmentFilters: { ...get().appointmentFilters, ...filters } });
          
          try {
            // In a real app, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            
            // Filter appointments based on filters
            let filtered = [...mockAppointments];
            
            if (filters.propertyId) {
              filtered = filtered.filter(a => a.propertyId === filters.propertyId);
            }
            
            if (filters.hostId) {
              filtered = filtered.filter(a => a.hostId === filters.hostId);
            }
            
            if (filters.attendeeId) {
              filtered = filtered.filter(a => a.attendeeId === filters.attendeeId);
            }
            
            if (filters.status) {
              const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
              filtered = filtered.filter(a => statuses.includes(a.status));
            }
            
            if (filters.type) {
              const types = Array.isArray(filters.type) ? filters.type : [filters.type];
              filtered = filtered.filter(a => types.includes(a.type));
            }
            
            if (filters.startDate) {
              filtered = filtered.filter(a => a.startTime >= filters.startDate!);
            }
            
            if (filters.endDate) {
              filtered = filtered.filter(a => a.startTime <= filters.endDate!);
            }
            
            // Create calendar events from appointments
            const events: CalendarEvent[] = filtered.map(appointment => ({
              id: appointment.id,
              title: appointment.type === AppointmentType.VIEWING 
                ? 'Property Viewing' 
                : appointment.type === AppointmentType.INSPECTION
                  ? 'Property Inspection'
                  : appointment.type === AppointmentType.HANDOVER
                    ? 'Property Handover'
                    : 'Appointment',
              start: appointment.startTime,
              end: appointment.endTime,
              allDay: false,
              color: appointment.status === AppointmentStatus.CONFIRMED 
                ? '#4CAF50' // Green
                : appointment.status === AppointmentStatus.PENDING
                  ? '#FFC107' // Yellow
                  : appointment.status === AppointmentStatus.CANCELLED
                    ? '#F44336' // Red
                    : appointment.status === AppointmentStatus.RESCHEDULED
                      ? '#2196F3' // Blue
                      : appointment.status === AppointmentStatus.COMPLETED
                        ? '#9E9E9E' // Gray
                        : '#9C27B0', // Purple (missed)
              description: appointment.notes || '',
              appointmentId: appointment.id,
              propertyId: appointment.propertyId,
              status: appointment.status
            }));
            
            set({ 
              appointments: mockAppointments,
              filteredAppointments: filtered,
              calendarEvents: events,
              pagination: {
                page: 1,
                limit: 10,
                total: filtered.length,
                hasMore: false
              },
              isLoading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch appointments',
              isLoading: false 
            });
          }
        },
        
        fetchAppointmentById: async (id) => {
          set({ isLoading: true, error: null });
          
          try {
            // In a real app, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            
            const appointment = mockAppointments.find(a => a.id === id);
            
            if (!appointment) {
              set({ 
                error: 'Appointment not found',
                isLoading: false 
              });
              return null;
            }
            
            set({ 
              selectedAppointmentId: id,
              isLoading: false 
            });
            
            return appointment;
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch appointment',
              isLoading: false 
            });
            return null;
          }
        },
        
        createAppointment: async (data) => {
          set({ isLoading: true, error: null });
          
          try {
            // In a real app, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            
            // Create a new appointment
            const newAppointment: Appointment = {
              id: `apt_${Date.now()}`,
              ...data,
              status: AppointmentStatus.PENDING,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            // Update state
            set(state => ({
              appointments: [...state.appointments, newAppointment],
              filteredAppointments: [...state.filteredAppointments, newAppointment],
              isLoading: false
            }));
            
            // Add to calendar events
            const newEvent: CalendarEvent = {
              id: newAppointment.id,
              title: newAppointment.type === AppointmentType.VIEWING 
                ? 'Property Viewing' 
                : newAppointment.type === AppointmentType.INSPECTION
                  ? 'Property Inspection'
                  : newAppointment.type === AppointmentType.HANDOVER
                    ? 'Property Handover'
                    : 'Appointment',
              start: newAppointment.startTime,
              end: newAppointment.endTime,
              allDay: false,
              color: '#FFC107', // Yellow for pending
              description: newAppointment.notes || '',
              appointmentId: newAppointment.id,
              propertyId: newAppointment.propertyId,
              status: newAppointment.status
            };
            
            set(state => ({
              calendarEvents: [...state.calendarEvents, newEvent]
            }));
            
            return newAppointment.id;
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to create appointment',
              isLoading: false 
            });
            return null;
          }
        },
        
        updateAppointment: async (id, data) => {
          set({ isLoading: true, error: null });
          
          try {
            // In a real app, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            
            // Update appointment
            set(state => {
              const updatedAppointments = state.appointments.map(appointment => 
                appointment.id === id
                  ? { 
                      ...appointment, 
                      ...data,
                      updatedAt: new Date()
                    }
                  : appointment
              );
              
              const updatedFilteredAppointments = state.filteredAppointments.map(appointment => 
                appointment.id === id
                  ? { 
                      ...appointment, 
                      ...data,
                      updatedAt: new Date()
                    }
                  : appointment
              );
              
              // Update calendar event
              const updatedCalendarEvents = state.calendarEvents.map(event => 
                event.appointmentId === id
                  ? { 
                      ...event,
                      start: data.startTime || event.start,
                      end: data.endTime || event.end,
                      status: data.status || event.status as AppointmentStatus,
                      color: data.status === AppointmentStatus.CONFIRMED 
                        ? '#4CAF50' // Green
                        : data.status === AppointmentStatus.PENDING
                          ? '#FFC107' // Yellow
                          : data.status === AppointmentStatus.CANCELLED
                            ? '#F44336' // Red
                            : data.status === AppointmentStatus.RESCHEDULED
                              ? '#2196F3' // Blue
                              : data.status === AppointmentStatus.COMPLETED
                                ? '#9E9E9E' // Gray
                                : event.color
                    }
                  : event
              );
              
              return {
                appointments: updatedAppointments,
                filteredAppointments: updatedFilteredAppointments,
                calendarEvents: updatedCalendarEvents,
                isLoading: false
              };
            });
            
            return true;
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to update appointment',
              isLoading: false 
            });
            return false;
          }
        },
        
        cancelAppointment: async (id, data) => {
          set({ isLoading: true, error: null });
          
          try {
            // In a real app, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            
            // Cancel appointment
            set(state => {
              const updatedAppointments = state.appointments.map(appointment => 
                appointment.id === id
                  ? { 
                      ...appointment, 
                      status: AppointmentStatus.CANCELLED,
                      cancelReason: data.cancelReason,
                      cancelledBy: 'current_user_id', // In a real app, this would be the current user's ID
                      updatedAt: new Date()
                    }
                  : appointment
              );
              
              const updatedFilteredAppointments = state.filteredAppointments.map(appointment => 
                appointment.id === id
                  ? { 
                      ...appointment, 
                      status: AppointmentStatus.CANCELLED,
                      cancelReason: data.cancelReason,
                      cancelledBy: 'current_user_id',
                      updatedAt: new Date()
                    }
                  : appointment
              );
              
              // Update calendar event
              const updatedCalendarEvents = state.calendarEvents.map(event => 
                event.appointmentId === id
                  ? { 
                      ...event,
                      status: AppointmentStatus.CANCELLED,
                      color: '#F44336' // Red
                    }
                  : event
              );
              
              return {
                appointments: updatedAppointments,
                filteredAppointments: updatedFilteredAppointments,
                calendarEvents: updatedCalendarEvents,
                isLoading: false
              };
            });
            
            return true;
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to cancel appointment',
              isLoading: false 
            });
            return false;
          }
        },
        
        confirmAppointment: async (id) => {
          set({ isLoading: true, error: null });
          
          try {
            // In a real app, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            
            // Confirm appointment
            set(state => {
              const updatedAppointments = state.appointments.map(appointment => 
                appointment.id === id
                  ? { 
                      ...appointment, 
                      status: AppointmentStatus.CONFIRMED,
                      updatedAt: new Date()
                    }
                  : appointment
              );
              
              const updatedFilteredAppointments = state.filteredAppointments.map(appointment => 
                appointment.id === id
                  ? { 
                      ...appointment, 
                      status: AppointmentStatus.CONFIRMED,
                      updatedAt: new Date()
                    }
                  : appointment
              );
              
              // Update calendar event
              const updatedCalendarEvents = state.calendarEvents.map(event => 
                event.appointmentId === id
                  ? { 
                      ...event,
                      status: AppointmentStatus.CONFIRMED,
                      color: '#4CAF50' // Green
                    }
                  : event
              );
              
              return {
                appointments: updatedAppointments,
                filteredAppointments: updatedFilteredAppointments,
                calendarEvents: updatedCalendarEvents,
                isLoading: false
              };
            });
            
            return true;
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to confirm appointment',
              isLoading: false 
            });
            return false;
          }
        },
        
        rescheduleAppointment: async (id, startTime, endTime) => {
          set({ isLoading: true, error: null });
          
          try {
            // In a real app, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            
            // Reschedule appointment
            set(state => {
              const updatedAppointments = state.appointments.map(appointment => 
                appointment.id === id
                  ? { 
                      ...appointment, 
                      startTime,
                      endTime,
                      status: AppointmentStatus.RESCHEDULED,
                      updatedAt: new Date()
                    }
                  : appointment
              );
              
              const updatedFilteredAppointments = state.filteredAppointments.map(appointment => 
                appointment.id === id
                  ? { 
                      ...appointment, 
                      startTime,
                      endTime,
                      status: AppointmentStatus.RESCHEDULED,
                      updatedAt: new Date()
                    }
                  : appointment
              );
              
              // Update calendar event
              const updatedCalendarEvents = state.calendarEvents.map(event => 
                event.appointmentId === id
                  ? { 
                      ...event,
                      start: startTime,
                      end: endTime,
                      status: AppointmentStatus.RESCHEDULED,
                      color: '#2196F3' // Blue
                    }
                  : event
              );
              
              return {
                appointments: updatedAppointments,
                filteredAppointments: updatedFilteredAppointments,
                calendarEvents: updatedCalendarEvents,
                isLoading: false
              };
            });
            
            return true;
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to reschedule appointment',
              isLoading: false 
            });
            return false;
          }
        },
        
        selectAppointment: (id) => {
          set({ selectedAppointmentId: id });
        },
        
        setCalendarView: (view) => {
          set({ calendarView: view });
        },
        
        setCalendarDate: (date) => {
          set({ calendarDate: date });
        },
        
        fetchHostAvailability: async (hostId) => {
          set({ isLoading: true, error: null });
          
          try {
            // In a real app, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            
            // For now, return mock data
            set({ 
              hostAvailability: mockHostAvailability,
              isLoading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch host availability',
              isLoading: false 
            });
          }
        },
        
        updateHostAvailability: async (availability) => {
          set({ isLoading: true, error: null });
          
          try {
            // In a real app, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            
            // Update host availability
            set(state => ({
              hostAvailability: state.hostAvailability 
                ? { ...state.hostAvailability, ...availability }
                : null,
              isLoading: false
            }));
            
            return true;
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to update host availability',
              isLoading: false 
            });
            return false;
          }
        },
        
        fetchAvailabilitySlots: async (hostId, date) => {
          set({ isLoading: true, error: null });
          
          try {
            // In a real app, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            
            // Get host availability
            const availability = mockHostAvailability;
            
            if (!availability) {
              set({ 
                error: 'Host availability not found',
                isLoading: false,
                availabilitySlots: []
              });
              return;
            }
            
            // Get day of week
            const dayOfWeek = format(date, 'EEEE').toLowerCase() as keyof typeof availability.weekdayAvailability;
            const daySlots = availability.weekdayAvailability[dayOfWeek];
            
            // Check if date is blocked
            const isBlocked = availability.blockedDates.some(blockedDate => 
              isSameDay(blockedDate, date)
            );
            
            if (isBlocked || daySlots.length === 0) {
              set({ 
                availabilitySlots: [],
                isLoading: false
              });
              return;
            }
            
            // Generate time slots
            const slots: AvailabilitySlot[] = [];
            
            for (const slot of daySlots) {
              if (!slot.available) continue;
              
              const [startHour, startMinute] = slot.start.split(':').map(Number);
              const [endHour, endMinute] = slot.end.split(':').map(Number);
              
              let currentTime = setMinutes(setHours(date, startHour), startMinute);
              const slotEndTime = setMinutes(setHours(date, endHour), endMinute);
              
              while (currentTime < slotEndTime) {
                const slotStart = new Date(currentTime);
                const slotEnd = addMinutes(slotStart, availability.appointmentDuration);
                
                if (slotEnd <= slotEndTime) {
                  // Check if slot conflicts with existing appointments
                  const isConflicting = get().appointments.some(appointment => {
                    if (appointment.status === AppointmentStatus.CANCELLED) return false;
                    
                    const appointmentStart = new Date(appointment.startTime);
                    const appointmentEnd = new Date(appointment.endTime);
                    
                    // Check if dates are the same day
                    if (!isSameDay(appointmentStart, date)) return false;
                    
                    // Check for overlap
                    return (
                      (slotStart >= appointmentStart && slotStart < appointmentEnd) ||
                      (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
                      (slotStart <= appointmentStart && slotEnd >= appointmentEnd)
                    );
                  });
                  
                  slots.push({
                    startTime: slotStart,
                    endTime: slotEnd,
                    available: !isConflicting
                  });
                }
                
                // Move to next slot
                currentTime = addMinutes(currentTime, availability.appointmentDuration + availability.bufferTime);
              }
            }
            
            set({ 
              availabilitySlots: slots,
              isLoading: false
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch availability slots',
              isLoading: false,
              availabilitySlots: []
            });
          }
        }
      }),
      {
        name: 'appointment-store',
        partialize: (state) => ({
          // Only persist these fields
          selectedAppointmentId: state.selectedAppointmentId,
          appointmentFilters: state.appointmentFilters,
          calendarView: state.calendarView,
          calendarDate: state.calendarDate
        })
      }
    )
  )
);