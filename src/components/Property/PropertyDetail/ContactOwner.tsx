import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../../types/property';
import { useAuth } from '../../../context/AuthContext';
import propertyInteractionService from '../../../services/propertyInteractionService';

interface ContactOwnerProps {
  property: Property;
  onClose: () => void;
}

const ContactOwner: React.FC<ContactOwnerProps> = ({ property, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const [message, setMessage] = useState<string>(
    `Hi, I'm interested in your property "${property.title}". Is it still available?`
  );
  const [name, setName] = useState<string>(
    user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''
  );
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError('Please sign in to contact the property owner.');
      return;
    }

    if (!property.ownerId) {
      setError('Unable to identify the property owner. Please try again later.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const contactDetails = [
      name && `Name: ${name}`,
      email && `Email: ${email}`,
      phone && `Phone: ${phone}`,
    ]
      .filter(Boolean)
      .join('\n');

    const fullMessage = contactDetails ? `${contactDetails}\n\n${message}` : message;

    const result = await propertyInteractionService.submitEnquiry({
      propertyId: property.id,
      ownerId: property.ownerId,
      subject: `Enquiry about ${property.title}`,
      message: fullMessage,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Failed to send message.');
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
        <p className="text-gray-600 mb-4">Sign in to send a message to the property owner.</p>
        <Link
          to="/auth/login"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
        <p className="text-gray-600">
          Your message has been sent to the property owner. They will contact you soon.
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
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message*
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            I agree to the terms and privacy policy
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
};

export default ContactOwner;
