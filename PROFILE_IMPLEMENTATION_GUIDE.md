# Profile Settings - Implementation Guide

## Quick Start: Making Profile Settings Production Ready

This guide shows how to implement the critical missing features in the Profile Settings page.

---

## 1. Edit Profile Functionality

### Step 1: Add State Management to ProfilePage.tsx

```tsx
// Add these imports
import { useState } from 'react';
import { toast } from 'react-hot-toast'; // or your toast library

// Add state
const [isEditing, setIsEditing] = useState(false);
const [isSaving, setIsSaving] = useState(false);
const [formData, setFormData] = useState({
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
  bio: profile?.bio || ''
});

// Add handlers
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
      .eq('id', user.id);

    if (error) throw error;

    // Update local state
    await updateProfile({
      bio: formData.bio
    });

    toast.success('Profile updated successfully!');
    setIsEditing(false);
  } catch (error) {
    console.error('Profile update failed:', error);
    toast.error('Failed to update profile. Please try again.');
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
```

### Step 2: Update the Form Fields

```tsx
{/* Replace read-only inputs with editable ones */}
<input
  type="text"
  value={formData.firstName}
  onChange={(e) => handleInputChange('firstName', e.target.value)}
  disabled={!isEditing}
  className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
    !isEditing ? 'bg-gray-50' : 'bg-white'
  }`}
/>

<textarea
  value={formData.bio}
  onChange={(e) => handleInputChange('bio', e.target.value)}
  disabled={!isEditing}
  rows={4}
  className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
    !isEditing ? 'bg-gray-50' : 'bg-white'
  }`}
/>
```

### Step 3: Update the Buttons

```tsx
<div className="pt-4 border-t border-gray-200 flex gap-2">
  {!isEditing ? (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Edit Profile
    </button>
  ) : (
    <>
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
      <button
        type="button"
        onClick={handleCancel}
        disabled={isSaving}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
      >
        Cancel
      </button>
    </>
  )}
</div>
```

---

## 2. Change Password Functionality

### Step 1: Create ChangePasswordModal.tsx

```tsx
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { IconX } from '@tabler/icons-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      // Update password in Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      alert('Password changed successfully!');
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <IconX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
```

### Step 2: Use in ProfilePage.tsx

```tsx
// Add import
import ChangePasswordModal from './ChangePasswordModal';

// Add state
const [showPasswordModal, setShowPasswordModal] = useState(false);

// Update button
<button
  type="button"
  onClick={() => setShowPasswordModal(true)}
  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
>
  Change Password
</button>

// Add modal at the end of component
<ChangePasswordModal
  isOpen={showPasswordModal}
  onClose={() => setShowPasswordModal(false)}
/>
```

---

## 3. Update Notification Preferences

### Step 1: Add State and Handler

```tsx
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
      .eq('id', user.id);

    if (error) throw error;

    await updateProfile({ notificationPreferences: preferences });
    toast.success('Preferences updated successfully!');
  } catch (error) {
    console.error('Failed to update preferences:', error);
    toast.error('Failed to update preferences');
  } finally {
    setIsSavingPreferences(false);
  }
};
```

### Step 2: Update Checkboxes

```tsx
<input
  id="email-notifications"
  type="checkbox"
  checked={preferences.email}
  onChange={(e) => handlePreferenceChange('email', e.target.checked)}
  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
/>
```

### Step 3: Update Button

```tsx
<button
  type="button"
  onClick={handleUpdatePreferences}
  disabled={isSavingPreferences}
  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
>
  {isSavingPreferences ? 'Updating...' : 'Update Preferences'}
</button>
```

---

## 4. Delete Account Functionality

### Step 1: Create DeleteAccountModal.tsx

```tsx
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { IconAlertTriangle, IconX } from '@tabler/icons-react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      // Note: This requires admin privileges or RLS policy
      // You may need to call an Edge Function instead
      const { error } = await supabase.rpc('delete_user_account');
      
      if (error) throw error;

      onConfirm();
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please contact support.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <IconAlertTriangle size={24} className="text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Delete Account
            </h2>
            <p className="text-sm text-gray-600">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <IconX size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type <span className="font-bold">DELETE</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={confirmText !== 'DELETE' || isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </button>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
```

### Step 2: Create Supabase Edge Function

Create `supabase/functions/delete-user-account/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401
      });
    }

    // Delete user data
    await supabaseClient.from('profiles').delete().eq('id', user.id);
    await supabaseClient.from('properties').delete().eq('owner_id', user.id);
    // ... delete other user data

    // Delete auth user
    await supabaseClient.auth.admin.deleteUser(user.id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    });
  }
});
```

---

## 5. Add Toast Notifications

### Install react-hot-toast

```bash
npm install react-hot-toast
```

### Add to App.tsx

```tsx
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      {/* ... rest of app */}
    </>
  );
}
```

---

## Testing Checklist

After implementing:

- [ ] Can edit first name and save
- [ ] Can edit last name and save
- [ ] Can edit bio and save
- [ ] Changes persist after page refresh
- [ ] Can cancel edit without saving
- [ ] Can change password
- [ ] Old password is validated
- [ ] New password meets requirements
- [ ] Can update notification preferences
- [ ] Preferences persist after refresh
- [ ] Delete account requires confirmation
- [ ] Delete account actually deletes data
- [ ] Toast notifications appear
- [ ] Loading states work correctly
- [ ] Error messages display properly

---

## Deployment Notes

1. Deploy Supabase Edge Function for delete account
2. Update RLS policies to allow profile updates
3. Test on staging environment first
4. Monitor error logs after deployment

---

**Estimated Time:** 4-6 hours for all critical features
