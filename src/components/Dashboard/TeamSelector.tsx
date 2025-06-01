import React from 'react';
import { Team } from '../../types/team';

interface TeamSelectorProps {
  teams: Team[];
  selectedTeam: string;
  onSelectTeam: (teamId: string) => void;
  selectedPatch: string;
  patches: string[];
  onPatchChange: (patch: string) => void;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({
  teams,
  selectedTeam,
  onSelectTeam,
  selectedPatch,
  patches,
  onPatchChange
}) => {
  return (
    <div className="mb-8">
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-700 shadow-lg overflow-hidden">
        <h2 className="text-base font-semibold mb-3 text-dark-100">LEC Teams</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => onSelectTeam(team.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all border ${
                selectedTeam === team.id
                  ? 'bg-dark-700 border-primary-500 shadow-md shadow-primary-500/20'
                  : 'bg-dark-800 border-dark-700 hover:border-dark-600 hover:bg-dark-750'
              }`}
            >
              <div className={`w-14 h-14 rounded-lg overflow-hidden bg-dark-900 mb-2 p-1 flex items-center justify-center ${
                selectedTeam === team.id ? 'ring-2 ring-primary-500' : ''
              }`}>
                {team.logoUrl ? (
                  <img
                    src={team.logoUrl}
                    alt={team.name}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center text-dark-400">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <span className={`text-xs font-medium text-center whitespace-nowrap overflow-hidden overflow-ellipsis w-full ${
                selectedTeam === team.id ? 'text-primary-400' : 'text-dark-200'
              }`}>
                {team.name}
              </span>
            </button>
          ))}
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="text-xs text-dark-300 whitespace-nowrap">Select patch/ver:</div>
          <div className="flex flex-wrap gap-2">
            {patches.slice(0, 5).map((patch) => (
              <button
                key={patch}
                onClick={() => onPatchChange(patch)}
                className={`px-3 py-1 rounded-full text-xs ${
                  selectedPatch === patch
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-dark-200'
                }`}
              >
                {patch}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSelector;
