import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
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

const routes = [
  { name: "Overview", path: "/", icon: HomeIcon },
  { name: "Scrims", path: "/scrims", icon: TrophyIcon },
  { name: "Competitive", path: "/competitive", icon: ChartBarIcon },
  { name: "Soloq", path: "/soloq", icon: FireIcon },
];

const DashboardShell = ({ children }: { children: React.ReactNode }) => {
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
    <div className="flex min-h-screen bg-[#0F172A] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] px-6 py-8 space-y-8 border-r border-white/10">
        <div className="text-xl font-bold text-teal-400">LoL Analytics</div>
        
        {/* Main Navigation */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Navigation
          </h3>
          {routes.map((item) => (
            <Link key={item.path} href={item.path}>
                <span
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer group
                ${
                  isActive(item.path)
                    ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                    : "text-gray-300 hover:bg-[#1F2937] hover:text-white"
                }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </span>
            </Link>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('analytics')}
            className="flex items-center justify-between w-full px-3 py-2 text-left text-gray-400 hover:text-white transition-colors"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider">Analytics</h3>
            {expandedSections.analytics ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )}
          </button>
          {expandedSections.analytics && (
            <div className="ml-4 space-y-2">
              <Link href="/analytics/champions">
                <span className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1F2937] rounded transition-colors">
                  Champion Stats
                </span>
              </Link>
              <Link href="/analytics/drafts">
                <span className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1F2937] rounded transition-colors">
                  Draft Analysis
                </span>
              </Link>
              <Link href="/analytics/team-stats">
                <span className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1F2937] rounded transition-colors">
                  Team Statistics
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Competitors Section */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('competitors')}
            className="flex items-center justify-between w-full px-3 py-2 text-left text-gray-400 hover:text-white transition-colors"
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
            <div className="ml-4 space-y-2">
              {competitorOptions.map((option) => (
                <Link key={option.path} href={option.path}>
                  <span className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1F2937] rounded transition-colors">
                    {option.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Heatmaps Section */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('heatmaps')}
            className="flex items-center justify-between w-full px-3 py-2 text-left text-gray-400 hover:text-white transition-colors"
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
            <div className="ml-4 space-y-2">
              {heatmapOptions.map((option) => (
                <Link key={option.path} href={option.path}>
                  <span className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1F2937] rounded transition-colors">
                    {option.name}
                </span>
              </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10">
          <div className="text-xs text-gray-500 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-500">Live Data</span>
            </div>
            <p>Powered by Grid.gg</p>
          </div>
        </div>
      </aside>

      {/* Page Content */}
      <main className="flex-1 px-6 py-8 overflow-y-auto">{children}</main>
    </div>
  );
};

export default DashboardShell;
