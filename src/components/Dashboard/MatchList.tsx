import React, { useState } from 'react';
import { MatchListProps } from '../../types/dashboard';

const ITEMS_PER_PAGE = 10;

const MatchList: React.FC<MatchListProps> = ({ matches, selectedTeam, onTeamSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(matches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedMatches = matches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden shadow-lg">
      <div className="p-4 border-b border-dark-700 flex items-center justify-between bg-gradient-to-r from-dark-900 to-dark-800">
        <h2 className="text-base font-semibold flex items-center gap-3">
          <span className="w-8 h-8 flex items-center justify-center bg-primary-500/10 rounded-lg">
            <svg className="w-4 h-4 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5h14a2 2 0 012 2v13a2 2 0 01-2 2h-4.5" strokeLinecap="round"/>
              <path d="M11 12H3" strokeLinecap="round"/>
              <path d="M9 9l-3 3 3 3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="text-dark-100">Recent Matches</span>
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-dark-300 bg-dark-700/50 px-3 py-1.5 rounded-full">
            {matches.length} matches
          </span>
          {matches.length > ITEMS_PER_PAGE && (
            <span className="text-xs text-dark-400">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>
      </div>
      
      <div className="divide-y divide-dark-700">
        {displayedMatches.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-dark-700/50 flex items-center justify-center">
              <svg className="w-6 h-6 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
            <p className="text-sm text-dark-300 mb-1">No matches found</p>
            <p className="text-xs text-dark-400">Try adjusting your filter settings</p>
          </div>
        ) : (
          displayedMatches.map((match, index) => (
            <div 
              key={match.id}
              className="group hover:bg-dark-900/50 transition-all duration-200 animate-in fade-in-0 slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms`, animationDuration: '400ms' }}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  {/* Team 1 */}
                  {match.teams[0] && (
                    <div 
                      className={`flex items-center gap-3 flex-1 ${
                        match.teams[0].baseInfo.id === selectedTeam 
                          ? 'bg-dark-800/80 rounded-lg p-2' 
                          : 'opacity-90 hover:opacity-100'
                      } transition-all duration-200 cursor-pointer`}
                      onClick={() => onTeamSelect && onTeamSelect(match.teams[0].baseInfo.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={`w-12 h-12 rounded-xl overflow-hidden ${
                        match.teams[0].baseInfo.id === selectedTeam
                          ? 'ring-2 ring-primary-500 shadow-lg shadow-primary-500/20'
                          : 'bg-dark-900/50'
                      } p-2 flex items-center justify-center`}>
                        <img 
                          src={match.teams[0].baseInfo.logoUrl}
                          alt={match.teams[0].baseInfo.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`text-sm font-medium truncate ${
                          match.teams[0].baseInfo.id === selectedTeam 
                            ? 'text-primary-400' 
                            : 'text-dark-100'
                        }`}>
                          {match.teams[0].baseInfo.name}
                        </span>
                        <span className="text-xs text-dark-400 truncate">
                          Score: {match.teams[0].scoreAdvantage || 0}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* VS and Match Info */}
                  <div className="flex flex-col items-center gap-1 px-4 min-w-[100px]">
                    <span className="text-[10px] uppercase tracking-wider text-dark-400">
                      {match.format?.name || 'Match'}
                    </span>
                    <span className="text-sm font-semibold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                      VS
                    </span>
                    <span className="text-[10px] text-dark-400">
                      {new Date(match.startTimeScheduled).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {/* Team 2 */}
                  {match.teams[1] && (
                    <div 
                      className={`flex items-center gap-3 flex-1 justify-end ${
                        match.teams[1].baseInfo.id === selectedTeam 
                          ? 'bg-dark-800/80 rounded-lg p-2' 
                          : 'opacity-90 hover:opacity-100'
                      } transition-all duration-200 cursor-pointer`}
                      onClick={() => onTeamSelect && onTeamSelect(match.teams[1].baseInfo.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex flex-col items-end min-w-0">
                        <span className={`text-sm font-medium truncate ${
                          match.teams[1].baseInfo.id === selectedTeam 
                            ? 'text-primary-400' 
                            : 'text-dark-100'
                        }`}>
                          {match.teams[1].baseInfo.name}
                        </span>
                        <span className="text-xs text-dark-400 truncate">
                          Score: {match.teams[1].scoreAdvantage || 0}
                        </span>
                      </div>
                      <div className={`w-12 h-12 rounded-xl overflow-hidden ${
                        match.teams[1].baseInfo.id === selectedTeam
                          ? 'ring-2 ring-primary-500 shadow-lg shadow-primary-500/20'
                          : 'bg-dark-900/50'
                      } p-2 flex items-center justify-center`}>
                        <img 
                          src={match.teams[1].baseInfo.logoUrl}
                          alt={match.teams[1].baseInfo.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* League Badge */}
                <div className="ml-4 hidden lg:block">
                  <span className="text-[10px] px-3 py-1 rounded-full bg-dark-700/50 text-dark-300 whitespace-nowrap border border-dark-600/30">
                    {match.league.nameShortened || match.league.name}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {matches.length > ITEMS_PER_PAGE && (
        <div className="px-4 py-3 border-t border-dark-700 bg-dark-800/50 flex items-center justify-between">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150
              ${currentPage === 1 
                ? 'text-dark-400 bg-dark-700/30 cursor-not-allowed' 
                : 'text-dark-200 bg-dark-700 hover:bg-dark-600'}`}
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors duration-150
                  ${pageNum === currentPage 
                    ? 'bg-primary-500 text-white' 
                    : 'text-dark-200 bg-dark-700 hover:bg-dark-600'}`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150
              ${currentPage === totalPages 
                ? 'text-dark-400 bg-dark-700/30 cursor-not-allowed' 
                : 'text-dark-200 bg-dark-700 hover:bg-dark-600'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchList;
