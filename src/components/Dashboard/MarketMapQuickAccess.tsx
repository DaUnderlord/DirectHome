import React, { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IconMap,
  IconSearch,
  IconClock,
  IconTrendingUp,
  IconMapPin,
  IconArrowRight,
  IconHeart,
} from '@tabler/icons-react';
import type { Property } from '../../types/property';
import type { AreaInsight, SeekerSearch } from '../../services/seekerService';

interface MarketMapQuickAccessProps {
  recentSearches?: SeekerSearch[];
  savedProperties?: Property[];
  trendingAreas?: AreaInsight[];
  listingsLive?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

const formatPrice = (price: number) => {
  if (price >= 1_000_000) return `₦${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `₦${Math.round(price / 1_000)}K`;
  return `₦${price.toLocaleString()}`;
};

const formatTimeAgo = (date: Date) => {
  const diffInHours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

const MarketMapQuickAccess: React.FC<MarketMapQuickAccessProps> = ({
  recentSearches = [],
  savedProperties = [],
  trendingAreas = [],
  listingsLive = false,
  onSearch,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'recent' | 'favorites' | 'trending'>('recent');
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSearch?.(query);
  };

  const tabClass = (tab: typeof activeTab) =>
    `flex-1 px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
      activeTab === tab
        ? 'border-courtyard-700 text-courtyard-700 bg-paper-100'
        : 'border-transparent text-ink-400 hover:text-ink-800'
    }`;

  return (
    <div className={`bg-paper-50 border border-paper-200 overflow-hidden ${className}`}>
      <div className="bg-courtyard-50 px-5 py-4 border-b border-paper-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <IconMap className="w-6 h-6 text-courtyard-700 shrink-0" stroke={1.5} />
            <h3 className="font-display text-lg font-semibold text-ink-950">Quick Map Access</h3>
          </div>
          <Link
            to="/search"
            className="px-4 py-2 min-h-11 bg-courtyard-700 text-paper-50 text-sm font-medium inline-flex items-center gap-2 shrink-0"
          >
            <IconMap className="w-4 h-4" stroke={1.5} />
            Open Map
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-5 py-4 border-b border-paper-200">
        <div className="flex items-center gap-2 mb-3">
          <IconSearch className="w-4 h-4 text-ink-400" stroke={1.5} />
          <span className="text-sm font-medium text-ink-700">Quick Search</span>
        </div>
        <label className="relative block">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400 pointer-events-none" stroke={1.5} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search areas, property types, prices…"
            className="w-full min-h-12 pl-10 pr-12 text-base bg-paper-50 border border-paper-300 text-ink-950 focus:ring-2 focus:ring-courtyard-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-ink-500 hover:text-courtyard-700"
            aria-label="Search"
          >
            <IconArrowRight className="w-4 h-4" />
          </button>
        </label>
      </form>

      <div className="flex border-b border-paper-200">
        <button type="button" onClick={() => setActiveTab('recent')} className={tabClass('recent')}>
          <span className="inline-flex items-center justify-center gap-2">
            <IconClock className="w-4 h-4" /> Recent
          </span>
        </button>
        <button type="button" onClick={() => setActiveTab('favorites')} className={tabClass('favorites')}>
          <span className="inline-flex items-center justify-center gap-2">
            <IconHeart className="w-4 h-4" /> Saved
          </span>
        </button>
        <button type="button" onClick={() => setActiveTab('trending')} className={tabClass('trending')}>
          <span className="inline-flex items-center justify-center gap-2">
            <IconTrendingUp className="w-4 h-4" /> Trending
          </span>
        </button>
      </div>

      <div className="p-5 min-h-[14rem]">
        {activeTab === 'recent' && (
          recentSearches.length === 0 ? (
            <div className="text-center py-8">
              <IconClock className="w-10 h-10 text-paper-300 mx-auto mb-3" stroke={1.25} />
              <p className="text-ink-600 text-sm">No recent searches yet</p>
              <p className="text-ink-400 text-xs mt-1">Searches you run here will appear in this list.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentSearches.map((search) => (
                <button
                  key={search.id}
                  type="button"
                  onClick={() => onSearch?.(search.query)}
                  className="w-full flex items-center justify-between p-3 border border-paper-200 hover:border-courtyard-500 text-left"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <IconSearch className="w-4 h-4 text-ink-400 shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-ink-950 truncate">{search.query}</span>
                      <span className="block text-xs text-ink-400">
                        {search.resultCount} live listing{search.resultCount === 1 ? '' : 's'} · {formatTimeAgo(search.createdAt)}
                      </span>
                    </span>
                  </span>
                  <IconArrowRight className="w-4 h-4 text-ink-400 shrink-0" />
                </button>
              ))}
            </div>
          )
        )}

        {activeTab === 'favorites' && (
          savedProperties.length === 0 ? (
            <div className="text-center py-8">
              <IconHeart className="w-10 h-10 text-paper-300 mx-auto mb-3" stroke={1.25} />
              <p className="text-ink-600 text-sm">No saved listings yet</p>
              <p className="text-ink-400 text-xs mt-1 max-w-xs mx-auto">
                {listingsLive
                  ? 'Tap the heart on a listing to keep it here.'
                  : 'Saved homes will appear here when marketplace listings go live.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {savedProperties.slice(0, 5).map((property) => (
                <Link
                  key={property.id}
                  to={`/property/${property.id}`}
                  className="flex items-center justify-between p-3 border border-paper-200 hover:border-courtyard-500"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink-950 truncate">{property.title}</span>
                    <span className="block text-xs text-ink-400">
                      {property.location.city || property.location.state} · {formatPrice(property.pricing.price)}
                    </span>
                  </span>
                  <IconArrowRight className="w-4 h-4 text-ink-400 shrink-0" />
                </Link>
              ))}
            </div>
          )
        )}

        {activeTab === 'trending' && (
          trendingAreas.length === 0 ? (
            <div className="text-center py-8">
              <IconTrendingUp className="w-10 h-10 text-paper-300 mx-auto mb-3" stroke={1.25} />
              <p className="text-ink-600 text-sm">No live market movement yet</p>
              <p className="text-ink-400 text-xs mt-1 max-w-xs mx-auto">
                Area rankings will be based on published DirectHome listings, not sample data.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {trendingAreas.slice(0, 5).map((area, index) => (
                <button
                  key={area.name}
                  type="button"
                  onClick={() => onSearch?.(area.name)}
                  className="w-full flex items-center justify-between p-3 border border-paper-200 hover:border-courtyard-500 text-left"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 bg-paper-200 text-xs font-semibold text-ink-800 flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <IconMapPin className="w-4 h-4 text-ink-400" />
                        <span className="text-sm font-medium text-ink-950">{area.name}</span>
                      </span>
                      <span className="block text-xs text-ink-400 mt-0.5">
                        {area.propertyCount} live listing{area.propertyCount === 1 ? '' : 's'} · {formatPrice(area.avgPrice)} avg
                      </span>
                    </span>
                  </span>
                  <IconArrowRight className="w-4 h-4 text-ink-400 shrink-0" />
                </button>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MarketMapQuickAccess;
