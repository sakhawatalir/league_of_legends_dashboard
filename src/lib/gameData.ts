import { 
  RiotGameSummary, 
  RiotGameTimeline, 
  RiotLiveGameData,
  GameDataResponse,
  TimelineResponse
} from '../types/riotGameData';
import JSZip from 'jszip';

// Simple in-memory cache
const cache: Record<string, {
  data: any;
  timestamp: number;
}> = {};

// Replaced by newer implementation below

interface ProcessedGameData {
  gameId: string;
  duration: number;
  teams: {
    [teamId: number]: {
      kills: number;
      deaths: number;
      damageToChampions: number;
      goldEarned: number;
      creepScore: number;
      wardsPlaced: number;
      wardsKilled: number;
      controlWardsPurchased: number;
      turretPlates: number;
      objectives: {
        towers: { kills: number; first: boolean };
        dragons: { kills: number; first: boolean };
        barons: { kills: number };
        inhibitors: { kills: number };
        heralds: { kills: number; first: boolean };
      };
      bans: Array<{ championId: string; pickTurn: number }>;
    };
  };
  players: Array<{
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
  }>;
}

function processGameData(
  gameId: string,
  statsData: GameDataResponse,
  timelineData: TimelineResponse
): ProcessedGameData {
  // Initialize team totals
  const teamTotals: { [teamId: number]: any } = {
    100: {
      kills: 0,
      deaths: 0,
      damageToChampions: 0,
      goldEarned: 0,
      creepScore: 0,
      wardsPlaced: 0,
      wardsKilled: 0,
      controlWardsPurchased: 0,
      turretPlates: 0
    },
    200: {
      kills: 0,
      deaths: 0,
      damageToChampions: 0,
      goldEarned: 0,
      creepScore: 0,
      wardsPlaced: 0,
      wardsKilled: 0,
      controlWardsPurchased: 0,
      turretPlates: 0
    }
  };

  // Process timeline events
  let firstBloodVictimId: number | null = null;
  for (const frame of timelineData.frames) {
    if (frame.timestamp > 850000) break;

    for (const event of frame.events) {
      if (event.type === 'TURRET_PLATE_DESTROYED' && event.teamId) {
        const teamId = event.teamId === 200 ? 100 : 200;
        teamTotals[teamId].turretPlates++;
      }

      if (event.type === 'CHAMPION_KILL' && !firstBloodVictimId && event.killerId && event.killerId !== 0) {
        firstBloodVictimId = event.victimId || null;
      }
    }
  }

  // Process player stats
  statsData.participants.forEach(player => {
    const teamId = player.teamId;
    teamTotals[teamId].kills += player.kills;
    teamTotals[teamId].deaths += player.deaths;
    teamTotals[teamId].damageToChampions += player.totalDamageDealtToChampions;
    teamTotals[teamId].goldEarned += player.goldEarned;
    teamTotals[teamId].creepScore += player.totalMinionsKilled + player.neutralMinionsKilled;
    teamTotals[teamId].wardsPlaced += player.wardsPlaced;
    teamTotals[teamId].wardsKilled += player.wardsKilled;
    teamTotals[teamId].controlWardsPurchased += player.visionWardsBoughtInGame;
  });

  // Process team data
  const teams: ProcessedGameData['teams'] = {};
  statsData.teams.forEach(team => {
    teams[team.teamId] = {
      ...teamTotals[team.teamId],
      objectives: {
        towers: { kills: team.objectives.tower.kills, first: team.objectives.tower.first },
        dragons: { kills: team.objectives.dragon.kills, first: team.objectives.dragon.first },
        barons: { kills: team.objectives.baron.kills },
        inhibitors: { kills: team.objectives.inhibitor.kills },
        heralds: { kills: team.objectives.riftHerald.kills, first: team.objectives.riftHerald.first }
      },
      bans: team.bans
    };
  });

  // Process player data
  const players = statsData.participants.map(player => {
    const [teamTag, playerName] = splitTeamTag(player.riotIdGameName);
    const teamId = player.teamId;
    
    return {
      participantId: player.participantId,
      teamId,
      name: playerName,
      teamTag,
      position: player.teamPosition,
      champion: player.championName,
      stats: {
        kills: player.kills,
        deaths: player.deaths,
        assists: player.assists,
        kda: calculateKDA(player.kills, player.deaths, player.assists),
        killParticipation: calculateKillParticipation(player.kills, player.assists, teamTotals[teamId].kills),
        damagePerMinute: player.totalDamageDealtToChampions / (statsData.gameDuration / 60),
        damageShare: player.totalDamageDealtToChampions / teamTotals[teamId].damageToChampions,
        wardsPerMinute: player.wardsPlaced / (statsData.gameDuration / 60),
        wardsClearedPerMinute: player.wardsKilled / (statsData.gameDuration / 60),
        controlWards: player.visionWardsBoughtInGame,
        cs: player.totalMinionsKilled + player.neutralMinionsKilled,
        csPerMinute: (player.totalMinionsKilled + player.neutralMinionsKilled) / (statsData.gameDuration / 60),
        goldEarned: player.goldEarned,
        goldPerMinute: player.goldEarned / (statsData.gameDuration / 60),
        firstBlood: {
          kill: player.firstBloodKill,
          assist: player.firstBloodAssist,
          victim: firstBloodVictimId === player.participantId
        }
      }
    };
  });

  return {
    gameId,
    duration: statsData.gameDuration,
    teams,
    players
  };
}

function splitTeamTag(name: string): [string | null, string] {
  const spaceIndex = name.indexOf(' ');
  if (spaceIndex !== -1 && spaceIndex < 5) {
    const possibleTag = name.substring(0, spaceIndex);
    if (possibleTag === possibleTag.toUpperCase()) {
      return [possibleTag, name.substring(spaceIndex + 1)];
    }
  }
  return [null, name];
}

function calculateKDA(kills: number, deaths: number, assists: number): number {
  return (kills + assists) / (deaths || 1);
}

function calculateKillParticipation(kills: number, assists: number, teamKills: number): number {
  return teamKills ? (kills + assists) / teamKills : 0;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function checkCache<T>(key: string): Promise<T | null> {
  const cached = cache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
}

function setCache(key: string, data: any): void {
  cache[key] = {
    data,
    timestamp: Date.now()
  };
}

async function handleResponse(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type');
  
  if (contentType?.includes('application/zip')) {
    const arrayBuffer = await response.arrayBuffer();
    const zip = new JSZip();
    const contents = await zip.loadAsync(arrayBuffer);
    
    // Most Riot data files are stored as JSON inside the zip
    const files = Object.keys(contents.files);
    if (files.length === 0) throw new Error('Empty zip file');
    
    const mainFile = contents.files[files[0]];
    const text = await mainFile.async('text');
    return JSON.parse(text);
  }
  
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  
  // For ROFL files, return as blob
  if (contentType?.includes('application/octet-stream')) {
    return response.blob();
  }
  
  throw new Error(`Unsupported content type: ${contentType}`);
}

interface FileTypes {
  events: boolean;
  summary: boolean;
  details: boolean;
  tencent: boolean;
  replay: boolean;
}

interface SeriesStateGame {
  id: string;
  sequenceNumber: number;
}

export interface GameData {
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
}

async function checkAvailableFiles(seriesId: string, apiKey: string): Promise<FileTypes> {
  const cacheKey = `files_${seriesId}`;
  const cached = await checkCache<FileTypes>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`https://api.grid.gg/file-download/list/${seriesId}`, {
    headers: {
      'x-api-key': apiKey,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to check available files: ${response.status}`);
  }

  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

async function getSeriesGames(seriesId: string, apiKey: string): Promise<SeriesStateGame[]> {
  const cacheKey = `games_${seriesId}`;
  const cached = await checkCache<SeriesStateGame[]>(cacheKey);
  if (cached) return cached;

  const response = await fetch('https://api.grid.gg/live-data-feed/series-state/graphql', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query GetSeriesState($seriesId: ID!) {
          seriesState(id: $seriesId) {
            games {
              id
              sequenceNumber
            }
          }
        }
      `,
      variables: { seriesId }
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to get series games: ${response.status}`);
  }

  const data = await response.json();
  const games = data.data.seriesState.games;
  setCache(cacheKey, games);
  return games;
}

export async function fetchGameData(
  seriesId: string, 
  gameNumber: number, 
  apiKey: string
): Promise<GameData | null> {
  const cacheKey = `gameData_${seriesId}_${gameNumber}`;
  const cached = await checkCache<GameData>(cacheKey);
  if (cached) {
    console.log('Returning cached game data:', {
      seriesId,
      gameNumber,
      hasSummary: !!cached.summary,
      hasDetails: !!cached.details,
      hasEvents: !!cached.events,
      hasPicks: !!cached.picks?.length,
      hasBans: !!cached.bans?.length
    });
    return cached;
  }

  try {
    console.log('Checking available files for game:', { seriesId, gameNumber });
    const availableFiles = await checkAvailableFiles(seriesId, apiKey);
    console.log('Available files:', availableFiles);
    
    const gameData: GameData = {};

    // Fetch each available file type
    if (availableFiles.summary) {
      console.log('Fetching summary data...');
      const summaryResponse = await fetch(
        `https://api.grid.gg/file-download/end-state/riot/series/${seriesId}/games/${gameNumber}/summary`,
        { headers: { 'x-api-key': apiKey } }
      );
      if (summaryResponse.ok) {
        gameData.summary = await handleResponse(summaryResponse);
        console.log('Summary data received:', {
          hasGameId: !!gameData.summary?.gameId,
          hasTeams: !!gameData.summary?.teams?.length,
          hasParticipants: !!gameData.summary?.participants?.length
        });
      } else {
        console.warn('Failed to fetch summary:', summaryResponse.status);
      }
    }

    if (availableFiles.details) {
      const detailsResponse = await fetch(
        `https://api.grid.gg/file-download/end-state/riot/series/${seriesId}/games/${gameNumber}/details`,
        { headers: { 'x-api-key': apiKey } }
      );
      if (detailsResponse.ok) {
        gameData.details = await handleResponse(detailsResponse);
      }
    }

    if (availableFiles.events) {
      const eventsResponse = await fetch(
        `https://api.grid.gg/file-download/events/riot/series/${seriesId}/games/${gameNumber}`,
        { headers: { 'x-api-key': apiKey } }
      );
      if (eventsResponse.ok) {
        gameData.events = await handleResponse(eventsResponse);
      }
    }

    if (gameData.summary) {
      // Basic game info
      gameData.gameId = String(gameData.summary.gameId);
      gameData.duration = gameData.summary.gameDuration;
      
      // Process picks and bans
      let pickNumber = 1;
      const picks: GameData['picks'] = [];
      const bans: GameData['bans'] = [];
      
      console.log('Processing game data:', {
        gameId: gameData.gameId,
        participantCount: gameData.summary.participants.length,
        teamCount: gameData.summary.teams.length
      });

      // Process picks
      gameData.summary.participants.forEach(participant => {
        picks.push({
          championId: String(participant.championId),
          teamId: String(participant.teamId),
          isFirstPick: pickNumber === 1,
          isWinner: gameData.summary?.teams.find(t => t.teamId === participant.teamId)?.win || false,
          phase: 'PICK',
          position: pickNumber++
        });
      });

      // Process bans
      gameData.summary.teams.forEach(team => {
        team.bans.forEach((ban, index) => {
          bans.push({
            championId: String(ban.championId),
            teamId: String(team.teamId),
            position: index + 1
          });
        });
      });

      console.log('Processed picks and bans:', {
        picks: picks.length,
        bans: bans.length,
        picksByTeam: picks.reduce((acc, pick) => {
          acc[pick.teamId] = (acc[pick.teamId] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        bansByTeam: bans.reduce((acc, ban) => {
          acc[ban.teamId] = (acc[ban.teamId] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      });

      // Set winner
      const winningTeam = gameData.summary.teams.find(t => t.win);
      if (winningTeam) {
        gameData.winner = {
          id: String(winningTeam.teamId)
        };
      }

      gameData.picks = picks;
      gameData.bans = bans;
    }

    setCache(cacheKey, gameData);
    console.log('Game data processed and cached:', {
      seriesId,
      gameNumber,
      hasSummary: !!gameData.summary,
      hasDetails: !!gameData.details,
      hasEvents: !!gameData.events,
      hasPicks: !!gameData.picks?.length,
      hasBans: !!gameData.bans?.length,
      hasWinner: !!gameData.winner
    });
    return gameData;
  } catch (error) {
    console.error('Error fetching game data:', {
      seriesId,
      gameNumber,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return null;
  }
}

export interface SeriesGameData {
  seriesId: string;
  games: (GameData | null)[];
}

export async function fetchAllSeriesData(
  seriesId: string, 
  apiKey: string
): Promise<SeriesGameData | null> {
  try {
    // Get list of games in the series
    const games = await getSeriesGames(seriesId, apiKey);
    
    // Fetch data for each game
    const gameDataPromises = games.map(game => 
      fetchGameData(seriesId, game.sequenceNumber, apiKey)
    );

    const gamesData = await Promise.all(gameDataPromises);
    
    return {
      seriesId,
      games: gamesData
    };
  } catch (error) {
    console.error('Error fetching series data:', error);
    return null;
  }
}

export function isSeriesComplete(
  productServiceLevels: Array<{ productName: string; serviceLevel: string }>
): boolean {
  return productServiceLevels.some(level => 
    level.productName === 'MATCH_DATA' && level.serviceLevel === 'FULL'
  );
}
