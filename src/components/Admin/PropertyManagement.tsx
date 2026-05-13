import React, { useState, useEffect } from 'react';
import {
  IconPlus,
  IconUpload,
  IconFilter,
  IconSearch,
  IconCheck,
  IconX,
  IconEye,
  IconEdit,
  IconTrash,
  IconDownload,
  IconFileSpreadsheet
} from '@tabler/icons-react';
import { Property, PropertyStatus, PropertyVerificationStatus } from '../../types/property';
import adminPropertyService from '../../services/adminPropertyService';
import Papa from 'papaparse';

type TabType = 'all' | 'pending' | 'active' | 'rejected';

const PropertyManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [bulkImportFile, setBulkImportFile] = useState<File | null>(null);
  const [bulkImportProgress, setBulkImportProgress] = useState<string>('');

  useEffect(() => {
    fetchProperties();
  }, [activeTab]);

  useEffect(() => {
    filterProperties();
  }, [properties, searchQuery, activeTab]);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      let filters: any = {};
      
      if (activeTab === 'pending') {
        filters.status = 'pending';
      } else if (activeTab === 'active') {
        filters.status = 'active';
      } else if (activeTab === 'rejected') {
        filters.status = 'rejected';
      }

      const result = await adminPropertyService.getAllProperties(filters);
      
      if (result.success && result.properties) {
        setProperties(result.properties);
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
  };

  const handleApprove = async (propertyId: string) => {
    const result = await adminPropertyService.updatePropertyStatus({
      propertyId,
      status: 'active',
      verificationStatus: 'verified',
      adminNotes: 'Approved by admin'
    });

    if (result.success) {
      fetchProperties();
    }
  };

  const handleReject = async (propertyId: string, reason: string) => {
    const result = await adminPropertyService.updatePropertyStatus({
      propertyId,
      status: 'rejected',
      verificationStatus: 'rejected',
      rejectionReason: reason
    });

    if (result.success) {
      fetchProperties();
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    const result = await adminPropertyService.deleteProperty(propertyId);
    
    if (result.success) {
      fetchProperties();
    }
  };

  const handleBulkImport = async () => {
    if (!bulkImportFile) return;

    setBulkImportProgress('Parsing CSV file...');

    Papa.parse(bulkImportFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        setBulkImportProgress(`Processing ${results.data.length} properties...`);
        
        const importResult = await adminPropertyService.bulkImportProperties(results.data);
        
        setBulkImportProgress(
          `Import complete! Success: ${importResult.successCount}, Failed: ${importResult.failureCount}`
        );

        if (importResult.errors.length > 0) {
          console.error('Import errors:', importResult.errors);
        }

        setTimeout(() => {
          setShowBulkImportModal(false);
          setBulkImportFile(null);
          setBulkImportProgress('');
          fetchProperties();
        }, 3000);
      },
      error: (error) => {
        setBulkImportProgress(`Error: ${error.message}`);
      }
    });
  };

  const downloadCSVTemplate = () => {
    const template = `ownerId,title,description,propertyType,listingType,address,city,state,zipCode,country,latitude,longitude,bedrooms,bathrooms,squareFootage,yearBuilt,furnished,petsAllowed,amenities,price,currency,paymentFrequency,securityDeposit,negotiable,availableFrom,minimumStay,maximumStay,smokingAllowed,partiesAllowed,childrenAllowed,additionalRules,images,status,verificationStatus
user-123,Modern 3BR Apartment,Beautiful apartment in VI,apartment,rent,123 Main St,Lagos,Lagos,100001,Nigeria,6.5244,3.3792,3,2,1200,2020,true,false,"WiFi,Parking,Security",500000,NGN,monthly,1000000,true,2024-01-01,1,12,false,false,true,"No loud music after 10pm",https://example.com/image1.jpg,active,verified`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'property_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'all' as TabType, label: 'All Properties', count: properties.length },
    { id: 'pending' as TabType, label: 'Pending Approval', count: properties.filter(p => p.status === 'pending').length },
    { id: 'active' as TabType, label: 'Active', count: properties.filter(p => p.status === 'active').length },
    { id: 'rejected' as TabType, label: 'Rejected', count: properties.filter(p => p.status === 'rejected').length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-600">Review, approve, and manage property listings on the platform.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowBulkImportModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <IconUpload size={20} className="mr-2" />
            Bulk Import
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <IconPlus size={20} className="mr-2" />
            Add Property
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <IconSearch size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties by title, city, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <IconFilter size={20} className="mr-2" />
          Filters
        </button>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No properties found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={property.images[0].url}
                              alt={property.title}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <IconHome size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{property.title}</div>
                          <div className="text-sm text-gray-500">{property.propertyType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.location.city}</div>
                      <div className="text-sm text-gray-500">{property.location.state}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₦{property.pricing.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">{property.pricing.paymentFrequency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        property.status === 'active' ? 'bg-green-100 text-green-800' :
                        property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        property.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        property.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                        property.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        property.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {property.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {property.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(property.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <IconCheck size={18} />
                            </button>
                            <button
                              onClick={() => handleReject(property.id, 'Does not meet requirements')}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <IconX size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedProperty(property)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <IconEye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <IconTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bulk Import Modal */}
      {showBulkImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Bulk Import Properties</h3>
            
            <div className="space-y-4">
              <div>
                <button
                  onClick={downloadCSVTemplate}
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                >
                  <IconDownload size={16} className="mr-1" />
                  Download CSV Template
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setBulkImportFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {bulkImportProgress && (
                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  {bulkImportProgress}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowBulkImportModal(false);
                    setBulkImportFile(null);
                    setBulkImportProgress('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkImport}
                  disabled={!bulkImportFile || !!bulkImportProgress}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;