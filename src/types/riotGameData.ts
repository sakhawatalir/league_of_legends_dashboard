// Summary Data Types (End of Game Stats)
export interface RiotGameStats {
  gameId: number;
  platformId: string;
  gameCreation: number;
  gameDuration: number;
  queueId: number;
  mapId: number;
  seasonId: number;
  gameVersion: string;
  gameMode: string;
  gameType: string;
}

export interface RiotPlayerStats {
  participantId: number;
  win: boolean;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  kills: number;
  deaths: number;
  assists: number;
  largestKillingSpree: number;
  largestMultiKill: number;
  killingSprees: number;
  longestTimeSpentLiving: number;
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;
  totalDamageDealt: number;
  magicDamageDealt: number;
  physicalDamageDealt: number;
  trueDamageDealt: number;
  largestCriticalStrike: number;
  totalDamageDealtToChampions: number;
  magicDamageDealtToChampions: number;
  physicalDamageDealtToChampions: number;
  trueDamageDealtToChampions: number;
  totalHeal: number;
  totalUnitsHealed: number;
  damageSelfMitigated: number;
  damageDealtToObjectives: number;
  damageDealtToTurrets: number;
  visionScore: number;
  timeCCingOthers: number;
  totalDamageTaken: number;
  magicalDamageTaken: number;
  physicalDamageTaken: number;
  trueDamageTaken: number;
  goldEarned: number;
  goldSpent: number;
  turretKills: number;
  inhibitorKills: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  neutralMinionsKilledTeamJungle: number;
  neutralMinionsKilledEnemyJungle: number;
  totalTimeCrowdControlDealt: number;
  champLevel: number;
  visionWardsBoughtInGame: number;
  sightWardsBoughtInGame: number;
  wardsPlaced: number;
  wardsKilled: number;
  firstBloodKill: boolean;
  firstBloodAssist: boolean;
  firstTowerKill: boolean;
  firstTowerAssist: boolean;
  firstInhibitorKill: boolean;
  firstInhibitorAssist: boolean;
}

export interface RiotPlayer extends RiotPlayerStats {
  teamId: number;
  spell1Id: number;
  spell2Id: number;
  championId: number;
  role: string;
  lane: string;
}

export interface RiotTeamStats {
  teamId: number;
  win: boolean;
  firstBlood: boolean;
  firstTower: boolean;
  firstInhibitor: boolean;
  firstBaron: boolean;
  firstDragon: boolean;
  firstRiftHerald: boolean;
  towerKills: number;
  inhibitorKills: number;
  baronKills: number;
  dragonKills: number;
  vilemawKills: number;
  riftHeraldKills: number;
  dominionVictoryScore: number;
  bans: Array<{
    championId: number;
    pickTurn: number;
  }>;
}

export interface RiotGameSummary {
  gameId: number;
  participantIdentities: Array<{
    participantId: number;
    player: {
      summonerId: string;
      summonerName: string;
    };
  }>;
  participants: RiotPlayer[];
  teams: RiotTeamStats[];
  gameDuration: number;
  gameCreation: number;
}

// Timeline Data Types
export interface RiotFrameEvent {
  type: string;
  timestamp: number;
  participantId?: number;
  itemId?: number;
  skillSlot?: number;
  levelUpType?: string;
  wardType?: string;
  creatorId?: number;
  position?: {
    x: number;
    y: number;
  };
  killerId?: number;
  victimId?: number;
  assistingParticipantIds?: number[];
  teamId?: number;
  buildingType?: string;
  laneType?: string;
  towerType?: string;
  monsterType?: string;
  monsterSubType?: string;
}

export interface RiotParticipantFrame {
  participantId: number;
  position: {
    x: number;
    y: number;
  };
  currentGold: number;
  totalGold: number;
  level: number;
  xp: number;
  minionsKilled: number;
  jungleMinionsKilled: number;
  dominionScore?: number;
  teamScore?: number;
}

export interface RiotTimelineFrame {
  timestamp: number;
  participantFrames: { [key: string]: RiotParticipantFrame };
  events: RiotFrameEvent[];
}

export interface RiotGameTimeline {
  frameInterval: number;
  frames: RiotTimelineFrame[];
}

// Live Events Data Types
export interface RiotLiveEvent {
  eventType: string;
  timestamp: number;
  data: Record<string, any>;
}

export interface RiotLiveGameData {
  events: RiotLiveEvent[];
}

// Additional Game Data Response Types
export interface GameDataResponse {
  platformId: string;
  gameId: string;
  gameDuration: number;
  participants: Array<{
    teamId: number;
    participantId: number;
    riotIdGameName: string;
    championName: string;
    teamPosition: string;
    kills: number;
    deaths: number;
    assists: number;
    win: boolean;
    firstBloodKill: boolean;
    firstBloodAssist: boolean;
    totalDamageDealtToChampions: number;
    wardsPlaced: number;
    wardsKilled: number;
    visionWardsBoughtInGame: number;
    totalMinionsKilled: number;
    neutralMinionsKilled: number;
    goldEarned: number;
  }>;
  teams: Array<{
    teamId: number;
    win: boolean;
    objectives: {
      champion: { kills: number; first: boolean };
      tower: { kills: number; first: boolean };
      dragon: { kills: number; first: boolean };
      riftHerald: { kills: number; first: boolean };
      baron: { kills: number };
      inhibitor: { kills: number };
    };
    bans: Array<{
      championId: string;
      pickTurn: number;
    }>;
  }>;
}

export interface TimelineResponse {
  frames: Array<{
    timestamp: number;
    events: Array<{
      type: string;
      timestamp: number;
      teamId?: number;
      killerId?: number;
      victimId?: number;
    }>;
  }>;
}
