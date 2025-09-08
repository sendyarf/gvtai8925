import React from 'react';
import type { MatchWithState } from '../types';

interface StreamPlayerProps {
    match: MatchWithState | null;
    streamUrl: string | null;
    onClose: () => void;
}

const GovoetLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.236L19.098 8 12 11.764 4.902 8 12 4.236zM4 9.655V17l8 4v-8.345L4 9.655zm16 0L12 12.655V21l8-4V9.655z"></path>
    </svg>
);

const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
    </svg>
);


export const StreamPlayer: React.FC<StreamPlayerProps> = ({ match, streamUrl, onClose }) => {
    // Case 1: No match selected at all.
    if (!match) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center bg-slate-900 rounded-lg border-2 border-dashed border-slate-800 p-4">
                <GovoetLogo className="w-24 h-24 text-slate-700" />
                <h2 className="mt-6 text-2xl font-bold text-slate-300">Welcome to GOVOET</h2>
                <p className="mt-2 text-slate-500">Select a live match from the schedule to begin streaming.</p>
            </div>
        );
    }
    
    // Case 2: A live match is selected, but no server has been chosen yet.
    if (!streamUrl) {
         return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center bg-slate-900 rounded-lg border-2 border-dashed border-slate-800 p-4">
                <GovoetLogo className="w-24 h-24 text-slate-700" />
                <h2 className="mt-6 text-2xl font-bold text-slate-300">{match.team1.name} vs {match.team2.name}</h2>
                <p className="mt-2 text-slate-500">The match is live! Select a server from the list to begin streaming.</p>
                 <button 
                    onClick={onClose}
                    className="lg:hidden flex items-center gap-1 text-sm text-slate-300 hover:text-blue-500 transition-colors mt-8"
                >
                    <BackIcon className="w-5 h-5" />
                    Back to Schedule
                </button>
            </div>
        );
    }

    // Case 3: Stream is active
    return (
        <div className="w-full h-full flex flex-col bg-black lg:rounded-lg overflow-hidden shadow-2xl shadow-black/50 lg:border lg:border-slate-800">
            <div className="p-4 bg-slate-900 lg:border-b lg:border-slate-800 flex items-center justify-between">
                <button 
                    onClick={onClose}
                    className="lg:hidden flex items-center gap-1 text-sm text-slate-300 hover:text-blue-500 transition-colors"
                >
                    <BackIcon className="w-5 h-5" />
                    Schedule
                </button>
                <div className="text-center text-xs text-blue-500 font-semibold hidden lg:block">
                    {match.league}
                </div>
                 {/* Placeholder to balance the flex layout on mobile */}
                <div className="lg:hidden w-24"></div>
            </div>
            
            <div className="hidden lg:flex p-4 bg-slate-900 border-b border-slate-800 items-center justify-center">
                 <div className="flex items-center justify-between gap-4 w-full max-w-md">
                     <div className="flex items-center gap-3">
                        <img src={match.team1.logo} alt={match.team1.name} className="w-7 h-7 object-contain"/>
                        <span className="font-semibold text-lg text-slate-100">{match.team1.name}</span>
                    </div>
                     <span className="text-sm font-bold text-slate-500">VS</span>
                     <div className="flex items-center gap-3">
                        <span className="font-semibold text-lg text-slate-100">{match.team2.name}</span>
                        <img src={match.team2.logo} alt={match.team2.name} className="w-7 h-7 object-contain"/>
                    </div>
                </div>
            </div>
            <div className="flex-grow bg-black">
                <iframe
                    src={streamUrl}
                    title="Live Stream Player"
                    className="w-full h-full border-0"
                    allow="encrypted-media; autoplay; fullscreen"
                    allowFullScreen
                    sandbox="allow-forms allow-scripts allow-same-origin allow-presentation"
                ></iframe>
            </div>
        </div>
    );
};