import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IconHome, 
  IconArrowRight, 
  IconArrowLeft, 
  IconCheck, 
  IconInfoCircle,
  IconX
} from '@tabler/icons-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

const RoleConversionFlow: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    propertyOwnerType: 'individual', // or 'company'
    ownershipExperience: 'none', // 'none', '1-5', '5+'
    propertyTypes: [] as string[],
    termsAccepted: false,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    idType: 'national_id', // 'national_id', 'passport', 'drivers_license'
    idNumber: '',
  });
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle property type selection
  const handlePropertyTypeToggle = (type: string) => {
    setFormData(prev => {
      const currentTypes = [...prev.propertyTypes];
      
      if (currentTypes.includes(type)) {
        return {
          ...prev,
          propertyTypes: currentTypes.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          propertyTypes: [...currentTypes, type]
        };
      }
    });
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // In a real app, this would be an API call to update the user's role
      // For now, we'll simulate a delay and then update the local state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user profile with new role
      if (user) {
        await updateProfile({
          // Add property owner information to the profile
          // This is a simplified version - in a real app, you would store more data
          propertyOwnerInfo: {
            type: formData.propertyOwnerType,
            experience: formData.ownershipExperience,
            propertyTypes: formData.propertyTypes,
          }
        });
      }
      
      // Navigate to verification flow
      navigate('/verification-flow');
    } catch (err) {
      console.error('Error during role conversion:', err);
      setError('An error occurred during role conversion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle next step
  const nextStep = () => {
    // Validate current step
    if (step === 1 && !formData.termsAccepted) {
      setError('You must accept the terms and conditions to continue');
      return;
    }
    
    if (step === 2) {
      // Validate address fields
      if (!formData.address || !formData.city || !formData.state) {
        setError('Please fill in all required address fields');
        return;
      }
    }
    
    setError(null);
    setStep(prev => Math.min(prev + 1, 3));
  };
  
  // Handle previous step
  const prevStep = () => {
    setError(null);
    setStep(prev => Math.max(prev - 1, 1));
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <IconHome className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Become a Property Owner</h1>
        <p className="text-gray-600 mt-2">
          Expand your account capabilities to list and manage properties
        </p>
      </div>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {['Information', 'Address', 'Verification'].map((stepName, index) => (
            <div 
              key={stepName} 
              className={`flex flex-col items-center ${index + 1 <= step ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  index + 1 < step 
                    ? 'bg-blue-600 text-white' 
                    : index + 1 === step 
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1 < step ? <IconCheck size={16} /> : index + 1}
              </div>
              <span className="text-xs hidden sm:block">{stepName}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="h-1 w-full bg-gray-200 rounded"></div>
          <div 
            className="h-1 bg-blue-600 rounded absolute top-0 left-0 transition-all duration-300" 
            style={{ width: `${(step - 1) * 50}%` }}
          ></div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <IconX className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        </div>
      )}
      
      {/* Step content */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        {/* Step 1: Information */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Property Owner Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Type
                </label>
                <select
                  name="propertyOwnerType"
                  value={formData.propertyOwnerType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="individual">Individual Owner</option>
                  <option value="company">Company/Business</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Ownership Experience
                </label>
                <select
                  name="ownershipExperience"
                  value={formData.ownershipExperience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">No previous experience</option>
                  <option value="1-5">1-5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Types You Plan to List
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Apartment', 'House', 'Studio', 'Duplex', 'Commercial', 'Land'].map(type => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`type-${type}`}
                        checked={formData.propertyTypes.includes(type.toLowerCase())}
                        onChange={() => handlePropertyTypeToggle(type.toLowerCase())}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="termsAccepted"
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      I accept the property owner terms and conditions
                    </label>
                    <p className="text-gray-500">
                      By becoming a property owner, you agree to our terms of service and property listing guidelines.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Address */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Contact Address</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Zip/Postal Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-start p-3 bg-blue-50 rounded-md">
                  <IconInfoCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Your address information will be used for verification purposes only and will not be displayed publicly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Verification */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Identity Verification</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-1">
                  ID Type
                </label>
                <select
                  id="idType"
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="national_id">National ID</option>
                  <option value="passport">Passport</option>
                  <option value="drivers_license">Driver's License</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  ID Number
                </label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-start p-3 bg-yellow-50 rounded-md">
                  <IconInfoCircle className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium mb-1">Next Steps:</p>
                    <p>After submitting this form, you'll be directed to our verification process where you'll need to:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Upload a copy of your ID document</li>
                      <li>Provide proof of address</li>
                      <li>Complete a brief verification questionnaire</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <IconArrowLeft size={16} className="mr-1" />
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
              <IconArrowRight size={16} className="ml-1" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
              {!isSubmitting && <IconCheck size={16} className="ml-1" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleConversionFlow;