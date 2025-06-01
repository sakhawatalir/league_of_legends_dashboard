import React, { useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useSeriesGames } from '../../hooks/useSeriesGames';
import type { GameData } from '../../hooks/useSeriesGames';
import { isSeriesComplete } from '../../lib/gameData';

interface TeamData {
  name: string | null;
  tag: string | null;
  bans: Array<{ championId: string; pickTurn: number }>;
  picks: Array<{
    champion: string;
    position: string;
    player: string;
  }>;
}

interface ProcessedTeams {
  blue: TeamData;
  red: TeamData;
}

interface GamePlayer {
  teamId: number;
  champion: string;
  position: string;
  name: string;
  teamTag: string | null;
}

interface GameBan {
  teamId: string;
  championId: string;
  position: number;
}

interface ChampionInfo {
  name: string;
  imageUrl: string;
}

interface ChampionCounts {
  bans: number;
  picks: number;
  wins: number;
  firstPicks: number;
}

interface DraftStats {
  blueSideWinRate: number;
  redSideWinRate: number;
  firstPickWinRate: number;
  totalGames: number;
  mostBanned: Array<{
    name: string;
    banRate: number;
    imageUrl: string;
  }>;
  firstPhasePickRate: number;
  secondPhasePickRate: number;
  teams: ProcessedTeams;
}

interface GamePick {
  championId: string;
  isFirstPick: boolean;
  teamId: string;
  isWinner: boolean;
  phase: string;
}

interface GameSide {
  teamId: string;
  side: string;
}

interface ChampionCounts {
  bans: number;
  picks: number;
  wins: number;
  firstPicks: number;
}

interface GameStats {
  blueSideWins: number;
  redSideWins: number;
  firstPickWins: number;
  totalGames: number;
  firstPhasePicks: number;
  secondPhasePicks: number;
  totalPicks: number;
  championStats: Map<string, ChampionCounts>;
}

interface DraftStats {
  blueSideWinRate: number;
  redSideWinRate: number;
  firstPickWinRate: number;
  totalGames: number;
  mostBanned: Array<{
    name: string;
    banRate: number;
    imageUrl: string;
  }>;
  firstPhasePickRate: number;
  secondPhasePickRate: number;
  teams: ProcessedTeams;
}

interface DraftStatsQueryData {
  allSeries: {
    edges: Array<{
      node: {
        id: string;
        teams: Array<{
          baseInfo: {
            id: string;
            name: string;
            logoUrl: string;
          };
          scoreAdvantage: number;
        }>;
        productServiceLevels: Array<{
          productName: string;
          serviceLevel: string;
        }>;
        format: {
          id: string;
          name: string;
          nameShortened: string;
        };
      };
    }>;
  };
  champions: {
    edges: Array<{
      node: {
        id: string;
        name: string;
        imageUrl: string;
      };
    }>;
  };
}

const getDraftStatsQuery = (titleId: string, leagueId?: string) => {
  const queryString = `query GetDraftStats($titleId: ID!${leagueId ? ", $leagueId: ID!" : ""}) {
    allSeries(
      filter: {
        titleId: $titleId,
        ${leagueId ? "tournament: { id: { in: [$leagueId] } }" : ""}
      }
    ) {
      edges {
        node {
          id
          teams {
            baseInfo {
              id
              name
              logoUrl
            }
            scoreAdvantage
          }
          productServiceLevels {
            productName
            serviceLevel
          }
          format {
            id
            name
            nameShortened
          }
        }
      }
    }
    champions: contentCatalogEntities(
      filter: {
        entityType: { in: [CHARACTER] }
      }
    ) {
      edges {
        node {
          id
          name
          imageUrl
        }
      }
    }
  }`;
  return gql(queryString);
}

interface DraftStatsProps {
  titleId: string;
  leagueId: string;
}

function isValidDraftData(game: GameData | null): game is GameData {
  if (!game) {
    console.warn('Game is null');
    return false;
  }
  
  const hasPicks = Array.isArray(game.picks) && game.picks.length > 0;
  const hasBans = Array.isArray(game.bans) && game.bans.length > 0;
  const hasWinner = !!game.winner;

  console.log('Validating game data:', {
    gameId: game.gameId,
    hasPicks,
    hasBans,
    hasWinner
  });

  return hasPicks && hasBans && hasWinner;
}

const DraftStats: React.FC<DraftStatsProps> = ({ titleId, leagueId }) => {
  const { data: queryData, loading: queryLoading, error: queryError } = useQuery<DraftStatsQueryData>(
    getDraftStatsQuery(titleId, leagueId),
    {
      skip: !titleId,
      variables: {
        titleId,
        ...(leagueId && { leagueId })
      },
      context: { endpoint: 'central' }
    }
  );

  console.log('DraftStats query data:', {
    titleId,
    leagueId,
    hasSeries: !!queryData?.allSeries?.edges?.length,
    hasChampions: !!queryData?.champions?.edges?.length,
    loading: queryLoading,
    error: queryError?.message
  });

  // Process the champions data from the query
  const championsMap = useMemo(() => {
    const map: { [key: string]: ChampionInfo } = {};
    if (!queryData?.champions?.edges) return map;

    queryData.champions.edges.forEach(edge => {
      if (edge?.node?.id) {
        map[edge.node.id] = {
          name: edge.node.name || '',
          imageUrl: edge.node.imageUrl || ''
        };
      }
    });
    return map;
  }, [queryData?.champions]);

  const currentSeriesId = useMemo(() => {
    if (!queryData?.allSeries?.edges?.length) return null;
    const completeSeries = queryData.allSeries.edges.find(edge => isSeriesComplete(edge.node.productServiceLevels));
    return completeSeries?.node.id || null;
  }, [queryData]);

  const { games: currentSeriesGames, loading: gamesLoading, error: gamesError } = useSeriesGames({
    seriesId: leagueId || '',
    apiKey: process.env.NEXT_PUBLIC_GRID_API_KEY || ''
  });

  const allGamesData = useMemo(() => {
    if (!currentSeriesGames) {
      console.log('No games available');
      return [];
    }

    return currentSeriesGames
      .flat()
      .filter(game => {
        if (!game) return false;
        const isValid = isValidDraftData(game);
        if (!isValid) {
          console.warn('Invalid game data:', {
            gameId: (game as GameData).gameId,
            hasPicks: !!(game as GameData).picks?.length,
            hasBans: !!(game as GameData).bans?.length,
            hasWinner: !!(game as GameData).winner
          });
        }
        return isValid;
      }) as GameData[];
  }, [queryData]);

  // Calculate draft stats
  const draftStats = useMemo(() => {
    console.log('Calculating draft stats with games:', allGamesData.length);
    if (!allGamesData.length) return null;

    const stats: GameStats = {
      blueSideWins: 0,
      redSideWins: 0,
      firstPickWins: 0,
      totalGames: allGamesData.length,
      firstPhasePicks: 0,
      secondPhasePicks: 0,
      totalPicks: 0,
      championStats: new Map()
    };

    allGamesData.forEach(game => {
      // Process picks
      game.picks?.forEach(pick => {
        stats.totalPicks++;
        if (pick.phase === 'PHASE_1') {
          stats.firstPhasePicks++;
        } else if (pick.phase === 'PHASE_2') {
          stats.secondPhasePicks++;
        }

        const championStats = stats.championStats.get(pick.championId) || {
          bans: 0,
          picks: 0,
          wins: 0,
          firstPicks: 0
        };

        championStats.picks++;
        if (pick.isFirstPick) {
          championStats.firstPicks++;
        }
        if (pick.isWinner) {
          championStats.wins++;
        }

        stats.championStats.set(pick.championId, championStats);
      });

      // Process bans
      game.bans?.forEach(ban => {
        const championStats = stats.championStats.get(ban.championId) || {
          bans: 0,
          picks: 0,
          wins: 0,
          firstPicks: 0
        };
        championStats.bans++;
        stats.championStats.set(ban.championId, championStats);
      });

      // Process win rates
      if (game.winner) {
        const winningTeamId = game.winner.id;
        const isFirstPickWin = game.picks?.find(p => p.isFirstPick)?.teamId === winningTeamId;
        if (isFirstPickWin) {
          stats.firstPickWins++;
        }

        if (winningTeamId === '100') {
          stats.blueSideWins++;
        } else if (winningTeamId === '200') {
          stats.redSideWins++;
        }
      }
    });

    return {
      blueSideWinRate: stats.blueSideWins / stats.totalGames,
      redSideWinRate: stats.redSideWins / stats.totalGames,
      firstPickWinRate: stats.firstPickWins / stats.totalGames,
      totalGames: stats.totalGames,
      mostBanned: Array.from(stats.championStats.entries())
        .map(([championId, stats]) => ({
          ...championsMap[championId],
          banRate: stats.bans / allGamesData.length
        }))
        .sort((a, b) => b.banRate - a.banRate)
        .slice(0, 5),
      firstPhasePickRate: stats.firstPhasePicks / stats.totalPicks,
      secondPhasePickRate: stats.secondPhasePicks / stats.totalPicks
    };
  }, [allGamesData, championsMap]);

  if (queryLoading || gamesLoading) {
    return (
      <div className="bg-dark-700/20 rounded-lg border border-accent-yellow/20 overflow-hidden">
        <div className="p-4 border-b border-dark-600/30 bg-gradient-to-r from-dark-800/50 to-dark-700/50 backdrop-blur-sm">
          <h2 className="text-base font-medium flex items-center gap-2">
            <span className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-accent-yellow/20 to-accent-yellow/30 rounded-md shadow-inner">
              <svg className="w-3.5 h-3.5 text-accent-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <span className="bg-gradient-to-r from-accent-yellow to-accent-orange bg-clip-text text-transparent">Loading Draft Statistics...</span>
          </h2>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-2 border-accent-yellow/30 border-t-accent-yellow rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-dark-300">This may take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  if (queryError || gamesError) {
    return (
      <div className="bg-dark-700/20 rounded-lg border border-accent-red/20 overflow-hidden">
        <div className="p-4 border-b border-dark-600/30 bg-gradient-to-r from-dark-800/50 to-dark-700/50 backdrop-blur-sm">
          <h2 className="text-base font-medium flex items-center gap-2">
            <span className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-accent-red/20 to-accent-red/30 rounded-md shadow-inner">
              <svg className="w-3.5 h-3.5 text-accent-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className="text-accent-red">Error Loading Draft Data</span>
          </h2>
        </div>
        <div className="p-4 text-sm text-dark-300">
          {(queryError || gamesError)?.message || 'An unknown error occurred while loading draft data'}
        </div>
      </div>
    );
  }

  if (!allGamesData.length) {
    return (
      <div className="bg-dark-700/20 rounded-lg border border-accent-yellow/20 overflow-hidden">
        <div className="p-4 border-b border-dark-600/30 bg-gradient-to-r from-dark-800/50 to-dark-700/50 backdrop-blur-sm">
          <h2 className="text-base font-medium flex items-center gap-2">
            <span className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-accent-yellow/20 to-accent-yellow/30 rounded-md shadow-inner">
              <svg className="w-3.5 h-3.5 text-accent-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className="bg-gradient-to-r from-accent-yellow to-accent-orange bg-clip-text text-transparent">No Draft Data Available</span>
          </h2>
        </div>
        <div className="p-4 text-sm text-dark-300">
          No games with draft data were found for this tournament. This could be because:
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>The games haven't been played yet</li>
            <li>The draft phase data is still being processed</li>
            <li>Or there was an issue collecting the draft data</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-700/20 rounded-lg border border-accent-yellow/20 overflow-hidden">
      <div className="p-4 border-b border-dark-600/30 bg-gradient-to-r from-dark-800/50 to-dark-700/50 backdrop-blur-sm">
        <h2 className="text-base font-medium flex items-center gap-2">
          <span className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-accent-yellow/20 to-accent-orange/20 rounded-md shadow-inner">
            <svg className="w-3.5 h-3.5 text-accent-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
          <span className="bg-gradient-to-r from-accent-yellow to-accent-orange bg-clip-text text-transparent">Draft Statistics</span>
        </h2>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="bg-dark-800/30 rounded-lg p-4 border border-dark-600/40">
            <h3 className="text-xs text-dark-300 uppercase mb-3">Side Selection</h3>
            
            <div className="flex mb-4">
              <div 
                className="h-2 rounded-l-full bg-primary-600" 
                style={{ width: `${draftStats?.blueSideWinRate}%` }}
              ></div>
              <div 
                className="h-2 rounded-r-full bg-accent-red" 
                style={{ width: `${draftStats?.redSideWinRate}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-sm font-medium text-primary-400">{draftStats?.blueSideWinRate}%</div>
                <div className="text-xs text-dark-300 mt-1">Blue Side Win</div>
              </div>
              <div>
                <div className="text-sm font-medium text-accent-red">{draftStats?.redSideWinRate}%</div>
                <div className="text-xs text-dark-300 mt-1">Red Side Win</div>
              </div>
            </div>
          </div>
          
          <div className="bg-dark-800/30 rounded-lg p-4 border border-dark-600/40">
            <h3 className="text-xs text-dark-300 uppercase mb-3">First Pick Advantage</h3>
            
            <div className="relative h-24">
              <div className="absolute inset-x-0 bottom-0 h-full flex justify-center">
                <div className="w-24 h-full relative">
                  <div 
                    className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-accent-green to-accent-green/40" 
                    style={{ height: `${draftStats?.firstPickWinRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-accent-green">{draftStats?.firstPickWinRate}%</div>
                  <div className="text-xs text-dark-300">Win Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-dark-800/30 rounded-lg p-4 border border-dark-600/40 mb-4">
          <h3 className="text-xs text-dark-300 uppercase mb-3">Most Banned Champions</h3>
          
          <div className="grid grid-cols-3 gap-4">
            {draftStats?.mostBanned.map((champ, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent-red/30 mb-2">
                  <img src={champ.imageUrl} alt={champ.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-sm font-medium text-dark-100">{champ.name}</div>
                <div className="text-xs text-accent-red mt-1">Ban Rate: {champ.banRate}%</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-dark-800/30 rounded-lg p-4 border border-dark-600/40">
          <h3 className="text-xs text-dark-300 uppercase mb-3">Pick Phase Distribution</h3>
          
          <div className="flex mb-4">
            <div 
              className="h-2 rounded-l-full bg-accent-blue" 
              style={{ width: `${draftStats?.firstPhasePickRate}%` }}
            ></div>
            <div 
              className="h-2 rounded-r-full bg-accent-purple" 
              style={{ width: `${draftStats?.secondPhasePickRate}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm font-medium text-accent-blue">{draftStats?.firstPhasePickRate}%</div>
              <div className="text-xs text-dark-300 mt-1">First Phase</div>
            </div>
            <div>
              <div className="text-sm font-medium text-accent-purple">{draftStats?.secondPhasePickRate}%</div>
              <div className="text-xs text-dark-300 mt-1">Second Phase</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 border-t border-dark-600/20 bg-dark-800/20 text-center">
        <div className="text-xs text-dark-400">
          Based on <span className="text-accent-yellow font-medium">{draftStats?.totalGames}</span> games
        </div>
      </div>
    </div>
  );
};

export default DraftStats;
