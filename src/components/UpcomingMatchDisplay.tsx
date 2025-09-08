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
        <div className="w-full h-full flex flex-col items-center justify-center bg-surface lg:rounded-lg lg:border-2 lg:border-dashed lg:border-white/10 p-4 sm:p-8 relative">
            <button 
                onClick={onClose}
                className="lg:hidden absolute top-4 left-4 flex items-center gap-1 text-sm text-text-secondary hover:text-secondary-accent transition-colors z-10"
            >
                <BackIcon className="w-5 h-5" />
                Schedule
            </button>
            
            <div className="flex flex-col lg:flex-row items-center justify-center w-full h-full gap-8 lg:gap-16">
                
                {/* Left Column: Time Info */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left pt-12 lg:pt-0">
                    <span className="text-xl font-medium text-text-primary mb-1">STARTS IN</span>
                    <CountdownTimer targetTime={match.startTime} size="matchday" />

                    <div className="mt-8 lg:mt-12">
                        <h2 className="text-5xl font-extrabold leading-none text-text-primary">MATCH</h2>
                        <h2 className="text-5xl font-extrabold leading-none text-text-primary">DAY</h2>
                        <div className="w-full h-1.5 bg-accent mt-4"></div>
                    </div>
                </div>

                {/* Right Column: Match Info */}
                <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-medium text-text-primary mb-6">{match.league}</span>
                    <div className="flex items-center justify-center gap-8">
                        <img src={match.team1.logo} alt={match.team1.name} className="w-12 h-12 object-contain"/>
                        <img src={match.team2.logo} alt={match.team2.name} className="w-12 h-12 object-contain"/>
                    </div>
                </div>
            </div>
        </div>
    );
};