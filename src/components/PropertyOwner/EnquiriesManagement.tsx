import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePropertyOwnerStore } from '../../store/propertyOwnerStore';
import {
  IconMessage,
  IconUser,
  IconPhone,
  IconMail,
  IconHome,
  IconSend,
  IconFilter,
  IconArrowLeft,
  IconCheck,
  IconClock
} from '@tabler/icons-react';
import { format } from 'date-fns';
import Container from '../UI/Container';
import { EnquiryStatus, Enquiry } from '../../types/propertyOwner';

const EnquiriesManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    enquiries,
    isLoadingEnquiries,
    fetchEnquiries,
    updateEnquiryStatus,
    sendEnquiryReply
  } = usePropertyOwnerStore();

  const [filter, setFilter] = useState<'all' | 'open' | 'active' | 'closed'>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchEnquiries(user?.id || 'owner-1');
  }, [user?.id, fetchEnquiries]);

  const filteredEnquiries = enquiries.filter(e => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const handleSendReply = async () => {
    if (!selectedEnquiry || !replyMessage.trim()) return;
    
    setIsSending(true);
    await sendEnquiryReply(selectedEnquiry.id, replyMessage);
    if (selectedEnquiry.status === EnquiryStatus.OPEN) {
      await updateEnquiryStatus(selectedEnquiry.id, EnquiryStatus.ACTIVE);
    }
    setReplyMessage('');
    setIsSending(false);
    
    // Refresh the selected enquiry
    const updated = enquiries.find(e => e.id === selectedEnquiry.id);
    if (updated) setSelectedEnquiry(updated);
  };

  const getStatusColor = (status: EnquiryStatus) => {
    switch (status) {
      case EnquiryStatus.OPEN: return 'bg-yellow-100 text-yellow-700';
      case EnquiryStatus.ACTIVE: return 'bg-blue-100 text-blue-700';
      case EnquiryStatus.CLOSED: return 'bg-gray-100 text-gray-700';
      case EnquiryStatus.CONVERTED: return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoadingEnquiries) {
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
              <h1 className="text-3xl font-bold text-gray-900">Enquiries</h1>
              <p className="text-gray-600 mt-1">Communicate with potential tenants</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <IconFilter size={20} className="text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Enquiries</option>
                <option value="open">Open</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enquiries List */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">All Enquiries ({filteredEnquiries.length})</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {filteredEnquiries.length === 0 ? (
                <div className="p-8 text-center">
                  <IconMessage size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No enquiries yet</p>
                </div>
              ) : (
                filteredEnquiries.map((enquiry) => (
                  <button
                    key={enquiry.id}
                    onClick={() => setSelectedEnquiry(enquiry)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedEnquiry?.id === enquiry.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-gray-900">{enquiry.seekerName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                        {enquiry.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">{enquiry.propertyTitle}</p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(enquiry.lastContactDate), 'MMM d, h:mm a')}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            {selectedEnquiry ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedEnquiry.seekerName}</h3>
                      <p className="text-sm text-gray-500">{selectedEnquiry.propertyTitle}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a href={`tel:${selectedEnquiry.seekerPhone}`} className="p-2 hover:bg-gray-100 rounded-lg">
                        <IconPhone size={20} className="text-gray-600" />
                      </a>
                      <a href={`mailto:${selectedEnquiry.seekerEmail}`} className="p-2 hover:bg-gray-100 rounded-lg">
                        <IconMail size={20} className="text-gray-600" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto max-h-[400px] space-y-4">
                  {selectedEnquiry.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderType === 'owner' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        msg.senderType === 'owner'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.senderType === 'owner' ? 'text-blue-200' : 'text-gray-400'
                        }`}>
                          {format(new Date(msg.createdAt), 'h:mm a')}
                          {msg.readAt && msg.senderType === 'owner' && (
                            <IconCheck size={12} className="inline ml-1" />
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Input */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-end space-x-3">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your message..."
                      rows={2}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim() || isSending}
                      className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <IconSend size={20} />
                    </button>
                  </div>
                  
                  {/* Quick Replies */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      'Yes, the property is still available.',
                      'Would you like to schedule a viewing?',
                      'The rent is negotiable.',
                      'Please call me to discuss further.'
                    ].map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => setReplyMessage(reply)}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-100 flex justify-between">
                  <div className="flex space-x-2">
                    {selectedEnquiry.status !== EnquiryStatus.CLOSED && (
                      <button
                        onClick={() => updateEnquiryStatus(selectedEnquiry.id, EnquiryStatus.CLOSED)}
                        className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Close Enquiry
                      </button>
                    )}
                    {selectedEnquiry.status !== EnquiryStatus.CONVERTED && (
                      <button
                        onClick={() => updateEnquiryStatus(selectedEnquiry.id, EnquiryStatus.CONVERTED)}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Mark as Converted
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <IconMessage size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an enquiry</h3>
                  <p className="text-gray-500">Choose an enquiry from the list to view the conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EnquiriesManagement;
