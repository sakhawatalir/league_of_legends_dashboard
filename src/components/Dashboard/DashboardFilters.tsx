import React, { useMemo, useCallback, useRef } from 'react';
import { League } from '../../types/league';
import { useClickOutside } from '../../hooks/useClickOutside';

// Enhanced type definitions
interface Tournament {
  nameShortened?: string;
  [key: string]: any;
}

interface DashboardFiltersProps {
  selectedPatch: string;
  selectedLeague: string;
  selectedSeriesType: 'ESPORTS' | 'SCRIM' | 'COMPETITIVE';
  onPatchChange: (patch: string) => void;
  onLeagueChange: (league: string) => void;
  onSeriesTypeChange: (seriesType: 'ESPORTS' | 'SCRIM' | 'COMPETITIVE') => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  leagues: League[];
  patches: string[];
  isLoading?: boolean;
  disabled?: boolean;
  searchLoading?: boolean;
  suggestions?: League[];
  showSuggestions?: boolean;
  onSuggestionSelect?: (league: League) => void;
  onSuggestionsClose?: () => void;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  selectedPatch,
  selectedLeague,
  selectedSeriesType,
  onPatchChange,
  onLeagueChange,
  onSeriesTypeChange,
  searchQuery,
  onSearchQueryChange,
  leagues,
  patches,
  isLoading = false,
  disabled = false,
  searchLoading = false,
  suggestions = [],
  showSuggestions = false,
  onSuggestionSelect,
  onSuggestionsClose
}) => {
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside
  useClickOutside(searchRef, () => {
    if (showSuggestions && onSuggestionsClose) {
      onSuggestionsClose();
    }
  });

  // Memoize leagues calculation for performance
  const sortedLeagues = useMemo(() => {
    return [...leagues].sort((a, b) => a.nameShortened.localeCompare(b.nameShortened));
  }, [leagues]);

  // Memoize sorted patches for performance
  const sortedPatches = useMemo(() => {
    return [...patches].sort((a, b) => {
      // Enhanced patch sorting - handles version numbers better
      const aVersion = a.split('.').map(num => parseInt(num, 10));
      const bVersion = b.split('.').map(num => parseInt(num, 10));
      
      for (let i = 0; i < Math.max(aVersion.length, bVersion.length); i++) {
        const aNum = aVersion[i] || 0;
        const bNum = bVersion[i] || 0;
        if (aNum !== bNum) return bNum - aNum; // Descending order (newest first)
      }
      return 0;
    });
  }, [patches]);

  // Memoized event handlers to prevent unnecessary re-renders
  const handlePatchChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onPatchChange(e.target.value);
  }, [onPatchChange]);

  const handleLeagueChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onLeagueChange(e.target.value);
  }, [onLeagueChange]);

  const handleSeriesTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onSeriesTypeChange(e.target.value as 'ESPORTS' | 'SCRIM' | 'COMPETITIVE');
  }, [onSeriesTypeChange]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchQueryChange(e.target.value);
  }, [onSearchQueryChange]);

  // Clear filters function
  const handleClearFilters = useCallback(() => {
    onPatchChange('');
    onLeagueChange('');
    onSeriesTypeChange('ESPORTS');
    onSearchQueryChange('');
  }, [onPatchChange, onLeagueChange, onSeriesTypeChange, onSearchQueryChange]);

  const hasActiveFilters = selectedPatch || selectedLeague || searchQuery;

  return (
    <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl shadow-xl p-6 mb-6 overflow-hidden border border-primary-500/20 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-500/5 opacity-50"></div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="relative z-10">
        {/* Header with title and clear button */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filters
          </h3>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-1 text-xs font-medium text-primary-400 hover:text-primary-300 bg-dark-700/50 hover:bg-dark-700 rounded-full transition-all duration-200 border border-primary-500/20 hover:border-primary-500/40 flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>

        {/* League Search Section */}
        <div className="relative" ref={searchRef}>
          <label htmlFor="search-input" className="text-xs font-medium text-dark-300 mb-3">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="uppercase tracking-wider">Search Leagues</span>
              {searchQuery && (
                <span className="ml-1 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs">
                  {searchQuery}
                </span>
              )}
            </span>
          </label>

          <div className="relative">
            <input
              type="text"
              id="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search leagues..."
              className="w-full px-4 py-3 bg-dark-800/80 rounded-lg border border-indigo-500/20 
                        text-dark-100 text-sm transition-all duration-200
                        hover:border-indigo-500/40 hover:bg-dark-800 focus:border-indigo-500/60 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-dark-800
                        placeholder-dark-400"
            />
            {searchLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute w-full mt-2 bg-dark-800 rounded-lg border border-dark-700 shadow-lg z-50 max-h-[300px] overflow-y-auto custom-scrollbar">
                <div className="py-1">
                  {suggestions.map((league) => (
                    <button
                      key={league.id}
                      onClick={() => onSuggestionSelect?.(league)}
                      className="w-full px-4 py-3 text-left hover:bg-dark-700 flex items-center gap-3 group transition-colors duration-150"
                    >
                      {league.teams[0]?.logoUrl && (
                        <img 
                          src={league.teams[0].logoUrl} 
                          alt="" 
                          className="w-6 h-6 rounded-full object-contain opacity-50 group-hover:opacity-100 transition-opacity"
                        />
                      )}
                      <div>
                        <div className="text-sm text-dark-100 group-hover:text-primary-400">{league.name}</div>
                        {league.nameShortened && (
                          <div className="text-xs text-dark-400">{league.nameShortened}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Patch Filter */}
          <div className="group">
            <label 
              htmlFor="patch-select"
              className="text-xs font-medium text-dark-300 mb-3"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="uppercase tracking-wider">Patch Version</span>
                {selectedPatch && (
                  <span className="ml-1 px-2 py-0.5 bg-primary-500/20 text-primary-300 rounded text-xs">
                    {selectedPatch}
                  </span>
                )}
              </span>
            </label>
            <div className="relative">
              <select
                id="patch-select"
                className="w-full px-4 py-3 bg-dark-800/80 rounded-lg border border-primary-500/20 
                          text-dark-100 text-sm appearance-none cursor-pointer transition-all duration-200
                          hover:border-primary-500/40 hover:bg-dark-800 focus:border-primary-500/60 
                          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-dark-800
                          disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-primary-900/10"
                value={selectedPatch}
                onChange={handlePatchChange}
                disabled={disabled || isLoading}
                aria-label="Select patch version"
              >
                <option value="" className="text-dark-400">
                  {isLoading ? 'Loading patches...' : 'All Patches'}
                </option>
                {sortedPatches.map((patch: string) => (
                  <option key={patch} value={patch} className="text-dark-100 bg-dark-800">
                    Patch {patch}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* League Filter */}
          <div className="group">
            <label 
              htmlFor="league-select"
              className="text-xs font-medium text-dark-300 mb-3"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="uppercase tracking-wider">League</span>
                {selectedLeague && (
                  <span className="ml-1 px-2 py-0.5 bg-secondary-500/20 text-secondary-300 rounded text-xs">
                    {selectedLeague}
                  </span>
                )}
              </span>
            </label>
            <div className="relative">
              <select
                id="league-select"
                className="w-full px-4 py-3 bg-dark-800/80 rounded-lg border border-secondary-500/20 
                          text-dark-100 text-sm appearance-none cursor-pointer transition-all duration-200
                          hover:border-secondary-500/40 hover:bg-dark-800 focus:border-secondary-500/60 
                          focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:bg-dark-800
                          disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-secondary-900/10"
                value={selectedLeague}
                onChange={handleLeagueChange}
                disabled={disabled || isLoading}
                aria-label="Select league"
              >
                <option value="" className="text-dark-400">
                  {isLoading ? 'Loading leagues...' : 'All Leagues'}
                </option>
                {sortedLeagues.map((league) => (
                  <option key={league.nameShortened} value={league.nameShortened} className="text-dark-100 bg-dark-800">
                    {league.nameShortened}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Series Type Filter */}
          <div className="group">
            <label 
              htmlFor="series-type-select"
              className="text-xs font-medium text-dark-300 mb-3"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="uppercase tracking-wider">Series Type</span>
                {selectedSeriesType && (
                  <span className="ml-1 px-2 py-0.5 bg-green-500/20 text-green-300 rounded text-xs">
                    {selectedSeriesType}
                  </span>
                )}
              </span>
            </label>
            <div className="relative">
              <select
                id="series-type-select"
                className="w-full px-4 py-3 bg-dark-800/80 rounded-lg border border-green-500/20 
                          text-dark-100 text-sm appearance-none cursor-pointer transition-all duration-200
                          hover:border-green-500/40 hover:bg-dark-800 focus:border-green-500/60 
                          focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:bg-dark-800
                          disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-green-900/10"
                value={selectedSeriesType}
                onChange={handleSeriesTypeChange}
                disabled={disabled || isLoading}
                aria-label="Select series type"
              >
                <option value="ESPORTS" className="text-dark-400">
                  Esports
                </option>
                <option value="SCRIM" className="text-dark-400">
                  Scrims
                </option>
                <option value="COMPETITIVE" className="text-dark-400">
                  Competitive
                </option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex items-center text-xs gap-2 border-t border-dark-600/20 pt-4">
            <svg className="w-4 h-4 text-dark-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="flex items-center flex-wrap gap-2">
              <span className="text-dark-400">Active filters:</span>
              {selectedPatch && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-dark-800/70 border border-primary-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 inline-block"></span>
                  Patch {selectedPatch}
                </span>
              )}
              {selectedLeague && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-dark-800/70 border border-secondary-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 inline-block"></span>
                  League {selectedLeague}
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-dark-800/70 border border-indigo-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block"></span>
                  Search: {searchQuery}
                </span>
              )}
              {selectedSeriesType && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-dark-800/70 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                  Series {selectedSeriesType}
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardFilters;