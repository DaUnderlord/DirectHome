import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  IconHeart, 
  IconSearch, 
  IconCalendar, 
  IconEye, 
  IconMapPin, 
  IconFilter, 
  IconBuildingCommunity,
  IconMessage,
  IconChevronRight,
  IconClock,
  IconStar,
  IconBell,
  IconHome
} from '@tabler/icons-react';
import BecomePropertyOwner from '../BecomePropertyOwner';
import { usePropertyFavorites } from '../../../hooks/usePropertyFavorites';
import { useAppointment } from '../../../hooks/useAppointment';
import { usePropertyStore } from '../../../store/propertyStore';
import { AppointmentStatus } from '../../../types/appointment';

const HomeSeekerDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { favorites, recentlyViewed } = usePropertyFavorites();
  const { appointmentStats, upcomingAppointments } = useAppointment();
  const { searchFilters } = usePropertyStore();
  const [recentSearches, setRecentSearches] = useState<Array<{
    id: string;
    query: string;
    location: string;
    filters: string[];
    date: Date;
  }>>([]);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'property' | 'appointment' | 'message' | 'system';
    message: string;
    date: Date;
    read: boolean;
  }>>([]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return formatDate(date);
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate loading recent searches
      const mockSearches = [
        {
          id: 'search-1',
          query: 'Apartments in Lekki',
          location: 'Lekki, Lagos',
          filters: ['2+ bedrooms', 'Under ₦2,000,000/month'],
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'search-2',
          query: 'Houses for sale',
          location: 'Ikoyi, Lagos',
          filters: ['4+ bedrooms', '₦100M - ₦300M'],
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'search-3',
          query: 'Commercial spaces',
          location: 'Victoria Island',
          filters: ['Office', '1000+ sqft'],
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      ];
      setRecentSearches(mockSearches);
      
      // Simulate loading notifications
      const mockNotifications = [
        {
          id: 'notif-1',
          type: 'property' as const,
          message: 'Price reduced on a property in your favorites',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          read: false
        },
        {
          id: 'notif-2',
          type: 'appointment' as const,
          message: 'Your viewing appointment has been confirmed',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          read: true
        },
        {
          id: 'notif-3',
          type: 'message' as const,
          message: 'New message from property owner',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          read: false
        },
        {
          id: 'notif-4',
          type: 'system' as const,
          message: 'Welcome to DirectHome! Complete your profile to get personalized recommendations',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          read: true
        }
      ];
      setNotifications(mockNotifications);
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Home Seeker Dashboard</h1>
        <p className="text-gray-600">Track your saved properties and search activity</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <IconHeart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Saved Properties</h3>
              <p className="text-2xl font-bold text-red-600">{favorites.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <IconSearch className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Searches</h3>
              <p className="text-2xl font-bold text-blue-600">{recentSearches.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <IconCalendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
              <p className="text-2xl font-bold text-green-600">{appointmentStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <IconEye className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recently Viewed</h3>
              <p className="text-2xl font-bold text-purple-600">{recentlyViewed.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Favorite Properties */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Favorite Properties</h2>
              <Link to="/favorites" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                View all <IconChevronRight size={16} className="ml-1" />
              </Link>
            </div>
            <div className="p-4">
              {favorites.length === 0 ? (
                <div className="text-center py-8">
                  <IconHeart size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">You haven't saved any properties yet.</p>
                  <Link 
                    to="/search" 
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    <IconSearch size={16} className="mr-2" />
                    Start Searching
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.slice(0, 4).map((property) => (
                    <Link 
                      key={property.id} 
                      to={`/property/${property.id}`}
                      className="flex border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="w-24 h-24 flex-shrink-0">
                        <img 
                          src={property.images[0]?.url || 'https://via.placeholder.com/100?text=No+Image'} 
                          alt={property.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{property.title}</h3>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <IconMapPin size={12} className="mr-1" />
                          <span className="line-clamp-1">{property.location.city}, {property.location.state}</span>
                        </div>
                        <p className="text-sm font-semibold text-blue-600 mt-1">
                          {formatCurrency(property.pricing.price)}
                          {property.pricing.paymentFrequency && (
                            <span className="text-xs text-gray-400">/{property.pricing.paymentFrequency}</span>
                          )}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {favorites.length > 4 && (
                <div className="mt-4 text-center">
                  <Link to="/favorites" className="text-sm text-blue-600 hover:text-blue-800">
                    View all {favorites.length} saved properties
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recently Viewed */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Recently Viewed</h2>
            </div>
            <div className="p-4">
              {recentlyViewed.length === 0 ? (
                <div className="text-center py-8">
                  <IconEye size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">You haven't viewed any properties yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentlyViewed.slice(0, 5).map((property) => (
                    <Link 
                      key={property.id} 
                      to={`/property/${property.id}`}
                      className="flex items-center p-2 border border-gray-100 rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                        <img 
                          src={property.images[0]?.url || 'https://via.placeholder.com/100?text=No+Image'} 
                          alt={property.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{property.title}</h3>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <IconMapPin size={12} className="mr-1" />
                          <span>{property.location.city}, {property.location.state}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm font-semibold text-blue-600">
                            {formatCurrency(property.pricing.price)}
                            {property.pricing.paymentFrequency && (
                              <span className="text-xs text-gray-400">/{property.pricing.paymentFrequency}</span>
                            )}
                          </p>
                          <span className="text-xs text-gray-400">
                            <IconClock size={12} className="inline mr-1" />
                            {formatRelativeTime(new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000))}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
            </div>
            <div className="p-4">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <IconCalendar size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No upcoming appointments.</p>
                  <Link 
                    to="/search" 
                    className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                  >
                    <IconBuildingCommunity size={16} className="mr-2" />
                    Find Properties
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <IconCalendar size={20} className="text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            Viewing for {appointment.property?.title || 'Property'}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === AppointmentStatus.CONFIRMED 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {formatDate(appointment.startTime)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {upcomingAppointments.length > 3 && (
                    <div className="pt-2 text-center">
                      <Link to="/appointments" className="text-sm text-blue-600 hover:text-blue-800">
                        View all appointments
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Search */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Quick Search</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <Link 
                  to="/search?type=rent&propertyType=apartment"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <IconBuildingCommunity size={20} className="text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Apartments for Rent</h3>
                    <p className="text-xs text-gray-500">Find your next home</p>
                  </div>
                </Link>
                
                <Link 
                  to="/search?type=sale&propertyType=house"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <IconHome size={20} className="text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Houses for Sale</h3>
                    <p className="text-xs text-gray-500">Invest in property</p>
                  </div>
                </Link>
                
                <Link 
                  to="/search?featured=true"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <IconStar size={20} className="text-amber-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Featured Properties</h3>
                    <p className="text-xs text-gray-500">Premium listings</p>
                  </div>
                </Link>
                
                <Link 
                  to="/search"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <IconFilter size={20} className="text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Advanced Search</h3>
                    <p className="text-xs text-gray-500">Customize your filters</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Searches */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Searches</h2>
            </div>
            <div className="p-4">
              {recentSearches.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No recent searches.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSearches.map((search) => (
                    <Link 
                      key={search.id} 
                      to="/search"
                      className="block p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{search.query}</h3>
                        <span className="text-xs text-gray-400">{formatRelativeTime(search.date)}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <IconMapPin size={12} className="mr-1" />
                        <span>{search.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {search.filters.map((filter, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {filter}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {notifications.filter(n => !n.read).length} new
              </span>
            </div>
            <div className="p-4">
              {notifications.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No notifications.</p>
                </div>
              ) : (
                <div>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-3 border rounded-lg ${notification.read ? 'border-gray-100' : 'border-blue-100 bg-blue-50'}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              notification.type === 'property' ? 'bg-blue-100 text-blue-600' :
                              notification.type === 'appointment' ? 'bg-green-100 text-green-600' :
                              notification.type === 'message' ? 'bg-purple-100 text-purple-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {notification.type === 'property' && <IconBuildingCommunity size={16} />}
                              {notification.type === 'appointment' && <IconCalendar size={16} />}
                              {notification.type === 'message' && <IconMessage size={16} />}
                              {notification.type === 'system' && <IconBell size={16} />}
                            </div>
                            <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1 ml-11">
                          {formatRelativeTime(notification.date)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {notifications.filter(n => !n.read).length > 0 && (
                    <div className="mt-4 text-center">
                      <button 
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Become Property Owner */}
          <BecomePropertyOwner className="mb-8" />
          
          {/* Market Trends */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Market Trends</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-900">Lekki, Lagos</h3>
                    <span className="text-xs font-medium text-green-600">+5.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Average price: {formatCurrency(1800000)}/month</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-900">Ikoyi, Lagos</h3>
                    <span className="text-xs font-medium text-green-600">+3.8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Average price: {formatCurrency(2500000)}/month</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-900">Victoria Island</h3>
                    <span className="text-xs font-medium text-red-600">-1.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-red-600 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Average price: {formatCurrency(2200000)}/month</p>
                </div>
                
                <div className="pt-2 text-center">
                  <Link to="/market-trends" className="text-sm text-blue-600 hover:text-blue-800">
                    View full market report
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSeekerDashboard;