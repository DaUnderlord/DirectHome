import { supabase } from '../lib/supabase';
import { 
  Appointment, 
  AppointmentStatus, 
  AppointmentType,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  CancelAppointmentDto,
  AppointmentFilters
} from '../types/appointment';

// Map database viewing to Appointment type
const mapDbViewingToAppointment = (dbViewing: any): Appointment => {
  // Combine date and time into Date objects
  const startTime = new Date(`${dbViewing.scheduled_date}T${dbViewing.scheduled_time}`);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Add 1 hour

  return {
    id: dbViewing.id,
    propertyId: dbViewing.property_id,
    hostId: dbViewing.owner_id,
    attendeeId: dbViewing.seeker_id,
    startTime,
    endTime,
    status: dbViewing.status as AppointmentStatus,
    type: AppointmentType.VIEWING,
    notes: dbViewing.notes,
    createdAt: new Date(dbViewing.created_at),
    updatedAt: new Date(dbViewing.updated_at),
    property: dbViewing.properties ? {
      id: dbViewing.properties.id,
      title: dbViewing.properties.title,
      location: {
        address: dbViewing.properties.address,
        city: dbViewing.properties.city,
        state: dbViewing.properties.state,
        zipCode: dbViewing.properties.zip_code || '',
        country: dbViewing.properties.country || 'Nigeria'
      },
      images: (dbViewing.properties as any).property_images || []
    } : undefined
  };
};

export const appointmentService = {
  /**
   * Fetch appointments with filters
   */
  fetchAppointments: async (filters: AppointmentFilters = {}) => {
    try {
      let query = supabase
        .from('property_viewings')
        .select(`
          *,
          properties (
            id,
            title,
            address,
            city,
            property_images (url, is_primary)
          )
        `);

      // Apply filters
      if (filters.propertyId) {
        query = query.eq('property_id', filters.propertyId);
      }

      if (filters.hostId) {
        query = query.eq('owner_id', filters.hostId);
      }

      if (filters.attendeeId) {
        query = query.eq('seeker_id', filters.attendeeId);
      }

      if (filters.status) {
        const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
        query = query.in('status', statuses);
      }

      if (filters.startDate) {
        query = query.gte('scheduled_date', filters.startDate.toISOString().split('T')[0]);
      }

      if (filters.endDate) {
        query = query.lte('scheduled_date', filters.endDate.toISOString().split('T')[0]);
      }

      // Order by date
      query = query.order('scheduled_date', { ascending: true });
      query = query.order('scheduled_time', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }

      const appointments = (data || []).map(mapDbViewingToAppointment);

      return {
        appointments,
        success: true
      };
    } catch (error) {
      console.error('Appointment fetch failed:', error);
      return {
        appointments: [],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch appointments'
      };
    }
  },

  /**
   * Get a single appointment by ID
   */
  fetchAppointmentById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('property_viewings')
        .select(`
          *,
          properties (
            id,
            title,
            address,
            city,
            property_images (url, is_primary)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching appointment:', error);
        throw error;
      }

      const appointment = mapDbViewingToAppointment(data);

      return {
        appointment,
        success: true
      };
    } catch (error) {
      console.error('Appointment fetch failed:', error);
      return {
        appointment: null,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch appointment'
      };
    }
  },

  /**
   * Create a new appointment
   */
  createAppointment: async (data: CreateAppointmentDto) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Extract date and time from startTime
      const scheduledDate = data.startTime.toISOString().split('T')[0];
      const scheduledTime = data.startTime.toTimeString().split(' ')[0];

      const { data: viewing, error } = await supabase
        .from('property_viewings')
        .insert({
          property_id: data.propertyId,
          seeker_id: user.id,
          owner_id: data.hostId,
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          status: 'pending',
          notes: data.notes
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating appointment:', error);
        throw error;
      }

      return {
        appointmentId: viewing.id,
        success: true
      };
    } catch (error) {
      console.error('Appointment creation failed:', error);
      return {
        appointmentId: null,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create appointment'
      };
    }
  },

  /**
   * Update an appointment
   */
  updateAppointment: async (id: string, data: UpdateAppointmentDto) => {
    try {
      const updateData: any = {};

      if (data.startTime) {
        updateData.scheduled_date = data.startTime.toISOString().split('T')[0];
        updateData.scheduled_time = data.startTime.toTimeString().split(' ')[0];
      }

      if (data.status) {
        updateData.status = data.status;
      }

      if (data.notes !== undefined) {
        updateData.notes = data.notes;
      }

      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('property_viewings')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating appointment:', error);
        throw error;
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Appointment update failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update appointment'
      };
    }
  },

  /**
   * Cancel an appointment
   */
  cancelAppointment: async (id: string, data: CancelAppointmentDto) => {
    try {
      const { error } = await supabase
        .from('property_viewings')
        .update({
          status: 'cancelled',
          notes: data.cancelReason ? `Cancelled: ${data.cancelReason}` : 'Cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error cancelling appointment:', error);
        throw error;
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Appointment cancellation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel appointment'
      };
    }
  },

  /**
   * Confirm an appointment
   */
  confirmAppointment: async (id: string) => {
    try {
      const { error } = await supabase
        .from('property_viewings')
        .update({
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error confirming appointment:', error);
        throw error;
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Appointment confirmation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to confirm appointment'
      };
    }
  },

  /**
   * Reschedule an appointment
   */
  rescheduleAppointment: async (id: string, startTime: Date, _endTime: Date) => {
    try {
      const scheduledDate = startTime.toISOString().split('T')[0];
      const scheduledTime = startTime.toTimeString().split(' ')[0];

      const { error } = await supabase
        .from('property_viewings')
        .update({
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          status: 'pending', // Reset to pending after reschedule
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error rescheduling appointment:', error);
        throw error;
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Appointment rescheduling failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reschedule appointment'
      };
    }
  }
};

export default appointmentService;
