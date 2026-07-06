import { supabase } from '../lib/supabase';
import { appointmentService } from './appointmentService';
import { AppointmentType } from '../types/appointment';

export interface SubmitEnquiryInput {
  propertyId: string;
  ownerId: string;
  subject: string;
  message: string;
}

export interface ScheduleViewingInput {
  propertyId: string;
  ownerId: string;
  date: string;
  time: string;
  notes?: string;
}

export const propertyInteractionService = {
  submitEnquiry: async (input: SubmitEnquiryInput) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Please sign in to contact the property owner.' };
    }

    const { error } = await supabase.from('property_enquiries').insert({
      property_id: input.propertyId,
      owner_id: input.ownerId,
      seeker_id: user.id,
      subject: input.subject,
      message: input.message,
      status: 'pending',
    });

    if (error) {
      console.error('Enquiry submission failed:', error);
      return { success: false, error: error.message || 'Failed to send message.' };
    }

    return { success: true };
  },

  scheduleViewing: async (input: ScheduleViewingInput) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Please sign in to schedule a viewing.' };
    }

    const startTime = new Date(`${input.date}T${input.time}:00`);

    if (Number.isNaN(startTime.getTime())) {
      return { success: false, error: 'Invalid date or time selected.' };
    }

    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    const result = await appointmentService.createAppointment({
      propertyId: input.propertyId,
      hostId: input.ownerId,
      attendeeId: user.id,
      startTime,
      endTime,
      type: AppointmentType.VIEWING,
      notes: input.notes,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to schedule viewing.',
      };
    }

    return { success: true, appointmentId: result.appointmentId };
  },
};

export default propertyInteractionService;
