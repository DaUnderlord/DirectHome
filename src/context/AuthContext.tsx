import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.IDLE);
  const [error, setError] = useState<AuthError | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  // Check for stored auth data on component mount
  useEffect(() => {
    const checkAuth = async () => {
      setStatus(AuthStatus.AUTHENTICATING);
      
      try {
        // Check for stored tokens
        const storedToken = localStorage.getItem('auth_token');
        const storedRefreshToken = localStorage.getItem('auth_refresh_token');
        const storedExpiresAt = localStorage.getItem('auth_expires_at');
        
        if (!storedToken || !storedRefreshToken || !storedExpiresAt) {
          setStatus(AuthStatus.UNAUTHENTICATED);
          return;
        }
        
        const expiresAtNum = parseInt(storedExpiresAt, 10);
        
        // Check if token is expired
        if (Date.now() >= expiresAtNum) {
          // Token expired, try to refresh
          try {
            const refreshResult = await refreshAuthToken();
            setToken(refreshResult.token);
            setRefreshToken(refreshResult.refreshToken);
            setExpiresAt(refreshResult.expiresAt);
            
            // Fetch user data with new token
            await fetchUserData(refreshResult.token);
            setStatus(AuthStatus.AUTHENTICATED);
          } catch (refreshError) {
            // Refresh failed, clear auth data
            clearAuthData();
            setStatus(AuthStatus.UNAUTHENTICATED);
          }
        } else {
          // Token still valid
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);
          setExpiresAt(expiresAtNum);
          
          // Fetch user data
          await fetchUserData(storedToken);
          setStatus(AuthStatus.AUTHENTICATED);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        clearAuthData();
        setStatus(AuthStatus.ERROR);
        setError({
          type: AuthErrorType.UNKNOWN_ERROR,
          message: 'Failed to authenticate. Please try again.'
        });
      }
    };
    
    checkAuth();
  }, []);
  
  // Helper function to fetch user data
  const fetchUserData = async (authToken: string): Promise<void> => {
    try {
      // This would be replaced with an actual API call
      // For now, we'll simulate a successful fetch with mock data
      const mockUser: User = {
        id: '123',
        email: 'user@example.com',
        phone: '+2348012345678',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.HOME_SEEKER,
        emailVerified: true,
        phoneVerified: true,
        verificationStatus: VerificationStatus.VERIFIED,
        accountStatus: AccountStatus.ACTIVE,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const mockProfile: UserProfile = {
        userId: '123',
        avatar: 'https://example.com/avatar.jpg',
        bio: 'Looking for a nice apartment in Lagos',
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
      };
      
      setUser(mockUser);
      setProfile(mockProfile);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw error;
    }
  };
  
  // Helper function to clear auth data
  const clearAuthData = (): void => {
    setUser(null);
    setProfile(null);
    setToken(null);
    setRefreshToken(null);
    setExpiresAt(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh_token');
    localStorage.removeItem('auth_expires_at');
  };

  // Login function
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setStatus(AuthStatus.AUTHENTICATING);
    setError(null);
    
    try {
      // This would be replaced with an actual API call
      // For now, we'll simulate a successful login with mock data
      const mockResponse: AuthResponse = {
        user: {
          id: '123',
          email: credentials.emailOrPhone.includes('@') ? credentials.emailOrPhone : 'user@example.com',
          phone: !credentials.emailOrPhone.includes('@') ? credentials.emailOrPhone : '+2348012345678',
          firstName: 'John',
          lastName: 'Doe',
          role: UserRole.HOME_SEEKER,
          emailVerified: true,
          phoneVerified: true,
          verificationStatus: VerificationStatus.VERIFIED,
          accountStatus: AccountStatus.ACTIVE,
          lastLogin: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        profile: {
          userId: '123',
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
      
      // Save to localStorage if rememberMe is true
      if (credentials.rememberMe) {
        localStorage.setItem('auth_token', mockResponse.token);
        localStorage.setItem('auth_refresh_token', mockResponse.refreshToken);
        localStorage.setItem('auth_expires_at', mockResponse.expiresAt.toString());
      }
      
      return mockResponse;
    } catch (error) {
      console.error('Login failed:', error);
      setStatus(AuthStatus.ERROR);
      const authError: AuthError = {
        type: AuthErrorType.INVALID_CREDENTIALS,
        message: 'Invalid email/phone or password. Please try again.'
      };
      setError(authError);
      throw authError;
    }
  };

  // Register function
  const register = async (data: RegistrationData): Promise<void> => {
    setStatus(AuthStatus.AUTHENTICATING);
    setError(null);
    
    try {
      // This would be replaced with an actual API call
      // For now, we'll simulate a successful registration
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would return user data and tokens
      // For now, we'll just set the status to unauthenticated to prompt verification
      setStatus(AuthStatus.UNAUTHENTICATED);
      
      // In a real app, we might store the email to pre-fill the verification form
      sessionStorage.setItem('pending_verification_email', data.email);
    } catch (error) {
      console.error('Registration failed:', error);
      setStatus(AuthStatus.ERROR);
      const authError: AuthError = {
        type: AuthErrorType.SERVER_ERROR,
        message: 'Registration failed. Please try again.'
      };
      setError(authError);
      throw authError;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // This would include an API call to invalidate the token on the server
      // For now, we'll just clear the local state
      
      clearAuthData();
      setStatus(AuthStatus.UNAUTHENTICATED);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails on the server, we clear local state
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
    isLoading: status === AuthStatus.AUTHENTICATING || status === AuthStatus.IDLE,
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