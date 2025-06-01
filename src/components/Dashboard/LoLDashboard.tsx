import React, { useState, useMemo, useCallback } from 'react';
import { useGetLeagueDataQuery, useSearchTournamentsLazyQuery } from '../../generated/hooks';
import type { GetLeagueDataQuery } from '../../generated/types';
import type { League } from '../../types/league';
import type { SeriesData } from '../../types/dashboard';
import type { Team } from '../../types/team';
import TeamSelector from './TeamSelector';
import MatchList from './MatchList';
import TeamStats from './TeamStats';
import VisionMap from './VisionMap';
import ChampionStats from './ChampionStats';
import DraftStats from './DraftStats';
import LeagueSelector from './LeagueSelector';
import DashboardFilters from './DashboardFilters';

const LoLDashboard = () => {
  // State management
  const [selectedPatch, setSelectedPatch] = useState<string>('');
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('');
  const [selectedSeries, setSelectedSeries] = useState<string>('');
  const [selectedSeriesType, setSelectedSeriesType] = useState<'ESPORTS' | 'SCRIM' | 'COMPETITIVE'>('ESPORTS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);

  // Separate query for league search
  const [searchTournaments, { data: searchData, loading: searchLoading }] = useSearchTournamentsLazyQuery({
    variables: {
      titleId: "3",
      name: { contains: searchQuery }
    }
  });
  
  // Main data query
  const { loading, error, data } = useGetLeagueDataQuery({
    variables: {
      titleId: "3",
      windowStartTime: "2022-01-01T00:00:00.000+05:30",
      windowEndTime: "2025-05-29T23:59:59.999+05:30",
      seriesType: selectedSeriesType
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });

  // Transform data to League[]
  const leagues = useMemo((): League[] => {
    console.log('Raw tournaments data:', {
      hasData: !!data?.tournaments?.edges,
      edgeCount: data?.tournaments?.edges?.length,
      firstEdge: data?.tournaments?.edges?.[0]
    });
    
    if (!data?.tournaments?.edges) return [];
    
    const transformedLeagues = data.tournaments.edges
      .map(edge => {
        if (!edge?.node) {
          console.log('Missing node in tournament edge');
          return null;
        }
        const node = edge.node;
        console.log('Processing tournament:', {
          id: node.id,
          name: node.name,
          teamCount: node.teams?.length
        });
        
        try {
          return {
            id: node.id,
            name: node.name,
            nameShortened: node.nameShortened || '',
            startDate: node.startDate,
            endDate: node.endDate,
            teams: (node.teams || []).map(team => {
              if (!team) {
                console.log('Null team entry in tournament:', node.id);
                return null;
              }
              return {
                id: team.id,
                name: team.name,
                logoUrl: team.logoUrl
              };
            }).filter((t): t is Team => t !== null)
          };
        } catch (error) {
          console.error('Error transforming tournament:', error, node);
          return null;
        }
      })
      .filter((l): l is League => l !== null);

    console.log('Transformed leagues:', {
      count: transformedLeagues.length,
      totalTeams: transformedLeagues.reduce((sum, league) => sum + league.teams.length, 0),
      leagueSample: transformedLeagues[0]
    });
    
    return transformedLeagues;
  }, [data?.tournaments?.edges]);

  // Transform data to SeriesData[]
  const series = useMemo((): SeriesData[] => {
    console.log('Transforming series data:', {
      hasData: !!data?.allSeries?.edges,
      edgeCount: data?.allSeries?.edges?.length
    });
    
    if (!data?.allSeries?.edges) return [];
    
    return data.allSeries.edges
      .map(edge => {
        if (!edge?.node) {
          console.log('Missing node in edge');
          return null;
        }
        const node = edge.node;
        
        try {
          const transformedSeries = {
            id: node.id,
            format: {
              id: node.format?.id || '',
              name: node.format?.name || ''
            },
            startTimeScheduled: node.startTimeScheduled,
            league: {
              id: node.tournament.id,
              name: node.tournament.name,
              nameShortened: node.tournament.nameShortened || '',
              venueType: node.tournament.venueType,
              startDate: node.tournament.startDate || '',
              endDate: node.tournament.endDate || ''
            },
            teams: node.teams?.map(team => ({
              baseInfo: {
                id: team.baseInfo.id,
                name: team.baseInfo.name,
                logoUrl: team.baseInfo.logoUrl
              },
              scoreAdvantage: team.scoreAdvantage
            })) || [],
            title: {
              id: node.title.id,
              name: node.title.name
            }
          };
          return transformedSeries;
        } catch (error) {
          console.error('Error transforming series:', error, node);
          return null;
        }
      })
      .filter((s): s is SeriesData => s !== null);
  }, [data?.allSeries?.edges]);

  // Get patches data
  const patches = useMemo(() => {
    if (!data?.contentCatalogVersions?.edges) return [];
    
    return data.contentCatalogVersions.edges
      .map(edge => edge.node?.name)
      .filter((name): name is string => name != null)
      .sort((a, b) => {
        const aVersion = a.split('.').map(num => parseInt(num, 10));
        const bVersion = b.split('.').map(num => parseInt(num, 10));
        
        for (let i = 0; i < Math.max(aVersion.length, bVersion.length); i++) {
          const aNum = aVersion[i] || 0;
          const bNum = bVersion[i] || 0;
          if (aNum !== bNum) return bNum - aNum;
        }
        return 0;
      });
  }, [data?.contentCatalogVersions?.edges]);

  // Filter series based on selected league and patch
  const filteredSeries = useMemo(() => {
    console.log('Filtering series with:', {
      totalSeries: series.length,
      selectedLeague,
      selectedPatch,
      selectedLeagueId
    });
    
    return series.filter(s => {
      // Match league
      const matchesLeague = !selectedLeague || 
        s.league.nameShortened === selectedLeague || 
        s.league.name === selectedLeague ||
        (!selectedLeagueId || s.league.id === selectedLeagueId);

      // Match patch
      let matchesSelectedPatch = !selectedPatch;
      if (selectedPatch && data?.contentCatalogVersions?.edges) {
        const seriesDate = new Date(s.startTimeScheduled);
        let patchStartDate: Date | undefined;
        let patchEndDate: Date | undefined;

        // Sort patches by date
        const sortedPatches = data.contentCatalogVersions.edges
          .map(edge => edge?.node)
          .filter((node): node is NonNullable<typeof node> => !!node)
          .sort((a, b) => {
            const dateA = new Date(a.publishedOn);
            const dateB = new Date(b.publishedOn);
            return dateA.getTime() - dateB.getTime();
          });

        const currentPatchIdx = sortedPatches.findIndex(node => node.name === selectedPatch);
        if (currentPatchIdx >= 0) {
          patchStartDate = new Date(sortedPatches[currentPatchIdx].publishedOn);
          if (currentPatchIdx < sortedPatches.length - 1) {
            patchEndDate = new Date(sortedPatches[currentPatchIdx + 1].publishedOn);
          }
          matchesSelectedPatch = seriesDate >= patchStartDate && (!patchEndDate || seriesDate < patchEndDate);
        }
      }

      const matches = matchesLeague && matchesSelectedPatch;
      if (!matches) {
        console.log('Series filtered out:', {
          id: s.id,
          league: s.league.name,
          date: s.startTimeScheduled,
          matchesLeague,
          matchesSelectedPatch
        });
      }
      return matches;
    });
  }, [series, selectedLeague, selectedPatch, selectedLeagueId, data?.contentCatalogVersions?.edges]);

  // Get selected team data
  const selectedTeamData = useMemo(() => {
    if (!selectedTeam) return undefined;
    
    console.log('Looking up team data:', {
      selectedTeam,
      leagueCount: leagues.length,
      teamCounts: leagues.map(l => ({
        leagueName: l.name,
        teamCount: l.teams.length,
        teams: l.teams.map(t => ({ id: t.id, name: t.name }))
      }))
    });
    
    // First try to find team in current leagues
    let teamData = leagues.flatMap(l => l.teams).find(t => t.id === selectedTeam);
    
    // If team not found in current leagues, check series data
    if (!teamData) {
      console.log('Team not found in leagues, checking series data');
      const seriesWithTeam = series.find(s => s.teams?.some(t => t?.baseInfo?.id === selectedTeam));
      
      if (seriesWithTeam) {
        const team = seriesWithTeam.teams?.find(t => t?.baseInfo?.id === selectedTeam)?.baseInfo;
        if (team) {
          console.log('Found team in series:', team);
          teamData = {
            id: team.id,
            name: team.name,
            logoUrl: team.logoUrl
          };
        }
      }
    }
    
    if (!teamData) {
      // Team not found - clear selection and show notification
      console.warn('Could not find team with ID:', selectedTeam, 'in any league or series');
      setSelectedTeam('');
      setNotification({
        message: `Could not find team data. Please try selecting the team again.`,
        type: 'error'
      });
      setTimeout(() => setNotification(null), 3000);
      return undefined;
    }
    
    console.log('Found team data:', teamData);
    return teamData;
  }, [selectedTeam, leagues, series, setSelectedTeam]);

  // Handlers
  const handlePatchChange = useCallback((patch: string) => {
    setSelectedPatch(patch);
  }, []);

  const handleLeagueChange = useCallback((leagueShortName: string) => {
    setSelectedLeague(leagueShortName);
    // Find the matching league ID when a league is selected from dropdown
    const matchingLeague = leagues.find(l => (l.nameShortened || l.name) === leagueShortName);
    setSelectedLeagueId(matchingLeague?.id || '');
  }, [leagues]);

  const handleTeamSelect = useCallback((teamId: string) => {
    console.log('Team selected:', teamId);
    setSelectedTeam(teamId);
    const teamName = leagues.flatMap(l => l.teams).find(t => t.id === teamId)?.name;
    console.log('Found team name:', teamName);
    if (teamName) {
      setNotification({
        message: `Selected: ${teamName}`,
        type: 'success'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  }, [leagues]);

  const handleClearSelection = useCallback(() => {
    setSelectedTeam('');
    setNotification({
      message: 'Team selection cleared',
      type: 'info'
    });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleLeagueIdChange = useCallback((leagueId: string) => {
    setSelectedLeagueId(leagueId);
  }, []);

  const handleSeriesChange = useCallback((seriesId: string) => {
    setSelectedSeries(seriesId);
  }, []);

  const handleSeriesTypeChange = useCallback((type: 'ESPORTS' | 'SCRIM' | 'COMPETITIVE') => {
    setSelectedSeriesType(type);
  }, []);

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
    // Only show suggestions if query is at least 2 characters
    if (query.length >= 2) {
      setShowSuggestions(true);
      // Delay search to avoid too many requests while typing
      const delayDebounceFn = setTimeout(() => {
        searchTournaments({
          variables: {
            titleId: "3",
            name: { contains: query }
          }
        });
      }, 300); // 300ms debounce delay

      // Cleanup timeout on new change
      return () => clearTimeout(delayDebounceFn);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTournaments]);

  // Clear filters function
  const handleClearFilters = useCallback(() => {
    setSelectedPatch('');
    setSelectedLeague('');
    setSelectedLeagueId('');
    setSelectedSeriesType('ESPORTS');
    setSearchQuery('');
    setShowSuggestions(false); // Ensure suggestions are closed when clearing filters
  }, []);

  // Suggestions from search
  const searchSuggestions = useMemo(() => {
    if (!searchData?.tournaments?.edges) return [];
    return searchData.tournaments.edges
      .map(edge => {
        if (!edge?.node) return null;
        const node = edge.node;
        return {
          id: node.id,
          name: node.name,
          nameShortened: node.nameShortened || '',
          teams: (node.teams || []).map(team => ({
            id: team.id,
            name: team.name,
            logoUrl: team.logoUrl
          }))
        };
      })
      .filter((t): t is League => t !== null);
  }, [searchData?.tournaments?.edges]);

  const handleSuggestionSelect = useCallback((league: League) => {
    setSelectedLeague(league.nameShortened || league.name);
    setSelectedLeagueId(league.id);
    setShowSuggestions(false);
    setSearchQuery('');
    setNotification({
      message: `Selected league: ${league.name}`,
      type: 'success'
    });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Effect to trigger search tournaments query when search query changes
  React.useEffect(() => {
    if (searchQuery) {
      const delayDebounceFn = setTimeout(() => {
        searchTournaments();
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, searchTournaments]);

  return (
    <div className="flex flex-col gap-8 p-4">
      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center p-8 text-dark-300">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            <p className="text-dark-300 text-sm">Fetching leagues, series, and statistics</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
          <p className="text-sm">Error loading data. Please try again later.</p>
        </div>
      )}

      {/* Main content */}
      {!loading && !error && (
        <>
          {/* Notification */}
          {notification && (
            <div
              className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-sm ${
                notification.type === 'success'
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                  : notification.type === 'error'
                  ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                  : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
              }`}
            >
              {notification.message}
            </div>
          )}

          {/* Filters */}
          <DashboardFilters
            selectedPatch={selectedPatch}
            selectedLeague={selectedLeague}
            selectedSeriesType={selectedSeriesType}
            onPatchChange={handlePatchChange}
            onLeagueChange={handleLeagueChange}
            onSeriesTypeChange={setSelectedSeriesType}
            leagues={leagues}
            patches={patches}
            searchQuery={searchQuery}
            onSearchQueryChange={handleSearchQueryChange}
            searchLoading={searchLoading}
            suggestions={searchSuggestions}
            showSuggestions={showSuggestions}
            onSuggestionSelect={handleSuggestionSelect}
            onSuggestionsClose={() => setShowSuggestions(false)}
          />

          {/* Team and Series Selectors */}
          {/* <div className="flex flex-col gap-4"> */}
            {/* League and Series Selector */}
            {/* <LeagueSelector
              leagues={leagues}
              series={series}
              selectedLeague={selectedLeagueId}
              onLeagueChange={handleLeagueIdChange}
              selectedSeries={selectedSeries}
              onSeriesChange={setSelectedSeries}
            /> */}

            {/* Team Selector */}
            {/* <TeamSelector
              teams={leagues.flatMap(l => l.teams)}
              selectedTeam={selectedTeam}
              onSelectTeam={handleTeamSelect}
              selectedPatch={selectedPatch}
              patches={patches}
              onPatchChange={handlePatchChange}
            /> */}
          {/* </div> */}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Match List */}
            <div className="lg:col-span-2">
              <MatchList
                matches={filteredSeries}
                selectedTeam={selectedTeam}
                onTeamSelect={handleTeamSelect}
              />
            </div>

            {/* Team Stats */}
            <div className="flex flex-col gap-4">
              <TeamStats team={selectedTeamData} series={filteredSeries} />
              {/* <DraftStats
                titleId="3"
                leagueId={selectedLeagueId}
                onError={(error) => {
                  console.error('DraftStats error:', error);
                  setNotification({
                    message: 'Error loading draft stats',
                    type: 'error'
                  });
                }}
              /> */}
            </div>

            {/* Vision Map */}
            <div>
              <VisionMap
                match={selectedSeries ? filteredSeries.find(s => s.id === selectedSeries) : undefined}
                selectedTeam={selectedTeam}
              />
            </div>

            {/* Champion Stats */}
            <div className="lg:col-span-2">
              {/* <ChampionStats
                titleId="3"
                leagueId={selectedLeagueId}
              /> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoLDashboard;