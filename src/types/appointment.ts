import { User } from './auth';
import { Property } from './property';

/**
 * Enum for appointment status
 */
export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  RESCHEDULED = 'rescheduled',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  MISSED = 'missed'
}

/**
 * Enum for appointment type
 */
export enum AppointmentType {
  VIEWING = 'viewing',
  INSPECTION = 'inspection',
  HANDOVER = 'handover',
  OTHER = 'other'
}

/**
 * Interface for appointment feedback
 */
export interface AppointmentFeedback {
  id: string;
  appointmentId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

/**
 * Interface for appointment reminders
 */
export interface AppointmentReminder {
  id: string;
  appointmentId: string;
  userId: string;
  reminderTime: Date;
  sent: boolean;
  sentAt?: Date;
  type: 'email' | 'sms' | 'push';
}

/**
 * Interface for appointment
 */
export interface Appointment {
  id: string;
  propertyId: string;
  property?: Property;
  hostId: string;
  host?: User;
  attendeeId: string;
  attendee?: User;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  type: AppointmentType;
  notes?: string;
  location?: string;
  conversationId?: string;
  feedback?: AppointmentFeedback[];
  reminders?: AppointmentReminder[];
  createdAt: Date;
  updatedAt: Date;
  cancelledBy?: string;
  cancelReason?: string;
}

/**
 * Interface for creating a new appointment
 */
export interface CreateAppointmentDto {
  propertyId: string;
  hostId: string;
  attendeeId: string;
  startTime: Date;
  endTime: Date;
  type: AppointmentType;
  notes?: string;
  location?: string;
  conversationId?: string;
}

/**
 * Interface for updating an appointment
 */
export interface UpdateAppointmentDto {
  startTime?: Date;
  endTime?: Date;
  status?: AppointmentStatus;
  notes?: string;
  location?: string;
}

/**
 * Interface for cancelling an appointment
 */
export interface CancelAppointmentDto {
  cancelReason: string;
}

/**
 * Interface for appointment search filters
 */
export interface AppointmentFilters {
  propertyId?: string;
  hostId?: string;
  attendeeId?: string;
  status?: AppointmentStatus | AppointmentStatus[];
  type?: AppointmentType | AppointmentType[];
  startDate?: Date;
  endDate?: Date;
}

/**
 * Interface for appointment pagination
 */
export interface AppointmentPagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

/**
 * Interface for appointment availability slot
 */
export interface AvailabilitySlot {
  startTime: Date;
  endTime: Date;
  available: boolean;
}

/**
 * Interface for host availability settings
 */
export interface HostAvailability {
  userId: string;
  weekdayAvailability: {
    monday: { start: string; end: string; available: boolean }[];
    tuesday: { start: string; end: string; available: boolean }[];
    wednesday: { start: string; end: string; available: boolean }[];
    thursday: { start: string; end: string; available: boolean }[];
    friday: { start: string; end: string; available: boolean }[];
    saturday: { start: string; end: string; available: boolean }[];
    sunday: { start: string; end: string; available: boolean }[];
  };
  blockedDates: Date[];
  appointmentDuration: number; // in minutes
  bufferTime: number; // in minutes
  maxDaysInAdvance: number;
  autoConfirm: boolean;
}

/**
 * Interface for appointment notification settings
 */
export interface AppointmentNotificationSettings {
  userId: string;
  reminderTimes: number[]; // minutes before appointment
  notificationMethods: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

/**
 * Interface for appointment statistics
 */
export interface AppointmentStatistics {
  total: number;
  completed: number;
  cancelled: number;
  pending: number;
  confirmed: number;
  rescheduled: number;
  missed: number;
  averageRating?: number;
}

/**
 * Interface for calendar event
 */
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  color?: string;
  description?: string;
  location?: string;
  appointmentId?: string;
  propertyId?: string;
  status?: AppointmentStatus;
}