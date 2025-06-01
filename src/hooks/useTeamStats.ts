import { useState, useEffect } from 'react';
import { TeamStatsResponse, TeamStatsData } from '../types/teamStats';

export function useTeamStats(teamId: string, timeWindow: string = 'LAST_6_MONTHS'): {
  data: TeamStatsData | null;
  loading: boolean;
  error: any;
} {
  const [data, setData] = useState<TeamStatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchTeamStats() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`https://api.grid.gg/stats-feed-gateway/statistics/team/${teamId}?timeWindow=${timeWindow}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apiData: TeamStatsResponse = await response.json();
        const stats = apiData.statistics.teamStatistics;
        const series = stats.series;
        const winData = series.won.find(w => w.value === true) || { count: 0, percentage: 0, streak: { current: 0 } };
        
        const objectives = {
          firstBlood: series.firstKill?.find(f => f.value)?.percentage || 0,
          firstTower: 0,
          firstDragon: 0,
          firstBaron: 0,
          towerKills: series.objectives?.find(obj => obj.type === 'destroyTower')?.completionCount?.sum || 0,
          dragonKills: series.objectives?.find(obj => obj.type === 'slayDragon')?.completionCount?.sum || 0,
          baronKills: series.objectives?.find(obj => obj.type === 'slayBaron')?.completionCount?.sum || 0
        };

        const durationMatch = series.game?.duration?.avg?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);
        const avgGameDuration = durationMatch ? parseInt(durationMatch[2] || "0") : 0;
        
        const transformedData: TeamStatsData = {
          kills: {
            sum: Number(series.kills?.sum) || 0,
            avg: Number(series.kills?.avg) || 0,
            min: Number(series.kills?.min) || 0,
            max: Number(series.kills?.max) || 0
          },
          deaths: {
            sum: Number(series.deaths?.sum) || 0,
            avg: Number(series.deaths?.avg) || 0,
            min: Number(series.deaths?.min) || 0,
            max: Number(series.deaths?.max) || 0
          },
          assists: {
            sum: Number(series.killAssistsGiven?.sum) || 0,
            avg: Number(series.killAssistsGiven?.avg) || 0,
            min: Number(series.killAssistsGiven?.min) || 0,
            max: Number(series.killAssistsGiven?.max) || 0
          },
          kda: ((Number(series.kills?.avg) || 0) + (Number(series.killAssistsGiven?.avg) || 0)) / Math.max(1, Number(series.deaths?.avg) || 1),
          goldPerMin: series.game?.money?.avg ? Number(series.game.money.avg) / Math.max(1, avgGameDuration) : 0,
          damagePerMin: 0,
          csPerMin: 0,
          visionPerMin: 0,
          winRate: Number(winData?.percentage) || 0,
          currentStreak: {
            type: (Number(winData?.streak?.current) || 0) > 0 ? 'WIN' : 'LOSS',
            count: Math.abs(Number(winData?.streak?.current) || 0)
          },
          objectives
        };

        setData(transformedData);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(new Error(`Failed to fetch team stats: ${errorMessage}`));
      } finally {
        setLoading(false);
      }
    }

    fetchTeamStats();
  }, [teamId, timeWindow]);

  return { data, loading, error };
}
