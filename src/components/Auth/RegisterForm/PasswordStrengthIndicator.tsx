import React from 'react';
import { PasswordStrengthLevel } from '../../../types/auth';

interface PasswordStrengthIndicatorProps {
  strength: {
    score: number;
    level: PasswordStrengthLevel;
  };
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ strength }) => {
  const { score, level } = strength;
  
  // Calculate percentage for the progress bar (score is 0-8)
  const percentage = (score / 8) * 100;
  
  // Define colors and labels based on strength level
  const getColorAndLabel = () => {
    switch (level) {
      case PasswordStrengthLevel.VERY_WEAK:
        return { color: 'bg-red-500', label: 'Very Weak' };
      case PasswordStrengthLevel.WEAK:
        return { color: 'bg-orange-500', label: 'Weak' };
      case PasswordStrengthLevel.MODERATE:
        return { color: 'bg-yellow-500', label: 'Moderate' };
      case PasswordStrengthLevel.STRONG:
        return { color: 'bg-green-500', label: 'Strong' };
      case PasswordStrengthLevel.VERY_STRONG:
        return { color: 'bg-green-600', label: 'Very Strong' };
      default:
        return { color: 'bg-gray-300', label: 'No Password' };
    }
  };
  
  const { color, label } = getColorAndLabel();
  
  return (
    <div className="mt-1 mb-3">
      <div className="flex justify-between items-center mb-1">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} transition-all duration-300 ease-in-out`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-xs font-medium ml-2 min-w-[80px] text-right">{label}</span>
      </div>
      
      {level === PasswordStrengthLevel.VERY_WEAK && (
        <p className="text-xs text-red-600">Password is too weak. Add more characters and variety.</p>
      )}
      
      {level === PasswordStrengthLevel.WEAK && (
        <p className="text-xs text-orange-600">Password could be stronger. Try adding special characters.</p>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;