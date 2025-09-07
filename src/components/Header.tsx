import React from 'react';

const GovoetLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.236L19.098 8 12 11.764 4.902 8 12 4.236zM4 9.655V17l8 4v-8.345L4 9.655zm16 0L12 12.655V21l8-4V9.655z"></path>
    </svg>
);

// Icon for Saweria (Support/Donation)
const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9-23.375 23.375 0 01-2.841-2.446 22.35 22.35 0 01-1.724-2.12c-.54-1.024-.922-2.13-.922-3.268 0-2.451 1.99-4.441 4.441-4.441 1.258 0 2.443.512 3.303 1.371a4.426 4.426 0 013.303-1.371c2.451 0 4.441 1.99 4.441 4.441 0 1.138-.382 2.244-.922 3.268a22.35 22.35 0 01-1.724 2.12 23.375 23.375 0 01-2.841 2.446 22.045 22.045 0 01-2.582 1.9 20.753 20.753 0 01-1.162.682l-.02.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
    </svg>
);

// Icon for Telegram
const TelegramIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.58c-.27 1.13-1.04 1.4-1.74.88l-4.98-3.9-2.28 2.2c-.28.27-.52.5-1.04.5s-.71-.23-.96-.49l-.28-.27z" />
    </svg>
);

// Icon for Search
const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
);

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <header className="p-4 border-b border-slate-800/50 sticky top-0 bg-slate-950/80 backdrop-blur-md z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <GovoetLogo className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-slate-100">
            GOVOET
          </h1>
        </div>
        <div className="flex items-center gap-4">
            <a 
                href="https://saweria.co/justfutball" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Dukung kami di Saweria"
                className="text-slate-400 hover:text-blue-500 transition-colors"
                aria-label="Dukung kami di Saweria"
            >
                <HeartIcon className="w-6 h-6" />
            </a>
            <a 
                href="https://t.me/FootySch" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Gabung saluran Telegram kami"
                className="text-slate-400 hover:text-blue-500 transition-colors"
                aria-label="Gabung saluran Telegram kami"
            >
                <TelegramIcon className="w-6 h-6" />
            </a>
        </div>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="h-5 w-5 text-slate-500" />
        </div>
        <input
            type="search"
            name="search"
            id="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full rounded-md border-0 bg-slate-900 py-2.5 pl-10 pr-3 text-slate-200 ring-1 ring-inset ring-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 transition-all"
            placeholder="Search by team or league..."
            aria-label="Search matches"
        />
      </div>
    </header>
  );
};
