import { Team } from './team';
import { League } from './league';
import { TournamentVenueType } from '../generated/types';

export interface EdgeNode<T> {
  node: T;
}

export interface Edge<T> {
  edges: EdgeNode<T>[];
}

export interface BaseGameInfo {
  id: string;
  patchVersion?: string;
}

export interface BaseTeamInfo {
  baseInfo: {
    id: string;
    name: string;
    logoUrl: string;
  };
  scoreAdvantage: number;
}

export interface GameInfo extends BaseGameInfo {
  startTime: string;
  endTime: string;
  state: string;
}

export interface ContentCatalogVersion {
  id: string;
  name: string;
  publishedOn: string;
}

export interface ContentCatalogVersions {
  edges: EdgeNode<ContentCatalogVersion>[];
}

export interface SeriesData {
  id: string;
  format: {
    id: string;
    name: string;
  };
  startTimeScheduled: Date;
  league: {
    id: string;
    name: string;
    nameShortened: string;
    venueType: TournamentVenueType;
    startDate: string;
    endDate: string;
  };
  teams: BaseTeamInfo[];
  title: {
    id: string;
    name: string;
  };
}

export interface DashboardFiltersProps {
  selectedPatch?: string;
  selectedLeague?: string;
  selectedSeriesType: 'ESPORTS' | 'SCRIM' | 'COMPETITIVE';
  onPatchChange: (patch: string) => void;
  onLeagueChange: (league: string) => void;
  onSeriesTypeChange: (type: 'ESPORTS' | 'SCRIM' | 'COMPETITIVE') => void;
  leagues: League[];
  patches: string[];
}

export interface MatchListProps {
  matches: SeriesData[];
  selectedTeam?: string;
  onTeamSelect?: (teamId: string) => void;
}

export interface TeamStatsProps {
  team?: Team;
  series: SeriesData[];
}

export interface VisionMapProps {
  match?: SeriesData;
  selectedTeam?: string;
}

export interface ChampionStats {
  championId: string;
  pickRate: number;
  banRate: number;
  winRate: number;
  firstPickRate: number;
  totalGames: number;
}

export interface TeamStatistics {
  teamId: string;
  teamName: string;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  firstPickRate: number;
  championStats: ChampionStats[];
}
