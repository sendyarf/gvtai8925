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
        <div className="w-full h-full flex flex-col items-center justify-center bg-surface lg:rounded-lg lg:border-2 lg:border-dashed lg:border-white/10 p-6 sm:p-12 lg:p-16 relative">
            <button 
                onClick={onClose}
                className="lg:hidden absolute top-4 left-4 flex items-center gap-1 text-sm text-text-secondary hover:text-secondary-accent transition-colors z-10"
            >
                <BackIcon className="w-5 h-5" />
                Schedule
            </button>
            
            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-y-8 lg:gap-x-16 items-center">
                
                {/* Left Column: Time Info */}
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left pt-12 lg:pt-0">
                    <span className="text-xl font-medium text-text-primary">STARTS IN</span>
                    <div className="my-2">
                      <CountdownTimer targetTime={match.startTime} size="matchday" />
                    </div>

                    <div className="mt-4">
                        <h2 className="text-5xl font-extrabold leading-none text-text-primary">MATCH</h2>
                        <h2 className="text-5xl font-extrabold leading-none text-text-primary">DAY</h2>
                        <div className="w-full h-1.5 bg-accent mt-4"></div>
                    </div>
                </div>

                {/* Right Column: Match Info */}
                <div className="flex flex-col items-center text-center lg:items-end lg:text-right">
                    <span className="text-xl font-medium text-text-primary">{match.league}</span>
                    <div className="flex items-center justify-center lg:justify-end gap-4 mt-8">
                        <img src={match.team1.logo} alt={match.team1.name} className="w-24 h-24 object-contain"/>
                        <img src={match.team2.logo} alt={match.team2.name} className="w-24 h-24 object-contain"/>
                    </div>
                </div>
            </div>
        </div>
    );
};