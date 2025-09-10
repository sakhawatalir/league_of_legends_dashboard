import React from 'react';
import DashboardShell from '../../components/Layout/DashboardShell';
import Link from 'next/link';

const CompetitorsIndex: React.FC = () => {
  const competitorOptions = [
    { 
      name: 'Team Rankings', 
      path: '/competitors/rankings',
      description: 'Comprehensive team performance rankings and statistics',
      icon: '🏆'
    },
    { 
      name: 'Player Stats', 
      path: '/competitors/players',
      description: 'Individual player performance metrics and analysis',
      icon: '👤'
    },
    { 
      name: 'Head-to-Head', 
      path: '/competitors/h2h',
      description: 'Direct team and player comparison analysis',
      icon: '⚔️'
    },
    { 
      name: 'Performance Trends', 
      path: '/competitors/trends',
      description: 'Historical performance trends and patterns',
      icon: '📈'
    },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Competitors Analysis</h1>
          <p className="text-gray-400">Comprehensive analysis of teams, players, and performance metrics</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitorOptions.map((option) => (
            <Link key={option.path} href={option.path}>
              <div className="bg-dark-800 rounded-lg p-6 border border-white/10 hover:border-primary-500/30 hover:bg-dark-700 transition-all duration-200 cursor-pointer group">
                <div className="text-4xl mb-4">{option.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors">
                  {option.name}
                </h3>
                <p className="text-gray-400">{option.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
};

export default CompetitorsIndex;
