import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePropertyOwnerStore } from '../../store/propertyOwnerStore';
import {
  IconArrowLeft,
  IconBell,
  IconHome,
  IconCheck,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import Container from '../UI/Container';

const NotificationsManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = usePropertyOwnerStore();

  useEffect(() => {
    if (!user?.id) return;
    void fetchNotifications(user.id);
  }, [user?.id, fetchNotifications]);

  return (
    <div className="min-h-screen bg-paper-100 py-6 sm:py-8 overflow-x-hidden">
      <Container size="md" className="min-w-0">
        <button
          type="button"
          onClick={() => navigate('/owner')}
          className="flex items-center text-ink-600 hover:text-ink-950 mb-4 text-sm"
        >
          <IconArrowLeft size={18} stroke={1.5} className="mr-2 shrink-0" />
          Back to dashboard
        </button>

        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-courtyard-700 font-semibold mb-2">
              Owner tools
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-950">
              Notifications
            </h1>
            <p className="text-ink-600 mt-2 text-sm max-w-xl">
              Listing updates and marketplace alerts. Viewing requests, enquiries, and rent
              payments will appear here as seekers start contacting you.
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => void markAllNotificationsRead()}
              className="text-sm text-courtyard-700 hover:text-courtyard-600 font-medium"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="bg-paper-50 border border-paper-200">
          {notifications.length === 0 ? (
            <div className="p-10 text-center">
              <IconBell size={40} stroke={1.25} className="mx-auto text-paper-300 mb-3" />
              <h2 className="font-display text-lg font-semibold text-ink-950 mb-2">No notifications yet</h2>
              <p className="text-ink-600 text-sm max-w-sm mx-auto mb-5">
                Status changes on your listings will show up here. Add a property to get started.
              </p>
              <button
                type="button"
                onClick={() => navigate('/owner/properties/new')}
                className="px-5 py-2.5 bg-courtyard-700 text-paper-50 hover:bg-courtyard-600"
              >
                Add a listing
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-paper-200">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => {
                      void markNotificationRead(notification.id);
                      if (notification.actionUrl) navigate(notification.actionUrl);
                    }}
                    className={`w-full text-left p-4 sm:p-5 flex items-start gap-3 hover:bg-paper-100 transition-colors ${
                      notification.read ? '' : 'bg-paper-100'
                    }`}
                  >
                    <span
                      className={`p-2 shrink-0 ${
                        notification.read ? 'bg-paper-200 text-ink-500' : 'bg-courtyard-700 text-paper-50'
                      }`}
                    >
                      <IconHome size={16} stroke={1.5} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-3">
                        <span className={`text-sm ${notification.read ? 'text-ink-700' : 'text-ink-950 font-semibold'}`}>
                          {notification.title}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 mt-1.5 rounded-full bg-courtyard-700 shrink-0" />
                        )}
                      </span>
                      <span className="block text-sm text-ink-600 mt-1">{notification.message}</span>
                      <span className="block text-xs text-ink-400 mt-2">
                        {format(new Date(notification.createdAt), 'MMM d, yyyy · h:mm a')}
                      </span>
                    </span>
                    {notification.read && (
                      <IconCheck size={16} stroke={1.5} className="text-ink-300 shrink-0 mt-1 hidden sm:block" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </div>
  );
};

export default NotificationsManagement;
