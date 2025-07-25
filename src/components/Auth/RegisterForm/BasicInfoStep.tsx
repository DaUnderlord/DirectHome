import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationStep1Schema, checkPasswordStrength } from '../../../validations/auth';
import type { RegistrationStep1Values } from '../../../validations/auth';
import Input from '../../UI/Input';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

interface BasicInfoStepProps {
  onSubmit: (data: RegistrationStep1Values) => void;
  defaultValues?: Partial<RegistrationStep1Values>;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ onSubmit, defaultValues = {} }) => {
  const { 
    control, 
    handleSubmit, 
    formState: { errors }, 
    watch 
  } = useForm<RegistrationStep1Values>({
    resolver: zodResolver(registrationStep1Schema),
    defaultValues: {
      firstName: defaultValues.firstName || '',
      lastName: defaultValues.lastName || '',
      email: defaultValues.email || '',
      phone: defaultValues.phone || '',
      password: defaultValues.password || '',
      confirmPassword: defaultValues.confirmPassword || '',
    },
  });
  
  const password = watch('password');
  const passwordStrength = password ? checkPasswordStrength(password) : { score: 0, level: 'very_weak' as const };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <Input
              id="firstName"
              label="First Name"
              placeholder="Enter your first name"
              error={errors.firstName?.message}
              required
              {...field}
            />
          )}
        />
        
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <Input
              id="lastName"
              label="Last Name"
              placeholder="Enter your last name"
              error={errors.lastName?.message}
              required
              {...field}
            />
          )}
        />
      </div>
      
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email address"
            error={errors.email?.message}
            required
            {...field}
          />
        )}
      />
      
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <Input
            id="phone"
            type="tel"
            label="Phone Number"
            placeholder="Enter your Nigerian phone number (e.g., 08012345678)"
            error={errors.phone?.message}
            required
            {...field}
          />
        )}
      />
      
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <div>
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Create a strong password"
              error={errors.password?.message}
              required
              {...field}
            />
            {field.value && <PasswordStrengthIndicator strength={passwordStrength} />}
          </div>
        )}
      />
      
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <Input
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            required
            {...field}
          />
        )}
      />
      
      <div className="text-xs text-gray-500 mt-2">
        <p>Password must contain:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li className={password && password.length >= 8 ? 'text-green-600' : ''}>
            At least 8 characters
          </li>
          <li className={password && /[A-Z]/.test(password) ? 'text-green-600' : ''}>
            At least one uppercase letter
          </li>
          <li className={password && /[a-z]/.test(password) ? 'text-green-600' : ''}>
            At least one lowercase letter
          </li>
          <li className={password && /\d/.test(password) ? 'text-green-600' : ''}>
            At least one number
          </li>
          <li className={password && /[^a-zA-Z0-9]/.test(password) ? 'text-green-600' : ''}>
            At least one special character
          </li>
        </ul>
      </div>
      
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Continue
      </button>
    </form>
  );
};

export default BasicInfoStep;