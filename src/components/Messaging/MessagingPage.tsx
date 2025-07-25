import React from 'react';
import { useParams } from 'react-router-dom';

const MessagingPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
        <p className="text-gray-600">
          Messaging functionality is being updated to work with the new design system.
        </p>
      </div>
    </div>
  );
};

export default MessagingPage;