import React, { useState, useEffect } from 'react';
import type { MatchWithState } from '../types';
import { CountdownTimer } from './CountdownTimer';

interface MatchCardProps {
  match: MatchWithState;
  isSelected: boolean;
  isActiveStream: boolean;
  onSelect: () => void;
  onWatch: (url: string) => void;
}

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
);

const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M13 4.5a2.5 2.5 0 11.702 4.283l-4.434 2.534a2.5 2.5 0 010 1.366l4.434 2.534a2.5 2.5 0 11-.702.717l-4.434-2.534a2.5 2.5 0 110-2.799l4.434-2.534A2.5 2.5 0 0113 4.5z" />
    </svg>
);


export const MatchCard: React.FC<MatchCardProps> = ({ match, isSelected, isActiveStream, onSelect, onWatch }) => {
  const [showServers, setShowServers] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const isLive = match.status === 'live';

  // Collapse or expand server list based on selection and active stream state
  useEffect(() => {
    if (isSelected && isActiveStream) {
      setShowServers(true);
    } else if (!isSelected) {
      setShowServers(false);
    }
  }, [isSelected, isActiveStream]);

  const handleWatchClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card selection when clicking the button
      onSelect();
      setShowServers(prev => !prev);
  }

  const handleServerClick = (e: React.MouseEvent, url: string) => {
      e.stopPropagation();
      onWatch(url);
  }

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Encode the ID to ensure it's a valid URL component
    const url = `${window.location.origin}/${encodeURIComponent(match.id)}`;
    navigator.clipboard.writeText(url).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Tooltip disappears after 2 seconds
    }).catch(err => {
        console.error('Failed to copy match link: ', err);
        alert('Failed to copy link.');
    });
  };

  const baseRing = "ring-1 ring-inset ring-slate-800";
  const selectedRing = "ring-2 ring-inset ring-blue-500";

  return (
    <div 
        id={`match-${match.id}`}
        className={`bg-slate-900/50 rounded-lg transition-all duration-300 ${isSelected ? selectedRing : baseRing} cursor-pointer hover:ring-slate-700`}
        onClick={onSelect}
        aria-labelledby={`match-title-${match.id}`}
    >
        <div className="p-4">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-3">
                <span className="truncate pr-2">{match.league}</span>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-mono">{match.kickoff_time}</span>
                  <div className="relative">
                    <button 
                      onClick={handleCopyLink} 
                      className="text-slate-500 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" 
                      title="Copy link to match"
                      aria-label="Copy link to match"
                    >
                        <ShareIcon className="w-4 h-4" />
                    </button>
                    {isCopied && (
                        <div className="absolute z-10 -top-8 right-1/2 translate-x-1/2 whitespace-nowrap bg-slate-700 text-white text-xs px-2 py-1 rounded-md shadow-lg animate-fade-in-out">
                            Copied!
                        </div>
                    )}
                 </div>
                </div>
            </div>
            
            <div id={`match-title-${match.id}`} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 flex-1 justify-end">
                    <span className="font-semibold text-sm sm:text-base text-right">{match.team1.name}</span>
                    <img src={match.team1.logo} alt={match.team1.name} className="w-8 h-8 object-contain"/>
                </div>
                <span className="text-sm font-bold text-slate-500">VS</span>
                <div className="flex items-center gap-3 flex-1">
                    <img src={match.team2.logo} alt={match.team2.name} className="w-8 h-8 object-contain"/>
                    <span className="font-semibold text-sm sm:text-base text-left">{match.team2.name}</span>
                </div>
            </div>
        </div>
      
        <div className={`px-4 pb-4 transition-all duration-300 ${isLive ? 'pt-2' : 'pt-4'}`}>
            {isLive ? (
                <button
                    onClick={handleWatchClick}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500"
                    aria-expanded={showServers}
                >
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    LIVE
                    <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${showServers ? 'rotate-180' : ''}`} />
                </button>
            ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                    <span className="text-xs text-slate-400">STARTS IN</span>
                    <CountdownTimer targetTime={match.startTime} size="small" />
                </div>
            )}
        </div>

        {showServers && isLive && isSelected && (
            <div className="bg-slate-950/40 p-3 border-t border-slate-800">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {match.servers.map((server, index) => (
                        <button 
                            key={index} 
                            onClick={(e) => handleServerClick(e, server.url)}
                            className="block text-center py-2 px-1 text-sm bg-slate-700 rounded-md text-slate-200 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium"
                        >
                            {server.label || `Server ${index + 1}`}
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};