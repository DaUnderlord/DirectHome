import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationStep3Schema, RegistrationStep3Values } from '../../../validations/auth';
import Input from '../../UI/Input';
import Button from '../../UI/Button';

interface ProfileInfoStepProps {
  onSubmit: (data: RegistrationStep3Values) => void;
  onBack: () => void;
  defaultValues?: Partial<RegistrationStep3Values>;
}

const ProfileInfoStep: React.FC<ProfileInfoStepProps> = ({ 
  onSubmit, 
  onBack,
  defaultValues = {} 
}) => {
  const { 
    control, 
    handleSubmit,
    formState: { errors }
  } = useForm<RegistrationStep3Values>({
    resolver: zodResolver(registrationStep3Schema),
    defaultValues: {
      bio: defaultValues.bio || '',
      address: defaultValues.address || '',
      city: defaultValues.city || '',
      state: defaultValues.state || '',
      zipCode: defaultValues.zipCode || '',
      occupation: defaultValues.occupation || '',
      company: defaultValues.company || '',
      notificationPreferences: defaultValues.notificationPreferences || {
        email: true,
        sms: true,
        push: true,
        newMessages: true,
        appointmentReminders: true,
        marketingUpdates: false,
      },
    },
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        This information is optional but helps us personalize your experience. You can update it later from your profile.
      </p>
      
      <Controller
        name="bio"
        control={control}
        render={({ field }) => (
          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              placeholder="Tell us a bit about yourself"
              className={`w-full px-3 py-2 border ${
                errors.bio ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              rows={3}
              {...field}
            />
            {errors.bio && <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>}
          </div>
        )}
      />
      
      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <Input
            id="address"
            label="Address"
            placeholder="Your address (optional)"
            error={errors.address?.message}
            {...field}
          />
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <Input
              id="city"
              label="City"
              placeholder="City (optional)"
              error={errors.city?.message}
              {...field}
            />
          )}
        />
        
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <Input
              id="state"
              label="State"
              placeholder="State (optional)"
              error={errors.state?.message}
              {...field}
            />
          )}
        />
        
        <Controller
          name="zipCode"
          control={control}
          render={({ field }) => (
            <Input
              id="zipCode"
              label="Zip Code"
              placeholder="Zip code (optional)"
              error={errors.zipCode?.message}
              {...field}
            />
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="occupation"
          control={control}
          render={({ field }) => (
            <Input
              id="occupation"
              label="Occupation"
              placeholder="Your occupation (optional)"
              error={errors.occupation?.message}
              {...field}
            />
          )}
        />
        
        <Controller
          name="company"
          control={control}
          render={({ field }) => (
            <Input
              id="company"
              label="Company"
              placeholder="Your company (optional)"
              error={errors.company?.message}
              {...field}
            />
          )}
        />
      </div>
      
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Notification Preferences</h4>
        <div className="space-y-2">
          <Controller
            name="notificationPreferences.email"
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className="flex items-center">
                <input
                  id="email-notifications"
                  type="checkbox"
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                  Email notifications
                </label>
              </div>
            )}
          />
          
          <Controller
            name="notificationPreferences.sms"
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className="flex items-center">
                <input
                  id="sms-notifications"
                  type="checkbox"
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sms-notifications" className="ml-2 block text-sm text-gray-700">
                  SMS notifications
                </label>
              </div>
            )}
          />
          
          <Controller
            name="notificationPreferences.marketingUpdates"
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className="flex items-center">
                <input
                  id="marketing-updates"
                  type="checkbox"
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="marketing-updates" className="ml-2 block text-sm text-gray-700">
                  Marketing updates and newsletters
                </label>
              </div>
            )}
          />
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        
        <Button
          type="submit"
        >
          Complete Registration
        </Button>
      </div>
    </form>
  );
};

export default ProfileInfoStep;