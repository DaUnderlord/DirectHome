import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  RegistrationStep1Values, 
  RegistrationStep2Values, 
  RegistrationStep3Values,
  CompleteRegistrationValues
} from '../../../validations/auth';
import { RegistrationStep, UserRole } from '../../../types/auth';
import Card from '../../UI/Card';
import Spinner from '../../UI/Spinner';
import StepIndicator from './StepIndicator';
import BasicInfoStep from './BasicInfoStep';
import RoleSelectionStep from './RoleSelectionStep';
import ProfileInfoStep from './ProfileInfoStep';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CompleteRegistrationValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Define steps
  const steps: RegistrationStep[] = [
    {
      step: 1,
      isCompleted: currentStep > 1,
      isActive: currentStep === 1,
      title: 'Basic Info',
      description: 'Personal information',
    },
    {
      step: 2,
      isCompleted: currentStep > 2,
      isActive: currentStep === 2,
      title: 'Role',
      description: 'Select your role',
    },
    {
      step: 3,
      isCompleted: currentStep > 3,
      isActive: currentStep === 3,
      title: 'Profile',
      description: 'Additional details',
    },
  ];
  
  // Handle step 1 submission
  const handleStep1Submit = (data: RegistrationStep1Values) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(2);
  };
  
  // Handle step 2 submission
  const handleStep2Submit = (data: RegistrationStep2Values) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(3);
  };
  
  // Handle step 3 submission
  const handleStep3Submit = async (data: RegistrationStep3Values) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Combine all form data
      const completeData = {
        ...formData,
        ...data,
      } as CompleteRegistrationValues;
      
      // Convert to RegistrationData for the API
      const registrationData = {
        email: completeData.email,
        phone: completeData.phone,
        password: completeData.password,
        firstName: completeData.firstName,
        lastName: completeData.lastName,
        role: completeData.role as UserRole,
      };
      
      // Submit registration
      await register(registrationData);
      
      // Redirect to verification page
      navigate('/auth/verify');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle back button
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };
  
  return (
    <div>
      <StepIndicator steps={steps} currentStep={currentStep} />
      
      <Card>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {currentStep === 1 && (
          <BasicInfoStep 
            onSubmit={handleStep1Submit} 
            defaultValues={formData} 
          />
        )}
        
        {currentStep === 2 && (
          <RoleSelectionStep 
            onSubmit={handleStep2Submit} 
            onBack={handleBack}
            defaultValues={formData} 
          />
        )}
        
        {currentStep === 3 && (
          <ProfileInfoStep 
            onSubmit={handleStep3Submit} 
            onBack={handleBack}
            defaultValues={formData} 
          />
        )}
        
        {isSubmitting && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-2 text-gray-600">Creating your account...</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RegisterForm;