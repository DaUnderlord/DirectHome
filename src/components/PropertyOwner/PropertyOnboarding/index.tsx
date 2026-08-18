import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { usePropertyOwnerStore } from '../../../store/propertyOwnerStore';
import {
  IconHome,
  IconMapPin,
  IconSettings,
  IconPhoto,
  IconCurrencyNaira,
  IconCheck,
  IconArrowLeft,
  IconArrowRight
} from '@tabler/icons-react';
import Container from '../../UI/Container';
import BasicInfoStep from './BasicInfoStep';
import LocationStep from './LocationStep';
import FeaturesStep from './FeaturesStep';
import ConditionStep from './ConditionStep';
import MediaStep from './MediaStep';
import PricingStep from './PricingStep';
import ReviewStep from './ReviewStep';
import {
  PropertyOnboarding,
  NigerianPropertyType,
  PropertyCategory,
  PaymentCycle,
  PowerSupplyType,
  WaterSource,
  KitchenType,
  FurnishingStatus,
  BuildingCondition
} from '../../../types/propertyOwner';

const STEPS = [
  { id: 1, title: 'Info', icon: IconHome },
  { id: 2, title: 'Location', icon: IconMapPin },
  { id: 3, title: 'Features', icon: IconSettings },
  { id: 4, title: 'Condition', icon: IconCheck },
  { id: 5, title: 'Media', icon: IconPhoto },
  { id: 6, title: 'Pricing', icon: IconCurrencyNaira },
  { id: 7, title: 'Review', icon: IconCheck }
];

const initialFormData: Partial<PropertyOnboarding> = {
  basicInfo: {
    title: '',
    propertyType: NigerianPropertyType.THREE_BEDROOM,
    category: PropertyCategory.RENT,
    description: '',
    size: 0,
    landmarks: []
  },
  location: {
    fullAddress: '',
    state: 'Lagos',
    lga: '',
    latitude: undefined,
    longitude: undefined,
    accessRoute: ''
  },
  features: {
    bedrooms: 2,
    bathrooms: 2,
    toilets: 2,
    kitchenType: KitchenType.CLOSED,
    parkingSpaces: 1,
    powerSupply: PowerSupplyType.NEPA_WITH_GEN,
    nepaHours: 12,
    waterSource: WaterSource.BOREHOLE,
    securityFeatures: [],
    amenities: [],
    accessibilityOptions: []
  },
  condition: {
    furnishingStatus: FurnishingStatus.UNFURNISHED,
    buildingCondition: BuildingCondition.GOOD,
    maintenanceStatus: 'Good',
    lastRenovated: undefined
  },
  media: {
    images: [],
    videos: [],
    virtualTour: undefined
  },
  pricing: {
    rentPrice: 0,
    cautionFee: undefined,
    legalFee: undefined,
    serviceCharge: undefined,
    agencyFee: undefined,
    paymentCycle: PaymentCycle.YEARLY,
    negotiable: true
  }
};

const PropertyOnboardingForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createProperty } = usePropertyOwnerStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<PropertyOnboarding>>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (section: keyof PropertyOnboarding, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        ...data
      }
    }));
    // Clear errors for the updated section
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(data).forEach(key => {
        delete newErrors[`${section}.${key}`];
      });
      return newErrors;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Basic Info
        if (!formData.basicInfo?.title?.trim()) {
          newErrors['basicInfo.title'] = 'Property title is required';
        }
        if (!formData.basicInfo?.description?.trim()) {
          newErrors['basicInfo.description'] = 'Description is required';
        }
        if ((formData.basicInfo?.size || 0) <= 0) {
          newErrors['basicInfo.size'] = 'Property size is required';
        }
        break;
      
      case 2: // Location
        if (!formData.location?.fullAddress?.trim()) {
          newErrors['location.fullAddress'] = 'Full address is required';
        }
        if (!formData.location?.state) {
          newErrors['location.state'] = 'State is required';
        }
        if (!formData.location?.lga) {
          newErrors['location.lga'] = 'LGA is required';
        }
        break;
      
      case 3: // Features
        if ((formData.features?.bedrooms || 0) < 0) {
          newErrors['features.bedrooms'] = 'Invalid number of bedrooms';
        }
        if ((formData.features?.bathrooms || 0) < 0) {
          newErrors['features.bathrooms'] = 'Invalid number of bathrooms';
        }
        break;
      
      case 5: // Media
        if (!formData.media?.images || formData.media.images.length < 3) {
          newErrors['media.images'] = 'Please upload at least 3 images';
        }
        break;
      
      case 6: // Pricing
        if ((formData.pricing?.rentPrice || 0) <= 0) {
          newErrors['pricing.rentPrice'] = 'Rent price is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    if (step < currentStep || validateStep(currentStep)) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    if (!user?.id) {
      setErrors({ submit: 'Please sign in as a home owner to submit a property.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const property = await createProperty({
        ...formData,
        ownerId: user.id,
        status: 'pending_review'
      });

      if (property) {
        navigate('/owner/properties', { 
          state: { message: 'Property submitted successfully! It will be reviewed shortly.' }
        });
      }
    } catch (error) {
      console.error('Error creating property:', error);
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to create property. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            data={formData.basicInfo!}
            errors={errors}
            onChange={(data) => updateFormData('basicInfo', data)}
          />
        );
      case 2:
        return (
          <LocationStep
            data={formData.location!}
            errors={errors}
            onChange={(data) => updateFormData('location', data)}
          />
        );
      case 3:
        return (
          <FeaturesStep
            data={formData.features!}
            errors={errors}
            onChange={(data) => updateFormData('features', data)}
          />
        );
      case 4:
        return (
          <ConditionStep
            data={formData.condition!}
            errors={errors}
            onChange={(data) => updateFormData('condition', data)}
          />
        );
      case 5:
        return (
          <MediaStep
            data={formData.media!}
            errors={errors}
            onChange={(data) => updateFormData('media', data)}
          />
        );
      case 6:
        return (
          <PricingStep
            data={formData.pricing!}
            category={formData.basicInfo?.category || PropertyCategory.RENT}
            errors={errors}
            onChange={(data) => updateFormData('pricing', data)}
          />
        );
      case 7:
        return (
          <ReviewStep
            formData={formData}
            onEdit={goToStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-paper-100 py-6 sm:py-8 overflow-x-hidden">
      <Container size="lg" className="min-w-0">
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/owner/properties')}
            className="flex items-center text-ink-600 hover:text-ink-950 mb-4 text-sm"
          >
            <IconArrowLeft size={18} stroke={1.5} className="mr-2" />
            Back to Properties
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-950">Add New Property</h1>
          <p className="text-ink-600 mt-2 text-sm sm:text-base">
            Complete all steps to list your property on DirectHome
          </p>
        </div>

        <div className="md:hidden border border-paper-200 bg-paper-50 p-4 mb-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-courtyard-700 font-semibold">
              Step {currentStep} of {STEPS.length}
            </p>
            <p className="text-sm font-medium text-ink-950 truncate">{STEPS[currentStep - 1].title}</p>
          </div>
          <div className="h-1 bg-paper-200">
            <div
              className="h-1 bg-courtyard-700 transition-all"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="hidden md:block bg-paper-50 border border-paper-200 p-4 lg:p-6 mb-8">
          <div className="flex items-center">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => goToStep(step.id)}
                    className={`flex flex-col items-center shrink-0 px-1 ${
                      isActive || isCompleted ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                    }`}
                    disabled={!isActive && !isCompleted && step.id > currentStep}
                  >
                    <div className={`w-10 h-10 flex items-center justify-center mb-2 transition-all ${
                      isCompleted ? 'bg-courtyard-700 text-paper-50' :
                      isActive ? 'bg-courtyard-700 text-paper-50' :
                      'bg-paper-200 text-ink-400'
                    }`}>
                      {isCompleted ? (
                        <IconCheck size={18} stroke={1.5} />
                      ) : (
                        <StepIcon size={18} stroke={1.4} />
                      )}
                    </div>
                    <span className={`text-[11px] font-medium text-center whitespace-nowrap ${
                      isActive ? 'text-courtyard-700' :
                      isCompleted ? 'text-courtyard-600' :
                      'text-ink-400'
                    }`}>
                      {step.title}
                    </span>
                  </button>
                  
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-px mx-2 min-w-2 ${
                      currentStep > step.id ? 'bg-courtyard-700' : 'bg-paper-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="bg-paper-50 border border-paper-200 p-4 sm:p-6 lg:p-8 min-w-0">
          {errors.submit && (
            <div className="mb-6 p-4 bg-laterite-500/10 border border-laterite-500/30 text-laterite-600 text-sm">
              {errors.submit}
            </div>
          )}
          
          {renderStepContent()}

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:items-center sm:justify-between mt-8 pt-6 border-t border-paper-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center justify-center px-5 py-3 font-medium transition-all w-full sm:w-auto ${
                currentStep === 1
                  ? 'bg-paper-200 text-ink-400 cursor-not-allowed'
                  : 'btn-outline-ink'
              }`}
            >
              <IconArrowLeft size={18} stroke={1.5} className="mr-2" />
              Previous
            </button>

            {currentStep < STEPS.length ? (
              <button
                onClick={nextStep}
                className="btn-courtyard justify-center w-full sm:w-auto"
              >
                Next Step
                <IconArrowRight size={18} stroke={1.5} className="ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-courtyard justify-center w-full sm:w-auto disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-paper-50 mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <IconCheck size={18} stroke={1.5} className="mr-2" />
                    Submit Property
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PropertyOnboardingForm;
