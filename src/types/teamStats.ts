import { Team } from './team';

export interface TeamPerformanceStats {
    teamId: string;
    teamName: string;
    totalGames: number;
    wins: number;
    losses: number;
    winRate: number;
    streaks: {
        current: {
            type: 'WIN' | 'LOSS' | 'NONE';
            count: number;
        };
        longest: {
            win: number;
            loss: number;
        };
    };
    objectives: {
        firstBlood: {
            total: number;
            rate: number;
        };
        firstTower: {
            total: number;
            rate: number;
        };
        firstDragon: {
            total: number;
            rate: number;
        };
        firstBaron: {
            total: number;
            rate: number;
        };
        dragonControl: {
            total: number;
            rate: number;
        };
        baronControl: {
            total: number;
            rate: number;
        };
    };
    averages: {
        kills: number;
        deaths: number;
        assists: number;
        kda: number;
        goldPerMinute: number;
        goldDiffAt15: number;
        xpDiffAt15: number;
        csPerMinute: number;
        visionScore: number;
    };
    side: {
        blue: {
            games: number;
            wins: number;
            winRate: number;
        };
        red: {
            games: number;
            wins: number;
            winRate: number;
        };
    };
}

export interface TeamMatchHistory {
    teamId: string;
    matches: Array<{
        matchId: string;
        opponent: Team;
        result: 'WIN' | 'LOSS';
        score: string;
        date: string;
        duration: number;
        stats: {
            kills: number;
            deaths: number;
            assists: number;
            goldEarned: number;
            objectives: {
                towers: number;
                dragons: number;
                barons: number;
            };
        };
    }>;
}

export interface TeamStatsResponse {
  entityId: string;
  entityType: "team";
  entityData: {
    name: string;
    logoUrl: string;
    colors: {
      primary: string;
      secondary: string;
    }
  };
  statistics: {
    teamStatistics: {
      id: string;
      series: {
        __typename?: string;
        count: number;
        kills: {
          sum: number;
          avg: number;
          min: number;
          max: number;
        };
        deaths: {
          sum: number;
          avg: number;
          min: number;
          max: number;
        };
        killAssistsGiven: {
          sum: number;
          avg: number;
          min: number;
          max: number;
        };
        won: Array<{
          value: boolean;
          count: number;
          percentage: number;
          streak: {
            min: number;
            max: number;
            current: number;
          };
        }>;
        firstKill: Array<{
          value: boolean;
          count: number;
          percentage: number;
        }>;
        objectives: Array<{
          type: string;
          completionCount: {
            sum: number;
            avg: number;
            min: number;
            max: number;
          };
        }>;
        game: {
          __typename?: string;
          count: number;
          duration: {
            sum: string;
            min: string;
            max: string;
            avg: string;
          };
          money: {
            sum: number;
            avg: number;
            min: number;
            max: number;
          };
          inventoryValue: {
            sum: number;
            avg: number;
            min: number;
            max: number;
          };
        };
      };
    };
  };
}

export interface TeamStatsData {
  kills: {
    sum: number;
    avg: number;
    min: number;
    max: number;
  };
  deaths: {
    sum: number;
    avg: number;
    min: number;
    max: number;
  };
  assists: {
    sum: number;
    avg: number;
    min: number;
    max: number;
  };
  kda: number;
  goldPerMin: number;
  damagePerMin: number;
  csPerMin: number;
  visionPerMin: number;
  winRate: number;
  currentStreak: {
    type: 'WIN' | 'LOSS';
    count: number;
  };
  objectives: {
    firstBlood: number;
    firstTower: number;
    firstDragon: number;
    firstBaron: number;
    towerKills: number;
    dragonKills: number;
    baronKills: number;
  };
}
