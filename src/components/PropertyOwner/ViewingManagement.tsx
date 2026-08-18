import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePropertyOwnerStore } from '../../store/propertyOwnerStore';
import {
  IconCalendar,
  IconClock,
  IconUser,
  IconPhone,
  IconMail,
  IconCheck,
  IconX,
  IconRefresh,
  IconKey,
  IconFilter,
  IconArrowLeft,
  IconPlus,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import Container from '../UI/Container';
import { ViewingStatus, ViewingRequest } from '../../types/propertyOwner';

const ViewingManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    viewings,
    isLoadingViewings,
    fetchViewings,
    updateViewingStatus,
    generateAccessCode,
    addViewingFeedback,
  } = usePropertyOwnerStore();

  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [selectedViewing, setSelectedViewing] = useState<ViewingRequest | null>(null);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: 5,
    interested: false,
    comments: '',
    followUpRequired: false,
  });

  useEffect(() => {
    if (!user?.id) return;
    void fetchViewings(user.id);
  }, [user?.id, fetchViewings]);

  const filteredViewings = viewings.filter((v) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return v.status === ViewingStatus.PENDING;
    if (filter === 'confirmed') return v.status === ViewingStatus.CONFIRMED;
    if (filter === 'completed') return v.status === ViewingStatus.COMPLETED;
    return true;
  });

  const handleStatusUpdate = async (id: string, status: ViewingStatus) => {
    await updateViewingStatus(id, status);
    if (status === ViewingStatus.CONFIRMED) {
      await generateAccessCode(id);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (selectedViewing) {
      await addViewingFeedback(selectedViewing.id, feedback);
      await updateViewingStatus(selectedViewing.id, ViewingStatus.COMPLETED);
      setFeedbackModal(false);
      setSelectedViewing(null);
      setFeedback({ rating: 5, interested: false, comments: '', followUpRequired: false });
    }
  };

  const getStatusClass = (status: ViewingStatus) => {
    switch (status) {
      case ViewingStatus.PENDING:
        return 'bg-paper-200 text-brass-600';
      case ViewingStatus.CONFIRMED:
        return 'bg-courtyard-700 text-paper-50';
      case ViewingStatus.COMPLETED:
        return 'bg-courtyard-100 text-courtyard-700';
      case ViewingStatus.CANCELLED:
      case ViewingStatus.NO_SHOW:
        return 'bg-paper-200 text-laterite-600';
      default:
        return 'bg-paper-200 text-ink-700';
    }
  };

  const stats = [
    {
      label: 'Pending',
      value: viewings.filter((v) => v.status === ViewingStatus.PENDING).length,
      tone: 'text-brass-700',
    },
    {
      label: 'Confirmed',
      value: viewings.filter((v) => v.status === ViewingStatus.CONFIRMED).length,
      tone: 'text-courtyard-700',
    },
    {
      label: 'Completed',
      value: viewings.filter((v) => v.status === ViewingStatus.COMPLETED).length,
      tone: 'text-ink-950',
    },
    {
      label: 'Cancelled',
      value: viewings.filter((v) => v.status === ViewingStatus.CANCELLED).length,
      tone: 'text-laterite-700',
    },
  ];

  if (isLoadingViewings) {
    return (
      <div className="min-h-screen bg-paper-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-courtyard-700 mx-auto mb-4" />
          <p className="text-ink-600">Loading viewing requests…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-100 py-6 sm:py-8 overflow-x-hidden">
      <Container size="xl" className="min-w-0">
        <button
          type="button"
          onClick={() => navigate('/owner')}
          className="flex items-center text-ink-600 hover:text-ink-950 mb-4 text-sm"
        >
          <IconArrowLeft size={18} stroke={1.5} className="mr-2 shrink-0" />
          Back to dashboard
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-courtyard-700 font-semibold mb-2">
              Owner tools
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-950">
              Viewing Requests
            </h1>
            <p className="text-ink-600 mt-2 text-sm max-w-xl">
              Confirm or decline property tours. Requests appear here when seekers book a viewing
              on a live listing.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-600 shrink-0">
            <IconFilter size={16} stroke={1.5} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="min-h-11 px-3 bg-paper-50 border border-paper-300 text-ink-950 focus:ring-2 focus:ring-courtyard-500"
            >
              <option value="all">All viewings</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-paper-50 border border-paper-200 p-4">
              <p className="text-xs uppercase tracking-wide text-ink-500">{stat.label}</p>
              <p className={`font-display text-2xl sm:text-3xl font-semibold mt-1 ${stat.tone}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-paper-50 border border-paper-200">
          {filteredViewings.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <IconCalendar size={40} stroke={1.25} className="mx-auto text-paper-300 mb-3" />
              <h2 className="font-display text-lg font-semibold text-ink-950 mb-2">
                No viewing requests yet
              </h2>
              <p className="text-ink-600 text-sm max-w-md mx-auto mb-5">
                When a seeker books a tour of your listing, it will show up here so you can
                confirm the time. Marketplace bookings are opening soon.
              </p>
              <button
                type="button"
                onClick={() => navigate('/owner/properties/new')}
                className="inline-flex items-center px-5 py-2.5 bg-courtyard-700 text-paper-50 hover:bg-courtyard-600"
              >
                <IconPlus size={16} className="mr-2" />
                Add or improve a listing
              </button>
            </div>
          ) : (
            <div className="divide-y divide-paper-200">
              {filteredViewings.map((viewing) => (
                <div key={viewing.id} className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-display font-semibold text-ink-950 break-words">
                          {viewing.propertyTitle}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-ink-600">
                          <span className="inline-flex items-center">
                            <IconCalendar size={14} className="mr-1 shrink-0" />
                            {format(new Date(viewing.requestedDate), 'EEE, MMM d, yyyy')}
                          </span>
                          <span className="inline-flex items-center">
                            <IconClock size={14} className="mr-1 shrink-0" />
                            {viewing.requestedTime}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-medium shrink-0 ${getStatusClass(viewing.status)}`}>
                        {viewing.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center text-ink-700">
                        <IconUser size={14} className="text-ink-400 mr-2 shrink-0" />
                        {viewing.seekerName}
                      </div>
                      {viewing.seekerPhone && (
                        <a href={`tel:${viewing.seekerPhone}`} className="flex items-center text-courtyard-700">
                          <IconPhone size={14} className="mr-2 shrink-0" />
                          {viewing.seekerPhone}
                        </a>
                      )}
                      {viewing.seekerEmail && (
                        <a href={`mailto:${viewing.seekerEmail}`} className="flex items-center text-courtyard-700 break-all">
                          <IconMail size={14} className="mr-2 shrink-0" />
                          {viewing.seekerEmail}
                        </a>
                      )}
                    </div>

                    {viewing.accessCode && (
                      <div className="inline-flex items-center px-3 py-2 bg-paper-100 border border-paper-200 text-sm">
                        <IconKey size={14} className="text-courtyard-700 mr-2" />
                        Access code
                        <span className="ml-2 font-mono font-semibold text-ink-950">{viewing.accessCode}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {viewing.status === ViewingStatus.PENDING && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(viewing.id, ViewingStatus.CONFIRMED)}
                            className="flex items-center px-4 py-2 min-h-11 bg-courtyard-700 text-paper-50 hover:bg-courtyard-600"
                          >
                            <IconCheck size={16} className="mr-1" />
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(viewing.id, ViewingStatus.RESCHEDULED)}
                            className="flex items-center px-4 py-2 min-h-11 border border-paper-300 text-ink-800 hover:border-courtyard-500"
                          >
                            <IconRefresh size={16} className="mr-1" />
                            Reschedule
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(viewing.id, ViewingStatus.CANCELLED)}
                            className="flex items-center px-4 py-2 min-h-11 border border-laterite-400 text-laterite-600"
                          >
                            <IconX size={16} className="mr-1" />
                            Decline
                          </button>
                        </>
                      )}
                      {viewing.status === ViewingStatus.CONFIRMED && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedViewing(viewing);
                              setFeedbackModal(true);
                            }}
                            className="flex items-center px-4 py-2 min-h-11 bg-courtyard-700 text-paper-50 hover:bg-courtyard-600"
                          >
                            <IconCheck size={16} className="mr-1" />
                            Mark complete
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(viewing.id, ViewingStatus.NO_SHOW)}
                            className="flex items-center px-4 py-2 min-h-11 border border-paper-300 text-ink-800"
                          >
                            <IconX size={16} className="mr-1" />
                            No show
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>

      {feedbackModal && selectedViewing && (
        <div className="fixed inset-0 bg-ink-950/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-paper-50 w-full sm:max-w-md sm:border border-paper-200 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-xl font-semibold text-ink-950 mb-4">Viewing notes</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-800 mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedback((prev) => ({ ...prev, rating: star }))}
                      className={`text-2xl ${star <= feedback.rating ? 'text-brass-500' : 'text-paper-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center text-sm text-ink-700">
                <input
                  type="checkbox"
                  checked={feedback.interested}
                  onChange={(e) => setFeedback((prev) => ({ ...prev, interested: e.target.checked }))}
                  className="w-4 h-4 mr-2 accent-courtyard-700"
                />
                Visitor showed interest
              </label>
              <label className="flex items-center text-sm text-ink-700">
                <input
                  type="checkbox"
                  checked={feedback.followUpRequired}
                  onChange={(e) => setFeedback((prev) => ({ ...prev, followUpRequired: e.target.checked }))}
                  className="w-4 h-4 mr-2 accent-courtyard-700"
                />
                Follow-up required
              </label>
              <textarea
                value={feedback.comments}
                onChange={(e) => setFeedback((prev) => ({ ...prev, comments: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 text-base bg-paper-50 border border-paper-300 text-ink-950 focus:ring-2 focus:ring-courtyard-500"
                placeholder="Any notes about the viewing…"
              />
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => {
                  setFeedbackModal(false);
                  setSelectedViewing(null);
                }}
                className="px-4 py-2.5 min-h-11 border border-paper-300 text-ink-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFeedbackSubmit}
                className="px-4 py-2.5 min-h-11 bg-courtyard-700 text-paper-50 hover:bg-courtyard-600"
              >
                Save & complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewingManagement;
