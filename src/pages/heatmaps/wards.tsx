import React from 'react';
import DashboardShell from '../../components/Layout/DashboardShell';

const WardPlacementHeatmap: React.FC = () => {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Ward Placement Heatmap</h1>
          <p className="text-gray-400">Detailed analysis of optimal ward placement strategies and patterns</p>
        </div>
        
        <div className="bg-dark-800 rounded-lg p-6 border border-white/10">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Ward Placement Heatmap Coming Soon</h3>
            <p className="text-gray-400">This feature will provide detailed heatmaps of optimal ward placement locations, showing where teams commonly place wards for maximum vision coverage and strategic advantage.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default WardPlacementHeatmap;
