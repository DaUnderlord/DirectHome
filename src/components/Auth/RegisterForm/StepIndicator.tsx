import React from 'react';
import type { RegistrationStep } from '../../../types/auth';

interface StepIndicatorProps {
  steps: RegistrationStep[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.step}>
            <div className="flex flex-col items-center min-w-0">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step.isCompleted
                    ? 'bg-courtyard-700 text-paper-50'
                    : step.isActive
                    ? 'bg-courtyard-700 text-paper-50'
                    : 'bg-paper-200 text-ink-400'
                }`}
              >
                {step.isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{step.step}</span>
                )}
              </div>
              <span className={`mt-2 text-[11px] sm:text-xs truncate max-w-[4.5rem] sm:max-w-none text-center ${
                step.isActive ? 'text-courtyard-700 font-medium' : 'text-ink-400'
              }`}>
                {step.title}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2">
                <div className={`h-px ${step.isCompleted ? 'bg-courtyard-700' : 'bg-paper-300'}`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
