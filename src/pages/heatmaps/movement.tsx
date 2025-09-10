import React from 'react';
import DashboardShell from '../../components/Layout/DashboardShell';

const TeamMovementHeatmap: React.FC = () => {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Team Movement Heatmap</h1>
          <p className="text-gray-400">Heatmap of team movement patterns and positioning throughout the game</p>
        </div>
        
        <div className="bg-dark-800 rounded-lg p-6 border border-white/10">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Team Movement Heatmap Coming Soon</h3>
            <p className="text-gray-400">This feature will visualize team movement patterns across the map, showing common paths, positioning strategies, and how teams navigate between objectives and lanes.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default TeamMovementHeatmap;
