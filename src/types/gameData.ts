import type { RiotGameSummary, RiotGameTimeline, RiotLiveGameData } from './riotGameData';

export interface GameData {
  summary?: RiotGameSummary;
  details?: RiotGameTimeline;
  events?: RiotLiveGameData;
}

export interface PlayerGameStats {
    kills: number;
    deaths: number;
    assists: number;
    wardsPlaced: number;
    wardsKilled: number;
    visionWardsBoughtInGame: number;
    totalDamageDealtToChampions: number;
    goldEarned: number;
    totalMinionsKilled: number;
    neutralMinionsKilled: number;
}

export interface Pick {
    championId: string;
    isFirstPick: boolean;
    teamId: string;
    isWinner: boolean;
    phase: string;
    position: number;
    playerStats: PlayerGameStats;
}

export interface Ban {
    championId: string;
    teamId: string;
    phase: string;
    position: number;
}

export interface TeamStats {
    kills: number;
    assists: number;
    deaths: number;
    totalGold: number;
    towerKills: number;
    dragonKills: number;
    baronKills: number;
    inhibitorKills: number;
    firstBlood: boolean;
    firstTower: boolean;
    firstDragon: boolean;
    firstBaron: boolean;
}

export interface TeamGameData {
    teamId: string;
    side: string;
    stats: TeamStats;
}

export interface Game {
    id: string;
    state: string;
    winner: {
        id: string;
    };
    picks: Pick[];
    bans: Ban[];
    teams: TeamGameData[];
}

export interface SeriesGameData {
    seriesId: string;
    games: Game[];
}
