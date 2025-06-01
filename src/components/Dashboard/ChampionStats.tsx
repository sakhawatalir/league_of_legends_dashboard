import React, { useMemo } from 'react';
import { useGetChampionStatsQuery } from '../../generated/hooks';
import { ContentCatalogEntity } from '../../generated/types';

interface ChampionStatsProps {
  titleId: string;
  leagueId?: string;
}

interface ChampionStat {
  id: string;
  name: string;
  imageUrl: string;
  pickRate: number;
  banRate: number;
  winRate: number;
  firstPickRate: number;
  games: number;
}

const ChampionStats: React.FC<ChampionStatsProps> = ({ titleId, leagueId }) => {
  const { data, loading, error } = useGetChampionStatsQuery({
    variables: {
      titleId
    },
    skip: !titleId
  });

  const championStats = useMemo<ChampionStat[]>(() => {
    if (!data?.champions?.edges) return [];

    return data.champions.edges
      .map(edge => edge.node)
      .map((champion): ChampionStat => ({
        id: champion.id,
        name: champion.name,
        imageUrl: champion.imageUrl,
        pickRate: 0,
        banRate: 0,
        winRate: 0,
        firstPickRate: 0,
        games: 0
      }))
      .slice(0, 10);
  }, [data]);

  if (loading) {
    return (
      <div className="bg-dark-700/20 rounded-lg border border-primary-500/20 overflow-hidden">
        <div className="p-4 border-b border-dark-600/30 bg-gradient-to-r from-dark-800/50 to-dark-700/50 backdrop-blur-sm">
          <h2 className="text-base font-medium flex items-center gap-2">
            <span className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 rounded-md shadow-inner">
              <svg className="w-3.5 h-3.5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
            <span className="bg-gradient-to-r from-secondary-300 to-secondary-500 bg-clip-text text-transparent">Champion Statistics</span>
          </h2>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-dark-300">Loading champion statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark-700/20 rounded-lg border border-accent-red/20 overflow-hidden">
        <div className="p-4 border-b border-dark-600/30 bg-gradient-to-r from-dark-800/50 to-dark-700/50 backdrop-blur-sm">
          <h2 className="text-base font-medium flex items-center gap-2">
            <span className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-accent-red/20 to-accent-red/30 rounded-md shadow-inner">
              <svg className="w-3.5 h-3.5 text-accent-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className="text-accent-red">Error Loading Champion Data</span>
          </h2>
        </div>
        <div className="p-4 text-sm text-dark-300">
          {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-700/20 rounded-lg border border-secondary-500/20 overflow-hidden">
      <div className="p-4 border-b border-dark-600/30 bg-gradient-to-r from-dark-800/50 to-dark-700/50 backdrop-blur-sm">
        <h2 className="text-base font-medium flex items-center gap-2">
          <span className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 rounded-md shadow-inner">
            <svg className="w-3.5 h-3.5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </span>
          <span className="bg-gradient-to-r from-secondary-300 to-secondary-500 bg-clip-text text-transparent">Champion Statistics</span>
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-dark-800/40 text-xs uppercase">
              <th className="px-4 py-3 text-left text-dark-200 font-medium">Champion</th>
              <th className="px-4 py-3 text-left text-dark-200 font-medium">Pick %</th>
              <th className="px-4 py-3 text-left text-dark-200 font-medium">Ban %</th>
              <th className="px-4 py-3 text-left text-dark-200 font-medium">Win %</th>
              <th className="px-4 py-3 text-left text-dark-200 font-medium">First Pick %</th>
              <th className="px-4 py-3 text-left text-dark-200 font-medium">Games</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-600/30">
            {championStats.map((champion) => (
              <tr key={champion.id} className="hover:bg-dark-700/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded overflow-hidden bg-dark-600/50">
                      <img src={champion.imageUrl} alt={champion.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-dark-100">{champion.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-dark-600/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 rounded-full" 
                        style={{ width: `${champion.pickRate}%` }}
                      ></div>
                    </div>
                    <span className="text-dark-200">{champion.pickRate}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-dark-600/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent-red rounded-full" 
                        style={{ width: `${champion.banRate}%` }}
                      ></div>
                    </div>
                    <span className="text-dark-200">{champion.banRate}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-dark-600/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent-green rounded-full" 
                        style={{ width: `${champion.winRate}%` }}
                      ></div>
                    </div>
                    <span className="text-dark-200">{champion.winRate}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-dark-600/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent-yellow rounded-full" 
                        style={{ width: `${champion.firstPickRate}%` }}
                      ></div>
                    </div>
                    <span className="text-dark-200">{champion.firstPickRate}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-dark-200">{champion.games}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChampionStats;
