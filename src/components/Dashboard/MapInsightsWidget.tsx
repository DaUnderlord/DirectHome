import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IconMap,
  IconHome,
  IconCurrencyNaira,
  IconMapPin,
  IconChartBar,
  IconRefresh,
  IconArrowRight,
} from '@tabler/icons-react';
import type { AreaInsight } from '../../services/seekerService';

interface MapInsightsWidgetProps {
  insights?: AreaInsight[];
  loading?: boolean;
  onRefresh?: () => void;
  onSelectArea?: (area: string) => void;
  className?: string;
}

const formatPrice = (price: number) => {
  if (price >= 1_000_000) return `₦${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `₦${Math.round(price / 1_000)}K`;
  return `₦${price.toLocaleString()}`;
};

const MapInsightsWidget: React.FC<MapInsightsWidgetProps> = ({
  insights = [],
  loading = false,
  onRefresh,
  onSelectArea,
  className = '',
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [updatedAt] = useState(() => new Date());

  const areas = useMemo(() => insights.map((item) => item.name), [insights]);
  const activeArea = selectedArea && areas.includes(selectedArea) ? selectedArea : areas[0];

  if (loading) {
    return (
      <div className={`bg-paper-50 border border-paper-200 p-6 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-paper-200 w-40" />
          <div className="h-16 bg-paper-200" />
          <div className="h-16 bg-paper-200" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-paper-50 border border-paper-200 overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-paper-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <IconMap className="w-6 h-6 text-courtyard-700 shrink-0" stroke={1.5} />
          <h3 className="font-display text-lg font-semibold text-ink-950">Market Insights</h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="p-2 hover:bg-paper-100"
              aria-label="Refresh insights"
            >
              <IconRefresh className="w-4 h-4 text-ink-600" />
            </button>
          )}
          <Link
            to="/search"
            className="px-3 py-2 min-h-11 bg-courtyard-700 text-paper-50 text-sm font-medium"
          >
            View Map
          </Link>
        </div>
      </div>

      {areas.length > 0 && (
        <div className="px-5 py-4 border-b border-paper-200">
          <div className="flex items-center gap-2 mb-3">
            <IconMapPin className="w-4 h-4 text-ink-400" stroke={1.5} />
            <span className="text-sm font-medium text-ink-700">Focus Area</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {areas.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => setSelectedArea(area)}
                className={`px-3 py-1.5 text-sm font-medium border ${
                  activeArea === area
                    ? 'border-courtyard-700 bg-courtyard-50 text-courtyard-800'
                    : 'border-paper-300 text-ink-700 hover:border-courtyard-500'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-5 min-h-[14rem]">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <IconChartBar className="w-10 h-10 text-paper-300 mx-auto mb-3" stroke={1.25} />
            <p className="text-ink-600 text-sm">No market data available</p>
            <p className="text-ink-400 text-xs mt-1 max-w-sm mx-auto">
              Insights are calculated from published DirectHome listings. They will appear here as
              homes go live.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.slice(0, 4).map((insight) => (
              <button
                key={insight.name}
                type="button"
                onClick={() => {
                  setSelectedArea(insight.name);
                  onSelectArea?.(insight.name);
                }}
                className={`w-full text-left p-4 border transition-colors ${
                  insight.name === activeArea
                    ? 'border-courtyard-700 bg-courtyard-50'
                    : 'border-paper-200 hover:border-courtyard-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2 gap-3">
                  <h4 className="font-semibold text-ink-950">{insight.name}</h4>
                  <span className="px-2 py-1 bg-paper-200 text-ink-600 text-xs shrink-0">
                    {insight.propertyCount} listing{insight.propertyCount === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-4 text-ink-700">
                    <span className="inline-flex items-center gap-1">
                      <IconCurrencyNaira className="w-4 h-4 text-ink-400" />
                      {formatPrice(insight.avgPrice)} avg
                    </span>
                    <span className="inline-flex items-center gap-1 capitalize">
                      <IconHome className="w-4 h-4 text-ink-400" />
                      {insight.popularType.replace('_', ' ')}
                    </span>
                  </span>
                  <IconArrowRight className="w-4 h-4 text-ink-400" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-paper-100 border-t border-paper-200 flex items-center justify-between">
        <p className="text-xs text-ink-400">
          Last updated: {updatedAt.toLocaleTimeString()}
        </p>
        <Link to="/search" className="text-xs text-courtyard-700 font-medium inline-flex items-center gap-1">
          Explore listings
          <IconArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default MapInsightsWidget;
