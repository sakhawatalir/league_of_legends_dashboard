import React from 'react';
import DashboardShell from '../../components/Layout/DashboardShell';

const PerformanceTrends: React.FC = () => {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Performance Trends</h1>
          <p className="text-gray-400">Historical performance trends and patterns</p>
        </div>
        
        <div className="bg-dark-800 rounded-lg p-6 border border-white/10">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-accent-pink/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Performance Trends Coming Soon</h3>
            <p className="text-gray-400">This feature will display historical performance data, showing how teams and players have evolved over time, including win rates, skill improvements, and strategic adaptations.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default PerformanceTrends;
