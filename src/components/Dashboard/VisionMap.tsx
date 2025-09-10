import React, { useMemo } from 'react';
import { VisionMapProps } from '../../types/dashboard';
import { useGetVisionMapDataQuery } from '../../generated/hooks';

const VisionMap: React.FC<VisionMapProps> = ({ match, selectedTeam }) => {
  const { data, loading, error } = useGetVisionMapDataQuery({
    variables: {
      seriesId: match?.id || '',
      teamId: selectedTeam || ''
    },
    skip: !match?.id || !selectedTeam
  });

  // Find the selected team data in the match
  const teamData = useMemo(() => {
    if (!match || !selectedTeam) return null;
    return match.teams?.find(t => t.baseInfo.id === selectedTeam);
  }, [match, selectedTeam]);

  // Generate mock vision heatmap data
  const mockHeatmapData = useMemo(() => {
    if (!selectedTeam || !match) return [];
    
    // Generate 20 random vision points
    return Array(20).fill(0).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      intensity: Math.random() * 0.8 + 0.2, // 0.2 to 1.0
      type: Math.random() > 0.7 ? 'control' : 'standard'
    }));
  }, [selectedTeam, match]);

  if (!match) return null;

  return (
    <div className="bg-dark-700/20 rounded-lg border border-secondary-500/20 overflow-hidden">
      <div className="p-4 border-b border-dark-600/30 bg-gradient-to-r from-dark-800/50 to-dark-700/50 backdrop-blur-sm">
        <h2 className="text-base font-medium flex items-center gap-2 relative">
          <span className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-accent-purple/20 to-secondary-600/20 rounded-md shadow-inner">
            <svg className="w-3.5 h-3.5 text-accent-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L16 4m0 13V4m0 0L9 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="bg-gradient-to-r from-accent-purple to-secondary-300 bg-clip-text text-transparent">Vision Heat Map</span>
        </h2>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="aspect-square flex items-center justify-center bg-dark-800/50 rounded-md border border-dark-600/30 mb-3">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-2 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin mb-3"></div>
              <p className="text-sm text-dark-300">Loading vision data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="aspect-square flex items-center justify-center bg-dark-800/50 rounded-md border border-accent-red/20 mb-3">
            <div className="p-4 text-center max-w-[220px]">
              <svg className="w-8 h-8 text-accent-red/70 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-dark-300 mb-1">Error loading vision data</p>
              <p className="text-xs text-dark-400">{error.message}</p>
            </div>
          </div>
        ) : (
          <div className="aspect-square relative bg-dark-800/50 rounded-md overflow-hidden border border-dark-600/30 mb-3 group">
            {/* Map background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>
            
            {/* Map elements */}
            <div className="absolute inset-0">
              {/* Background map image (just a placeholder overlay) */}
              <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-dark-900 to-dark-950 z-0"></div>
              
              {/* Map quadrant boundaries */}
              <div className="absolute inset-0 z-0">
                <div className="w-full h-full grid grid-cols-2 grid-rows-2 opacity-30">
                  <div className="border-r border-b border-primary-500/30"></div>
                  <div className="border-b border-primary-500/30"></div>
                  <div className="border-r border-primary-500/30"></div>
                  <div></div>
                </div>
              </div>
              
              {/* Map lanes */}
              <div className="absolute inset-0 z-0">
                {/* Diagonal lanes */}
                <div className="absolute top-0 left-0 right-0 bottom-0 transform -rotate-[30deg] translate-y-1/4 border-b border-primary-500/20"></div>
                <div className="absolute top-0 left-0 right-0 bottom-0 transform rotate-[30deg] translate-y-1/4 border-b border-primary-500/20"></div>
                {/* Middle lane */}
                <div className="absolute top-[50%] left-0 right-0 border-b border-primary-500/30"></div>
              </div>
              
              {/* Vision points - generated randomly for visual effect */}
              {selectedTeam && mockHeatmapData.map((point) => (
                <div 
                  key={point.id}
                  className={`absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${
                    point.type === 'control' ? 'bg-accent-purple' : 'bg-accent-blue'
                  }`}
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    opacity: point.intensity * 0.6,
                    boxShadow: `0 0 ${10 + point.intensity * 15}px ${point.intensity * 8}px ${
                      point.type === 'control' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(59, 130, 246, 0.4)'
                    }`
                  }}
                >
                  <div 
                    className={`absolute inset-0 rounded-full animate-ping ${
                      point.type === 'control' ? 'bg-accent-purple/30' : 'bg-accent-blue/30'
                    }`}
                    style={{ animationDuration: `${2 + point.intensity * 3}s` }}
                  ></div>
                </div>
              ))}
              
              {/* Empty state */}
              {!selectedTeam && (
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <div className="p-4 rounded-lg bg-dark-700/50 backdrop-blur-sm border border-dark-600/20 text-center max-w-[200px]">
                    <svg className="w-8 h-8 text-dark-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-dark-300">Please select a team to view vision data</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Grid overlay */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
              {Array(64).fill(0).map((_, i) => (
                <div key={i} className="border border-primary-500/20"></div>
              ))}
            </div>
            
            {selectedTeam && (
              <div className="absolute bottom-3 right-3 px-3 py-2 bg-dark-800/80 backdrop-blur-sm rounded-lg border border-dark-600/50 text-xs z-10">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-blue"></span>
                  <span className="text-dark-200">Ward</span>
                  <span className="w-2 h-2 rounded-full bg-accent-purple ml-2"></span>
                  <span className="text-dark-200">Control Ward</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-dark-400">Top: <span className="text-dark-200">24%</span></div>
                  <div className="text-dark-400">Mid: <span className="text-dark-200">32%</span></div>
                  <div className="text-dark-400">Bot: <span className="text-dark-200">18%</span></div>
                  <div className="text-dark-400">Jungle: <span className="text-dark-200">26%</span></div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-dark-400 px-1">
          <span>Map: Summoner's Rift</span>
          <span>{new Date(match.startTimeScheduled).toLocaleDateString()}</span>
        </div>
        
        {selectedTeam && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="bg-dark-800/30 p-3 rounded border border-dark-600/30 flex items-center justify-between">
              <span className="text-xs text-dark-300">Wards Placed</span>
              <span className="text-sm font-medium text-accent-blue">
                {Math.floor(Math.random() * 25) + 15}
              </span>
            </div>
            <div className="bg-dark-800/30 p-3 rounded border border-dark-600/30 flex items-center justify-between">
              <span className="text-xs text-dark-300">Vision Score</span>
              <span className="text-sm font-medium text-accent-purple">
                {Math.floor(Math.random() * 40) + 20}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisionMap;
