import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  IconCalendar,
  IconHeart,
  IconMessage,
  IconSearch,
  IconMapPin,
  IconHammer,
} from '@tabler/icons-react';
import ModernDashboardLayout from './ModernDashboardLayout';
import InteractiveStatsCard from './InteractiveStatsCard';
import MarketMapQuickAccess from './MarketMapQuickAccess';
import MapInsightsWidget from './MapInsightsWidget';
import { UserRole } from '../../types/auth';
import { Property } from '../../types/property';
import { usePropertyFavorites } from '../../hooks/usePropertyFavorites';
import {
  AreaInsight,
  SeekerSearch,
  buildAreaInsights,
  fetchLiveListings,
  fetchSeekerFavorites,
  fetchSeekerSearches,
  recordSeekerSearch,
} from '../../services/seekerService';

interface HomeSeekerDashboardProps {
  activeRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

const HomeSeekerDashboard: React.FC<HomeSeekerDashboardProps> = ({
  activeRole = UserRole.HOME_SEEKER,
  onRoleChange = () => {},
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { favorites: localFavorites } = usePropertyFavorites();

  const [liveListings, setLiveListings] = useState<Property[]>([]);
  const [dbSavedProperties, setSavedProperties] = useState<Property[]>([]);
  const [recentSearches, setRecentSearches] = useState<SeekerSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const [listings, dbFavorites, searches] = await Promise.all([
        fetchLiveListings(24),
        user?.id ? fetchSeekerFavorites(user.id) : Promise.resolve([] as Property[]),
        user?.id ? fetchSeekerSearches(user.id) : Promise.resolve([] as SeekerSearch[]),
      ]);

      setLiveListings(listings);
      setSavedProperties(dbFavorites);
      setRecentSearches(searches);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const savedProperties = useMemo(() => {
    const merged = [...dbSavedProperties];
    localFavorites.forEach((property) => {
      if (!merged.some((item) => item.id === property.id)) {
        merged.push(property);
      }
    });
    return merged;
  }, [dbSavedProperties, localFavorites]);

  const insights: AreaInsight[] = useMemo(() => buildAreaInsights(liveListings), [liveListings]);
  const listingsLive = liveListings.length > 0;

  const handleSearch = async (rawQuery: string) => {
    const query = rawQuery.trim();
    if (query && user?.id) {
      const recorded = await recordSeekerSearch(user.id, query);
      if (recorded) {
        setRecentSearches((current) => [recorded, ...current.filter((item) => item.query !== query)].slice(0, 8));
      }
    }
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  };

  const stats = [
    { label: 'Saved Properties', value: savedProperties.length, color: 'blue' as const },
    { label: 'Upcoming Viewings', value: 0, color: 'green' as const },
    { label: 'Unread Messages', value: 0, color: 'purple' as const },
  ];

  return (
    <ModernDashboardLayout
      user={user!}
      activeRole={activeRole}
      onRoleChange={onRoleChange}
      title="Find your next home"
      subtitle="Search published DirectHome listings, save homes you like, and book viewings when the marketplace opens."
      stats={stats}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <InteractiveStatsCard
          title="Saved Properties"
          value={savedProperties.length}
          icon={IconHeart}
          color="blue"
          onClick={() => navigate('/favorites')}
          subtitle="From your account"
        />
        <InteractiveStatsCard
          title="Upcoming Viewings"
          value={0}
          icon={IconCalendar}
          color="green"
          onClick={() => navigate('/search')}
          subtitle="Marketplace opening"
        />
        <InteractiveStatsCard
          title="Unread Messages"
          value={0}
          icon={IconMessage}
          color="purple"
          onClick={() => navigate('/search')}
          subtitle="Owner replies"
        />
        <InteractiveStatsCard
          title="Recent Searches"
          value={recentSearches.length}
          icon={IconSearch}
          color="indigo"
          onClick={() => navigate('/search')}
          subtitle="Saved to your account"
        />
      </div>

      <div className="border border-paper-200 bg-paper-50 p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold text-ink-950 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/search" className="btn-courtyard justify-center">
            <IconSearch className="h-5 w-5" stroke={1.5} />
            <span>Find Properties</span>
          </Link>
          <Link to="/favorites" className="btn-outline-ink justify-center">
            <IconHeart className="h-5 w-5" stroke={1.5} />
            <span>Saved Properties</span>
          </Link>
          <Link to="/search" className="btn-outline-ink justify-center">
            <IconMapPin className="h-5 w-5" stroke={1.5} />
            <span>Browse areas</span>
          </Link>
          <Link to="/construction-estimator" className="btn-outline-ink justify-center">
            <IconHammer className="h-5 w-5" stroke={1.5} />
            <span>Build Cost Estimator</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketMapQuickAccess
          recentSearches={recentSearches}
          savedProperties={savedProperties}
          trendingAreas={insights}
          listingsLive={listingsLive}
          onSearch={handleSearch}
        />
        <MapInsightsWidget
          insights={insights}
          loading={isLoading}
          onRefresh={() => void loadDashboard()}
          onSelectArea={(area) => void handleSearch(area)}
        />
      </div>

      <section className="bg-paper-50 border border-paper-200 p-5 sm:p-6">
        <div className="flex justify-between items-center mb-4 gap-3">
          <h3 className="font-display text-xl font-semibold text-ink-950">Saved Properties</h3>
          <Link to="/favorites" className="text-courtyard-700 hover:text-courtyard-600 text-sm font-medium">
            View all
          </Link>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-courtyard-700" />
          </div>
        ) : savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedProperties.slice(0, 3).map((property) => (
              <Link
                key={property.id}
                to={`/property/${property.id}`}
                className="block border border-paper-200 hover:border-courtyard-500 overflow-hidden"
              >
                <div className="relative h-40 bg-paper-200">
                  {property.images?.[0] && (
                    <img src={property.images[0].url} alt={property.title} className="w-full h-full object-cover" />
                  )}
                  <IconHeart className="absolute top-2 right-2 h-5 w-5 text-laterite-500 fill-current" />
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-ink-950 mb-1 truncate">{property.title}</h4>
                  <p className="text-ink-500 text-sm mb-2">
                    {property.location.city || property.location.state}
                  </p>
                  <p className="text-courtyard-700 font-semibold">{formatCurrency(property.pricing.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-paper-100">
            <IconHeart className="h-10 w-10 text-paper-300 mx-auto mb-3" stroke={1.25} />
            <p className="text-ink-600">You haven’t saved any properties yet</p>
            <Link to="/search" className="mt-3 inline-block text-courtyard-700 font-medium">
              Browse listings
            </Link>
          </div>
        )}
      </section>

      <section className="bg-paper-50 border border-paper-200 p-5 sm:p-6">
        <div className="flex justify-between items-center mb-4 gap-3">
          <h3 className="font-display text-xl font-semibold text-ink-950">Upcoming viewings</h3>
        </div>
        <div className="text-center py-10 bg-paper-100">
          <IconCalendar className="h-10 w-10 text-paper-300 mx-auto mb-3" stroke={1.25} />
          <p className="text-ink-600">No viewing requests yet</p>
          <p className="text-ink-400 text-sm mt-1 max-w-md mx-auto">
            When a listing goes live, you can request a tour from the property page. Confirmed times will show here.
          </p>
        </div>
      </section>

      <section className="bg-paper-50 border border-paper-200 p-5 sm:p-6">
        <div className="flex justify-between items-center mb-4 gap-3">
          <h3 className="font-display text-xl font-semibold text-ink-950">Recommended for you</h3>
          <Link to="/search" className="text-courtyard-700 hover:text-courtyard-600 text-sm font-medium">
            View more
          </Link>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-courtyard-700" />
          </div>
        ) : liveListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveListings.slice(0, 3).map((property) => (
              <Link
                key={property.id}
                to={`/property/${property.id}`}
                className="block border border-paper-200 hover:border-courtyard-500 overflow-hidden"
              >
                <div className="relative h-40 bg-paper-200">
                  {property.images?.[0] && (
                    <img src={property.images[0].url} alt={property.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-ink-950 mb-1 truncate">{property.title}</h4>
                  <p className="text-ink-500 text-sm mb-2">
                    {property.location.city || property.location.state}
                  </p>
                  <p className="text-courtyard-700 font-semibold">{formatCurrency(property.pricing.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-paper-100">
            <IconSearch className="h-10 w-10 text-paper-300 mx-auto mb-3" stroke={1.25} />
            <p className="text-ink-600">No published listings yet</p>
            <p className="text-ink-400 text-sm mt-1 max-w-md mx-auto">
              DirectHome is reviewing owner submissions. Recommendations will appear here as homes go live.
            </p>
            <Link to="/construction-estimator" className="mt-3 inline-block text-courtyard-700 font-medium">
              Plan a build while you wait
            </Link>
          </div>
        )}
      </section>
    </ModernDashboardLayout>
  );
};

export default HomeSeekerDashboard;
