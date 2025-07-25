import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { usePropertyStore } from '../../store/propertyStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useMessagingStore } from '../../store/messagingStore';
import { AppointmentStatus } from '../../types/appointment';
import { IconCalendar, IconHeart, IconMessage, IconSearch, IconStar, IconMapPin } from '@tabler/icons-react';
import { format } from 'date-fns';
import ModernDashboardLayout from './ModernDashboardLayout';
import InteractiveStatsCard from './InteractiveStatsCard';
import MarketMapQuickAccess from './MarketMapQuickAccess';
import MapInsightsWidget from './MapInsightsWidget';
import { UserRole } from '../../types/auth';

interface HomeSeekerDashboardProps {
  activeRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

const HomeSeekerDashboard: React.FC<HomeSeekerDashboardProps> = ({
  activeRole = UserRole.HOME_SEEKER,
  onRoleChange = () => {}
}) => {
  const { user } = useAuth();
  const { fetchProperties } = usePropertyStore();
  const { fetchAppointments, appointments } = useAppointmentStore();
  const { fetchConversations, conversations } = useMessagingStore();

  const [favoriteProperties, setFavoriteProperties] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recentSearches] = useState<number>(3);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);

      // Fetch favorite properties
      await fetchProperties({ featured: true, limit: 3 });

      // Fetch upcoming appointments
      await fetchAppointments({
        attendeeId: user?.id,
        status: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING]
      });

      // Fetch conversations
      await fetchConversations({ participantId: user?.id });

      setIsLoading(false);
    };

    loadDashboardData();
  }, [fetchProperties, fetchAppointments, fetchConversations, user?.id]);

  // Process appointments data
  useEffect(() => {
    if (appointments) {
      // Filter for upcoming appointments and sort by date
      const upcoming = appointments
        .filter(apt =>
          (apt.status === AppointmentStatus.CONFIRMED || apt.status === AppointmentStatus.PENDING) &&
          new Date(apt.startTime) > new Date()
        )
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        .slice(0, 3); // Get only the next 3 appointments

      setUpcomingAppointments(upcoming);
    }
  }, [appointments]);

  // Process conversations data
  useEffect(() => {
    if (conversations && user) {
      // Calculate total unread messages
      const unread = conversations.reduce((total, conv) => {
        return total + (conv.unreadCount[user.id] || 0);
      }, 0);

      setUnreadMessages(unread);
    }
  }, [conversations, user]);

  // Get favorite properties from the store
  useEffect(() => {
    const favorites = usePropertyStore.getState().properties.filter(p => p.featured);
    setFavoriteProperties(favorites.slice(0, 3));
  }, []);

  // Prepare stats for the layout
  const stats = [
    {
      label: 'Saved Properties',
      value: favoriteProperties.length,
      color: 'blue' as const,
      change: 12,
      trend: 'up' as const
    },
    {
      label: 'Upcoming Viewings',
      value: upcomingAppointments.length,
      color: 'green' as const,
      change: 5,
      trend: 'up' as const
    },
    {
      label: 'Unread Messages',
      value: unreadMessages,
      color: 'purple' as const
    }
  ];

  return (
    <ModernDashboardLayout
      user={user!}
      activeRole={activeRole}
      onRoleChange={onRoleChange}
      title="Find Your Perfect Home"
      subtitle="Discover amazing properties, schedule viewings, and connect with property owners in your area."
      stats={stats}
    >
      {/* Interactive Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InteractiveStatsCard
          title="Saved Properties"
          value={favoriteProperties.length}
          icon={IconHeart}
          color="blue"
          onClick={() => window.location.href = '/favorites'}
          change={12}
          trend="up"
          subtitle="This month"
        />
        
        <InteractiveStatsCard
          title="Upcoming Viewings"
          value={upcomingAppointments.length}
          icon={IconCalendar}
          color="green"
          onClick={() => window.location.href = '/appointments'}
          change={5}
          trend="up"
          subtitle="Next 7 days"
        />
        
        <InteractiveStatsCard
          title="Unread Messages"
          value={unreadMessages}
          icon={IconMessage}
          color="purple"
          onClick={() => window.location.href = '/messages'}
          subtitle="From owners"
        />
        
        <InteractiveStatsCard
          title="Recent Searches"
          value={recentSearches}
          icon={IconSearch}
          color="indigo"
          onClick={() => window.location.href = '/search'}
          subtitle="Last 24 hours"
        />
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg backdrop-blur-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/search"
            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <IconSearch className="h-5 w-5 mr-2" />
            <span className="font-semibold">Find Properties</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          </Link>

          <Link
            to="/favorites"
            className="group relative overflow-hidden glass-card hover:shadow-lg text-gray-700 hover:text-gray-900 py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center border border-white/30"
          >
            <IconHeart className="h-5 w-5 mr-2" />
            <span className="font-semibold">Saved Properties</span>
          </Link>

          <Link
            to="/appointments"
            className="group relative overflow-hidden glass-card hover:shadow-lg text-gray-700 hover:text-gray-900 py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center border border-white/30"
          >
            <IconCalendar className="h-5 w-5 mr-2" />
            <span className="font-semibold">My Appointments</span>
          </Link>

          <Link
            to="/rent-calculator?tab=market-map"
            className="group relative overflow-hidden glass-card hover:shadow-lg text-gray-700 hover:text-gray-900 py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center border border-white/30"
          >
            <IconMapPin className="h-5 w-5 mr-2" />
            <span className="font-semibold">Market Map</span>
          </Link>
        </div>
      </div>

      {/* Map Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Map Quick Access */}
        <MarketMapQuickAccess 
          recentSearches={[
            { query: 'Victoria Island apartments', timestamp: new Date(Date.now() - 3600000), resultCount: 45 },
            { query: 'Lekki Phase 1 houses', timestamp: new Date(Date.now() - 7200000), resultCount: 32 },
            { query: 'Ikeja GRA properties', timestamp: new Date(Date.now() - 86400000), resultCount: 28 }
          ]}
          favoriteAreas={[
            { name: 'Victoria Island', coordinates: [3.4219, 6.4281], propertyCount: 156, avgPrice: 2500000, trending: true },
            { name: 'Lekki Phase 1', coordinates: [3.4700, 6.4474], propertyCount: 203, avgPrice: 1800000, trending: false },
            { name: 'Ikeja GRA', coordinates: [3.3515, 6.5966], propertyCount: 89, avgPrice: 1200000, trending: true }
          ]}
        />

        {/* Map Insights Widget */}
        <MapInsightsWidget 
          userLocation={user?.profile?.city || 'Lagos'}
          favoriteAreas={['Victoria Island', 'Lekki', 'Ikeja', 'Ikoyi']}
        />
      </div>

      {/* Saved Properties Section */}
      <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg backdrop-blur-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Saved Properties</h3>
          <Link to="/favorites" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteProperties.map(property => (
              <Link
                key={property.id}
                to={`/property/${property.id}`}
                className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-40 bg-gray-200">
                  {property.images && property.images[0] && (
                    <img
                      src={property.images[0].url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2">
                    <IconHeart className="h-6 w-6 text-red-500 fill-current" />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-1 truncate">{property.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{property.location.city}, {property.location.state}</p>
                  <p className="text-blue-600 font-semibold">
                    ₦{property.pricing.price.toLocaleString()}
                    {property.listingType === 'rent' && '/month'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <IconHeart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">You haven't saved any properties yet</p>
            <Link
              to="/search"
              className="mt-3 inline-block text-blue-600 hover:text-blue-800 font-medium"
            >
              Start browsing properties
            </Link>
          </div>
        )}
      </div>

      {/* Upcoming Appointments Section */}
      <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg backdrop-blur-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h3>
          <Link to="/appointments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map(appointment => (
              <div
                key={appointment.id}
                className="border border-gray-200 rounded-lg p-4 flex items-center"
              >
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <IconCalendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Property Viewing</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(appointment.startTime), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(appointment.startTime), 'h:mm a')} -
                    {format(new Date(appointment.endTime), 'h:mm a')}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${appointment.status === AppointmentStatus.CONFIRMED
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {appointment.status === AppointmentStatus.CONFIRMED ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <IconCalendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">You don't have any upcoming appointments</p>
            <Link
              to="/search"
              className="mt-3 inline-block text-blue-600 hover:text-blue-800 font-medium"
            >
              Find properties to view
            </Link>
          </div>
        )}
      </div>

      {/* Recommended Properties Section */}
      <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg backdrop-blur-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Recommended For You</h3>
          <Link to="/search" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View More
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usePropertyStore.getState().properties.slice(0, 3).map(property => (
              <Link
                key={property.id}
                to={`/property/${property.id}`}
                className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-40 bg-gray-200">
                  {property.images && property.images[0] && (
                    <img
                      src={property.images[0].url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {property.featured && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-md font-medium flex items-center">
                        <IconStar className="h-3 w-3 mr-1" />
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-1 truncate">{property.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{property.location.city}, {property.location.state}</p>
                  <p className="text-blue-600 font-semibold">
                    ₦{property.pricing.price.toLocaleString()}
                    {property.listingType === 'rent' && '/month'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ModernDashboardLayout>
  );
};

export default HomeSeekerDashboard;