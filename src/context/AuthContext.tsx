import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { 
  AuthStatus, 
  UserRole, 
  AuthErrorType,
  VerificationStatus,
  AccountStatus
} from '../types/auth';
import type { 
  User, 
  UserProfile, 
  AuthError, 
  LoginCredentials,
  RegistrationData,
  AuthResponse,
  AuthContextType,
  TokenRefreshResponse,
  PasswordResetRequest,
  PasswordResetConfirmation,
  SocialLoginData
} from '../types/auth';
import type { Session } from '@supabase/supabase-js';

// Map database role to UserRole enum
const mapDbRoleToUserRole = (dbRole: string): UserRole => {
  switch (dbRole) {
    case 'homeowner': return UserRole.HOME_OWNER;
    case 'homeseeker': return UserRole.HOME_SEEKER;
    case 'admin': return UserRole.ADMIN;
    default: return UserRole.HOME_SEEKER;
  }
};

// Map UserRole enum to database role
const mapUserRoleToDbRole = (role: UserRole): 'homeowner' | 'homeseeker' | 'admin' => {
  switch (role) {
    case UserRole.HOME_OWNER: return 'homeowner';
    case UserRole.HOME_SEEKER: return 'homeseeker';
    case UserRole.ADMIN: return 'admin';
    default: return 'homeseeker';
  }
};

// Create context with undefined initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State for user data and authentication status
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.UNAUTHENTICATED);
  const [error, setError] = useState<AuthError | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const isHandlingSessionRef = useRef(false);

  // Check for Supabase session on component mount
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Get current session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setStatus(AuthStatus.UNAUTHENTICATED);
          setIsInitializing(false);
          return;
        }

        if (session) {
          await handleSession(session);
        } else {
          setStatus(AuthStatus.UNAUTHENTICATED);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setStatus(AuthStatus.UNAUTHENTICATED);
      } finally {
        setIsInitializing(false);
      }
    };

    // Add timeout to prevent infinite loading (3 seconds max)
    timeoutId = setTimeout(() => {
      setIsInitializing(false);
    }, 3000);

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (session) {
        if (isHandlingSessionRef.current) return;
        isHandlingSessionRef.current = true;
        try {
          await handleSession(session);
        } finally {
          isHandlingSessionRef.current = false;
        }
      } else {
        clearAuthData();
        setStatus(AuthStatus.UNAUTHENTICATED);
      }
    });

    const handleUnauthorized = async () => {
      if (!isMounted) return;
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Error signing out after unauthorized:', e);
      } finally {
        clearAuthData();
        setStatus(AuthStatus.UNAUTHENTICATED);
      }
    };

    window.addEventListener('directhome:unauthorized', handleUnauthorized);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      window.removeEventListener('directhome:unauthorized', handleUnauthorized);
      subscription.unsubscribe();
    };
  }, []);

  // Handle session and fetch user profile
  const handleSession = async (session: Session) => {
    try {
      setToken(session.access_token);
      setRefreshToken(session.refresh_token || null);
      setExpiresAt(session.expires_at ? session.expires_at * 1000 : null);

      localStorage.setItem('auth_token', session.access_token);
      if (session.refresh_token) {
        localStorage.setItem('auth_refresh_token', session.refresh_token);
      }
      if (session.expires_at) {
        localStorage.setItem('auth_expires_at', (session.expires_at * 1000).toString());
      }

      // Fetch user profile from database
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
      }

      const dbProfile: any = profileData || {};

      const userData: User = {
        id: session.user.id,
        email: session.user.email || dbProfile.email || '',
        phone: dbProfile.phone || '',
        firstName: dbProfile.first_name || '',
        lastName: dbProfile.last_name || '',
        role: mapDbRoleToUserRole(dbProfile.role || 'homeseeker'),
        emailVerified: session.user.email_confirmed_at !== null,
        phoneVerified: dbProfile.phone_verified || false,
        verificationStatus: dbProfile.verification_status === 'verified' 
          ? VerificationStatus.VERIFIED 
          : VerificationStatus.PENDING,
        accountStatus: dbProfile.account_status === 'active' 
          ? AccountStatus.ACTIVE 
          : AccountStatus.SUSPENDED,
        lastLogin: new Date(),
        createdAt: new Date(session.user.created_at),
        updatedAt: new Date(dbProfile.updated_at || session.user.created_at),
      };

      const userProfile: UserProfile = {
        userId: session.user.id,
        avatar: dbProfile.avatar_url,
        bio: dbProfile.bio,
        notificationPreferences: dbProfile.notification_preferences || {
          email: true,
          sms: true,
          push: true,
          newMessages: true,
          appointmentReminders: true,
          marketingUpdates: false,
        },
        createdAt: new Date(dbProfile.created_at || session.user.created_at),
        updatedAt: new Date(dbProfile.updated_at || session.user.created_at),
      };

      setUser(userData);
      setProfile(userProfile);
      setStatus(AuthStatus.AUTHENTICATED);
    } catch (error) {
      console.error('Error handling session:', error);
      setStatus(AuthStatus.ERROR);
    }
  };

  // Helper function to fetch user data (kept for compatibility)
  const fetchUserData = async (_authToken: string): Promise<void> => {
    // This is now handled by handleSession
    console.log('fetchUserData called - session handling is automatic');
  };

  // Helper function to clear auth data
  const clearAuthData = (): void => {
    setUser(null);
    setProfile(null);
    setToken(null);
    setRefreshToken(null);
    setExpiresAt(null);
    // Supabase handles its own session storage

    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh_token');
    localStorage.removeItem('auth_expires_at');
  };

  // Login function using Supabase Auth
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setStatus(AuthStatus.AUTHENTICATING);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.emailOrPhone,
        password: credentials.password,
      });

      if (signInError) {
        throw signInError;
      }

      if (!data.session || !data.user) {
        throw new Error('No session returned');
      }

      const metadata: any = data.user.user_metadata || {};
      const roleFromMeta = metadata.role || metadata.user_role;

      const userData: User = {
        id: data.user.id,
        email: data.user.email || '',
        phone: metadata.phone || '',
        firstName: metadata.first_name || metadata.firstName || '',
        lastName: metadata.last_name || metadata.lastName || '',
        role: mapDbRoleToUserRole(roleFromMeta || 'homeseeker'),
        emailVerified: data.user.email_confirmed_at !== null,
        phoneVerified: false,
        verificationStatus: VerificationStatus.PENDING,
        accountStatus: AccountStatus.ACTIVE,
        lastLogin: new Date(),
        createdAt: new Date(data.user.created_at),
        updatedAt: new Date(),
      };

      const userProfile: UserProfile = {
        userId: data.user.id,
        avatar: metadata.avatar_url,
        bio: metadata.bio,
        notificationPreferences: {
          email: true,
          sms: true,
          push: true,
          newMessages: true,
          appointmentReminders: true,
          marketingUpdates: false,
        },
        createdAt: new Date(data.user.created_at),
        updatedAt: new Date(),
      };

      setUser(userData);
      setProfile(userProfile);
      setToken(data.session.access_token);
      setRefreshToken(data.session.refresh_token || null);
      setExpiresAt(data.session.expires_at ? data.session.expires_at * 1000 : null);
      setStatus(AuthStatus.AUTHENTICATED);
      setIsInitializing(false);

      localStorage.setItem('auth_token', data.session.access_token);
      if (data.session.refresh_token) {
        localStorage.setItem('auth_refresh_token', data.session.refresh_token);
      }
      if (data.session.expires_at) {
        localStorage.setItem('auth_expires_at', (data.session.expires_at * 1000).toString());
      }

      const response: AuthResponse = {
        user: userData,
        profile: userProfile,
        token: data.session.access_token,
        refreshToken: data.session.refresh_token || '',
        expiresAt: data.session.expires_at ? data.session.expires_at * 1000 : Date.now() + 3600000,
      };

      return response;
    } catch (error: any) {
      console.error('Login failed:', error);
      setStatus(AuthStatus.ERROR);
      const authError: AuthError = {
        type: AuthErrorType.INVALID_CREDENTIALS,
        message: error.message || 'Invalid email or password. Please try again.'
      };
      setError(authError);
      throw authError;
    }
  };

  const register = async (data: RegistrationData): Promise<void> => {
    setStatus(AuthStatus.AUTHENTICATING);
    setError(null);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: mapUserRoleToDbRole(data.role as UserRole),
            phone: data.phone,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('Registration failed - no user returned');
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: data.email,
          phone: data.phone,
          first_name: data.firstName,
          last_name: data.lastName,
          role: mapUserRoleToDbRole(data.role as UserRole),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      sessionStorage.setItem('pending_verification_email', data.email);

      if (!authData.session) {
        setStatus(AuthStatus.UNAUTHENTICATED);
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      setStatus(AuthStatus.ERROR);
      const authError: AuthError = {
        type: AuthErrorType.SERVER_ERROR,
        message: error.message || 'Registration failed. Please try again.'
      };
      setError(authError);
      throw authError;
    }
  };

  // Logout function using Supabase Auth
  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      clearAuthData();
      setStatus(AuthStatus.UNAUTHENTICATED);
    } catch (error) {
      console.error('Logout failed:', error);
      clearAuthData();
      setStatus(AuthStatus.UNAUTHENTICATED);
    }
  };

  // Verify email function
  const verifyEmail = async (code: string): Promise<void> => {
    setStatus(AuthStatus.AUTHENTICATING);
    setError(null);
    
    try {
      // This would be replaced with an actual API call
      // For now, we'll simulate a successful verification
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would update the user's verification status
      // For now, we'll just set the status back to unauthenticated
      setStatus(AuthStatus.UNAUTHENTICATED);
    } catch (error) {
      console.error('Email verification failed:', error);
      setStatus(AuthStatus.ERROR);
      const authError: AuthError = {
        type: AuthErrorType.SERVER_ERROR,
        message: 'Email verification failed. Please try again.'
      };
      setError(authError);
      throw authError;
    }
  };

  // Verify phone function
  const verifyPhone = async (code: string): Promise<void> => {
    setStatus(AuthStatus.AUTHENTICATING);
    setError(null);
    
    try {
      // This would be replaced with an actual API call
      // For now, we'll simulate a successful verification
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would update the user's verification status
      // For now, we'll just set the status back to unauthenticated
      setStatus(AuthStatus.UNAUTHENTICATED);
    } catch (error) {
      console.error('Phone verification failed:', error);
      setStatus(AuthStatus.ERROR);
      const authError: AuthError = {
        type: AuthErrorType.SERVER_ERROR,
        message: 'Phone verification failed. Please try again.'
      };
      setError(authError);
      throw authError;
    }
  };

  // Reset password request function
  const resetPassword = async (request: PasswordResetRequest): Promise<void> => {
    setError(null);
    
    try {
      // This would be replaced with an actual API call
      // For now, we'll simulate a successful request
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would send a reset email/SMS
      // For now, we'll just log a success message
      console.log(`Password reset requested for: ${request.emailOrPhone}`);
    } catch (error) {
      console.error('Password reset request failed:', error);
      const authError: AuthError = {
        type: AuthErrorType.SERVER_ERROR,
        message: 'Password reset request failed. Please try again.'
      };
      setError(authError);
      throw authError;
    }
  };

  // Confirm password reset function
  const confirmResetPassword = async (confirmation: PasswordResetConfirmation): Promise<void> => {
    setError(null);
    
    try {
      // This would be replaced with an actual API call
      // For now, we'll simulate a successful confirmation
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would update the user's password
      // For now, we'll just log a success message
      console.log('Password reset confirmed successfully');
    } catch (error) {
      console.error('Password reset confirmation failed:', error);
      const authError: AuthError = {
        type: AuthErrorType.SERVER_ERROR,
        message: 'Password reset confirmation failed. Please try again.'
      };
      setError(authError);
      throw authError;
    }
  };

  // Social login function
  const socialLogin = async (data: SocialLoginData): Promise<AuthResponse> => {
    setStatus(AuthStatus.AUTHENTICATING);
    setError(null);
    
    try {
      // This would be replaced with an actual API call
      // For now, we'll simulate a successful social login
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse: AuthResponse = {
        user: {
          id: '123',
          email: data.userData?.email || 'social@example.com',
          phone: '+2348012345678', // This would come from the social provider or user input
          firstName: data.userData?.name?.split(' ')[0] || 'Social',
          lastName: data.userData?.name?.split(' ')[1] || 'User',
          role: UserRole.HOME_SEEKER, // Default role for social login
          emailVerified: true, // Usually true for social logins
          phoneVerified: false, // Usually needs verification
          verificationStatus: VerificationStatus.VERIFIED,
          accountStatus: AccountStatus.ACTIVE,
          lastLogin: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        profile: {
          userId: '123',
          avatar: data.userData?.picture,
          notificationPreferences: {
            email: true,
            sms: true,
            push: true,
            newMessages: true,
            appointmentReminders: true,
            marketingUpdates: false,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token: 'mock_token_' + Math.random(),
        refreshToken: 'mock_refresh_token_' + Math.random(),
        expiresAt: Date.now() + 3600000, // 1 hour from now
      };
      
      // Store auth data
      setUser(mockResponse.user);
      setProfile(mockResponse.profile);
      setToken(mockResponse.token);
      setRefreshToken(mockResponse.refreshToken);
      setExpiresAt(mockResponse.expiresAt);
      setStatus(AuthStatus.AUTHENTICATED);
      
      // Save to localStorage
      localStorage.setItem('auth_token', mockResponse.token);
      localStorage.setItem('auth_refresh_token', mockResponse.refreshToken);
      localStorage.setItem('auth_expires_at', mockResponse.expiresAt.toString());
      
      return mockResponse;
    } catch (error) {
      console.error('Social login failed:', error);
      setStatus(AuthStatus.ERROR);
      const authError: AuthError = {
        type: AuthErrorType.SERVER_ERROR,
        message: 'Social login failed. Please try again.'
      };
      setError(authError);
      throw authError;
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
    setError(null);
    
    try {
      if (!profile) {
        throw new Error('No profile to update');
      }
      
      // This would be replaced with an actual API call
      // For now, we'll simulate a successful update
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update profile with new data
      const updatedProfile: UserProfile = {
        ...profile,
        ...data,
        updatedAt: new Date(),
      };
      
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Profile update failed:', error);
      const authError: AuthError = {
        type: AuthErrorType.SERVER_ERROR,
        message: 'Profile update failed. Please try again.'
      };
      setError(authError);
      throw authError;
    }
  };

  // Refresh auth token function
  const refreshAuthToken = async (): Promise<TokenRefreshResponse> => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      // This would be replaced with an actual API call
      // For now, we'll simulate a successful token refresh
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResponse: TokenRefreshResponse = {
        token: 'new_mock_token_' + Math.random(),
        refreshToken: 'new_mock_refresh_token_' + Math.random(),
        expiresAt: Date.now() + 3600000, // 1 hour from now
      };
      
      // Update localStorage
      localStorage.setItem('auth_token', mockResponse.token);
      localStorage.setItem('auth_refresh_token', mockResponse.refreshToken);
      localStorage.setItem('auth_expires_at', mockResponse.expiresAt.toString());
      
      return mockResponse;
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuthData();
      throw error;
    }
  };

  // Provide the auth context value
  const value: AuthContextType = {
    user,
    profile,
    status,
    error,
    isAuthenticated: status === AuthStatus.AUTHENTICATED,
    isLoading: isInitializing && status !== AuthStatus.AUTHENTICATED,
    login,
    register,
    logout,
    verifyEmail,
    verifyPhone,
    resetPassword,
    confirmResetPassword,
    socialLogin,
    updateProfile,
    refreshAuthToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;