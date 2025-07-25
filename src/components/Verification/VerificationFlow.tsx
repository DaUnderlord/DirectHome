import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IconShieldCheck, 
  IconArrowRight, 
  IconArrowLeft, 
  IconCheck, 
  IconInfoCircle,
  IconX,
  IconUpload,
  IconFileText
} from '@tabler/icons-react';
import { useAuth } from '../../context/AuthContext';
import { useVerificationStore } from '../../store/verificationStore';
import { VerificationDocumentType } from '../../types/verification';
import VerificationRequirements from './VerificationRequirements';
import DocumentUpload from './DocumentUpload';
import VerificationSubmission from './VerificationSubmission';

const VerificationFlow: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    documents: [] as {
      type: VerificationDocumentType;
      file: File | null;
      status: 'pending' | 'uploading' | 'success' | 'error';
      progress: number;
      url: string;
    }[],
    additionalInfo: '',
    termsAccepted: false
  });
  
  // Handle document upload
  const handleDocumentUpload = (type: VerificationDocumentType, file: File) => {
    // Check if document of this type already exists
    const existingIndex = formData.documents.findIndex(doc => doc.type === type);
    
    if (existingIndex >= 0) {
      // Replace existing document
      const updatedDocuments = [...formData.documents];
      updatedDocuments[existingIndex] = {
        type,
        file,
        status: 'pending',
        progress: 0,
        url: URL.createObjectURL(file)
      };
      
      setFormData(prev => ({
        ...prev,
        documents: updatedDocuments
      }));
    } else {
      // Add new document
      setFormData(prev => ({
        ...prev,
        documents: [
          ...prev.documents,
          {
            type,
            file,
            status: 'pending',
            progress: 0,
            url: URL.createObjectURL(file)
          }
        ]
      }));
    }
  };
  
  // Handle document removal
  const handleDocumentRemove = (type: VerificationDocumentType) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.type !== type)
    }));
  };
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // In a real app, this would be an API call to submit verification documents
      // For now, we'll simulate a delay and then redirect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to verification pending page
      navigate('/verification-pending');
    } catch (err) {
      console.error('Error during verification submission:', err);
      setError('An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle next step
  const nextStep = () => {
    // Validate current step
    if (step === 1) {
      // No validation needed for step 1
    } else if (step === 2) {
      // Validate document uploads
      if (formData.documents.length === 0) {
        setError('Please upload at least one document for verification');
        return;
      }
    } else if (step === 3) {
      // Validate terms acceptance
      if (!formData.termsAccepted) {
        setError('You must accept the terms and conditions to continue');
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <IconShieldCheck className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Owner Verification</h1>
        <p className="text-gray-600 mt-2">
          Complete the verification process to list properties on DirectHome
        </p>
      </div>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {['Requirements', 'Documents', 'Submission'].map((stepName, index) => (
            <div 
              key={stepName} 
              className={`flex flex-col items-center ${index + 1 <= step ? 'text-green-600' : 'text-gray-400'}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  index + 1 < step 
                    ? 'bg-green-600 text-white' 
                    : index + 1 === step 
                    ? 'bg-green-100 text-green-600 border-2 border-green-600' 
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
            className="h-1 bg-green-600 rounded absolute top-0 left-0 transition-all duration-300" 
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
        {/* Step 1: Requirements */}
        {step === 1 && (
          <VerificationRequirements />
        )}
        
        {/* Step 2: Document Upload */}
        {step === 2 && (
          <DocumentUpload 
            documents={formData.documents}
            onUpload={handleDocumentUpload}
            onRemove={handleDocumentRemove}
          />
        )}
        
        {/* Step 3: Submission */}
        {step === 3 && (
          <VerificationSubmission
            documents={formData.documents}
            additionalInfo={formData.additionalInfo}
            termsAccepted={formData.termsAccepted}
            onChange={handleChange}
          />
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
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Next
              <IconArrowRight size={16} className="ml-1" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              {!isSubmitting && <IconCheck size={16} className="ml-1" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationFlow;