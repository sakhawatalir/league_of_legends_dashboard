import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { fetchGameData } from '../lib/gameData';
import type { 
  RiotGameSummary, 
  RiotGameTimeline, 
  RiotLiveGameData 
} from '../types/riotGameData';
import type { GameData as LibGameData } from '../lib/gameData';

export type GameData = SeriesGameData;

interface UseSeriesGamesProps {
  seriesId: string;
  apiKey: string;
}

export interface GameBan {
  championId: string;
  teamId: string;
  position: number;
}

export interface GamePlayer {
  participantId: number;
  teamId: number;
  name: string;
  teamTag: string | null;
  position: string;
  champion: string;
  stats: {
    kills: number;
    deaths: number;
    assists: number;
    kda: number;
    killParticipation: number;
    damagePerMinute: number;
    damageShare: number;
    wardsPerMinute: number;
    wardsClearedPerMinute: number;
    controlWards: number;
    cs: number;
    csPerMinute: number;
    goldEarned: number;
    goldPerMinute: number;
    firstBlood: {
      kill: boolean;
      assist: boolean;
      victim: boolean;
    };
  };
}

export interface SeriesGameData {
  gameId?: string;
  duration?: number;
  summary?: RiotGameSummary;
  details?: RiotGameTimeline;
  events?: RiotLiveGameData;
  picks?: Array<{
    championId: string;
    isFirstPick: boolean;
    teamId: string;
    isWinner: boolean;
    phase: string;
    position: number;
  }>;
  bans?: Array<{
    championId: string;
    teamId: string;
    position: number;
  }>;
  winner?: {
    id: string;
  };
  state?: string;
}

interface SeriesStateGameData {
  id: string;
  sequenceNumber: number;
  started: boolean;
  finished: boolean;
  __typename?: 'GameState';
}

interface SeriesStateResponse {
  seriesState: {
    games: SeriesStateGameData[];
    __typename?: 'SeriesState';
  };
}

const SERIES_STATE_QUERY = gql`
  query GetSeriesState($seriesId: ID!) {
          seriesState(id: $seriesId) {
            games {
              id
              sequenceNumber
              started
              finished
            }
          }
        }
`;

export function useSeriesGames({ seriesId, apiKey }: UseSeriesGamesProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [games, setGames] = useState<SeriesGameData[]>([]);

  // Add loading status tracking
  const [status, setStatus] = useState<'idle' | 'loading' | 'fetching-games' | 'error' | 'complete'>('idle');

  console.log('useSeriesGames hook initialized', { seriesId, apiKey });
  const { data: seriesData, error: queryError, loading: queryLoading } = useQuery<SeriesStateResponse>(SERIES_STATE_QUERY, {
    variables: { seriesId },
    context: { endpoint: 'live' },
    skip: !seriesId
  });

  console.log(seriesData)

  useEffect(() => {
    if (!seriesId || !apiKey) {
      console.log('Missing required data:', { hasSeriesId: !!seriesId, hasApiKey: !!apiKey });
      setStatus('idle');
      setLoading(false);
      return;
    }

    if (queryError) {
      console.error('Series state query error:', queryError);
      setError(queryError);
      setStatus('error');
      setLoading(false);
      return;
    }

    if (queryLoading) {
      console.log('Loading series state...', { seriesId });
      setStatus('loading');
      return;
    }

    const loadGames = async () => {
      try {
        setLoading(true);
        setStatus('fetching-games');
        setError(null);

        console.log('Series data received:', {
          seriesId,
          hasState: !!seriesData?.seriesState,
          games: seriesData?.seriesState?.games?.length,
          rawData: seriesData // Log the raw data
        });

        if (!seriesData?.seriesState?.games?.length) {
          console.log('No games found in series state');
          setGames([]);
          setStatus('complete');
          setLoading(false);
          return;
        }

        // Only fetch completed games
        const completedGames = seriesData.seriesState.games.filter((game: SeriesStateGameData) => {
          const isComplete = game.finished;
          console.log('Game completion check:', {
            id: game.id,
            sequence: game.sequenceNumber,
            started: game.started,
            finished: game.finished
          });
          return isComplete;
        });

        if (completedGames.length === 0) {
          console.log('No completed games found');
          setGames([]);
          setStatus('complete');
          setLoading(false);
          return;
        }

        const gamePromises = completedGames.map((game: SeriesStateGameData) => {
          console.log('Fetching game data:', {
            id: game.id,
            sequence: game.sequenceNumber,
            seriesId
          });
          return fetchGameData(seriesId, game.sequenceNumber, apiKey);
        });

        const gameResults = await Promise.all(gamePromises);
        console.log('Game results received:', gameResults.map((game, index) => ({
          index,
          hasData: !!game,
          id: game?.gameId,
          picks: game?.picks?.length,
          bans: game?.bans?.length,
          summary: !!game?.summary,
          details: !!game?.details,
          events: !!game?.events
        })));
        
        const validGames = gameResults.filter((game): game is NonNullable<typeof game> => game !== null);
        
        console.log('Setting games:', {
          totalResults: gameResults.length,
          validGames: validGames.length
        });
        
        setGames(validGames);
        setStatus('complete');
      } catch (err) {
        console.error('Error loading games:', err);
        setError(err instanceof Error ? err : new Error('Failed to load games'));
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [seriesId, apiKey, seriesData, queryLoading, queryError]);

  return { games, loading, error, status };
}
