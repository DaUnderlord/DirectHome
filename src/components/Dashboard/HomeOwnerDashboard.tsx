import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { usePropertyStore } from '../../store/propertyStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useMessagingStore } from '../../store/messagingStore';
import { AppointmentStatus } from '../../types/appointment';
import { PropertyStatus } from '../../types/property';
import { IconCalendar, IconHome, IconMessage, IconPlus, IconChartBar, IconEye, IconMessageCircle, IconTrendingUp } from '@tabler/icons-react';
import { format } from 'date-fns';
import ModernDashboardLayout from './ModernDashboardLayout';
import InteractiveStatsCard from './InteractiveStatsCard';
import MarketMapQuickAccess from './MarketMapQuickAccess';
import { UserRole } from '../../types/auth';

interface HomeOwnerDashboardProps {
  activeRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

const HomeOwnerDashboard: React.FC<HomeOwnerDashboardProps> = ({
  activeRole = UserRole.HOME_OWNER,
  onRoleChange = () => {}
}) => {
  const { user } = useAuth();
  const { fetchProperties } = usePropertyStore();
  const { fetchAppointments, appointments } = useAppointmentStore();
  const { fetchConversations, conversations } = useMessagingStore();
  
  const [myProperties, setMyProperties] = useState<any[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [propertyStats, setPropertyStats] = useState({
    active: 0,
    pending: 0,
    total: 0,
    views: 0,
    inquiries: 0
  });
  
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Fetch my properties
      await fetchProperties({ ownerId: user?.id });
      
      // Fetch upcoming appointments
      await fetchAppointments({ 
        hostId: user?.id,
        status: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING]
      });
      
      // Fetch conversations
      await fetchConversations({ participantId: user?.id });
      
      setIsLoading(false);
    };
    
    loadDashboardData();
  }, [fetchProperties, fetchAppointments, fetchConversations, user?.id]);
  
  // Process properties data
  useEffect(() => {
    const properties = usePropertyStore.getState().properties;
    
    if (properties.length > 0) {
      // Filter for my properties
      const myProps = properties.filter(p => p.ownerId === user?.id);
      setMyProperties(myProps.slice(0, 3));
      
      // Calculate property stats
      const active = myProps.filter(p => p.status === PropertyStatus.ACTIVE).length;
      const pending = myProps.filter(p => p.status === PropertyStatus.PENDING).length;
      const totalViews = myProps.reduce((sum, p) => sum + (p.analytics?.viewCount || 0), 0);
      const totalInquiries = myProps.reduce((sum, p) => sum + (p.analytics?.inquiryCount || 0), 0);
      
      setPropertyStats({
        active,
        pending,
        total: myProps.length,
        views: totalViews,
        inquiries: totalInquiries
      });
    }
  }, [usePropertyStore.getState().properties, user?.id]);
  
  // Process appointments data
  useEffect(() => {
    if (appointments) {
      // Filter for pending appointments and sort by date
      const pending = appointments
        .filter(apt => apt.status === AppointmentStatus.PENDING && apt.hostId === user?.id)
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        .slice(0, 5); // Get only the next 5 pending appointments
      
      setPendingAppointments(pending);
    }
  }, [appointments, user?.id]);
  
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
  
  // Prepare stats for the layout
  const stats = [
    {
      label: 'Total Properties',
      value: propertyStats.total,
      color: 'blue' as const,
      change: 8,
      trend: 'up' as const
    },
    {
      label: 'Active Listings',
      value: propertyStats.active,
      color: 'green' as const,
      change: 15,
      trend: 'up' as const
    },
    {
      label: 'Total Views',
      value: propertyStats.views,
      color: 'indigo' as const,
      change: 23,
      trend: 'up' as const
    }
  ];

  return (
    <ModernDashboardLayout
      user={user!}
      activeRole={activeRole}
      onRoleChange={onRoleChange}
      title="Manage Your Properties"
      subtitle="Track your listings, manage appointments, and grow your property portfolio with powerful analytics and insights."
      stats={stats}
    >
      {/* Interactive Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <InteractiveStatsCard
          title="Total Properties"
          value={propertyStats.total}
          icon={IconHome}
          color="blue"
          onClick={() => window.location.href = '/my-properties'}
          change={8}
          trend="up"
          subtitle="All listings"
        />
        
        <InteractiveStatsCard
          title="Active Listings"
          value={propertyStats.active}
          icon={IconTrendingUp}
          color="green"
          onClick={() => window.location.href = '/my-properties?status=active'}
          change={15}
          trend="up"
          subtitle="Live now"
        />
        
        <InteractiveStatsCard
          title="Pending Listings"
          value={propertyStats.pending}
          icon={IconCalendar}
          color="yellow"
          onClick={() => window.location.href = '/my-properties?status=pending'}
          subtitle="Under review"
        />
        
        <InteractiveStatsCard
          title="Total Views"
          value={propertyStats.views}
          icon={IconEye}
          color="indigo"
          onClick={() => window.location.href = '/analytics'}
          change={23}
          trend="up"
          subtitle="This month"
        />
        
        <InteractiveStatsCard
          title="Inquiries"
          value={propertyStats.inquiries}
          icon={IconMessageCircle}
          color="purple"
          onClick={() => window.location.href = '/messages'}
          change={12}
          trend="up"
          subtitle="New leads"
        />
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg backdrop-blur-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/property/create" 
            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <IconPlus className="h-5 w-5 mr-2" />
            <span className="font-semibold">Add New Property</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          </Link>
          
          <Link 
            to="/my-properties" 
            className="group relative overflow-hidden glass-card hover:shadow-lg text-gray-700 hover:text-gray-900 py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center border border-white/30"
          >
            <IconHome className="h-5 w-5 mr-2" />
            <span className="font-semibold">My Properties</span>
          </Link>
          
          <Link 
            to="/appointments" 
            className="group relative overflow-hidden glass-card hover:shadow-lg text-gray-700 hover:text-gray-900 py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center border border-white/30"
          >
            <IconCalendar className="h-5 w-5 mr-2" />
            <span className="font-semibold">Appointments</span>
            {pendingAppointments.length > 0 && (
              <span className="ml-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingAppointments.length}
              </span>
            )}
          </Link>
          
          <Link 
            to="/analytics" 
            className="group relative overflow-hidden glass-card hover:shadow-lg text-gray-700 hover:text-gray-900 py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center border border-white/30"
          >
            <IconChartBar className="h-5 w-5 mr-2" />
            <span className="font-semibold">Analytics</span>
          </Link>
        </div>
      </div>

      {/* Market Map Quick Access */}
      <MarketMapQuickAccess 
        userRole="homeOwner"
        recentSearches={[
          { location: 'Victoria Island, Lagos', propertyCount: 45, averagePrice: 2500000 },
          { location: 'Lekki Phase 1, Lagos', propertyCount: 32, averagePrice: 1800000 },
          { location: 'Ikeja GRA, Lagos', propertyCount: 28, averagePrice: 1200000 }
        ]}
      />
      
      {/* My Properties Section */}
      <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg backdrop-blur-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">My Properties</h3>
          <Link to="/my-properties" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : myProperties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inquiries
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myProperties.map(property => (
                  <tr key={property.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                          {property.images && property.images[0] && (
                            <img 
                              src={property.images[0].thumbnailUrl || property.images[0].url} 
                              alt={property.title} 
                              className="h-10 w-10 object-cover"
                            />
                          )}
                        </div>
                        <div className="ml-4">
                          <Link to={`/property/${property.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                            {property.title}
                          </Link>
                          <div className="text-xs text-gray-500">{property.location.city}, {property.location.state}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        property.status === PropertyStatus.ACTIVE 
                          ? 'bg-green-100 text-green-800' 
                          : property.status === PropertyStatus.PENDING
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <IconEye className="h-4 w-4 text-gray-400 mr-1" />
                        {property.analytics?.viewCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <IconMessageCircle className="h-4 w-4 text-gray-400 mr-1" />
                        {property.analytics?.inquiryCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      ₦{property.pricing.price.toLocaleString()}
                      {property.listingType === 'rent' && '/month'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <IconHome className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">You haven't listed any properties yet</p>
            <Link 
              to="/property/create" 
              className="mt-3 inline-block text-blue-600 hover:text-blue-800 font-medium"
            >
              Add your first property
            </Link>
          </div>
        )}
      </div>
      
      {/* Pending Appointments Section */}
      <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg backdrop-blur-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Pending Appointments</h3>
          <Link to="/appointments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : pendingAppointments.length > 0 ? (
          <div className="space-y-4">
            {pendingAppointments.map(appointment => (
              <div 
                key={appointment.id} 
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Property Viewing Request</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(appointment.startTime), 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(appointment.startTime), 'h:mm a')} - 
                      {format(new Date(appointment.endTime), 'h:mm a')}
                    </p>
                    {appointment.notes && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Note:</span> {appointment.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                      Confirm
                    </button>
                    <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50">
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <IconCalendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No pending appointments</p>
          </div>
        )}
      </div>
      
      {/* Analytics Section */}
      <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg backdrop-blur-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Performance Overview</h3>
          <Link to="/analytics" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View Detailed Analytics
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Property Views (Last 30 Days)</h4>
            <div className="h-40 flex items-center justify-center">
              <div className="text-center">
                <IconChartBar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Analytics data will appear here</p>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Inquiry Conversion Rate</h4>
            <div className="h-40 flex items-center justify-center">
              <div className="text-center">
                <IconChartBar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Analytics data will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModernDashboardLayout>
  );
};

export default HomeOwnerDashboard;