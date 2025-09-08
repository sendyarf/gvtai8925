import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetTime: number; // UTC timestamp
  size?: 'small' | 'large';
}

const calculateTimeLeft = (targetTime: number) => {
  const difference = targetTime - Date.now();
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetTime, size = 'small' }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetTime));

  useEffect(() => {
    // Set up an interval that updates the time left every second.
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetTime));
    }, 1000);

    // Clean up the interval when the component unmounts or targetTime changes.
    return () => clearInterval(timer);
  }, [targetTime]);

  const { days, hours, minutes, seconds } = timeLeft;
  
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  if (size === 'large') {
    return (
      <div className="grid grid-flow-col gap-x-4 sm:gap-x-6 text-center auto-cols-max font-mono">
        {days > 0 && (
          <div className="flex flex-col">
            <span className="countdown font-bold text-4xl sm:text-6xl text-slate-100">{String(days).padStart(2, '0')}</span>
            <span className="text-xs sm:text-sm text-slate-500 uppercase">days</span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="countdown font-bold text-4xl sm:text-6xl text-slate-100">{formattedHours}</span>
          <span className="text-xs sm:text-sm text-slate-500 uppercase">hours</span>
        </div>
        <div className="flex flex-col">
          <span className="countdown font-bold text-4xl sm:text-6xl text-slate-100">{formattedMinutes}</span>
          <span className="text-xs sm:text-sm text-slate-500 uppercase">min</span>
        </div>
        <div className="flex flex-col">
          <span className="countdown font-bold text-4xl sm:text-6xl text-slate-100">{formattedSeconds}</span>
          <span className="text-xs sm:text-sm text-slate-500 uppercase">sec</span>
        </div>
      </div>
    );
  }

  // Default 'small' size
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  parts.push(`${formattedHours}h`);
  parts.push(`${formattedMinutes}m`);
  parts.push(`${formattedSeconds}s`);

  return (
    <div className="font-mono text-base font-medium text-slate-300 tabular-nums">
      {parts.join(' : ')}
    </div>
  );
};