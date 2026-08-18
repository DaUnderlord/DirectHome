import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePropertyOwnerStore } from '../../store/propertyOwnerStore';
import {
  IconEye,
  IconMessage,
  IconCalendar,
  IconUsers,
  IconArrowLeft,
  IconChartBar,
  IconPlus,
  IconHome,
  IconHeart,
} from '@tabler/icons-react';
import Container from '../UI/Container';

const formatCount = (value: number) =>
  new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(value);

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

const statusLabel: Record<string, string> = {
  draft: 'Draft',
  pending: 'In review',
  pending_review: 'In review',
  active: 'Live',
  inactive: 'Paused',
  suspended: 'Paused',
  rejected: 'Rejected',
};

const AnalyticsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    properties,
    analytics,
    dashboardStats,
    isLoadingAnalytics,
    isLoadingProperties,
    fetchAnalytics,
    fetchDashboardStats,
    fetchProperties,
  } = usePropertyOwnerStore();

  useEffect(() => {
    if (!user?.id) return;
    void fetchAnalytics(user.id);
    void fetchDashboardStats(user.id);
    void fetchProperties(user.id);
  }, [user?.id, fetchAnalytics, fetchDashboardStats, fetchProperties]);

  const totals = useMemo(() => {
    const views = analytics.reduce((sum, item) => sum + item.views, 0);
    const enquiries = analytics.reduce((sum, item) => sum + item.enquiries, 0);
    const viewings = analytics.reduce((sum, item) => sum + item.viewings, 0);
    const applications = analytics.reduce((sum, item) => sum + item.applications, 0);
    const askingRent = properties.reduce((sum, property) => sum + (property.pricing?.rentPrice || 0), 0);
    const live = properties.filter((property) => property.status === 'active').length;
    const pending = properties.filter((property) =>
      ['pending', 'pending_review'].includes(property.status)
    ).length;
    const enquiryRate = views > 0 ? (enquiries / views) * 100 : 0;

    return { views, enquiries, viewings, applications, askingRent, live, pending, enquiryRate };
  }, [analytics, properties]);

  const rankedProperties = useMemo(() => {
    return [...properties].sort((a, b) => {
      const aViews = analytics.find((item) => item.propertyId === a.id)?.views || 0;
      const bViews = analytics.find((item) => item.propertyId === b.id)?.views || 0;
      return bViews - aViews;
    });
  }, [properties, analytics]);

  const funnelMax = Math.max(totals.views, totals.enquiries, totals.viewings, totals.applications, 1);

  const isLoading = isLoadingAnalytics || isLoadingProperties;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-courtyard-700 mx-auto mb-4" />
          <p className="text-ink-600">Loading analytics…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-100 py-6 sm:py-8 overflow-x-hidden">
      <Container size="xl" className="min-w-0">
        <div className="mb-6 sm:mb-8">
          <button
            type="button"
            onClick={() => navigate('/owner')}
            className="flex items-center text-ink-600 hover:text-ink-950 mb-4 text-sm"
          >
            <IconArrowLeft size={18} stroke={1.5} className="mr-2 shrink-0" />
            Back to dashboard
          </button>
          <p className="text-[11px] uppercase tracking-[0.2em] text-courtyard-700 font-semibold mb-2">
            Owner tools
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-950 leading-tight">
            Listing performance
          </h1>
          <p className="text-ink-600 mt-2 text-sm sm:text-base max-w-xl">
            Views and enquiries on your DirectHome listings. Viewing requests and applications
            will appear here as the marketplace opens.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: 'Views', value: formatCount(totals.views), icon: IconEye, tone: 'bg-courtyard-700' },
            { label: 'Enquiries', value: formatCount(totals.enquiries), icon: IconMessage, tone: 'bg-brass-500' },
            { label: 'Viewings', value: formatCount(totals.viewings), icon: IconCalendar, tone: 'bg-ink-800' },
            { label: 'Applications', value: formatCount(totals.applications), icon: IconUsers, tone: 'bg-laterite-500' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-paper-50 border border-paper-200 p-4 sm:p-5 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-ink-400 font-semibold leading-snug">
                    {card.label}
                  </p>
                  <span className={`p-2 ${card.tone} shrink-0`}>
                    <Icon size={16} stroke={1.4} className="text-paper-50" />
                  </span>
                </div>
                <p className="font-display text-2xl sm:text-3xl font-semibold text-ink-950 leading-none">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-paper-50 border border-paper-200 p-4 sm:p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-ink-400 font-semibold mb-2">Live listings</p>
            <p className="font-display text-3xl font-semibold text-ink-950">{dashboardStats?.activeListings ?? totals.live}</p>
            <p className="text-sm text-ink-600 mt-2">
              {totals.pending} in review · {properties.length} total
            </p>
          </div>
          <div className="bg-paper-50 border border-paper-200 p-4 sm:p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-ink-400 font-semibold mb-2">Enquiry rate</p>
            <p className="font-display text-3xl font-semibold text-ink-950">
              {totals.enquiryRate.toFixed(1)}%
            </p>
            <p className="text-sm text-ink-600 mt-2">Enquiries as a share of views</p>
          </div>
          <div className="bg-paper-50 border border-paper-200 p-4 sm:p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-ink-400 font-semibold mb-2">Asking rent listed</p>
            <p className="font-display text-2xl sm:text-3xl font-semibold text-ink-950 break-words">
              {formatCurrency(totals.askingRent)}
            </p>
            <p className="text-sm text-ink-600 mt-2">Combined yearly asking price</p>
          </div>
        </div>

        <div className="bg-paper-50 border border-paper-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-5">
            <IconChartBar size={18} stroke={1.5} className="text-courtyard-700" />
            <h2 className="font-display text-lg font-semibold text-ink-950">Interest funnel</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Views', value: totals.views },
              { label: 'Enquiries', value: totals.enquiries },
              { label: 'Viewings', value: totals.viewings },
              { label: 'Applications', value: totals.applications },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-ink-600">{row.label}</span>
                  <span className="font-semibold text-ink-950">{formatCount(row.value)}</span>
                </div>
                <div className="h-1.5 bg-paper-200">
                  <div
                    className="h-1.5 bg-courtyard-700"
                    style={{ width: `${Math.max(2, (row.value / funnelMax) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-paper-50 border border-paper-200 mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 border-b border-paper-200">
            <h2 className="font-display text-lg font-semibold text-ink-950">Your listings</h2>
          </div>

          {properties.length === 0 ? (
            <div className="text-center px-4 py-12">
              <IconHome size={40} stroke={1.25} className="mx-auto text-paper-300 mb-4" />
              <h3 className="font-display text-lg font-semibold text-ink-950 mb-2">No listings yet</h3>
              <p className="text-ink-600 mb-5 max-w-sm mx-auto">
                Add a property to start tracking views and enquiries.
              </p>
              <button
                type="button"
                onClick={() => navigate('/owner/properties/new')}
                className="btn-courtyard inline-flex"
              >
                <IconPlus size={18} stroke={1.5} />
                Add property
              </button>
            </div>
          ) : (
            <div className="divide-y divide-paper-200">
              {rankedProperties.map((property) => {
                const stats = analytics.find((item) => item.propertyId === property.id);
                return (
                  <button
                    key={property.id}
                    type="button"
                    onClick={() => navigate('/owner/properties')}
                    className="w-full text-left p-4 sm:p-5 hover:bg-paper-100 transition-colors"
                  >
                    <div className="flex gap-3 sm:gap-4 min-w-0">
                      <img
                        src={property.media.images[0]?.url || '/hero-courtyard-day.webp'}
                        alt=""
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover shrink-0 bg-paper-200"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <p className="font-medium text-ink-950 truncate">{property.basicInfo.title || 'Untitled listing'}</p>
                          <span className="text-[11px] uppercase tracking-wide text-courtyard-700 font-semibold shrink-0">
                            {statusLabel[property.status] || property.status}
                          </span>
                        </div>
                        <p className="text-sm text-ink-600 truncate">
                          {[property.location.lga, property.location.state].filter(Boolean).join(', ') || 'Nigeria'}
                        </p>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs sm:text-sm">
                          <div>
                            <p className="text-ink-400">Views</p>
                            <p className="font-semibold text-ink-950">{formatCount(stats?.views || 0)}</p>
                          </div>
                          <div>
                            <p className="text-ink-400">Enquiries</p>
                            <p className="font-semibold text-ink-950">{formatCount(stats?.enquiries || 0)}</p>
                          </div>
                          <div>
                            <p className="text-ink-400">Rate</p>
                            <p className="font-semibold text-ink-950">{stats?.conversionRate || 0}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-paper-50 border border-paper-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <IconHeart size={18} stroke={1.5} className="text-brass-500" />
              <h3 className="font-display text-lg font-semibold text-ink-950">Strongest interest</h3>
            </div>
            {rankedProperties.length === 0 ? (
              <p className="text-sm text-ink-600">List a property to see which one draws the most views.</p>
            ) : (
              <div className="space-y-3">
                {rankedProperties.slice(0, 3).map((property, index) => {
                  const stats = analytics.find((item) => item.propertyId === property.id);
                  return (
                    <div key={property.id} className="flex items-center gap-3 border border-paper-200 p-3 min-w-0">
                      <span className="w-7 h-7 shrink-0 bg-courtyard-700 text-paper-50 text-xs font-semibold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-ink-950 truncate">{property.basicInfo.title}</p>
                        <p className="text-sm text-ink-600">{formatCount(stats?.views || 0)} views</p>
                      </div>
                      <span className="text-sm font-semibold text-courtyard-700 shrink-0">
                        {stats?.conversionRate || 0}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-courtyard-800 text-paper-50 p-4 sm:p-6">
            <h3 className="font-display text-lg font-semibold mb-4">How to get more interest</h3>
            <ul className="space-y-3 text-sm text-paper-200">
              <li>Use at least five clear daylight photos of rooms, compound, and street.</li>
              <li>Put the estate or nearest landmark in the title — seekers search that way.</li>
              <li>Reply to enquiries the same day. Speed is the conversion edge in Lagos and Abuja.</li>
              <li>Keep asking rent in range for the LGA; overpricing stalls views into enquiries.</li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AnalyticsDashboard;
