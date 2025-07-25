import { z } from 'zod';

// User Roles
export enum UserRole {
  HOME_OWNER = 'homeowner',
  HOME_SEEKER = 'homeseeker',
  ADMIN = 'admin',
}

// Verification Status
export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

// Authentication Status
export enum AuthStatus {
  IDLE = 'idle',
  AUTHENTICATING = 'authenticating',
  AUTHENTICATED = 'authenticated',
  ERROR = 'error',
  UNAUTHENTICATED = 'unauthenticated',
}

// Account Status
export enum AccountStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DEACTIVATED = 'deactivated',
  DELETED = 'deleted',
}

// Base User Interface
export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  previousRoles?: UserRole[];
  emailVerified: boolean;
  phoneVerified: boolean;
  verificationStatus: VerificationStatus;
  accountStatus: AccountStatus;
  lastLogin?: Date;
  profile?: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

// User Profile Interface
export interface UserProfile {
  userId: string;
  avatar?: string;
  bio?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  occupation?: string;
  company?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
    newMessages: boolean;
    appointmentReminders: boolean;
    marketingUpdates: boolean;
  };
  trustScore?: number;
  verifiedDocuments?: string[];
  propertyOwnerInfo?: {
    type: string;
    experience: string;
    propertyTypes: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Authentication State Interface
export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  status: AuthStatus;
  error: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

// Registration Data Interface
export interface RegistrationData {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// Registration Step Interface
export interface RegistrationStep {
  step: number;
  isCompleted: boolean;
  isActive: boolean;
  title: string;
  description: string;
}

// Login Credentials Interface
export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
  rememberMe?: boolean;
}

// Verification Code Interface
export interface VerificationCode {
  code: string;
  type: 'email' | 'phone';
}

// Password Reset Request Interface
export interface PasswordResetRequest {
  emailOrPhone: string;
}

// Password Reset Confirmation Interface
export interface PasswordResetConfirmation {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Social Login Provider
export enum SocialProvider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
}

// Social Login Data
export interface SocialLoginData {
  provider: SocialProvider;
  token: string;
  userData?: {
    email?: string;
    name?: string;
    picture?: string;
  };
}

// Authentication Response Interface
export interface AuthResponse {
  user: User;
  profile: UserProfile;
  token: string;
  refreshToken: string;
  expiresAt: number;
}

// Token Refresh Response
export interface TokenRefreshResponse {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

// Auth Error Types
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'invalid_credentials',
  ACCOUNT_LOCKED = 'account_locked',
  EMAIL_NOT_VERIFIED = 'email_not_verified',
  PHONE_NOT_VERIFIED = 'phone_not_verified',
  ACCOUNT_SUSPENDED = 'account_suspended',
  NETWORK_ERROR = 'network_error',
  SERVER_ERROR = 'server_error',
  UNKNOWN_ERROR = 'unknown_error',
}

// Auth Error Interface
export interface AuthError {
  type: AuthErrorType;
  message: string;
  details?: Record<string, any>;
}

// Password Strength Level
export enum PasswordStrengthLevel {
  VERY_WEAK = 'very_weak',
  WEAK = 'weak',
  MODERATE = 'moderate',
  STRONG = 'strong',
  VERY_STRONG = 'very_strong',
}

// Auth Context Interface
export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  status: AuthStatus;
  error: AuthError | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  verifyPhone: (code: string) => Promise<void>;
  resetPassword: (request: PasswordResetRequest) => Promise<void>;
  confirmResetPassword: (confirmation: PasswordResetConfirmation) => Promise<void>;
  socialLogin: (data: SocialLoginData) => Promise<AuthResponse>;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
  refreshAuthToken: () => Promise<TokenRefreshResponse>;
}

// Role-based Permission
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

// Role with Permissions
export interface RoleWithPermissions {
  role: UserRole;
  permissions: Permission[];
}