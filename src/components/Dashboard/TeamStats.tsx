import React from 'react';
import { TeamStatsProps } from '../../types/dashboard';
import { useTeamStats } from '../../hooks/useTeamStats';

const TeamStats: React.FC<TeamStatsProps> = ({ team, series }) => {
  const { data: statsData, loading: statsLoading } = useTeamStats(team?.id || '');
  
  console.log('TeamStats received:', { 
    team: team ? { id: team.id, name: team.name } : null,
    seriesCount: series?.length,
    seriesSample: series?.[0] ? {
      id: series[0].id,
      teams: series[0].teams?.map(t => ({ id: t?.baseInfo?.id, name: t?.baseInfo?.name }))
    } : null,
    statsData
  });
  
  if (!team) {
    console.log('No team provided');
    return null;
  }

  if (statsLoading) {
    return (
      <div className="bg-dark-700/20 rounded-lg border border-primary-500/20 overflow-hidden">
        <div className="p-4 text-center text-dark-300">
          Loading team statistics...
        </div>
      </div>
    );
  }

  if (!statsData) {
    console.log('No stats data available');
    return (
      <div className="bg-dark-700/20 rounded-lg border border-primary-500/20 overflow-hidden">
        <div className="p-4 text-center text-dark-300">
          No statistics available for this team
        </div>
      </div>
    );
  }

  const totalGames = series?.length || 0;
  const wins = series?.filter(s => {
    const teamEntry = s.teams?.find(t => t?.baseInfo?.id === team.id);
    return teamEntry && (teamEntry.scoreAdvantage || 0) > 0;
  }).length || 0;
  const losses = totalGames - wins;
  const winRate = statsData.winRate;
  
  // Calculate side-based stats from series data
  const blueSideGames = series?.filter(s => s.teams?.[0]?.baseInfo?.id === team.id).length || 0;
  const redSideGames = totalGames - blueSideGames;
  const blueSideWins = series?.filter(s => 
    s.teams?.[0]?.baseInfo?.id === team.id && (s.teams[0]?.scoreAdvantage || 0) > 0
  ).length || 0;
  const redSideWins = wins - blueSideWins;

  // Get current streak from stats
  const currentStreak = statsData.currentStreak.type === 'WIN' 
    ? `W${statsData.currentStreak.count}` 
    : `L${statsData.currentStreak.count}`;

  return (
    <div className="bg-dark-700/20 rounded-lg border border-primary-500/20 overflow-hidden">
      <div className="p-4 border-b border-dark-600/30 bg-gradient-to-r from-dark-800/50 to-dark-700/50 backdrop-blur-sm">
        <h2 className="text-base font-medium flex items-center gap-2 relative">
          <span className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-md shadow-inner">
            <svg className="w-3.5 h-3.5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">Team Performance</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-dark-600/20">
        {/* Win Rate Card */}
        <div className="bg-dark-700/30 p-4 relative overflow-hidden group transition-all duration-300 hover:bg-dark-700/40">
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500/80 to-secondary-500/80 transition-all duration-500" style={{ width: `${winRate}%` }}></div>
          <div className="relative">
            <div className="text-xs font-medium text-dark-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <svg className="w-3 h-3 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Win Rate
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent group-hover:scale-105 transform transition-transform duration-300">{winRate.toFixed(1)}%</span>
              <span className="text-xs text-dark-400 pb-1 flex items-center gap-1">
                <span className="text-accent-green">{wins}W</span>
                <span>-</span>
                <span className="text-accent-red">{losses}L</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Current Streak Card */}
        <div className="bg-dark-700/30 p-4 relative overflow-hidden group transition-all duration-300 hover:bg-dark-700/40">
          <div className={`absolute bottom-0 left-0 h-1 ${currentStreak.startsWith('W') ? 'bg-accent-green' : currentStreak.startsWith('L') ? 'bg-accent-red' : 'bg-dark-500'} transition-all duration-500`} style={{ width: `${Math.min(100, (parseInt(currentStreak.substring(1)) || 0) * 20)}%` }}></div>
          <div className="relative">
            <div className="text-xs font-medium text-dark-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <svg className="w-3 h-3 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              Current Streak
            </div>
            <div className="flex items-end gap-2">
              <span className={`text-2xl font-bold transition-all duration-300 group-hover:scale-105 transform ${currentStreak.startsWith('W') ? 'text-accent-green' : currentStreak.startsWith('L') ? 'text-accent-red' : 'text-dark-100'}`}>
                {currentStreak}
              </span>
              <span className="text-xs text-dark-400 pb-1">
                {totalGames} games total
              </span>
            </div>
          </div>
        </div>

        {/* Side Win Rates Card */}
        <div className="bg-dark-700/30 p-4 relative overflow-hidden group transition-all duration-300 hover:bg-dark-700/40">
          <div className="relative">
            <div className="text-xs font-medium text-dark-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <svg className="w-3 h-3 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Side Performance
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xl font-bold text-primary-400">
                  {blueSideGames > 0 ? ((blueSideWins / blueSideGames) * 100).toFixed(1) : '0'}%
                </div>
                <div className="text-xs text-dark-300">Blue Side ({blueSideWins}W)</div>
              </div>
              <div>
                <div className="text-xl font-bold text-accent-red">
                  {redSideGames > 0 ? ((redSideWins / redSideGames) * 100).toFixed(1) : '0'}%
                </div>
                <div className="text-xs text-dark-300">Red Side ({redSideWins}W)</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Performance Card */}
        <div className="bg-dark-700/30 p-4 relative overflow-hidden group transition-all duration-300 hover:bg-dark-700/40">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="text-xs font-medium text-dark-300 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <svg className="w-3 h-3 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Recent Performance
            </div>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                {getLast5Games(series, team.id).map((result, index) => (
                  <div key={index} className="flex-1 space-y-1">
                    <div 
                      className={`w-full h-2 rounded-full ${
                        result === 'win' ? 'bg-accent-green' : 
                        result === 'loss' ? 'bg-accent-red' : 
                        'bg-dark-500'
                      } group-hover:h-3 transition-all duration-300`}
                    ></div>
                    <div className="text-center text-[10px] text-dark-400">
                      {result === 'win' ? 'W' : result === 'loss' ? 'L' : '-'}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between pt-1 text-[10px] text-dark-400">
                <span>Oldest</span>
                <span>Most Recent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Objective Control Stats */}
        <div className="bg-dark-700/30 p-4 col-span-full relative overflow-hidden">
          <h3 className="text-xs font-medium text-dark-300 uppercase mb-4">Objective Control</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="relative">
              <div className="text-sm text-dark-200">First Blood</div>
              <div className="mt-1 h-2 bg-dark-600/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent-red rounded-full transition-all duration-300"
                  style={{ width: `${statsData.objectives.firstBlood}%` }}
                ></div>
              </div>
              <div className="text-xs text-dark-300 mt-1">{statsData.objectives.firstBlood.toFixed(1)}%</div>
            </div>
            
            <div className="relative">
              <div className="text-sm text-dark-200">Total Towers</div>
              <div className="mt-1 h-2 bg-dark-600/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent-yellow rounded-full transition-all duration-300"
                  style={{ width: `${(statsData.objectives.towerKills / Math.max(totalGames, 1)) * 10}%` }}
                ></div>
              </div>
              <div className="text-xs text-dark-300 mt-1">{statsData.objectives.towerKills}</div>
            </div>
            
            <div className="relative">
              <div className="text-sm text-dark-200">Total Dragons</div>
              <div className="mt-1 h-2 bg-dark-600/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent-blue rounded-full transition-all duration-300"
                  style={{ width: `${(statsData.objectives.dragonKills / Math.max(totalGames, 1)) * 20}%` }}
                ></div>
              </div>
              <div className="text-xs text-dark-300 mt-1">{statsData.objectives.dragonKills}</div>
            </div>
            
            <div className="relative">
              <div className="text-sm text-dark-200">Total Barons</div>
              <div className="mt-1 h-2 bg-dark-600/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent-purple rounded-full transition-all duration-300"
                  style={{ width: `${(statsData.objectives.baronKills / Math.max(totalGames, 1)) * 50}%` }}
                ></div>
              </div>
              <div className="text-xs text-dark-300 mt-1">{statsData.objectives.baronKills}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get results of last 5 games
function getLast5Games(series: any[], teamId: string): ('win' | 'loss' | 'none')[] {
  const results: ('win' | 'loss' | 'none')[] = [];
  
  const sortedSeries = [...series].sort((a, b) => 
    new Date(b.startTimeScheduled).getTime() - new Date(a.startTimeScheduled).getTime()
  );
  
  for (let i = 0; i < 5; i++) {
    if (i >= sortedSeries.length) {
      results.push('none');
      continue;
    }
    
    const match = sortedSeries[i];
    const teamEntry = match.teams?.find((t: any) => t?.baseInfo?.id === teamId);
    if (!teamEntry) {
      results.push('none');
      continue;
    }
    
    results.push((teamEntry.scoreAdvantage || 0) > 0 ? 'win' : 'loss');
  }
  
  return results;
}

export default TeamStats;
