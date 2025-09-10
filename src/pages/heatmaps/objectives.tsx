import React from 'react';
import DashboardShell from '../../components/Layout/DashboardShell';

const ObjectiveControlHeatmap: React.FC = () => {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Objective Control Heatmap</h1>
          <p className="text-gray-400">Visual representation of objective control patterns and timing</p>
        </div>
        
        <div className="bg-dark-800 rounded-lg p-6 border border-white/10">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-accent-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Objective Control Heatmap Coming Soon</h3>
            <p className="text-gray-400">This feature will show heatmaps of dragon, baron, and tower control patterns, helping teams understand optimal objective timing and positioning.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default ObjectiveControlHeatmap;
