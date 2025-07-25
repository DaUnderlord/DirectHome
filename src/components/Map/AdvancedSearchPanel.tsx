import React, { useState, useEffect, useRef } from 'react';
import {
  IconSearch,
  IconMapPin,
  IconHistory,
  IconBookmark,
  IconX,
  IconFilter,
  IconStar,
  IconChevronDown,
  IconPlus
} from '@tabler/icons-react';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { debounce } from '../../utils/deviceDetection';

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'location' | 'property' | 'area';
  coordinates?: [number, number];
  description?: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: any;
  createdAt: Date;
  lastUsed: Date;
}

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  filters: any;
  icon: React.ComponentType<any>;
}

interface AdvancedSearchPanelProps {
  onSearch: (query: string, filters?: any) => void;
  onLocationSelect: (location: SearchSuggestion) => void;
  suggestions: SearchSuggestion[];
  savedSearches: SavedSearch[];
  filterPresets: FilterPreset[];
  onSaveSearch: (name: string, query: string, filters: any) => void;
  onDeleteSavedSearch: (id: string) => void;
  onApplyPreset: (preset: FilterPreset) => void;
  className?: string;
}

const AdvancedSearchPanel: React.FC<AdvancedSearchPanelProps> = ({
  onSearch,
  onLocationSelect,
  suggestions,
  savedSearches,
  filterPresets,
  onSaveSearch,
  onDeleteSavedSearch,
  onApplyPreset,
  className = ''
}) => {
  const isMobile = useIsMobile();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const debouncedSearch = debounce((searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  }, 300);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0);
    debouncedSearch(value);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    onLocationSelect(suggestion);
  };

  // Handle saved search selection
  const handleSavedSearchSelect = (savedSearch: SavedSearch) => {
    setQuery(savedSearch.query);
    setShowSavedSearches(false);
    onSearch(savedSearch.query, savedSearch.filters);
  };

  // Handle preset application
  const handlePresetSelect = (preset: FilterPreset) => {
    setShowPresets(false);
    onApplyPreset(preset);
  };

  // Handle save search
  const handleSaveSearch = () => {
    if (saveSearchName.trim() && query.trim()) {
      onSaveSearch(saveSearchName.trim(), query, {});
      setSaveSearchName('');
      setShowSaveDialog(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
      {/* Search Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <IconSearch className="w-5 h-5 text-gray-600" />
          <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-sm' : 'text-base'}`}>
            Advanced Search
          </h3>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <IconMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search locations, properties, or areas..."
              className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isMobile ? 'text-base' : 'text-sm'}`}
              aria-label="Search locations and properties"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <IconX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-gray-50 focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    <IconMapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {suggestion.text}
                      </p>
                      {suggestion.description && (
                        <p className="text-xs text-gray-500 truncate">
                          {suggestion.description}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      suggestion.type === 'location' ? 'bg-blue-100 text-blue-800' :
                      suggestion.type === 'property' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {suggestion.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* Quick Actions */}
      <div className="p-4 space-y-3">
        {/* Filter Presets */}
        <div>
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="flex items-center justify-between w-full text-left"
            aria-expanded={showPresets}
          >
            <div className="flex items-center space-x-2">
              <IconFilter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Quick Filters</span>
            </div>
            <IconChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
          </button>

          {showPresets && (
            <div className="mt-2 grid grid-cols-1 gap-2">
              {filterPresets.map((preset) => {
                const IconComponent = preset.icon;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className="flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                  >
                    <IconComponent className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{preset.name}</p>
                      <p className="text-xs text-gray-500">{preset.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Saved Searches */}
        <div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSavedSearches(!showSavedSearches)}
              className="flex items-center space-x-2"
              aria-expanded={showSavedSearches}
            >
              <IconBookmark className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Saved Searches</span>
              <IconChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSavedSearches ? 'rotate-180' : ''}`} />
            </button>

            {query && (
              <button
                onClick={() => setShowSaveDialog(true)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                aria-label="Save current search"
              >
                <IconPlus className="w-3 h-3" />
                <span>Save</span>
              </button>
            )}
          </div>

          {showSavedSearches && (
            <div className="mt-2 space-y-1">
              {savedSearches.length > 0 ? (
                savedSearches.map((savedSearch) => (
                  <div
                    key={savedSearch.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <button
                      onClick={() => handleSavedSearchSelect(savedSearch)}
                      className="flex-1 text-left"
                    >
                      <p className="text-sm font-medium text-gray-900">{savedSearch.name}</p>
                      <p className="text-xs text-gray-500">{savedSearch.query}</p>
                    </button>
                    <button
                      onClick={() => onDeleteSavedSearch(savedSearch.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      aria-label={`Delete saved search: ${savedSearch.name}`}
                    >
                      <IconX className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 py-2">No saved searches yet</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Save Search</h3>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label htmlFor="search-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Name
                </label>
                <input
                  id="search-name"
                  type="text"
                  value={saveSearchName}
                  onChange={(e) => setSaveSearchName(e.target.value)}
                  placeholder="Enter a name for this search"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Query:</strong> {query}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSearch}
                  disabled={!saveSearchName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchPanel;