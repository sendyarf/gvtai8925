import React from 'react';
import type { MatchWithState } from '../types';
import { CountdownTimer } from './CountdownTimer';

const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
    </svg>
);


interface UpcomingMatchDisplayProps {
    match: MatchWithState;
    onClose: () => void;
}

export const UpcomingMatchDisplay: React.FC<UpcomingMatchDisplayProps> = ({ match, onClose }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center bg-slate-900 lg:rounded-lg lg:border-2 lg:border-dashed lg:border-slate-800 p-4 sm:p-8 relative">
            <button 
                onClick={onClose}
                className="lg:hidden absolute top-4 left-4 flex items-center gap-1 text-sm text-slate-300 hover:text-amber-500 transition-colors"
            >
                <BackIcon className="w-5 h-5" />
                Schedule
            </button>
            <span className="text-sm sm:text-base font-semibold text-amber-400 uppercase tracking-wider">{match.league}</span>

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

            <span className="text-base sm:text-lg text-slate-400 mb-4">STARTS IN</span>
            <CountdownTimer targetTime={match.startTime} size="large" />
        </div>
    );
};