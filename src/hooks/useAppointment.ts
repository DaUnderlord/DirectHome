import { useCallback, useEffect, useMemo } from 'react';
import { useAppointmentStore } from '../store/appointmentStore';
import {
  AppointmentFilters,
  AppointmentStatus,
  AppointmentType,
  CreateAppointmentDto
} from '../types/appointment';
import { addDays, format, isSameDay, startOfDay } from 'date-fns';

/**
 * Custom hook for appointment functionality
 */
export const useAppointment = () => {
  const {
    appointments,
    filteredAppointments,
    selectedAppointmentId,
    appointmentFilters,
    pagination,
    isLoading,
    error,
    calendarEvents,
    calendarView,
    calendarDate,
    hostAvailability,
    availabilitySlots,
    fetchAppointments,
    fetchAppointmentById,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    confirmAppointment,
    rescheduleAppointment,
    selectAppointment,
    setCalendarView,
    setCalendarDate,
    fetchHostAvailability,
    updateHostAvailability,
    fetchAvailabilitySlots
  } = useAppointmentStore();

  // Get selected appointment
  const selectedAppointment = useMemo(() => {
    return selectedAppointmentId
      ? appointments.find(a => a.id === selectedAppointmentId)
      : null;
  }, [selectedAppointmentId, appointments]);

  // Get upcoming appointments
  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return filteredAppointments
      .filter(a =>
        a.startTime > now &&
        (a.status === AppointmentStatus.CONFIRMED || a.status === AppointmentStatus.PENDING)
      )
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }, [filteredAppointments]);

  // Get today's appointments
  const todayAppointments = useMemo(() => {
    const today = startOfDay(new Date());
    return filteredAppointments
      .filter(a => isSameDay(a.startTime, today))
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }, [filteredAppointments]);

  // Get appointment statistics
  const appointmentStats = useMemo(() => {
    const total = filteredAppointments.length;
    const completed = filteredAppointments.filter(a => a.status === AppointmentStatus.COMPLETED).length;
    const cancelled = filteredAppointments.filter(a => a.status === AppointmentStatus.CANCELLED).length;
    const pending = filteredAppointments.filter(a => a.status === AppointmentStatus.PENDING).length;
    const confirmed = filteredAppointments.filter(a => a.status === AppointmentStatus.CONFIRMED).length;
    const rescheduled = filteredAppointments.filter(a => a.status === AppointmentStatus.RESCHEDULED).length;
    const missed = filteredAppointments.filter(a => a.status === AppointmentStatus.MISSED).length;

    return {
      total,
      completed,
      cancelled,
      pending,
      confirmed,
      rescheduled,
      missed
    };
  }, [filteredAppointments]);

  // Format date for display
  const formatAppointmentDate = useCallback((date: Date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  }, []);

  // Format time for display
  const formatAppointmentTime = useCallback((date: Date) => {
    return format(date, 'h:mm a');
  }, []);

  // Format date and time for display
  const formatAppointmentDateTime = useCallback((date: Date) => {
    return format(date, 'EEEE, MMMM d, yyyy h:mm a');
  }, []);

  // Check if a date has available slots
  const hasAvailableSlots = useCallback((date: Date) => {
    // If we have host availability, check if the date is blocked
    if (hostAvailability) {
      // Check if date is blocked
      const isBlocked = hostAvailability.blockedDates.some(blockedDate =>
        isSameDay(blockedDate, date)
      );

      if (isBlocked) return false;

      // Check if day of week has available slots
      const dayOfWeek = format(date, 'EEEE').toLowerCase() as keyof typeof hostAvailability.weekdayAvailability;
      const daySlots = hostAvailability.weekdayAvailability[dayOfWeek];

      return daySlots.some(slot => slot.available);
    }

    return true;
  }, [hostAvailability]);

  // Create a new appointment with validation
  const scheduleAppointment = useCallback(async (data: Omit<CreateAppointmentDto, 'type'>) => {
    // Validate appointment
    const now = new Date();

    if (data.startTime < now) {
      return { success: false, error: 'Cannot schedule an appointment in the past' };
    }

    if (data.startTime >= data.endTime) {
      return { success: false, error: 'End time must be after start time' };
    }

    // Check if host is available
    if (hostAvailability) {
      // Check if date is blocked
      const isBlocked = hostAvailability.blockedDates.some(blockedDate =>
        isSameDay(blockedDate, data.startTime)
      );

      if (isBlocked) {
        return { success: false, error: 'Host is not available on this date' };
      }

      // Check if day of week has available slots
      const dayOfWeek = format(data.startTime, 'EEEE').toLowerCase() as keyof typeof hostAvailability.weekdayAvailability;
      const daySlots = hostAvailability.weekdayAvailability[dayOfWeek];

      if (daySlots.length === 0) {
        return { success: false, error: 'Host is not available on this day of the week' };
      }

      // Check if time is within available slots
      const startTimeStr = format(data.startTime, 'HH:mm');
      const endTimeStr = format(data.endTime, 'HH:mm');

      const isWithinSlot = daySlots.some(slot => {
        return startTimeStr >= slot.start && endTimeStr <= slot.end && slot.available;
      });

      if (!isWithinSlot) {
        return { success: false, error: 'Selected time is outside of host availability' };
      }

      // Check if appointment duration is valid
      const durationMs = data.endTime.getTime() - data.startTime.getTime();
      const durationMinutes = durationMs / (1000 * 60);

      if (durationMinutes !== hostAvailability.appointmentDuration) {
        return {
          success: false,
          error: `Appointment duration must be ${hostAvailability.appointmentDuration} minutes`
        };
      }

      // Check if appointment is too far in the future
      const maxDate = addDays(now, hostAvailability.maxDaysInAdvance);

      if (data.startTime > maxDate) {
        return {
          success: false,
          error: `Cannot schedule appointments more than ${hostAvailability.maxDaysInAdvance} days in advance`
        };
      }
    }

    // Create appointment
    const appointmentId = await createAppointment({
      ...data,
      type: AppointmentType.VIEWING
    });

    if (appointmentId) {
      return { success: true, appointmentId };
    } else {
      return { success: false, error: 'Failed to create appointment' };
    }
  }, [createAppointment, hostAvailability]);

  // Fetch appointments on mount if none exist
  useEffect(() => {
    if (appointments.length === 0 && !isLoading) {
      fetchAppointments();
    }
  }, [appointments.length, fetchAppointments, isLoading]);

  return {
    // State
    appointments,
    filteredAppointments,
    selectedAppointment,
    appointmentFilters,
    pagination,
    isLoading,
    error,
    calendarEvents,
    calendarView,
    calendarDate,
    hostAvailability,
    availabilitySlots,
    upcomingAppointments,
    todayAppointments,
    appointmentStats,

    // Actions
    fetchAppointments,
    fetchAppointmentById,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    confirmAppointment,
    rescheduleAppointment,
    selectAppointment,
    setCalendarView,
    setCalendarDate,
    fetchHostAvailability,
    updateHostAvailability,
    fetchAvailabilitySlots,
    scheduleAppointment,

    // Helper methods
    formatAppointmentDate,
    formatAppointmentTime,
    formatAppointmentDateTime,
    hasAvailableSlots,

    // Filter helpers
    filterByStatus: (status: AppointmentStatus | AppointmentStatus[]) =>
      fetchAppointments({ ...appointmentFilters, status }),
    filterByType: (type: AppointmentType | AppointmentType[]) =>
      fetchAppointments({ ...appointmentFilters, type }),
    filterByDateRange: (startDate: Date, endDate: Date) =>
      fetchAppointments({ ...appointmentFilters, startDate, endDate }),
    filterByProperty: (propertyId: string) =>
      fetchAppointments({ ...appointmentFilters, propertyId }),
    filterByHost: (hostId: string) =>
      fetchAppointments({ ...appointmentFilters, hostId }),
    filterByAttendee: (attendeeId: string) =>
      fetchAppointments({ ...appointmentFilters, attendeeId }),
    clearFilters: () => fetchAppointments({})
  };
};