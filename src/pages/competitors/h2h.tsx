import React from 'react';
import DashboardShell from '../../components/Layout/DashboardShell';

const HeadToHead: React.FC = () => {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Head-to-Head Analysis</h1>
          <p className="text-gray-400">Direct team and player comparison analysis</p>
        </div>
        
        <div className="bg-dark-800 rounded-lg p-6 border border-white/10">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-accent-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Head-to-Head Analysis Coming Soon</h3>
            <p className="text-gray-400">This feature will provide detailed comparisons between teams and players, showing historical matchups, performance differences, and strategic advantages.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default HeadToHead;
