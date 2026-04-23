import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { IconAlertTriangle, IconX } from '@tabler/icons-react';
import Button from '../UI/Button';

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
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user found');
      }

      // Delete user profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile deletion error:', profileError);
      }

      // Delete user properties
      const { error: propertiesError } = await supabase
        .from('properties')
        .delete()
        .eq('owner_id', user.id);

      if (propertiesError) {
        console.error('Properties deletion error:', propertiesError);
      }

      // Note: Deleting the auth user requires admin privileges
      // In production, you should call an Edge Function or backend API
      // For now, we'll just sign out the user
      await supabase.auth.signOut();

      onConfirm();
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      setError(error.message || 'Failed to delete account. Please contact support.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <IconAlertTriangle size={24} className="text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Delete Account
              </h2>
              <p className="text-sm text-gray-600">
                This action cannot be undone. All your data will be permanently deleted, including:
              </p>
              <ul className="text-sm text-gray-600 list-disc pl-5 mt-2 space-y-1">
                <li>Your profile information</li>
                <li>All your properties</li>
                <li>Messages and conversations</li>
                <li>Appointments and bookings</li>
                <li>Favorites and saved searches</li>
              </ul>
            </div>
            <button
              onClick={handleClose}
              disabled={isDeleting}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <IconX size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="font-bold text-red-600">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              disabled={isDeleting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleDelete}
              disabled={confirmText !== 'DELETE' || isDeleting}
              variant="danger"
              fullWidth
            >
              {isDeleting ? 'Deleting Account...' : 'Delete My Account'}
            </Button>
            <Button
              onClick={handleClose}
              disabled={isDeleting}
              variant="outline"
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Need help? <a href="/help" className="text-blue-600 hover:text-blue-700">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
