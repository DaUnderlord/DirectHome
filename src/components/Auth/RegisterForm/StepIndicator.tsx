import React from 'react';
import type { RegistrationStep } from '../../../types/auth';

interface StepIndicatorProps {
  steps: RegistrationStep[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.step}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step.isCompleted
                    ? 'bg-green-500 text-white'
                    : step.isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                } transition-colors duration-200`}
              >
                {step.isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{step.step}</span>
                )}
              </div>
              <span className={`mt-2 text-xs ${
                step.isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
            
            {/* Connector Line (except after the last step) */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2">
                <div
                  className={`h-1 ${
                    step.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;