import React from 'react';
import type { MatchWithState } from '../types';

interface StreamPlayerProps {
    match: MatchWithState | null;
    streamUrl: string | null;
    onClose: () => void;
    onWatchStream: (url: string) => void;
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


export const StreamPlayer: React.FC<StreamPlayerProps> = ({ match, streamUrl, onClose, onWatchStream }) => {
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
    
    // Case 2: A live match is selected, but no server has been chosen yet. SHOW SERVER SELECTION.
    if (!streamUrl) {
         return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center bg-slate-900 lg:rounded-lg p-4 sm:p-8 relative">
                <button
                    onClick={onClose}
                    className="lg:hidden absolute top-4 left-4 flex items-center gap-1 text-sm text-slate-300 hover:text-amber-500 transition-colors"
                >
                    <BackIcon className="w-5 h-5" />
                    Schedule
                </button>
                
                <div className="flex items-center justify-center gap-4 sm:gap-8 my-8 w-full max-w-lg">
                     <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 justify-end">
                        <span className="font-bold text-lg sm:text-2xl text-slate-100 text-right order-2 sm:order-1">{match.team1.name}</span>
                        <img src={match.team1.logo} alt={match.team1.name} className="w-12 h-12 sm:w-16 sm:h-16 object-contain order-1 sm:order-2"/>
                    </div>
                    <span className="text-xl sm:text-2xl font-bold text-slate-500">VS</span>
                    <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
                        <img src={match.team2.logo} alt={match.team2.name} className="w-12 h-12 sm:w-16 sm:h-16 object-contain"/>
                        <span className="font-bold text-lg sm:text-2xl text-slate-100 text-left">{match.team2.name}</span>
                    </div>
                </div>

                <span className="text-base sm:text-lg text-slate-400 mb-4">Select a Server to Start</span>
                
                <div className="w-full max-w-md grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {match.servers.map((server, index) => (
                        <button
                            key={index}
                            onClick={() => onWatchStream(server.url)}
                            className="block text-center py-2.5 px-2 text-sm bg-slate-800 rounded-md text-slate-200 hover:bg-amber-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 font-semibold"
                        >
                            {server.label || `Server ${index + 1}`}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Case 3: Stream is active. SHOW PLAYER + SERVER SWITCHER.
    return (
        <div className="w-full h-full flex flex-col bg-black lg:rounded-lg overflow-hidden shadow-2xl shadow-black/50 lg:border lg:border-slate-800">
             {/* Header for mobile back button */}
             <div className="p-4 bg-slate-900 lg:border-b lg:border-slate-800 flex items-center justify-between lg:hidden">
                <button
                    onClick={onClose}
                    className="flex items-center gap-1 text-sm text-slate-300 hover:text-amber-500 transition-colors"
                >
                    <BackIcon className="w-5 h-5" />
                    Schedule
                </button>
                 {/* Placeholder to balance the flex layout on mobile */}
                <div className="w-24"></div>
            </div>

            {/* Player */}
            <div className="flex-grow bg-black aspect-video lg:aspect-auto">
                <iframe
                    key={streamUrl} // Add key to force re-render on URL change
                    src={streamUrl}
                    title="Live Stream Player"
                    className="w-full h-full border-0"
                    allow="encrypted-media; autoplay; fullscreen"
                    allowFullScreen
                ></iframe>
            </div>

            {/* Server Switcher Footer */}
            <div className="bg-slate-900 p-3 lg:border-t lg:border-slate-800">
                <p className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider text-center lg:text-left">Switch Server</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                    {match.servers.map((server, index) => {
                        const isActive = server.url === streamUrl;
                        return (
                             <button
                                key={index}
                                onClick={() => onWatchStream(server.url)}
                                className={`block text-center py-2 px-1 text-xs sm:text-sm rounded-md transition-all duration-200 font-medium truncate ${
                                    isActive 
                                    ? 'bg-amber-500 text-slate-900 cursor-default' 
                                    : 'bg-slate-700 text-slate-200 hover:bg-amber-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500'
                                }`}
                                disabled={isActive}
                            >
                                {server.label || `Server ${index + 1}`}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};