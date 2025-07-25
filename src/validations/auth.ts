import { z } from 'zod';
import {
  UserRole,
  PasswordStrengthLevel,
  AccountStatus,
  VerificationStatus
} from '../types/auth';

// Helper regex patterns
const PHONE_REGEX = /^(\+?234|0)[789][01]\d{8}$/; // Nigerian phone number format
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Login Schema
export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone number is required')
    .refine((value) => {
      // Check if input is email or valid Nigerian phone
      const isEmail = EMAIL_REGEX.test(value);
      const isPhone = PHONE_REGEX.test(value);
      return isEmail || isPhone;
    }, 'Please enter a valid email or Nigerian phone number'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

// Registration Schema - Step 1: Basic Information
export const registrationStep1Schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(NAME_REGEX, 'Please enter a valid name'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(NAME_REGEX, 'Please enter a valid name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(PHONE_REGEX, 'Please enter a valid Nigerian phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(
      PASSWORD_REGEX,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Registration Schema - Step 2: Role Selection
export const registrationStep2Schema = z.object({
  role: z.nativeEnum(UserRole, {
    required_error: 'Please select a role'
  }),
});

// Registration Schema - Step 3: Profile Information (Optional)
export const registrationStep3Schema = z.object({
  avatar: z.string().optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  address: z.string().max(100, 'Address cannot exceed 100 characters').optional(),
  city: z.string().max(50, 'City cannot exceed 50 characters').optional(),
  state: z.string().max(50, 'State cannot exceed 50 characters').optional(),
  zipCode: z.string().max(10, 'Zip code cannot exceed 10 characters').optional(),
  occupation: z.string().max(50, 'Occupation cannot exceed 50 characters').optional(),
  company: z.string().max(50, 'Company name cannot exceed 50 characters').optional(),
  notificationPreferences: z.object({
    email: z.boolean().default(true),
    sms: z.boolean().default(true),
    push: z.boolean().default(true),
    newMessages: z.boolean().default(true),
    appointmentReminders: z.boolean().default(true),
    marketingUpdates: z.boolean().default(false),
  }).optional().default({
    email: true,
    sms: true,
    push: true,
    newMessages: true,
    appointmentReminders: true,
    marketingUpdates: false,
  }),
});

// Complete Registration Schema (all steps combined)
export const completeRegistrationSchema = registrationStep1Schema
  .merge(registrationStep2Schema)
  .merge(registrationStep3Schema);

// Verification Code Schema
export const verificationCodeSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits').regex(/^\d{6}$/, 'Code must contain only digits'),
  type: z.enum(['email', 'phone']),
});

// Password Reset Request Schema
export const passwordResetRequestSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone number is required')
    .refine((value) => {
      const isEmail = EMAIL_REGEX.test(value);
      const isPhone = PHONE_REGEX.test(value);
      return isEmail || isPhone;
    }, 'Please enter a valid email or Nigerian phone number'),
});

// Password Reset Confirmation Schema
export const passwordResetConfirmationSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(
      PASSWORD_REGEX,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// User Profile Update Schema
export const userProfileUpdateSchema = z.object({
  avatar: z.string().optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  address: z.string().max(100, 'Address cannot exceed 100 characters').optional(),
  city: z.string().max(50, 'City cannot exceed 50 characters').optional(),
  state: z.string().max(50, 'State cannot exceed 50 characters').optional(),
  zipCode: z.string().max(10, 'Zip code cannot exceed 10 characters').optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  occupation: z.string().max(50, 'Occupation cannot exceed 50 characters').optional(),
  company: z.string().max(50, 'Company name cannot exceed 50 characters').optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  socialLinks: z.object({
    facebook: z.string().url('Please enter a valid Facebook URL').optional().or(z.literal('')),
    twitter: z.string().url('Please enter a valid Twitter URL').optional().or(z.literal('')),
    instagram: z.string().url('Please enter a valid Instagram URL').optional().or(z.literal('')),
    linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  }).optional(),
  notificationPreferences: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
    newMessages: z.boolean(),
    appointmentReminders: z.boolean(),
    marketingUpdates: z.boolean(),
  }).optional(),
});

// Password Change Schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(
      PASSWORD_REGEX,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Social Login Schema
export const socialLoginSchema = z.object({
  provider: z.enum(['google', 'facebook', 'twitter']),
  token: z.string().min(1, 'Token is required'),
  userData: z.object({
    email: z.string().email('Invalid email').optional(),
    name: z.string().optional(),
    picture: z.string().optional(),
  }).optional(),
});

// Password Strength Checker
export const checkPasswordStrength = (password: string): { score: number; level: PasswordStrengthLevel } => {
  let strength = 0;

  // Length check
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;

  // Complexity checks
  if (/[a-z]/.test(password)) strength += 1; // lowercase
  if (/[A-Z]/.test(password)) strength += 1; // uppercase
  if (/\d/.test(password)) strength += 1;    // numbers
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1; // special chars

  // Variety check
  const uniqueChars = new Set(password).size;
  if (uniqueChars > 6) strength += 1;
  if (uniqueChars > 10) strength += 1;

  const score = Math.min(strength, 8); // Scale from 0-8

  // Map score to strength level
  let level: PasswordStrengthLevel;
  if (score <= 2) {
    level = PasswordStrengthLevel.VERY_WEAK;
  } else if (score <= 4) {
    level = PasswordStrengthLevel.WEAK;
  } else if (score <= 6) {
    level = PasswordStrengthLevel.MODERATE;
  } else if (score <= 7) {
    level = PasswordStrengthLevel.STRONG;
  } else {
    level = PasswordStrengthLevel.VERY_STRONG;
  }

  return { score, level };
};

// User Schema for Admin Management
export const userAdminSchema = z.object({
  id: z.string().optional(), // Optional for creation
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(PHONE_REGEX, 'Please enter a valid Nigerian phone number'),
  firstName: z.string().min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(NAME_REGEX, 'Please enter a valid name'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(NAME_REGEX, 'Please enter a valid name'),
  role: z.nativeEnum(UserRole),
  emailVerified: z.boolean().default(false),
  phoneVerified: z.boolean().default(false),
  verificationStatus: z.nativeEnum(VerificationStatus).default(VerificationStatus.UNVERIFIED),
  accountStatus: z.nativeEnum(AccountStatus).default(AccountStatus.ACTIVE),
});

// Export types for form handling
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegistrationStep1Values = z.infer<typeof registrationStep1Schema>;
export type RegistrationStep2Values = z.infer<typeof registrationStep2Schema>;
export type RegistrationStep3Values = z.infer<typeof registrationStep3Schema>;
export type CompleteRegistrationValues = z.infer<typeof completeRegistrationSchema>;
export type VerificationCodeValues = z.infer<typeof verificationCodeSchema>;
export type PasswordResetRequestValues = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirmationValues = z.infer<typeof passwordResetConfirmationSchema>;
export type UserProfileUpdateValues = z.infer<typeof userProfileUpdateSchema>;
export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;
export type SocialLoginValues = z.infer<typeof socialLoginSchema>;
export type UserAdminValues = z.infer<typeof userAdminSchema>;