import React from 'react';
import type { RiotGameSummary, RiotTeamStats } from '../../types/riotGameData';

interface DetailedGameStatsProps {
  game: RiotGameSummary;
  teamId: string;
}

export const DetailedGameStats: React.FC<DetailedGameStatsProps> = ({ game, teamId }) => {
  const team = game.teams.find(t => t.teamId.toString() === teamId);
  if (!team) return null;

  const teamPlayers = game.participants.filter(p => p.teamId.toString() === teamId);
  
  // Calculate team total stats
  const totalStats = teamPlayers.reduce((acc, player) => ({
    kills: acc.kills + player.kills,
    deaths: acc.deaths + player.deaths,
    assists: acc.assists + player.assists,
    goldEarned: acc.goldEarned + player.goldEarned,
    totalDamageDealt: acc.totalDamageDealt + player.totalDamageDealtToChampions,
    wardsPlaced: acc.wardsPlaced + player.wardsPlaced,
    visionScore: acc.visionScore + player.visionScore,
  }), {
    kills: 0,
    deaths: 0,
    assists: 0,
    goldEarned: 0,
    totalDamageDealt: 0,
    wardsPlaced: 0,
    visionScore: 0,
  });

  return (
    <div className="bg-dark-700/30 rounded-lg border border-dark-600/40 p-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Combat Stats */}
        <div>
          <h4 className="text-xs font-medium text-dark-300 uppercase mb-2">Combat</h4>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-dark-200">K/D/A</div>
              <div className="text-lg font-bold">
                {totalStats.kills}/{totalStats.deaths}/{totalStats.assists}
              </div>
              <div className="text-xs text-dark-400">
                {((totalStats.kills + totalStats.assists) / Math.max(1, totalStats.deaths)).toFixed(2)} KDA Ratio
              </div>
            </div>
            <div>
              <div className="text-sm text-dark-200">Damage</div>
              <div className="text-lg font-bold">
                {Math.round(totalStats.totalDamageDealt / 1000)}k
              </div>
            </div>
          </div>
        </div>

        {/* Economy Stats */}
        <div>
          <h4 className="text-xs font-medium text-dark-300 uppercase mb-2">Economy</h4>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-dark-200">Total Gold</div>
              <div className="text-lg font-bold">
                {Math.round(totalStats.goldEarned / 1000)}k
              </div>
            </div>
            <div>
              <div className="text-sm text-dark-200">Gold/Min</div>
              <div className="text-lg font-bold">
                {Math.round((totalStats.goldEarned / game.gameDuration) * 60)}
              </div>
            </div>
          </div>
        </div>

        {/* Objective Control */}
        <div>
          <h4 className="text-xs font-medium text-dark-300 uppercase mb-2">Objectives</h4>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-dark-200">Towers</div>
              <div className="text-lg font-bold">{team.towerKills}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm text-dark-200">Dragons</div>
                <div className="text-lg font-bold">{team.dragonKills}</div>
              </div>
              <div>
                <div className="text-sm text-dark-200">Barons</div>
                <div className="text-lg font-bold">{team.baronKills}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Control */}
        <div>
          <h4 className="text-xs font-medium text-dark-300 uppercase mb-2">Vision</h4>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-dark-200">Vision Score</div>
              <div className="text-lg font-bold">{totalStats.visionScore}</div>
            </div>
            <div>
              <div className="text-sm text-dark-200">Wards Placed</div>
              <div className="text-lg font-bold">{totalStats.wardsPlaced}</div>
            </div>
          </div>
        </div>
      </div>

      {/* First Objective Indicators */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[
          { label: 'First Blood', achieved: team.firstBlood },
          { label: 'First Tower', achieved: team.firstTower },
          { label: 'First Dragon', achieved: team.firstDragon },
          { label: 'First Baron', achieved: team.firstBaron },
        ].map((objective, index) => (
          <div 
            key={index}
            className={`text-center p-2 rounded ${
              objective.achieved 
                ? 'bg-accent-green/20 text-accent-green' 
                : 'bg-dark-600/20 text-dark-400'
            }`}
          >
            <div className="text-xs">{objective.label}</div>
            <div className="text-sm mt-1">
              {objective.achieved ? 'Yes' : 'No'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailedGameStats;
