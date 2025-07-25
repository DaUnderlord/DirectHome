import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  IconMapPin, 
  IconBed, 
  IconBath, 
  IconRuler, 
  IconCalendar, 
  IconCheck,
  IconX,
  IconArrowLeft,
  IconHeart,
  IconHeartFilled,
  IconMessage
} from '@tabler/icons-react';
import { mockDataService } from '../../../services/mockData';
import { Property } from '../../../types/property';
import PropertyInfo from './PropertyInfo';
import PropertyGallery from './PropertyGallery';
import ContactOwner from './ContactOwner';
import ScheduleViewing from './ScheduleViewing';
import SimilarProperties from './SimilarProperties';
import MapView from '../../Map/MapView';
import Container from '../../UI/Container';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('description');
  const [showContactForm, setShowContactForm] = useState<boolean>(false);
  const [showScheduleForm, setShowScheduleForm] = useState<boolean>(false);
  
  // Refs for scrolling to forms
  const contactFormRef = useRef<HTMLDivElement>(null);
  const scheduleFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate API call to fetch property details
    setLoading(true);
    setTimeout(() => {
      const foundProperty = mockDataService.getProperty(id || '');
      setProperty(foundProperty || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, you would call an API to save the favorite status
  };

  const formatPrice = (price: number, currency: string = 'NGN', frequency?: string): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price) + (frequency ? `/${frequency}` : '');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">
            The property you are looking for does not exist or has been removed.
          </p>
          <Link to="/search" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <IconArrowLeft size={16} className="mr-2" />
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Container>
    <div className="py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/search" className="hover:text-blue-600">Properties</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{property.title}</span>
      </div>

      {/* Property Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
          <div className="flex items-center text-gray-600">
            <IconMapPin size={16} className="mr-1" />
            <span>{property.location.address}, {property.location.city}, {property.location.state}</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="text-2xl font-bold text-blue-600">
            {formatPrice(
              property.pricing.price, 
              property.pricing.currency, 
              property.pricing.paymentFrequency
            )}
          </div>
          {property.pricing.negotiable && (
            <span className="text-sm text-gray-500 block text-right">Price negotiable</span>
          )}
        </div>
      </div>

      {/* Property Gallery */}
      <div className="mb-8">
        <PropertyGallery images={property.images} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Property Details */}
        <div className="lg:col-span-2">
          {/* Quick Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto mb-2">
                  <IconBed size={24} />
                </div>
                <div className="text-lg font-semibold">{property.features.bedrooms}</div>
                <div className="text-sm text-gray-500">Bedrooms</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto mb-2">
                  <IconBath size={24} />
                </div>
                <div className="text-lg font-semibold">{property.features.bathrooms}</div>
                <div className="text-sm text-gray-500">Bathrooms</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto mb-2">
                  <IconRuler size={24} />
                </div>
                <div className="text-lg font-semibold">{property.features.squareFootage}</div>
                <div className="text-sm text-gray-500">Sq Ft</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto mb-2">
                  <IconCalendar size={24} />
                </div>
                <div className="text-lg font-semibold">
                  {property.features.yearBuilt || 'N/A'}
                </div>
                <div className="text-sm text-gray-500">Year Built</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'description'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'features'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Features & Amenities
                </button>
                <button
                  onClick={() => setActiveTab('rules')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'rules'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Rules
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'description' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">About this property</h3>
                  <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-4">Location</h3>
                  <p className="text-gray-600 mb-4">
                    {property.location.address}, {property.location.city}, {property.location.state}, {property.location.zipCode}, {property.location.country}
                  </p>
                  
                  <div className="rounded-lg overflow-hidden">
                    <MapView 
                      properties={[property]}
                      center={[
                        property.location.longitude || 3.3792,
                        property.location.latitude || 6.5244
                      ]}
                      height={400}
                      zoom={15}
                      showMarkers={true}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <IconBed size={16} className="text-blue-600" />
                      </div>
                      <span className="text-gray-700">{property.features.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <IconBath size={16} className="text-blue-600" />
                      </div>
                      <span className="text-gray-700">{property.features.bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <IconRuler size={16} className="text-blue-600" />
                      </div>
                      <span className="text-gray-700">{property.features.squareFootage} sq ft</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        {property.features.furnished ? (
                          <IconCheck size={16} className="text-blue-600" />
                        ) : (
                          <IconX size={16} className="text-blue-600" />
                        )}
                      </div>
                      <span className="text-gray-700">
                        {property.features.furnished ? 'Furnished' : 'Not Furnished'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                    {property.features.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <IconCheck size={16} className="text-green-500 mr-2" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'rules' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">House Rules</h3>
                  {property.rules ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full ${property.rules.smoking ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center mr-3`}>
                            {property.rules.smoking ? (
                              <IconCheck size={16} className="text-green-600" />
                            ) : (
                              <IconX size={16} className="text-red-600" />
                            )}
                          </div>
                          <span className="text-gray-700">
                            {property.rules.smoking ? 'Smoking allowed' : 'No smoking'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full ${property.rules.pets ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center mr-3`}>
                            {property.rules.pets ? (
                              <IconCheck size={16} className="text-green-600" />
                            ) : (
                              <IconX size={16} className="text-red-600" />
                            )}
                          </div>
                          <span className="text-gray-700">
                            {property.rules.pets ? 'Pets allowed' : 'No pets'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full ${property.rules.parties ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center mr-3`}>
                            {property.rules.parties ? (
                              <IconCheck size={16} className="text-green-600" />
                            ) : (
                              <IconX size={16} className="text-red-600" />
                            )}
                          </div>
                          <span className="text-gray-700">
                            {property.rules.parties ? 'Parties allowed' : 'No parties'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full ${property.rules.children ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center mr-3`}>
                            {property.rules.children ? (
                              <IconCheck size={16} className="text-green-600" />
                            ) : (
                              <IconX size={16} className="text-red-600" />
                            )}
                          </div>
                          <span className="text-gray-700">
                            {property.rules.children ? 'Children allowed' : 'No children'}
                          </span>
                        </div>
                      </div>

                      {property.rules.additionalRules && property.rules.additionalRules.length > 0 && (
                        <>
                          <h4 className="text-md font-semibold mb-2">Additional Rules</h4>
                          <ul className="list-disc pl-5 text-gray-700">
                            {property.rules.additionalRules.map((rule, index) => (
                              <li key={index}>{rule}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-600">No specific rules have been set for this property.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Similar Properties */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Similar Properties</h3>
            <SimilarProperties 
              currentPropertyId={property.id} 
              propertyType={property.propertyType} 
              city={property.location.city}
            />
          </div>
        </div>

        {/* Right Column - Contact and Actions */}
        <div>
          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  setShowContactForm(true);
                  // Wait for the form to render before scrolling
                  setTimeout(() => {
                    contactFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 100);
                }}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center"
              >
                <IconMessage size={18} className="mr-2" />
                Contact Owner
              </button>
              <button
                onClick={() => {
                  setShowScheduleForm(true);
                  // Wait for the form to render before scrolling
                  setTimeout(() => {
                    scheduleFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 100);
                }}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center justify-center"
              >
                <IconCalendar size={18} className="mr-2" />
                Schedule Viewing
              </button>
              <button
                onClick={toggleFavorite}
                className={`w-full py-3 px-4 ${
                  isFavorite 
                    ? 'bg-red-50 text-red-600 border border-red-200' 
                    : 'bg-gray-50 text-gray-700 border border-gray-200'
                } hover:bg-gray-100 font-medium rounded-lg flex items-center justify-center`}
              >
                {isFavorite ? (
                  <IconHeartFilled size={18} className="mr-2" />
                ) : (
                  <IconHeart size={18} className="mr-2" />
                )}
                {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
              </button>
            </div>
          </div>

          {/* Property Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Property Info</h3>
            <PropertyInfo property={property} />
          </div>

          {/* Contact Form */}
          {showContactForm && (
            <div ref={contactFormRef} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Contact Owner</h3>
                <button 
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <IconX size={18} />
                </button>
              </div>
              <ContactOwner property={property} onClose={() => setShowContactForm(false)} />
            </div>
          )}

          {/* Schedule Viewing Form */}
          {showScheduleForm && (
            <div ref={scheduleFormRef} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Schedule Viewing</h3>
                <button 
                  onClick={() => setShowScheduleForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <IconX size={18} />
                </button>
              </div>
              <ScheduleViewing property={property} onClose={() => setShowScheduleForm(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
    </Container>
  );
};

export default PropertyDetailPage;