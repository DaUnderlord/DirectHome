import React, { useEffect, useState } from 'react';
import { 
  IconCalendar, 
  IconCheck, 
  IconClock, 
  IconEdit, 
  IconMapPin, 
  IconMessage, 
  IconTrash, 
  IconUser 
} from '@tabler/icons-react';
import { useAppointment } from '../../hooks';
import { AppointmentStatus } from '../../types/appointment';
import { format } from 'date-fns';

interface AppointmentDetailsProps {
  appointmentId: string;
  onStatusChange?: () => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ 
  appointmentId,
  onStatusChange
}) => {
  const { 
    fetchAppointmentById, 
    confirmAppointment,
    cancelAppointment,
    rescheduleAppointment,
    formatAppointmentDateTime,
    isLoading,
    error
  } = useAppointment();
  
  const [appointment, setAppointment] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Fetch appointment details
  useEffect(() => {
    const loadAppointment = async () => {
      const data = await fetchAppointmentById(appointmentId);
      if (data) {
        setAppointment(data);
      }
    };
    
    loadAppointment();
  }, [appointmentId, fetchAppointmentById]);
  
  // Handle appointment confirmation
  const handleConfirm = async () => {
    const success = await confirmAppointment(appointmentId);
    if (success) {
      // Refresh appointment data
      const data = await fetchAppointmentById(appointmentId);
      if (data) {
        setAppointment(data);
      }
      
      // Notify parent component
      if (onStatusChange) {
        onStatusChange();
      }
    }
  };
  
  // Handle appointment cancellation
  const handleCancel = async () => {
    setIsCancelling(true);
    
    const success = await cancelAppointment(appointmentId, { cancelReason });
    
    setIsCancelling(false);
    setShowCancelModal(false);
    
    if (success) {
      // Refresh appointment data
      const data = await fetchAppointmentById(appointmentId);
      if (data) {
        setAppointment(data);
      }
      
      // Notify parent component
      if (onStatusChange) {
        onStatusChange();
      }
    }
  };
  
  // Get status badge color
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED:
        return 'bg-green-100 text-green-800';
      case AppointmentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case AppointmentStatus.RESCHEDULED:
        return 'bg-blue-100 text-blue-800';
      case AppointmentStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case AppointmentStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      case AppointmentStatus.MISSED:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading || !appointment) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4">Loading appointment details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-md bg-red-50 text-red-700">
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Status badge */}
      <div className="flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
          {appointment.status.toUpperCase()}
        </span>
        
        <div className="flex space-x-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
            <IconEdit size={18} />
          </button>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded-full">
            <IconTrash size={18} />
          </button>
        </div>
      </div>
      
      {/* Appointment type */}
      <h2 className="text-xl font-bold capitalize">
        {appointment.type} Appointment
      </h2>
      
      {/* Date and time */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-full text-blue-600">
            <IconCalendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Date & Time</p>
            <p className="text-gray-900">
              {formatAppointmentDateTime(appointment.startTime)}
            </p>
            <p className="text-sm text-gray-500">
              Duration: {format(appointment.endTime, 'h:mm a')} ({
                Math.round((appointment.endTime.getTime() - appointment.startTime.getTime()) / (1000 * 60))
              } minutes)
            </p>
          </div>
        </div>
      </div>
      
      {/* Property details */}
      {appointment.propertyId && (
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-100 rounded-full text-purple-600">
              <IconMapPin size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Property</p>
              <p className="text-gray-900">
                {appointment.propertyId === 'property_1' 
                  ? '3 Bedroom Apartment in Lekki Phase 1' 
                  : appointment.propertyId === 'property_2'
                    ? '2 Bedroom Flat in Ikeja GRA'
                    : 'Studio Apartment in Yaba'}
              </p>
              <a 
                href={`/property/${appointment.propertyId}`}
                className="inline-block mt-2 text-xs font-medium text-blue-600 hover:text-blue-800"
              >
                View Property
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Participants */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-green-100 rounded-full text-green-600">
            <IconUser size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Participants</p>
            <div className="flex space-x-8">
              <div>
                <p className="text-gray-900">Host:</p>
                <p className="text-sm text-gray-500">
                  {appointment.hostId === 'current_user_id' 
                    ? 'You' 
                    : appointment.hostId === 'user_1'
                      ? 'John Smith'
                      : appointment.hostId === 'user_2'
                        ? 'Mary Johnson'
                        : 'David Williams'}
                </p>
              </div>
              <div>
                <p className="text-gray-900">Attendee:</p>
                <p className="text-sm text-gray-500">
                  {appointment.attendeeId === 'current_user_id' 
                    ? 'You' 
                    : appointment.attendeeId === 'user_1'
                      ? 'John Smith'
                      : appointment.attendeeId === 'user_2'
                        ? 'Mary Johnson'
                        : 'David Williams'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Notes */}
      {appointment.notes && (
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-orange-100 rounded-full text-orange-600">
              <IconMessage size={24} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Notes</p>
              <p className="text-gray-900">{appointment.notes}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="border-t border-gray-200 my-6"></div>
      
      <div className="flex justify-center space-x-4">
        {appointment.status === AppointmentStatus.PENDING && (
          <button 
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={handleConfirm}
          >
            <IconCheck size={16} />
            <span>Confirm Appointment</span>
          </button>
        )}
        
        {(appointment.status === AppointmentStatus.PENDING || 
          appointment.status === AppointmentStatus.CONFIRMED) && (
          <button 
            className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
            onClick={() => setShowCancelModal(true)}
          >
            Cancel Appointment
          </button>
        )}
        
        {appointment.status === AppointmentStatus.CONFIRMED && (
          <button 
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <IconClock size={16} />
            <span>Reschedule</span>
          </button>
        )}
      </div>
      
      {/* Cancel modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Appointment</h3>
            <p className="mb-4 text-gray-600">
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCancelReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please provide a reason for cancelling this appointment"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Appointment
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                onClick={handleCancel}
                disabled={isCancelling || !cancelReason.trim()}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetails;