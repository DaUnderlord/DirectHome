import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePropertyOwnerStore } from '../../store/propertyOwnerStore';
import {
  IconMessage,
  IconPhone,
  IconMail,
  IconSend,
  IconFilter,
  IconArrowLeft,
  IconPlus,
  IconChevronLeft,
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
    sendEnquiryReply,
  } = usePropertyOwnerStore();

  const [filter, setFilter] = useState<'all' | 'open' | 'active' | 'closed'>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    void fetchEnquiries(user.id);
  }, [user?.id, fetchEnquiries]);

  const filteredEnquiries = enquiries.filter((e) => {
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
  };

  const getStatusClass = (status: EnquiryStatus) => {
    switch (status) {
      case EnquiryStatus.OPEN:
        return 'bg-paper-200 text-brass-600';
      case EnquiryStatus.ACTIVE:
        return 'bg-courtyard-100 text-courtyard-700';
      case EnquiryStatus.CONVERTED:
        return 'bg-courtyard-700 text-paper-50';
      default:
        return 'bg-paper-200 text-ink-700';
    }
  };

  if (isLoadingEnquiries) {
    return (
      <div className="min-h-screen bg-paper-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-courtyard-700 mx-auto mb-4" />
          <p className="text-ink-600">Loading enquiries…</p>
        </div>
      </div>
    );
  }

  const enquiryList = (
    <div className="bg-paper-50 border border-paper-200 overflow-hidden h-full">
      <div className="p-4 border-b border-paper-200">
        <h2 className="font-display font-semibold text-ink-950">
          All enquiries ({filteredEnquiries.length})
        </h2>
      </div>
      <div className="divide-y divide-paper-200 max-h-[70vh] overflow-y-auto">
        {filteredEnquiries.length === 0 ? (
          <div className="p-8 text-center">
            <IconMessage size={36} stroke={1.25} className="mx-auto text-paper-300 mb-3" />
            <p className="text-ink-600 text-sm">No enquiries yet</p>
          </div>
        ) : (
          filteredEnquiries.map((enquiry) => (
            <button
              key={enquiry.id}
              type="button"
              onClick={() => setSelectedEnquiry(enquiry)}
              className={`w-full p-4 text-left hover:bg-paper-100 transition-colors ${
                selectedEnquiry?.id === enquiry.id ? 'bg-paper-100' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-medium text-ink-950 truncate">{enquiry.seekerName}</span>
                <span className={`px-2 py-0.5 text-xs font-medium shrink-0 ${getStatusClass(enquiry.status)}`}>
                  {enquiry.status}
                </span>
              </div>
              <p className="text-sm text-ink-600 truncate">{enquiry.propertyTitle}</p>
              <p className="text-xs text-ink-400 mt-1">
                {format(new Date(enquiry.lastContactDate), 'MMM d, h:mm a')}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );

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
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-950">Enquiries</h1>
            <p className="text-ink-600 mt-2 text-sm max-w-xl">
              Messages from people interested in your listings. Threads appear here when a seeker
              contacts you from a live property.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-600 shrink-0">
            <IconFilter size={16} stroke={1.5} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="min-h-11 px-3 bg-paper-50 border border-paper-300 text-ink-950"
            >
              <option value="all">All enquiries</option>
              <option value="open">Open</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </label>
        </div>

        {enquiries.length === 0 ? (
          <div className="bg-paper-50 border border-paper-200 p-8 sm:p-12 text-center">
            <IconMessage size={40} stroke={1.25} className="mx-auto text-paper-300 mb-3" />
            <h2 className="font-display text-lg font-semibold text-ink-950 mb-2">No enquiries yet</h2>
            <p className="text-ink-600 text-sm max-w-md mx-auto mb-5">
              When a seeker messages you about a listing, the conversation will show up here.
              Marketplace messaging is opening soon.
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className={`${selectedEnquiry ? 'hidden lg:block' : 'block'} lg:col-span-1 min-w-0`}>
              {enquiryList}
            </div>

            <div className={`${selectedEnquiry ? 'block' : 'hidden lg:block'} lg:col-span-2 min-w-0`}>
              <div className="bg-paper-50 border border-paper-200 flex flex-col min-h-[28rem]">
                {selectedEnquiry ? (
                  <>
                    <div className="p-4 border-b border-paper-200">
                      <button
                        type="button"
                        onClick={() => setSelectedEnquiry(null)}
                        className="lg:hidden flex items-center text-sm text-ink-600 mb-3"
                      >
                        <IconChevronLeft size={16} className="mr-1" />
                        All enquiries
                      </button>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-display font-semibold text-ink-950">{selectedEnquiry.seekerName}</h3>
                          <p className="text-sm text-ink-500 truncate">{selectedEnquiry.propertyTitle}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {selectedEnquiry.seekerPhone && (
                            <a href={`tel:${selectedEnquiry.seekerPhone}`} className="p-2 hover:bg-paper-100">
                              <IconPhone size={18} className="text-ink-600" />
                            </a>
                          )}
                          {selectedEnquiry.seekerEmail && (
                            <a href={`mailto:${selectedEnquiry.seekerEmail}`} className="p-2 hover:bg-paper-100">
                              <IconMail size={18} className="text-ink-600" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto max-h-[50vh] space-y-3">
                      {selectedEnquiry.message && (
                        <div className="flex justify-start">
                          <div className="max-w-[85%] bg-paper-100 border border-paper-200 px-4 py-3">
                            <p className="text-sm text-ink-950">{selectedEnquiry.message}</p>
                          </div>
                        </div>
                      )}
                      {selectedEnquiry.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderType === 'owner' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] px-4 py-3 ${
                              msg.senderType === 'owner'
                                ? 'bg-courtyard-700 text-paper-50'
                                : 'bg-paper-100 border border-paper-200 text-ink-950'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.senderType === 'owner' ? 'text-paper-200' : 'text-ink-400'
                              }`}
                            >
                              {format(new Date(msg.createdAt), 'h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 border-t border-paper-200">
                      <div className="flex items-end gap-2">
                        <textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Type your message…"
                          rows={2}
                          className="flex-1 px-4 py-3 text-base bg-paper-50 border border-paper-300 text-ink-950 focus:ring-2 focus:ring-courtyard-500 resize-none"
                        />
                        <button
                          type="button"
                          onClick={handleSendReply}
                          disabled={!replyMessage.trim() || isSending}
                          className="p-3 min-h-11 min-w-11 bg-courtyard-700 text-paper-50 hover:bg-courtyard-600 disabled:opacity-50"
                        >
                          <IconSend size={18} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {[
                          'Yes, the property is still available.',
                          'Would you like to schedule a viewing?',
                          'The rent is negotiable.',
                        ].map((reply) => (
                          <button
                            key={reply}
                            type="button"
                            onClick={() => setReplyMessage(reply)}
                            className="px-3 py-1.5 text-xs border border-paper-300 text-ink-600 hover:border-courtyard-500"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {selectedEnquiry.status !== EnquiryStatus.CLOSED && (
                          <button
                            type="button"
                            onClick={() => updateEnquiryStatus(selectedEnquiry.id, EnquiryStatus.CLOSED)}
                            className="px-4 py-2 text-sm border border-paper-300 text-ink-800"
                          >
                            Close
                          </button>
                        )}
                        {selectedEnquiry.status !== EnquiryStatus.CONVERTED && (
                          <button
                            type="button"
                            onClick={() => updateEnquiryStatus(selectedEnquiry.id, EnquiryStatus.CONVERTED)}
                            className="px-4 py-2 text-sm bg-courtyard-700 text-paper-50"
                          >
                            Mark converted
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center">
                      <IconMessage size={40} stroke={1.25} className="mx-auto text-paper-300 mb-3" />
                      <h3 className="font-display font-semibold text-ink-950 mb-1">Select an enquiry</h3>
                      <p className="text-ink-600 text-sm">Choose a conversation from the list</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default EnquiriesManagement;
