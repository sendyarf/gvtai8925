import React from 'react';

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

const NEW_YEAR_GIF_URL = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhTrt56JP0cCdSAgkZhyphenhyphenci9Wgu1ou3f8A3W2uOc0KOrRqqy3O0ZEtcKbrajhSKFGItI0yo1D0uANAHj1RljwScJlPjuxXF6p4I-kL7iKTh8oAwH3isB-oQof8jc-YTtE3q78rUZXk-1I0XHC7gfOcGMWkCkrTfVMFXoXBBxkR2Nfkzzbojxlz8tD-r6DRre/s1600/kembangapi.gif';

export const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
// FOR TESTING: Always show the background.
// To make it dynamic, you would use logic like this:
// const isNewYearPeriod = () => {
// const now = new Date();
// const month = now.getMonth(); // 0-11
// const day = now.getDate();
// return (month === 11 && day === 31) || (month === 0 && day <= 2);
// };
  
  const showNewYearBackground = true;

  return (
    <header className="border-b border-white/10 sticky top-0 bg-background/80 backdrop-blur-md z-10 overflow-hidden">
      {showNewYearBackground && (
        <>
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${NEW_YEAR_GIF_URL})` }}
                aria-hidden="true"
            ></div>
            <div className="absolute inset-0 bg-black/50" aria-hidden="true"></div>
        </>
      )}
      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-text-primary">
              GOVOET
            </h1>
          </div>
          <div className="flex items-center gap-4">
              <a 
                  href="https://saweria.co/justfutball" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="Dukung kami di Saweria"
                  className="text-text-secondary hover:text-secondary-accent transition-colors"
                  aria-label="Dukung kami di Saweria"
              >
                  <HeartIcon className="w-6 h-6" />
              </a>
              <a 
                  href="https://t.me/FootySch" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="Gabung saluran Telegram kami"
                  className="text-text-secondary hover:text-secondary-accent transition-colors"
                  aria-label="Gabung saluran Telegram kami"
              >
                  <TelegramIcon className="w-6 h-6" />
              </a>
          </div>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-5 w-5 text-text-secondary" />
          </div>
          <input
              type="search"
              name="search"
              id="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full rounded-md border-0 bg-surface py-2.5 pl-10 pr-3 text-text-primary ring-1 ring-inset ring-white/10 placeholder:text-text-secondary focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6 transition-all"
              placeholder="Search by team or league..."
              aria-label="Search matches"
          />
        </div>
      </div>
    </header>
  );
};