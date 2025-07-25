import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  IconUser, 
  IconSettings, 
  IconLock, 
  IconBell, 
  IconShield, 
  IconCreditCard,
  IconChevronRight,
  IconLogout
} from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../UI/Card';

const ProfilePage: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  
  if (!user || !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
                        value={user.firstName}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={user.lastName}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center">
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                      {user.emailVerified && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="flex items-center">
                      <input
                        type="tel"
                        value={user.phone}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                      {user.phoneVerified && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio || ''}
                      readOnly
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Edit Profile
                    </button>
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
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Password</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Last changed: Never
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
                      >
                        Enable
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Login Sessions</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Manage your active sessions
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
                      >
                        View Sessions
                      </button>
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="email-notifications"
                            type="checkbox"
                            checked={profile.notificationPreferences?.email}
                            readOnly
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                            Email Notifications
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="sms-notifications"
                            type="checkbox"
                            checked={profile.notificationPreferences?.sms}
                            readOnly
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="sms-notifications" className="ml-2 block text-sm text-gray-700">
                            SMS Notifications
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="push-notifications"
                            type="checkbox"
                            checked={profile.notificationPreferences?.push}
                            readOnly
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="push-notifications" className="ml-2 block text-sm text-gray-700">
                            Push Notifications
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Notification Types</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="new-messages"
                            type="checkbox"
                            checked={profile.notificationPreferences?.newMessages}
                            readOnly
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="new-messages" className="ml-2 block text-sm text-gray-700">
                            New Messages
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="appointment-reminders"
                            type="checkbox"
                            checked={profile.notificationPreferences?.appointmentReminders}
                            readOnly
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="appointment-reminders" className="ml-2 block text-sm text-gray-700">
                            Appointment Reminders
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="marketing-updates"
                            type="checkbox"
                            checked={profile.notificationPreferences?.marketingUpdates}
                            readOnly
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="marketing-updates" className="ml-2 block text-sm text-gray-700">
                            Marketing Updates
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Update Preferences
                    </button>
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
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email Verification</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {user.emailVerified ? 'Your email is verified' : 'Verify your email to receive notifications'}
                        </p>
                      </div>
                      {user.emailVerified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                        >
                          Verify Email
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Phone Verification</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {user.phoneVerified ? 'Your phone is verified' : 'Verify your phone number for added security'}
                        </p>
                      </div>
                      {user.phoneVerified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                        >
                          Verify Phone
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
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
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Language</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Choose your preferred language
                        </p>
                      </div>
                      <select
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                        defaultValue="en"
                      >
                        <option value="en">English</option>
                        <option value="fr">French</option>
                        <option value="es">Spanish</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Time Zone</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Set your local time zone
                        </p>
                      </div>
                      <select
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                        defaultValue="UTC"
                      >
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                        <option value="GMT">GMT (Greenwich Mean Time)</option>
                        <option value="EST">EST (Eastern Standard Time)</option>
                        <option value="PST">PST (Pacific Standard Time)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Currency</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Choose your preferred currency
                        </p>
                      </div>
                      <select
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                        defaultValue="NGN"
                      >
                        <option value="NGN">NGN (Nigerian Naira)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                        <option value="GBP">GBP (British Pound)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg bg-red-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-red-900">Delete Account</h3>
                        <p className="text-xs text-red-700 mt-1">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;