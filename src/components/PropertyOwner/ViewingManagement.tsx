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
  IconMessageCircle,
  IconFilter,
  IconArrowLeft
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
    addViewingFeedback
  } = usePropertyOwnerStore();

  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [selectedViewing, setSelectedViewing] = useState<ViewingRequest | null>(null);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState({ rating: 5, interested: false, comments: '', followUpRequired: false });

  useEffect(() => {
    fetchViewings(user?.id || 'owner-1');
  }, [user?.id, fetchViewings]);

  const filteredViewings = viewings.filter(v => {
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

  const getStatusColor = (status: ViewingStatus) => {
    switch (status) {
      case ViewingStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case ViewingStatus.CONFIRMED: return 'bg-blue-100 text-blue-700';
      case ViewingStatus.COMPLETED: return 'bg-green-100 text-green-700';
      case ViewingStatus.CANCELLED: return 'bg-red-100 text-red-700';
      case ViewingStatus.NO_SHOW: return 'bg-gray-100 text-gray-700';
      case ViewingStatus.RESCHEDULED: return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoadingViewings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <Container size="xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/owner')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <IconArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Viewing Requests</h1>
              <p className="text-gray-600 mt-1">Manage property viewing schedules</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <IconFilter size={20} className="text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Viewings</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {viewings.filter(v => v.status === ViewingStatus.PENDING).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Confirmed</p>
            <p className="text-2xl font-bold text-blue-600">
              {viewings.filter(v => v.status === ViewingStatus.CONFIRMED).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {viewings.filter(v => v.status === ViewingStatus.COMPLETED).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">
              {viewings.filter(v => v.status === ViewingStatus.CANCELLED).length}
            </p>
          </div>
        </div>

        {/* Viewings List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {filteredViewings.length === 0 ? (
            <div className="p-12 text-center">
              <IconCalendar size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No viewing requests</h3>
              <p className="text-gray-500">Viewing requests will appear here when tenants schedule them</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredViewings.map((viewing) => (
                <div key={viewing.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{viewing.propertyTitle}</h3>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <IconCalendar size={16} className="mr-1" />
                            {format(new Date(viewing.requestedDate), 'EEEE, MMMM d, yyyy')}
                            <IconClock size={16} className="ml-3 mr-1" />
                            {viewing.requestedTime}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewing.status)}`}>
                          {viewing.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center text-sm">
                          <IconUser size={16} className="text-gray-400 mr-2" />
                          <span className="text-gray-700">{viewing.seekerName}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <IconPhone size={16} className="text-gray-400 mr-2" />
                          <a href={`tel:${viewing.seekerPhone}`} className="text-blue-600 hover:underline">
                            {viewing.seekerPhone}
                          </a>
                        </div>
                        <div className="flex items-center text-sm">
                          <IconMail size={16} className="text-gray-400 mr-2" />
                          <a href={`mailto:${viewing.seekerEmail}`} className="text-blue-600 hover:underline">
                            {viewing.seekerEmail}
                          </a>
                        </div>
                      </div>

                      {viewing.accessCode && (
                        <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                          <IconKey size={16} className="text-blue-600 mr-2" />
                          <span className="text-sm text-gray-600">Access Code:</span>
                          <span className="ml-2 font-mono font-bold text-blue-700">{viewing.accessCode}</span>
                        </div>
                      )}

                      {viewing.feedback && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Feedback:</span>
                            <span className="ml-2 text-yellow-500">
                              {'★'.repeat(viewing.feedback.rating)}{'☆'.repeat(5 - viewing.feedback.rating)}
                            </span>
                            {viewing.feedback.interested && (
                              <span className="ml-3 px-2 py-1 bg-green-200 text-green-700 text-xs rounded-full">
                                Interested
                              </span>
                            )}
                          </div>
                          {viewing.feedback.comments && (
                            <p className="text-sm text-gray-600">{viewing.feedback.comments}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-4 lg:mt-0 lg:ml-6">
                      {viewing.status === ViewingStatus.PENDING && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(viewing.id, ViewingStatus.CONFIRMED)}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <IconCheck size={16} className="mr-1" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(viewing.id, ViewingStatus.RESCHEDULED)}
                            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            <IconRefresh size={16} className="mr-1" />
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(viewing.id, ViewingStatus.CANCELLED)}
                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <IconX size={16} className="mr-1" />
                            Decline
                          </button>
                        </>
                      )}
                      {viewing.status === ViewingStatus.CONFIRMED && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedViewing(viewing);
                              setFeedbackModal(true);
                            }}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <IconCheck size={16} className="mr-1" />
                            Mark Complete
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(viewing.id, ViewingStatus.NO_SHOW)}
                            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <IconX size={16} className="mr-1" />
                            No Show
                          </button>
                        </>
                      )}
                      <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <IconMessageCircle size={16} className="mr-1" />
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>

      {/* Feedback Modal */}
      {feedbackModal && selectedViewing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Viewing Feedback</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                      className={`text-2xl ${star <= feedback.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="interested"
                  checked={feedback.interested}
                  onChange={(e) => setFeedback(prev => ({ ...prev, interested: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="interested" className="ml-2 text-sm text-gray-700">
                  Visitor showed interest in the property
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="followUp"
                  checked={feedback.followUpRequired}
                  onChange={(e) => setFeedback(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="followUp" className="ml-2 text-sm text-gray-700">
                  Follow-up required
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                <textarea
                  value={feedback.comments}
                  onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Any notes about the viewing..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setFeedbackModal(false);
                  setSelectedViewing(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save & Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewingManagement;
