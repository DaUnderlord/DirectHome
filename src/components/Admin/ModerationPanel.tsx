import React from 'react';

const ModerationPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
        <p className="text-gray-600">Review reported content and manage platform moderation.</p>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Moderation Panel Coming Soon</h3>
        <p className="text-gray-600">
          This section will include report queue, content review tools, and moderation actions.
        </p>
      </div>
    </div>
  );
};

export default ModerationPanel;