import React from 'react';
import DashboardShell from '../../components/Layout/DashboardShell';

const VisionControlHeatmap: React.FC = () => {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Vision Control Heatmap</h1>
          <p className="text-gray-400">Interactive heatmap showing vision control patterns and ward placement strategies</p>
        </div>
        
        <div className="bg-dark-800 rounded-lg p-6 border border-white/10">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Vision Control Heatmap Coming Soon</h3>
            <p className="text-gray-400">This feature will display interactive heatmaps showing vision control patterns, ward placement strategies, and vision denial areas across different map regions.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default VisionControlHeatmap;
