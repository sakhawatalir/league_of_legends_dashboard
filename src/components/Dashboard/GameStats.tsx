import React from 'react';
import type { GameData } from '../../types/gameData';
import type { RiotGameSummary, RiotPlayer, RiotTeamStats } from '../../types/riotGameData';

interface GameStatsProps {
  data: GameData;
  gameNumber: number;
}

export function GameStats({ data, gameNumber }: GameStatsProps) {
  const summary = data.summary;
  if (!summary) return null;

  const blueTeam = summary.teams.find((team: RiotTeamStats) => team.teamId === 100);
  const redTeam = summary.teams.find((team: RiotTeamStats) => team.teamId === 200);

  const bluePlayers = summary.participants.filter((p: RiotPlayer) => p.teamId === 100);
  const redPlayers = summary.participants.filter((p: RiotPlayer) => p.teamId === 200);

  return (
    <div className="game-stats">
      <h3 className="text-xl font-bold mb-4">Game {gameNumber}</h3>
      
      <div className="grid grid-cols-3 gap-4">
        {/* Team Overview */}
        <TeamOverview team={blueTeam} side="BLUE" />
        <div className="text-center">
          <div className="text-lg font-bold">{summary.gameDuration / 60} minutes</div>
          <div className="text-sm">Game Duration</div>
        </div>
        <TeamOverview team={redTeam} side="RED" />

        {/* Player Stats */}
        <div className="col-span-3 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-lg font-semibold mb-2">Blue Team</h4>
              <PlayerTable players={bluePlayers} />
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Red Team</h4>
              <PlayerTable players={redPlayers} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TeamOverviewProps {
  team?: RiotTeamStats;
  side: 'BLUE' | 'RED';
}

function TeamOverview({ team, side }: TeamOverviewProps) {
  if (!team) return null;

  return (
    <div className={`team-overview ${side.toLowerCase()}`}>
      <div className={`text-lg font-bold ${team.win ? 'text-green-600' : 'text-red-600'}`}>
        {team.win ? 'Victory' : 'Defeat'}
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
        <div>Towers: {team.towerKills}</div>
        <div>Dragons: {team.dragonKills}</div>
        <div>Barons: {team.baronKills}</div>
        <div>Inhibitors: {team.inhibitorKills}</div>
      </div>
    </div>
  );
}

interface PlayerTableProps {
  players: RiotPlayer[];
}

function PlayerTable({ players }: PlayerTableProps) {
  return (
    <table className="min-w-full">
      <thead>
        <tr className="text-xs">
          <th className="text-left">Player</th>
          <th>K/D/A</th>
          <th>CS</th>
          <th>Gold</th>
          <th>Dmg</th>
          <th>Vision</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player) => (
          <tr key={player.participantId} className="text-sm">
            <td className="text-left">Champ {player.championId}</td>
            <td>{player.kills}/{player.deaths}/{player.assists}</td>
            <td>{player.totalMinionsKilled + player.neutralMinionsKilled}</td>
            <td>{Math.round(player.goldEarned / 1000)}k</td>
            <td>{Math.round(player.totalDamageDealtToChampions / 1000)}k</td>
            <td>{player.visionScore}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
