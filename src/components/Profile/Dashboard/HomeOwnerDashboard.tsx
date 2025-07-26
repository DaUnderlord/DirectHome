import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  IconHome, 
  IconEye, 
  IconMessage, 
  IconCalendar, 
  IconChartBar, 
  IconPlus,
  IconDotsVertical,
  IconStar,
  IconStarFilled,
  IconEdit,
  IconTrash,
  IconClock
} from '@tabler/icons-react';
import { usePropertyStore } from '../../../store/propertyStore';
import { useAppointment } from '../../../hooks/useAppointment';
import { PropertyStatus, PropertyType, ListingType } from '../../../types/property';
import { AppointmentStatus } from '../../../types/appointment';
import { mockDataService } from '../../../services/mockData';

const HomeOwnerDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { fetchProperties, properties } = usePropertyStore();
  const { appointmentStats, upcomingAppointments, todayAppointments } = useAppointment();
  const [inquiries, setInquiries] = useState<number>(0);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [featuredProperties, setFeaturedProperties] = useState<number>(0);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchProperties();
      
      // Get inquiries count from mock data
      const conversations = mockDataService.getConversations('user-1');
      setInquiries(conversations.length);
      
      // Calculate total views
      const viewsCount = properties.reduce((total, property) => {
        return total + (property.analytics?.viewCount || 0);
      }, 0);
      setTotalViews(viewsCount);
      
      // Count featured properties
      const featured = properties.filter(p => p.featured).length;
      setFeaturedProperties(featured);
      
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchProperties, properties]);
  
  // Filter active properties
  const activeProperties = properties.filter(p => p.status === PropertyStatus.ACTIVE);
  
  // Filter pending properties
  const pendingProperties = properties.filter(p => p.status === PropertyStatus.PENDING);
  
  // Calculate property type distribution for chart
  const propertyTypeDistribution = properties.reduce((acc, property) => {
    const type = property.propertyType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<PropertyType, number>);
  
  // Calculate listing type distribution for chart
  const listingTypeDistribution = properties.reduce((acc, property) => {
    const type = property.listingType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<ListingType, number>);
  
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

  // Toggle dropdown menu
  const toggleDropdown = (propertyId: string) => {
    if (showDropdown === propertyId) {
      setShowDropdown(null);
    } else {
      setShowDropdown(propertyId);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Owner Dashboard</h1>
        <p className="text-gray-600">Manage your properties and track inquiries</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <IconHome className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Active Properties</h3>
              <p className="text-2xl font-bold text-blue-600">{activeProperties.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <IconEye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Views</h3>
              <p className="text-2xl font-bold text-green-600">{totalViews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <IconMessage className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Inquiries</h3>
              <p className="text-2xl font-bold text-purple-600">{inquiries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <IconCalendar className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
              <p className="text-2xl font-bold text-amber-600">{appointmentStats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Properties Overview */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Your Properties</h2>
              <Link 
                to="/property/create" 
                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                <IconPlus size={16} className="mr-1" />
                Add Property
              </Link>
            </div>
            <div className="p-4">
              {properties.length === 0 ? (
                <div className="text-center py-8">
                  <IconHome size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">You haven't listed any properties yet.</p>
                  <Link 
                    to="/property/create" 
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    <IconPlus size={16} className="mr-2" />
                    Add Your First Property
                  </Link>
                </div>
              ) : (
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
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Featured
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {properties.slice(0, 5).map((property) => (
                        <tr key={property.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img 
                                  className="h-10 w-10 rounded-md object-cover" 
                                  src={property.images[0]?.url || 'https://via.placeholder.com/100?text=No+Image'} 
                                  alt={property.title} 
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                  <Link to={`/property/${property.id}`} className="hover:text-blue-600">
                                    {property.title}
                                  </Link>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {property.location.city}, {property.location.state}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              property.status === PropertyStatus.ACTIVE 
                                ? 'bg-green-100 text-green-800' 
                                : property.status === PropertyStatus.PENDING 
                                ? 'bg-yellow-100 text-yellow-800'
                                : property.status === PropertyStatus.SOLD || property.status === PropertyStatus.RENTED
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {property.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {property.analytics?.viewCount || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(property.pricing.price)}
                            {property.pricing.paymentFrequency && (
                              <span className="text-xs text-gray-400">/{property.pricing.paymentFrequency}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {property.featured ? (
                              <IconStarFilled size={18} className="text-amber-400" />
                            ) : (
                              <IconStar size={18} className="text-gray-300" />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="relative inline-block text-left">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDropdown(property.id);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <IconDotsVertical size={18} />
                              </button>
                              
                              {showDropdown === property.id && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                  <div className="py-1" role="menu" aria-orientation="vertical">
                                    <Link 
                                      to={`/property/edit/${property.id}`}
                                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <IconEdit size={16} className="mr-2" />
                                      Edit Property
                                    </Link>
                                    <Link 
                                      to={`/property/${property.id}`}
                                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <IconEye size={16} className="mr-2" />
                                      View Property
                                    </Link>
                                    <button 
                                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        // Delete property logic would go here
                                        alert(`Delete property: ${property.id}`);
                                      }}
                                    >
                                      <IconTrash size={16} className="mr-2" />
                                      Delete Property
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {properties.length > 5 && (
                    <div className="px-6 py-3 border-t border-gray-200">
                      <Link to="/properties" className="text-sm text-blue-600 hover:text-blue-800">
                        View all properties
                      </Link>
                    </div>
                  )}
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
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <IconCalendar size={20} className="text-blue-600" />
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
          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  to="/property/create" 
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <IconPlus size={20} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Add Property</span>
                </Link>
                <Link 
                  to="/messages" 
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <IconMessage size={20} className="text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Messages</span>
                </Link>
                <Link 
                  to="/appointments" 
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                    <IconCalendar size={20} className="text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Appointments</span>
                </Link>
                <Link 
                  to="/analytics" 
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <IconChartBar size={20} className="text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Analytics</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Property Status Summary */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Property Status</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Active</span>
                  <span className="text-sm font-medium text-gray-900">{activeProperties.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${properties.length > 0 ? (activeProperties.length / properties.length) * 100 : 0}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Pending</span>
                  <span className="text-sm font-medium text-gray-900">{pendingProperties.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-500 h-2.5 rounded-full" 
                    style={{ width: `${properties.length > 0 ? (pendingProperties.length / properties.length) * 100 : 0}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Featured</span>
                  <span className="text-sm font-medium text-gray-900">{featuredProperties}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${properties.length > 0 ? (featuredProperties / properties.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
            </div>
            <div className="p-4">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No appointments scheduled for today.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center p-2 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-xs text-gray-500">
                          Viewing for {appointment.property?.title || 'Property'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeOwnerDashboard;