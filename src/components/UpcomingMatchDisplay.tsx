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
        <div className="w-full h-full flex flex-col items-center justify-center text-center bg-surface lg:rounded-lg lg:border-2 lg:border-dashed lg:border-white/10 p-4 sm:p-8 relative">
            <button 
                onClick={onClose}
                className="lg:hidden absolute top-4 left-4 flex items-center gap-1 text-sm text-text-secondary hover:text-secondary-accent transition-colors"
            >
                <BackIcon className="w-5 h-5" />
                Schedule
            </button>
            <span className="text-sm sm:text-base font-semibold text-accent uppercase tracking-wider">{match.league}</span>

            <div className="flex items-center justify-center gap-4 sm:gap-8 my-10 w-full max-w-3xl">
                <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 justify-end">
                    <span className="font-extrabold text-3xl sm:text-5xl text-text-primary text-right order-2 sm:order-1 leading-tight">{match.team1.name}</span>
                    <img src={match.team1.logo} alt={match.team1.name} className="w-16 h-16 sm:w-20 sm:h-20 object-contain order-1 sm:order-2"/>
                </div>
                <span className="text-2xl sm:text-4xl font-light text-text-secondary/50 mx-2">VS</span>
                <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
                    <img src={match.team2.logo} alt={match.team2.name} className="w-16 h-16 sm:w-20 sm:h-20 object-contain"/>
                    <span className="font-extrabold text-3xl sm:text-5xl text-text-primary text-left leading-tight">{match.team2.name}</span>
                </div>
            </div>

            <span className="text-sm text-text-secondary mb-6 uppercase tracking-widest">STARTS IN</span>
            <CountdownTimer targetTime={match.startTime} size="large" />
        </div>
    );
};