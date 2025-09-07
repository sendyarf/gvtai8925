import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetTime: number; // UTC timestamp
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

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetTime));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetTime));
    }, 1000);

    return () => clearTimeout(timer);
  });

  const { days, hours, minutes, seconds } = timeLeft;
  
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

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
