import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IconHome, 
  IconMapPin, 
  IconCurrencyDollar, 
  IconRuler, 
  IconBed, 
  IconBath,
  IconCalendar,
  IconPhoto,
  IconTrash,
  IconPlus,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { PropertyType, ListingType } from '../../../types/property';
import BasicDetailsStep from './BasicDetailsStep';
import LocationStep from './LocationStep';
import FeaturesStep from './FeaturesStep';
import MediaStep from './MediaStep';
import ReviewStep from './ReviewStep';

const PropertyListingForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    basicDetails: {
      title: '',
      description: '',
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
      price: '',
      currency: 'NGN',
      paymentFrequency: 'monthly',
      negotiable: false
    },
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Nigeria',
      latitude: '',
      longitude: ''
    },
    features: {
      bedrooms: 1,
      bathrooms: 1,
      squareFootage: '',
      furnished: false,
      petsAllowed: false,
      yearBuilt: '',
      amenities: []
    },
    media: {
      images: []
    },
    availability: {
      availableFrom: new Date().toISOString().split('T')[0],
      minimumStay: '',
      maximumStay: ''
    },
    rules: {
      smoking: false,
      pets: false,
      parties: false,
      children: true,
      additionalRules: []
    },
    termsAccepted: false
  });
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload the images and send the form data to your API
      // For now, we'll just simulate a delay and redirect
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to the property page (in a real app, this would be the newly created property)
      navigate('/search');
    } catch (error) {
      console.error('Error submitting property:', error);
      setIsSubmitting(false);
    }
  };
  
  // Navigation between form steps
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  // Update form data
  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        ...data
      }
    }));
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">List Your Property</h1>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {['Basic Info', 'Location', 'Features', 'Photos', 'Review'].map((step, index) => (
            <div 
              key={step} 
              className={`flex flex-col items-center ${index < currentStep ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${index < currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
              >
                {index < currentStep ? <IconCheck size={16} /> : index + 1}
              </div>
              <span className="text-xs hidden sm:block">{step}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="h-1 w-full bg-gray-200 rounded"></div>
          <div 
            className="h-1 bg-blue-600 rounded absolute top-0 left-0 transition-all duration-300" 
            style={{ width: `${(currentStep - 1) * 25}%` }}
          ></div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <BasicDetailsStep 
            formData={formData.basicDetails} 
            updateFormData={(data) => updateFormData('basicDetails', data)} 
            onNext={nextStep}
          />
        )}
        
        {/* Step 2: Location */}
        {currentStep === 2 && (
          <LocationStep 
            formData={formData.location} 
            updateFormData={(data) => updateFormData('location', data)} 
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}
        
        {/* Step 3: Features */}
        {currentStep === 3 && (
          <FeaturesStep 
            formData={formData.features}
            rulesData={formData.rules}
            updateFormData={(data) => updateFormData('features', data)}
            updateRules={(data) => updateFormData('rules', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}
        
        {/* Step 4: Media */}
        {currentStep === 4 && (
          <MediaStep 
            formData={formData.media}
            updateFormData={(data) => updateFormData('media', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}
        
        {/* Step 5: Review */}
        {currentStep === 5 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <IconCheck className="mr-2" /> Review & Submit
            </h2>
            
            <ReviewStep 
              form={{ 
                watch: () => formData,
                setValue: (name, value) => {
                  if (name === 'termsAccepted') {
                    setFormData(prev => ({
                      ...prev,
                      termsAccepted: value
                    }));
                  }
                }
              }}
            />
            
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || !formData.termsAccepted}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Listing'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PropertyListingForm;