import React, { useState, useMemo } from 'react';
import type { League } from '../../types/league';
import type { SeriesData } from '../../types/dashboard';

interface LeagueSelectorProps {
  leagues: League[];
  series: SeriesData[];
  selectedLeague?: string;
  onLeagueChange: (leagueId: string) => void;
  selectedSeries?: string;
  onSeriesChange: (seriesId: string) => void;
}

const LeagueSelector: React.FC<LeagueSelectorProps> = ({
  leagues,
  series,
  selectedLeague,
  onLeagueChange,
  selectedSeries,
  onSeriesChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeagues = useMemo(() => {
    return leagues.filter(league => 
      league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      league.nameShortened?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [leagues, searchQuery]);

  const filteredSeries = selectedLeague 
    ? series.filter(s => s.id === selectedLeague)
    : series;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-dark-800/40 p-4 rounded-xl border border-dark-700/50">
      {/* League Selector */}
      <div className="w-full sm:w-64">
        <label 
          htmlFor="league-search"
          className="text-xs font-medium text-dark-300 mb-2 flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="uppercase tracking-wider">League Search</span>
        </label>
        
        {/* Search Input */}
        <div className="relative mb-2">
          <input
            type="text"
            id="league-search"
            placeholder="Search leagues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-dark-800/80 rounded-lg border border-secondary-500/20 
                      text-dark-100 text-sm transition-all duration-200
                      hover:border-secondary-500/40 hover:bg-dark-800 focus:border-secondary-500/60 
                      focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:bg-dark-800
                      placeholder-dark-400"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* League Select */}
        <div className="relative">
          <select
            id="league-select"
            value={selectedLeague || ''}
            onChange={(e) => onLeagueChange(e.target.value)}
            className="w-full bg-dark-800/80 text-dark-100 rounded-lg border border-secondary-500/20 px-4 py-3
                      appearance-none hover:border-secondary-500/40 hover:bg-dark-800 focus:border-secondary-500/60 
                      focus:ring-2 focus:ring-secondary-500/20 focus:outline-none transition-colors text-sm"
          >
            <option value="">All Leagues</option>
            {filteredLeagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.nameShortened || league.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Series Selector */}
      <div className="w-full sm:w-96">
        <label 
          htmlFor="series-select"
          className="text-xs font-medium text-dark-300 mb-2 flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="uppercase tracking-wider">Series</span>
        </label>
        <div className="relative">
          <select
            id="series-select"
            value={selectedSeries || ''}
            onChange={(e) => onSeriesChange(e.target.value)}
            className="w-full bg-dark-800/80 text-dark-100 rounded-lg border border-indigo-500/20 px-4 py-3
                      appearance-none hover:border-indigo-500/40 hover:bg-dark-800 focus:border-indigo-500/60 
                      focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-colors text-sm
                      disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={filteredSeries.length === 0}
          >
            <option value="">Select a Series</option>
            {filteredSeries.map((series) => (
              <option key={series.id} value={series.id}>
                {series.teams.map(team => team.baseInfo.name).join(' vs ')} - {new Date(series.startTimeScheduled).toLocaleDateString()}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueSelector;
