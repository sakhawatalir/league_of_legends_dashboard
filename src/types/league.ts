export interface LeagueTeam {
  id: string;
  name: string;
  logoUrl: string;
}

export interface League {
  id: string;
  name: string;
  nameShortened: string;
  startDate: string | null;
  endDate: string | null;
  teams: LeagueTeam[];
}
