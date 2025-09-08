import React, { useState } from 'react';
import type { Match, MatchStatus } from '../types';

interface MatchCardProps {
  match: Match;
  status: MatchStatus;
  displayTime: number;
  isSelected: boolean;
  onSelect: () => void;
}

const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M13 4.5a2.5 2.5 0 11.702 4.283l-4.434 2.534a2.5 2.5 0 010 1.366l4.434 2.534a2.5 2.5 0 11-.702.717l-4.434-2.534a2.5 2.5 0 110-2.799l4.434-2.534A2.5 2.5 0 0113 4.5z" />
    </svg>
);


export const MatchCard: React.FC<MatchCardProps> = ({ match, status, displayTime, isSelected, onSelect }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isLive = status === 'live';

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

  const baseRing = "ring-1 ring-inset ring-white/10";
  const selectedRing = "ring-2 ring-inset ring-accent";

  return (
    <div 
        id={`match-${match.id}`}
        className={`bg-surface rounded-lg transition-all duration-300 ${isSelected ? selectedRing : baseRing} cursor-pointer hover:ring-white/20`}
        onClick={onSelect}
        aria-labelledby={`match-title-${match.id}`}
    >
        <div className="p-4">
            <div className="flex justify-between items-center text-xs text-text-secondary mb-3">
                <span className="truncate pr-2">{match.league}</span>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-mono">{new Date(displayTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <div className="relative">
                    <button 
                      onClick={handleCopyLink} 
                      className="text-text-secondary hover:text-secondary-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded" 
                      title="Copy link to match"
                      aria-label="Copy link to match"
                    >
                        <ShareIcon className="w-4 h-4" />
                    </button>
                    {isCopied && (
                        <div className="absolute z-10 -top-8 right-1/2 translate-x-1/2 whitespace-nowrap bg-surface text-text-primary text-xs px-2 py-1 rounded-md shadow-lg animate-fade-in-out ring-1 ring-white/10">
                            Copied!
                        </div>
                    )}
                 </div>
                </div>
            </div>
            
            <div id={`match-title-${match.id}`} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 flex-1 justify-end">
                    <span className="font-semibold text-sm sm:text-base text-right text-text-primary">{match.team1.name}</span>
                    <img src={match.team1.logo} alt={match.team1.name} className="w-8 h-8 object-contain"/>
                </div>
                <span className="text-sm font-bold text-text-secondary">VS</span>
                <div className="flex items-center gap-3 flex-1">
                    <img src={match.team2.logo} alt={match.team2.name} className="w-8 h-8 object-contain"/>
                    <span className="font-semibold text-sm sm:text-base text-left text-text-primary">{match.team2.name}</span>
                </div>
            </div>
        </div>
      
        <div className="px-4 pb-4">
            {isLive ? (
                <div
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold bg-accent text-background rounded-md"
                >
                    <span className="w-2 h-2 bg-background rounded-full animate-pulse"></span>
                    LIVE
                </div>
            ) : (
                <div className="text-center py-2 bg-white/5 text-text-secondary rounded-md text-sm font-bold uppercase tracking-wider">
                    Upcoming
                </div>
            )}
        </div>
    </div>
  );
};