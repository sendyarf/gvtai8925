import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ExclamationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);


export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-red-900/30 border border-red-500/30 text-red-300 rounded-lg m-4">
        <ExclamationIcon className="w-10 h-10 text-red-400" />
        <h2 className="mt-3 text-lg font-semibold text-red-200">Error Loading Schedule</h2>
        <p className="mt-1 text-sm text-red-300/80">{message}</p>
    </div>
  );
};