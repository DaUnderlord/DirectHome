import React from 'react';
import Spinner from './Spinner';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  fullScreen = true
}) => {
  if (!fullScreen) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="md" />
        {message && (
          <span className="ml-3 text-gray-600">{message}</span>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-lg text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;