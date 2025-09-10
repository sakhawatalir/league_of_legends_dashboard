import React from 'react';
import DashboardShell from '../../components/Layout/DashboardShell';
import Link from 'next/link';

const HeatmapsIndex: React.FC = () => {
  const heatmapOptions = [
    { 
      name: 'Vision Control', 
      path: '/heatmaps/vision',
      description: 'Interactive heatmap showing vision control patterns and ward placement strategies',
      icon: '👁️'
    },
    { 
      name: 'Objective Control', 
      path: '/heatmaps/objectives',
      description: 'Visual representation of objective control patterns and timing',
      icon: '⏰'
    },
    { 
      name: 'Team Movement', 
      path: '/heatmaps/movement',
      description: 'Heatmap of team movement patterns and positioning throughout the game',
      icon: '🚶'
    },
    { 
      name: 'Fight Locations', 
      path: '/heatmaps/fights',
      description: 'Analysis of where team fights and skirmishes commonly occur',
      icon: '⚔️'
    },
    { 
      name: 'Ward Placement', 
      path: '/heatmaps/wards',
      description: 'Detailed analysis of optimal ward placement strategies and patterns',
      icon: '🔮'
    },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Heatmap Visualizations</h1>
          <p className="text-gray-400">Interactive heatmaps for strategic analysis and pattern recognition</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heatmapOptions.map((option) => (
            <Link key={option.path} href={option.path}>
              <div className="bg-dark-800 rounded-lg p-6 border border-white/10 hover:border-secondary-500/30 hover:bg-dark-700 transition-all duration-200 cursor-pointer group">
                <div className="text-4xl mb-4">{option.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-secondary-300 transition-colors">
                  {option.name}
                </h3>
                <p className="text-gray-400 text-sm">{option.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
};

export default HeatmapsIndex;
