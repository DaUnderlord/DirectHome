import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../../types/property';
import { useAuth } from '../../../context/AuthContext';
import propertyInteractionService from '../../../services/propertyInteractionService';

interface ScheduleViewingProps {
  property: Property;
  onClose: () => void;
}

const ScheduleViewing: React.FC<ScheduleViewingProps> = ({ property, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [name, setName] = useState<string>(
    user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''
  );
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + i + 1);
    return nextDate;
  });

  const availableTimeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  ];

  const formatDate = (value: Date): string => {
    return value.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError('Please sign in to schedule a viewing.');
      return;
    }

    if (!property.ownerId) {
      setError('Unable to identify the property owner. Please try again later.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const contactNotes = [
      name && `Name: ${name}`,
      email && `Email: ${email}`,
      phone && `Phone: ${phone}`,
      notes,
    ]
      .filter(Boolean)
      .join('\n');

    const result = await propertyInteractionService.scheduleViewing({
      propertyId: property.id,
      ownerId: property.ownerId,
      date,
      time,
      notes: contactNotes || undefined,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Failed to schedule viewing.');
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-600 mb-4">Sign in to schedule a property viewing.</p>
        <Link
          to="/auth/login"
          className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Viewing Scheduled!</h3>
        <p className="text-gray-600">
          Your viewing request has been sent to the property owner. They will confirm the appointment soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Date*
          </label>
          <select
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a date</option>
            {availableDates.map((availableDate, index) => (
              <option key={index} value={availableDate.toISOString().split('T')[0]}>
                {formatDate(availableDate)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Time*
          </label>
          <select
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a time</option>
            {availableTimeSlots.map((timeSlot, index) => (
              <option key={index} value={timeSlot}>
                {timeSlot}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name*
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address*
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number*
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any specific questions or requirements for the viewing?"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Scheduling...' : 'Schedule Viewing'}
        </button>
      </div>
    </form>
  );
};

export default ScheduleViewing;
