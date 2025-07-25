import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationStep2Schema } from '../../../validations/auth';
import type { RegistrationStep2Values } from '../../../validations/auth';
import type { UserRole } from '../../../types/auth';
import RoleSelection from './RoleSelection';
import Button from '../../UI/Button';

interface RoleSelectionStepProps {
  onSubmit: (data: RegistrationStep2Values) => void;
  onBack: () => void;
  defaultValues?: Partial<RegistrationStep2Values>;
}

const RoleSelectionStep: React.FC<RoleSelectionStepProps> = ({ 
  onSubmit, 
  onBack,
  defaultValues = {} 
}) => {
  const { 
    handleSubmit, 
    setValue,
    formState: { errors },
    watch
  } = useForm<RegistrationStep2Values>({
    resolver: zodResolver(registrationStep2Schema),
    defaultValues: {
      role: defaultValues.role || undefined,
    },
  });
  
  const selectedRole = watch('role');
  
  const handleRoleSelect = (role: UserRole) => {
    setValue('role', role, { shouldValidate: true });
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <RoleSelection
        selectedRole={selectedRole || null}
        onSelectRole={handleRoleSelect}
        error={errors.role?.message}
      />
      
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
          disabled={!selectedRole}
        >
          Continue
        </Button>
      </div>
    </form>
  );
};

export default RoleSelectionStep;