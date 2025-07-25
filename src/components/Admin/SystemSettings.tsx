import React from 'react';

const SystemSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Configure platform settings and system parameters.</p>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings Coming Soon</h3>
        <p className="text-gray-600">
          This section will include general settings, verification settings, payment configuration, and notification preferences.
        </p>
      </div>
    </div>
  );
};

export default SystemSettings;