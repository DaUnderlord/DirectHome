import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePropertyOwnerStore } from '../../store/propertyOwnerStore';
import {
  IconHome,
  IconPlus,
  IconEye,
  IconMessage,
  IconUsers,
  IconCash,
  IconTool,
  IconChartBar,
  IconBell,
  IconCalendar,
  IconArrowRight,
  IconTrendingUp,
  IconTrendingDown,
  IconClock,
  IconBuilding
} from '@tabler/icons-react';
import { format } from 'date-fns';
import Container from '../UI/Container';

const PropertyOwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const mountedRef = useRef(true);
  const {
    properties,
    viewings,
    enquiries,
    applications,
    maintenanceRequests,
    notifications,
    dashboardStats,
    unreadCount,
    fetchProperties,
    fetchViewings,
    fetchEnquiries,
    fetchApplications,
    fetchMaintenanceRequests,
    fetchNotifications,
    fetchDashboardStats
  } = usePropertyOwnerStore();

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'viewings' | 'enquiries' | 'applications' | 'payments' | 'maintenance' | 'analytics'>('overview');

  const withTimeout = <T,>(promise: Promise<T>, ms: number) =>
    Promise.race([
      promise,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
    ]);

  useEffect(() => {
    mountedRef.current = true;
    const loadData = async () => {
      setIsLoading(true);
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      const ownerId = user.id;
      const watchdogId = window.setTimeout(() => {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }, 12000);

      try {
        await Promise.allSettled([
          withTimeout(fetchProperties(ownerId), 10000),
          withTimeout(fetchViewings(ownerId), 10000),
          withTimeout(fetchEnquiries(ownerId), 10000),
          withTimeout(fetchApplications(ownerId), 10000),
          withTimeout(fetchMaintenanceRequests(ownerId), 10000),
          withTimeout(fetchNotifications(ownerId), 10000),
          withTimeout(fetchDashboardStats(ownerId), 10000)
        ]);
      } catch (_e) {
        // Individual store methods should handle their own errors; this prevents a stuck loader.
      } finally {
        window.clearTimeout(watchdogId);
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };
    
    loadData();
    return () => {
      mountedRef.current = false;
    };
  }, [user?.id]);

  const pendingViewings = viewings.filter(v => v.status === 'pending' || v.status === 'confirmed');
  const openEnquiries = enquiries.filter(e => e.status === 'open' || e.status === 'active');
  const pendingApplications = applications.filter(a => a.status === 'submitted' || a.status === 'under_review');
  const pendingMaintenance = maintenanceRequests.filter(m => m.status === 'pending' || m.status === 'assigned');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const toneClass = {
    courtyard: 'bg-courtyard-700',
    brass: 'bg-brass-500',
    ink: 'bg-ink-800',
    laterite: 'bg-laterite-500',
  } as const;

  const QuickStatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    tone, 
    trend, 
    trendValue,
    onClick 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ComponentType<{ size?: number; stroke?: number; className?: string }>; 
    tone: keyof typeof toneClass;
    trend?: 'up' | 'down';
    trendValue?: string;
    onClick?: () => void;
  }) => (
    <div 
      className={`bg-paper-50 border border-paper-200 p-5 sm:p-6 ${onClick ? 'cursor-pointer hover:border-brass-500' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-400 font-semibold mb-2">{title}</p>
          <p className="font-display text-3xl font-semibold text-ink-950 leading-none">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center mt-3 text-sm ${trend === 'up' ? 'text-courtyard-600' : 'text-laterite-600'}`}>
              {trend === 'up' ? <IconTrendingUp size={16} stroke={1.5} /> : <IconTrendingDown size={16} stroke={1.5} />}
              <span className="ml-1">{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-2.5 ${toneClass[tone]} shrink-0`}>
          <Icon size={22} stroke={1.4} className="text-paper-50" />
        </div>
      </div>
    </div>
  );

  const ActionCard = ({ 
    title, 
    count, 
    description, 
    icon: Icon, 
    tone,
    actionLabel,
    onClick 
  }: { 
    title: string; 
    count: number;
    description: string;
    icon: React.ComponentType<{ size?: number; stroke?: number; className?: string }>; 
    tone: keyof typeof toneClass;
    actionLabel: string;
    onClick: () => void;
  }) => (
    <div className="bg-paper-50 border border-paper-200 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 ${toneClass[tone]}`}>
          <Icon size={22} stroke={1.4} className="text-paper-50" />
        </div>
        {count > 0 && (
          <span className="bg-laterite-500/10 text-laterite-600 text-xs font-semibold tracking-wide px-2.5 py-1">
            {count} pending
          </span>
        )}
      </div>
      <h3 className="font-display text-lg font-semibold text-ink-950 mb-1">{title}</h3>
      <p className="text-sm text-ink-600 mb-4">{description}</p>
      <button 
        onClick={onClick}
        className="flex items-center text-courtyard-700 hover:text-courtyard-600 font-medium text-sm"
      >
        {actionLabel}
        <IconArrowRight size={16} stroke={1.5} className="ml-1" />
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-courtyard-700 mx-auto mb-4"></div>
          <p className="text-ink-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-100">
      <Container size="xl" className="py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-950 mb-2">
              Welcome back, {user?.firstName || 'Property Owner'}!
            </h1>
            <p className="text-ink-600">
              Manage your properties, viewings, and tenant applications all in one place.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className="relative p-3 bg-paper-50 border border-paper-200 hover:bg-paper-100"
              onClick={() => navigate('/owner/notifications')}
            >
              <IconBell size={24} className="text-ink-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => navigate('/owner/properties/new')}
              className="flex items-center px-5 py-3 bg-courtyard-700 text-paper-50 hover:bg-courtyard-600 transition-all font-semibold rounded-sm"
            >
              <IconPlus size={20} className="mr-2" />
              Add Property
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <QuickStatCard
            title="Total Properties"
            value={Math.max(dashboardStats?.totalProperties ?? 0, properties.length)}
            icon={IconBuilding}
            tone="courtyard"
            onClick={() => navigate('/owner/properties')}
          />
          <QuickStatCard
            title="Occupancy Rate"
            value={`${dashboardStats?.occupancyRate ?? 0}%`}
            icon={IconHome}
            tone="brass"
          />
          <QuickStatCard
            title="Total Revenue"
            value={formatCurrency(dashboardStats?.totalRevenue || 0)}
            icon={IconCash}
            tone="ink"
            onClick={() => navigate('/owner/payments')}
          />
          <QuickStatCard
            title="Pending Payments"
            value={formatCurrency(dashboardStats?.pendingPayments || 0)}
            icon={IconClock}
            tone="laterite"
            onClick={() => navigate('/owner/payments')}
          />
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ActionCard
            title="Viewing Requests"
            count={pendingViewings.length}
            description="Manage property viewing schedules"
            icon={IconEye}
            tone="courtyard"
            actionLabel="View all requests"
            onClick={() => navigate('/owner/viewings')}
          />
          <ActionCard
            title="Enquiries"
            count={openEnquiries.length}
            description="Respond to potential tenants"
            icon={IconMessage}
            tone="brass"
            actionLabel="View enquiries"
            onClick={() => navigate('/owner/enquiries')}
          />
          <ActionCard
            title="Applications"
            count={pendingApplications.length}
            description="Review tenant applications"
            icon={IconUsers}
            tone="ink"
            actionLabel="Review applications"
            onClick={() => navigate('/owner/applications')}
          />
          <ActionCard
            title="Maintenance"
            count={pendingMaintenance.length}
            description="Track repair requests"
            icon={IconTool}
            tone="laterite"
            actionLabel="View requests"
            onClick={() => navigate('/owner/maintenance')}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Properties Overview */}
          <div className="lg:col-span-2 bg-paper-50 border border-paper-200 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-ink-950">Your Properties</h2>
              <Link to="/owner/properties" className="text-courtyard-700 hover:text-courtyard-600 text-sm font-medium">
                View all
              </Link>
            </div>
            
            {properties.length === 0 ? (
              <div className="text-center py-12">
                <IconHome size={48} stroke={1.25} className="mx-auto text-paper-300 mb-4" />
                <h3 className="font-display text-lg font-semibold text-ink-950 mb-2">No properties yet</h3>
                <p className="text-ink-600 mb-4">Start by adding your first property listing</p>
                <button 
                  onClick={() => navigate('/owner/properties/new')}
                  className="px-6 py-2.5 bg-courtyard-700 text-paper-50 hover:bg-courtyard-600"
                >
                  Add Property
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.slice(0, 3).map(property => (
                  <div 
                    key={property.id}
                    className="flex items-center p-4 bg-paper-100 border border-paper-200 hover:border-brass-500 transition-colors cursor-pointer"
                    onClick={() => navigate(`/owner/properties/${property.id}`)}
                  >
                    <img 
                      src={property.media.images[0]?.url || 'https://via.placeholder.com/100'} 
                      alt={property.basicInfo.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-900">{property.basicInfo.title}</h3>
                      <p className="text-sm text-gray-500">{property.location.fullAddress}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-sm font-semibold text-blue-600">
                          {formatCurrency(property.pricing.rentPrice)}/yr
                        </span>
                        <span className={`text-xs px-2 py-1 ${
                          property.status === 'active' ? 'bg-courtyard-700 text-paper-50' :
                          property.status === 'pending' || property.status === 'pending_review' ? 'bg-paper-200 text-brass-600' :
                          'bg-paper-200 text-ink-700'
                        }`}>
                          {property.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <IconArrowRight size={20} className="text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity & Notifications */}
          <div className="space-y-6">
            {/* Upcoming Viewings */}
            <div className="bg-paper-50 border border-paper-200 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold text-ink-950">Upcoming Viewings</h2>
                <Link to="/owner/viewings" className="text-courtyard-700 hover:text-courtyard-600 text-sm font-medium">
                  View all
                </Link>
              </div>
              
              {pendingViewings.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No upcoming viewings</p>
              ) : (
                <div className="space-y-3">
                  {pendingViewings.slice(0, 3).map(viewing => (
                    <div key={viewing.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-lg ${
                        viewing.status === 'confirmed' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        <IconCalendar size={16} className={
                          viewing.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
                        } />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{viewing.seekerName}</p>
                        <p className="text-xs text-gray-500">{viewing.propertyTitle}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {format(new Date(viewing.requestedDate), 'MMM d, yyyy')} at {viewing.requestedTime}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        viewing.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {viewing.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Notifications */}
            <div className="bg-paper-50 border border-paper-200 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold text-ink-950">Notifications</h2>
                <Link to="/owner/notifications" className="text-courtyard-700 hover:text-courtyard-600 text-sm font-medium">
                  View all
                </Link>
              </div>
              
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No new notifications</p>
              ) : (
                <div className="space-y-3">
                  {notifications.slice(0, 4).map(notification => (
                    <button
                      type="button"
                      key={notification.id}
                      onClick={() => {
                        if (notification.actionUrl) navigate(notification.actionUrl);
                      }}
                      className={`w-full flex items-start p-3 text-left ${
                        notification.read ? 'bg-paper-100' : 'bg-courtyard-50'
                      }`}
                    >
                      <div className={`p-2 ${
                        notification.read ? 'bg-paper-200' : 'bg-courtyard-700'
                      }`}>
                        {notification.type === 'new_enquiry' && <IconMessage size={16} className={notification.read ? 'text-ink-600' : 'text-paper-50'} />}
                        {notification.type === 'viewing_request' && <IconEye size={16} className={notification.read ? 'text-ink-600' : 'text-paper-50'} />}
                        {notification.type === 'application_received' && <IconUsers size={16} className={notification.read ? 'text-ink-600' : 'text-paper-50'} />}
                        {notification.type === 'payment_received' && <IconCash size={16} className={notification.read ? 'text-ink-600' : 'text-paper-50'} />}
                        {notification.type === 'maintenance_request' && <IconTool size={16} className={notification.read ? 'text-ink-600' : 'text-paper-50'} />}
                        {notification.type === 'system_alert' && <IconBell size={16} className={notification.read ? 'text-ink-600' : 'text-paper-50'} />}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className={`text-sm ${notification.read ? 'text-ink-600' : 'text-ink-950 font-medium'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-ink-500 mt-1">
                          {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-courtyard-700 rounded-full shrink-0"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-8 bg-courtyard-800 p-6 sm:p-8 text-paper-50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">Ready to list a new property?</h2>
              <p className="text-paper-300">
                Get your property in front of thousands of potential tenants today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => navigate('/owner/properties/new')}
                className="px-6 py-3 bg-paper-50 text-courtyard-800 font-semibold hover:bg-paper-100"
              >
                <IconPlus size={20} className="inline mr-2" />
                Add New Property
              </button>
              <button 
                onClick={() => navigate('/owner/analytics')}
                className="px-6 py-3 border border-white/30 text-paper-50 font-semibold hover:bg-white/10"
              >
                <IconChartBar size={20} className="inline mr-2" />
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PropertyOwnerDashboard;
