import React from 'react';
import DashboardShell from '../../components/Layout/DashboardShell';

const PlayerStats: React.FC = () => {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Player Statistics</h1>
          <p className="text-gray-400">Individual player performance metrics and analysis</p>
        </div>
        
        <div className="bg-dark-800 rounded-lg p-6 border border-white/10">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Player Statistics Coming Soon</h3>
            <p className="text-gray-400">This feature will provide detailed individual player performance metrics, KDA ratios, CS per minute, and other key statistics.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default PlayerStats;
