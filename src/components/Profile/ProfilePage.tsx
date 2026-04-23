import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  IconUser, 
  IconSettings, 
  IconLock, 
  IconBell, 
  IconShield, 
  IconCreditCard,
  IconChevronRight,
  IconLogout,
  IconCheck,
  IconX,
  IconAlertTriangle
} from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../UI/Card';
import Button from '../UI/Button';
import ChangePasswordModal from './ChangePasswordModal';
import DeleteAccountModal from './DeleteAccountModal';

const ProfilePage: React.FC = () => {
  const { user, profile, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: profile?.bio || ''
  });
  
  // Notification preferences state
  const [preferences, setPreferences] = useState(
    profile?.notificationPreferences || {
      email: true,
      sms: true,
      push: true,
      newMessages: true,
      appointmentReminders: true,
      marketingUpdates: false
    }
  );
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  
  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Toast messages
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Show toast message
  const showToast = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  // Profile editing handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update Supabase profile
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user!.id);

      if (error) throw error;

      // Update local state
      await updateProfile({
        bio: formData.bio
      });

      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Profile update failed:', error);
      showToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: profile?.bio || ''
    });
    setIsEditing(false);
  };
  
  // Notification preferences handlers
  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdatePreferences = async () => {
    setIsSavingPreferences(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_preferences: preferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', user!.id);

      if (error) throw error;

      await updateProfile({ notificationPreferences: preferences });
      showToast('Preferences updated successfully!', 'success');
    } catch (error: any) {
      console.error('Failed to update preferences:', error);
      showToast('Failed to update preferences. Please try again.', 'error');
    } finally {
      setIsSavingPreferences(false);
    }
  };
  
  // Email verification handler
  const handleVerifyEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user!.email
      });
      
      if (error) throw error;
      showToast('Verification email sent! Please check your inbox.', 'success');
    } catch (error: any) {
      console.error('Failed to send verification email:', error);
      showToast('Failed to send verification email. Please try again.', 'error');
    }
  };
  
  // Delete account handler
  const handleDeleteAccount = async () => {
    await logout();
    navigate('/');
  };
  
  if (!user || !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Toast Messages */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up">
          <IconCheck size={20} />
          <span>{successMessage}</span>
        </div>
      )}
      
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up">
          <IconX size={20} />
          <span>{errorMessage}</span>
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card padding="none" className="overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt={`${user.firstName} ${user.lastName}`} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-900">{user.firstName} {user.lastName}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
            
            <nav className="p-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-3 rounded-md ${
                  activeTab === 'profile' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IconUser size={20} className="mr-3" />
                <span>Personal Information</span>
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-4 py-3 rounded-md ${
                  activeTab === 'security' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IconLock size={20} className="mr-3" />
                <span>Security</span>
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-4 py-3 rounded-md ${
                  activeTab === 'notifications' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IconBell size={20} className="mr-3" />
                <span>Notifications</span>
              </button>
              
              <button
                onClick={() => setActiveTab('verification')}
                className={`w-full flex items-center px-4 py-3 rounded-md ${
                  activeTab === 'verification' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IconShield size={20} className="mr-3" />
                <span>Verification</span>
              </button>
              
              <button
                onClick={() => setActiveTab('billing')}
                className={`w-full flex items-center px-4 py-3 rounded-md ${
                  activeTab === 'billing' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IconCreditCard size={20} className="mr-3" />
                <span>Billing</span>
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-4 py-3 rounded-md ${
                  activeTab === 'settings' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IconSettings size={20} className="mr-3" />
                <span>Account Settings</span>
              </button>
              
              <button
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="w-full flex items-center px-4 py-3 rounded-md text-red-700 hover:bg-red-50"
              >
                <IconLogout size={20} className="mr-3" />
                <span>Logout</span>
              </button>
            </nav>
          </Card>
          
          <Card className="mt-6 bg-blue-50 border border-blue-200" padding="md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Need help?</h3>
            <p className="text-sm text-blue-700 mb-3">
              Contact our support team for assistance with your account.
            </p>
            <Link 
              to="/help" 
              className="text-sm font-medium text-blue-700 hover:text-blue-800 flex items-center"
            >
              Get Support
              <IconChevronRight size={16} className="ml-1" />
            </Link>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card padding="lg">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                          !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                        } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                          !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                        } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                      />
                      {user.emailVerified && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="tel"
                        value={user.phone}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                      />
                      {user.phoneVerified && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Phone cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      maxLength={500}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                      } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Tell us about yourself..."
                    />
                    {isEditing && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.bio.length}/500 characters
                      </p>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 flex gap-2">
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={handleSave}
                          disabled={isSaving}
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isSaving}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                <p className="text-gray-600 mb-6">
                  Manage your password and account security settings.
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Password</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Change your password to keep your account secure
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPasswordModal(true)}
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Login Sessions</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Manage your active sessions across devices
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                <p className="text-gray-600 mb-6">
                  Manage how you receive notifications from DirectHome.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Notification Channels</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <input
                            id="email-notifications"
                            type="checkbox"
                            checked={preferences.email}
                            onChange={(e) => handlePreferenceChange('email', e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="email-notifications" className="ml-3 block text-sm text-gray-700">
                            Email Notifications
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <input
                            id="sms-notifications"
                            type="checkbox"
                            checked={preferences.sms}
                            onChange={(e) => handlePreferenceChange('sms', e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="sms-notifications" className="ml-3 block text-sm text-gray-700">
                            SMS Notifications
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <input
                            id="push-notifications"
                            type="checkbox"
                            checked={preferences.push}
                            onChange={(e) => handlePreferenceChange('push', e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="push-notifications" className="ml-3 block text-sm text-gray-700">
                            Push Notifications
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Notification Types</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <input
                            id="new-messages"
                            type="checkbox"
                            checked={preferences.newMessages}
                            onChange={(e) => handlePreferenceChange('newMessages', e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="new-messages" className="ml-3 block text-sm text-gray-700">
                            New Messages
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <input
                            id="appointment-reminders"
                            type="checkbox"
                            checked={preferences.appointmentReminders}
                            onChange={(e) => handlePreferenceChange('appointmentReminders', e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="appointment-reminders" className="ml-3 block text-sm text-gray-700">
                            Appointment Reminders
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <input
                            id="marketing-updates"
                            type="checkbox"
                            checked={preferences.marketingUpdates}
                            onChange={(e) => handlePreferenceChange('marketingUpdates', e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="marketing-updates" className="ml-3 block text-sm text-gray-700">
                            Marketing Updates and Newsletters
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      onClick={handleUpdatePreferences}
                      disabled={isSavingPreferences}
                    >
                      {isSavingPreferences ? 'Updating...' : 'Update Preferences'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'verification' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Verification</h2>
                <p className="text-gray-600 mb-6">
                  Verify your identity to unlock all features of DirectHome.
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email Verification</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {user.emailVerified ? 'Your email is verified' : 'Verify your email to receive notifications'}
                        </p>
                      </div>
                      {user.emailVerified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <IconCheck size={14} className="mr-1" />
                          Verified
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          onClick={handleVerifyEmail}
                        >
                          Send Verification Email
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Phone Verification</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {user.phoneVerified ? 'Your phone is verified' : 'Verify your phone number for added security'}
                        </p>
                      </div>
                      {user.phoneVerified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <IconCheck size={14} className="mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">ID Verification</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Verify your identity with a government-issued ID
                        </p>
                      </div>
                      <Link
                        to="/verification-flow"
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        Start Verification
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'billing' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing & Subscription</h2>
                <p className="text-gray-600 mb-6">
                  Manage your subscription and payment methods.
                </p>
                
                <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
                  <p className="text-gray-600 mb-4">
                    Upgrade to a premium plan to unlock additional features.
                  </p>
                  <Link
                    to="/premium"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    View Premium Plans
                  </Link>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                <p className="text-gray-600 mb-6">
                  Manage your account preferences and settings.
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Language</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Choose your preferred language
                        </p>
                      </div>
                      <select
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
                        defaultValue="en"
                        disabled
                      >
                        <option value="en">English</option>
                        <option value="fr">French</option>
                        <option value="es">Spanish</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Coming soon</p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Time Zone</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Set your local time zone
                        </p>
                      </div>
                      <select
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
                        defaultValue="UTC"
                        disabled
                      >
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                        <option value="GMT">GMT (Greenwich Mean Time)</option>
                        <option value="EST">EST (Eastern Standard Time)</option>
                        <option value="PST">PST (Pacific Standard Time)</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Coming soon</p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Currency</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Choose your preferred currency
                        </p>
                      </div>
                      <select
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
                        defaultValue="NGN"
                        disabled
                      >
                        <option value="NGN">NGN (Nigerian Naira)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                        <option value="GBP">GBP (British Pound)</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Coming soon</p>
                  </div>
                  
                  <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50 mt-8">
                    <div className="flex items-start gap-3">
                      <IconAlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-red-900 mb-1">Danger Zone</h3>
                        <p className="text-xs text-red-700 mb-3">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setShowDeleteModal(true)}
                        >
                          Delete My Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Modals */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
      
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};

export default ProfilePage;