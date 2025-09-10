import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  ChartBarIcon, 
  UsersIcon, 
  MapIcon, 
  HomeIcon, 
  TrophyIcon, 
  FireIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState({
    analytics: true,
    competitors: false,
    heatmaps: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const navigationItems = [
    { name: 'Overview', path: '/', icon: HomeIcon },
    { name: 'Scrims', path: '/scrims', icon: TrophyIcon },
    { name: 'Competitive', path: '/competitive', icon: ChartBarIcon },
    { name: 'Soloq', path: '/soloq', icon: FireIcon },
  ];

  const competitorOptions = [
    { name: 'Team Rankings', path: '/competitors/rankings' },
    { name: 'Player Stats', path: '/competitors/players' },
    { name: 'Head-to-Head', path: '/competitors/h2h' },
    { name: 'Performance Trends', path: '/competitors/trends' },
  ];

  const heatmapOptions = [
    { name: 'Vision Control', path: '/heatmaps/vision' },
    { name: 'Objective Control', path: '/heatmaps/objectives' },
    { name: 'Team Movement', path: '/heatmaps/movement' },
    { name: 'Fight Locations', path: '/heatmaps/fights' },
    { name: 'Ward Placement', path: '/heatmaps/wards' },
  ];

  const isActive = (path: string) => router.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm opacity-90"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-300 to-secondary-400 text-transparent bg-clip-text">
                LoL Analytics
              </h1>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {/* Main Navigation */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-dark-300 uppercase tracking-wider mb-3">
                Navigation
              </h3>
              {navigationItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <span className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer group
                    ${isActive(item.path) 
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' 
                      : 'text-dark-100 hover:bg-white/5 hover:text-white'
                    }
                  `}>
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </span>
                </Link>
              ))}
            </div>

            {/* Analytics Section */}
            <div className="space-y-1 pt-4">
              <button
                onClick={() => toggleSection('analytics')}
                className="flex items-center justify-between w-full px-3 py-2 text-left text-dark-300 hover:text-white transition-colors"
              >
                <h3 className="text-xs font-semibold uppercase tracking-wider">Analytics</h3>
                {expandedSections.analytics ? (
                  <ChevronDownIcon className="w-4 h-4" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4" />
                )}
              </button>
              {expandedSections.analytics && (
                <div className="ml-4 space-y-1">
                  <Link href="/analytics/champions">
                    <span className="block px-3 py-2 text-sm text-dark-200 hover:text-white hover:bg-white/5 rounded transition-colors">
                      Champion Stats
                    </span>
                  </Link>
                  <Link href="/analytics/drafts">
                    <span className="block px-3 py-2 text-sm text-dark-200 hover:text-white hover:bg-white/5 rounded transition-colors">
                      Draft Analysis
                    </span>
                  </Link>
                  <Link href="/analytics/team-stats">
                    <span className="block px-3 py-2 text-sm text-dark-200 hover:text-white hover:bg-white/5 rounded transition-colors">
                      Team Statistics
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* Competitors Section */}
            <div className="space-y-1 pt-4">
              <button
                onClick={() => toggleSection('competitors')}
                className="flex items-center justify-between w-full px-3 py-2 text-left text-dark-300 hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <UsersIcon className="w-4 h-4" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider">Competitors</h3>
                </div>
                {expandedSections.competitors ? (
                  <ChevronDownIcon className="w-4 h-4" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4" />
                )}
              </button>
              {expandedSections.competitors && (
                <div className="ml-4 space-y-1">
                  {competitorOptions.map((option) => (
                    <Link key={option.path} href={option.path}>
                      <span className="block px-3 py-2 text-sm text-dark-200 hover:text-white hover:bg-white/5 rounded transition-colors">
                        {option.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Heatmaps Section */}
            <div className="space-y-1 pt-4">
              <button
                onClick={() => toggleSection('heatmaps')}
                className="flex items-center justify-between w-full px-3 py-2 text-left text-dark-300 hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <MapIcon className="w-4 h-4" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider">Heatmaps</h3>
                </div>
                {expandedSections.heatmaps ? (
                  <ChevronDownIcon className="w-4 h-4" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4" />
                )}
              </button>
              {expandedSections.heatmaps && (
                <div className="ml-4 space-y-1">
                  {heatmapOptions.map((option) => (
                    <Link key={option.path} href={option.path}>
                      <span className="block px-3 py-2 text-sm text-dark-200 hover:text-white hover:bg-white/5 rounded transition-colors">
                        {option.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="text-xs text-dark-400 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                <span className="text-accent-green">Live Data</span>
              </div>
              <p>Powered by Grid.gg</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
