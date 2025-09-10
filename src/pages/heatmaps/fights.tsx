import React from 'react';
import DashboardShell from '../../components/Layout/DashboardShell';

const FightLocationsHeatmap: React.FC = () => {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Fight Locations Heatmap</h1>
          <p className="text-gray-400">Analysis of where team fights and skirmishes commonly occur</p>
        </div>
        
        <div className="bg-dark-800 rounded-lg p-6 border border-white/10">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-accent-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Fight Locations Heatmap Coming Soon</h3>
            <p className="text-gray-400">This feature will show heatmaps of where team fights and skirmishes commonly occur, helping teams understand optimal engagement zones and positioning for different phases of the game.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default FightLocationsHeatmap;
