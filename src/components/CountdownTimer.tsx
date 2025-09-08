import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetTime: number; // UTC timestamp
  size?: 'small' | 'large' | 'hero' | 'matchday';
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
  
  const totalHours = days * 24 + hours;
  const formattedHours = String(totalHours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  if (size === 'matchday') {
    return (
      <div className="font-mono text-3xl font-bold text-text-primary tracking-tighter">
        <span>{formattedHours}</span>
        <span className="animate-pulse">:</span>
        <span>{formattedMinutes}</span>
        <span className="animate-pulse">:</span>
        <span>{formattedSeconds}</span>
      </div>
    );
  }

  if (size === 'hero') {
    return (
      <div className="font-mono text-7xl sm:text-8xl font-bold text-text-primary tracking-tighter">
        <span>{formattedHours}</span>
        <span className="animate-pulse">:</span>
        <span>{formattedMinutes}</span>
        <span className="animate-pulse">:</span>
        <span>{formattedSeconds}</span>
      </div>
    );
  }

  if (size === 'large') {
    return (
      <div className="grid grid-flow-col gap-x-4 sm:gap-x-6 text-center auto-cols-max font-mono">
        {days > 0 && (
          <div className="flex flex-col">
            <span className="countdown font-bold text-4xl sm:text-6xl text-text-primary">{String(days).padStart(2, '0')}</span>
            <span className="text-xs sm:text-sm text-text-secondary uppercase">days</span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="countdown font-bold text-4xl sm:text-6xl text-text-primary">{String(hours).padStart(2, '0')}</span>
          <span className="text-xs sm:text-sm text-text-secondary uppercase">hours</span>
        </div>
        <div className="flex flex-col">
          <span className="countdown font-bold text-4xl sm:text-6xl text-text-primary">{String(minutes).padStart(2, '0')}</span>
          <span className="text-xs sm:text-sm text-text-secondary uppercase">min</span>
        </div>
        <div className="flex flex-col">
          <span className="countdown font-bold text-4xl sm:text-6xl text-text-primary">{String(seconds).padStart(2, '0')}</span>
          <span className="text-xs sm:text-sm text-text-secondary uppercase">sec</span>
        </div>
      </div>
    );
  }

  // Default 'small' size
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  parts.push(`${String(hours).padStart(2, '0')}h`);
  parts.push(`${formattedMinutes}m`);
  parts.push(`${formattedSeconds}s`);

  return (
    <div className="font-mono text-base font-medium text-text-primary tabular-nums">
      {parts.join(' : ')}
    </div>
  );
};