import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { MatchCard } from './components/StoryForm';
import { LoadingSpinner } from './components/LoadingDisplay';
import { ErrorMessage } from './components/ErrorMessage';
import { StreamPlayer } from './components/StreamPlayer';
import { UpcomingMatchDisplay } from './components/UpcomingMatchDisplay';
import type { Match, MatchWithState, MatchStatus } from './types';

const SCHEDULE_URL = 'https://weekendsch.pages.dev/sch/schedulegvt.json';

// Simple hook to check for screen size
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

const getLocalDateKey = (timestamp: number) => {
    const d = new Date(timestamp);
    // Format to YYYY-MM-DD to ensure correct sorting and uniqueness
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const groupMatchesByDate = (matches: MatchWithState[]): Record<string, MatchWithState[]> => {
  return matches.reduce((acc, match) => {
    // Group by local date derived from the UTC timestamp
    const dateKey = getLocalDateKey(match.startTime);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(match);
    return acc;
  }, {} as Record<string, MatchWithState[]>);
};

const formatDate = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // dateString is now a local 'YYYY-MM-DD' key. Parse it as a local date.
    // Splitting is safer than new Date(dateString) to avoid timezone interpretation issues.
    const [year, month, day] = dateString.split('-').map(Number);
    const matchDate = new Date(year, month - 1, day);
    
    if (matchDate.getTime() === today.getTime()) return 'Today';
    if (matchDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
    
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return matchDate.toLocaleDateString('en-US', options);
}

const App: React.FC = () => {
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [visibleMatches, setVisibleMatches] = useState<MatchWithState[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<MatchWithState | null>(null);
  const [activeStreamUrl, setActiveStreamUrl] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'schedule' | 'player'>('schedule');
  const [searchQuery, setSearchQuery] = useState('');
  const [initialMatchId, setInitialMatchId] = useState<string | null>(null);
  const [newScheduleData, setNewScheduleData] = useState<Match[] | null>(null);

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    const path = window.location.pathname;
    if (path && path.length > 1) {
      // Decode URI component to handle special characters in IDs
      const matchId = decodeURIComponent(path.substring(1)); 
      setInitialMatchId(matchId);
    }
  }, []);

  // Effect for fetching schedule: initial load + polling every 5 minutes
  useEffect(() => {
    const fetchSchedule = async (isInitialLoad = false) => {
      if (isInitialLoad) {
        setIsLoading(true);
        setError(null);
      }
      try {
        const response = await fetch(SCHEDULE_URL);
        if (!response.ok) {
          if (isInitialLoad) throw new Error(`Failed to load schedule: ${response.statusText}`);
          return; // Fail silently on auto-update
        }
        const data: Match[] = await response.json();
        
        if (isInitialLoad) {
          setAllMatches(data);
        } else {
          // On auto-update, check if data is actually new before showing notification
          if (JSON.stringify(data) !== JSON.stringify(allMatches)) {
            setNewScheduleData(data);
          }
        }
      } catch (err) {
        if (isInitialLoad) {
          console.error("Failed to fetch schedule:", err);
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } else {
          console.error("Auto-update failed:", err);
        }
      } finally {
        if (isInitialLoad) setIsLoading(false);
      }
    };

    fetchSchedule(true); // Initial fetch

    const intervalId = setInterval(() => fetchSchedule(false), 300000); // Poll every 5 minutes

    return () => clearInterval(intervalId);
  }, [allMatches]);

  // Effect for processing matches and preserving selection
  useEffect(() => {
    const timer = setInterval(() => {
      if (allMatches.length === 0) return;

      const now = Date.now();
      const updatedAndFiltered = allMatches
        .map(match => {
          try {
            const startTime = new Date(`${match.match_date}T${match.match_time}:00+07:00`).getTime();
            const displayTime = new Date(`${match.kickoff_date}T${match.kickoff_time}:00+07:00`).getTime();
            const durationInMs = parseFloat(match.duration) * 60 * 60 * 1000;
            const endTime = startTime + durationInMs;

            if (now >= endTime) return null;

            const status: MatchStatus = now >= startTime ? 'live' : 'upcoming';
            return { ...match, status, startTime, displayTime };
          } catch (e) {
            console.error(`Error processing match ${match.id}:`, e);
            return null;
          }
        })
        .filter((m): m is MatchWithState => m !== null);
      
      // Sort matches: live first, then by start time.
      updatedAndFiltered.sort((a, b) => {
        if (a.status === 'live' && b.status === 'upcoming') return -1;
        if (a.status === 'upcoming' && b.status === 'live') return 1;
        return a.startTime - b.startTime;
      });

      setVisibleMatches(updatedAndFiltered);

      // Preserve selected match across data refreshes
      if (selectedMatch) {
        const updatedSelected = updatedAndFiltered.find(m => m.id === selectedMatch.id);
        if (updatedSelected) {
          if (JSON.stringify(updatedSelected) !== JSON.stringify(selectedMatch)) {
            setSelectedMatch(updatedSelected);
          }
        } else {
          setSelectedMatch(null);
          setActiveStreamUrl(null);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [allMatches, selectedMatch]);

  const handleSelectMatch = useCallback((match: MatchWithState) => {
      setSelectedMatch(match);
      setActiveStreamUrl(null); // ALWAYS clear stream URL on new selection

      if (!isDesktop) {
        setMobileView('player');
      }
  }, [isDesktop]);

  const handleWatchStream = useCallback((url: string) => {
    setActiveStreamUrl(url);
    if (!isDesktop) {
      setMobileView('player');
    }
  }, [isDesktop]);

  // Effect to select match from URL after matches are loaded
  useEffect(() => {
    if (initialMatchId && visibleMatches.length > 0) {
      const matchToSelect = visibleMatches.find(m => m.id === initialMatchId);
      if (matchToSelect) {
        handleSelectMatch(matchToSelect);

        if (matchToSelect.status === 'live' && matchToSelect.servers.length > 0) {
          handleWatchStream(matchToSelect.servers[0].url);
        }

        setTimeout(() => {
          const element = document.getElementById(`match-${matchToSelect.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        setInitialMatchId(null);
        window.history.replaceState({}, document.title, window.location.origin);
      }
    }
  }, [visibleMatches, initialMatchId, handleSelectMatch, handleWatchStream]);

  const handleClosePlayer = useCallback(() => {
      setMobileView('schedule');
  }, []);

  const handleApplyUpdate = () => {
    if (newScheduleData) {
      setAllMatches(newScheduleData);
      setNewScheduleData(null);
      // Scroll to the top of the schedule list to see new matches
      const scheduleList = document.getElementById('schedule-list');
      if (scheduleList) {
        scheduleList.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const filteredMatches = useMemo(() => {
    if (!searchQuery.trim()) {
      return visibleMatches;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return visibleMatches.filter(match =>
      match.team1.name.toLowerCase().includes(lowercasedQuery) ||
      match.team2.name.toLowerCase().includes(lowercasedQuery) ||
      match.league.toLowerCase().includes(lowercasedQuery)
    );
  }, [visibleMatches, searchQuery]);

  const groupedMatches = useMemo(() => groupMatchesByDate(filteredMatches), [filteredMatches]);
  const sortedDates = Object.keys(groupedMatches).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const SchedulePanel = (
      <aside className="w-full lg:w-[35%] lg:max-w-md xl:max-w-lg bg-background lg:border-l lg:border-white/10 flex flex-col h-screen">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        {newScheduleData && (
          <div className="p-4 border-b border-white/10">
            <button
              onClick={handleApplyUpdate}
              className="w-full flex items-center justify-center gap-2 text-center py-2.5 px-4 text-sm bg-accent rounded-md text-background hover:bg-secondary-accent transition-all duration-200 font-semibold"
              title="Load new matches"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.204 2.103l-1.123.562a.75.75 0 01-.983-.983l.562-1.123a5.5 5.5 0 018.64-4.825.75.75 0 011.108.966l-1.11 2.221a.75.75 0 01-1.341.22l-.427-.852a3.001 3.001 0 00-4.633-2.22.75.75 0 01-1.23-.615A5.503 5.503 0 0112 5.5a5.5 5.5 0 015.488 5.076.75.75 0 01-.86.948l-1.316-.263zM4.688 8.576a5.5 5.5 0 019.204-2.103l1.123-.562a.75.75 0 11.983.983l-.562 1.123a5.5 5.5 0 01-8.64 4.825.75.75 0 01-1.108-.966l1.11-2.221a.75.75 0 011.341-.22l.427.852a3.001 3.001 0 004.633 2.22.75.75 0 011.23.615A5.503 5.503 0 018 14.5a5.5 5.5 0 01-5.488-5.076.75.75 0 01.86-.948l1.316.263z" clipRule="evenodd" />
              </svg>
              Jadwal baru tersedia, klik untuk memuat.
            </button>
          </div>
        )}
        <div id="schedule-list" className="flex-grow overflow-y-auto p-4 space-y-8">
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && sortedDates.length === 0 && (
            <div className="text-center py-16 px-6">
                {searchQuery ? (
                     <p className="text-text-secondary">No matches found for "<span className="font-semibold text-text-primary">{searchQuery}</span>".</p>
                ) : (
                    <p className="text-text-secondary">No matches scheduled. Please check back later.</p>
                )}
            </div>
          )}
          {!isLoading && !error && sortedDates.map(date => (
            <div key={date}>
              <h2 className="text-lg font-bold text-accent uppercase tracking-wider mb-4 px-2">
                {formatDate(date)}
              </h2>
              <div className="flex flex-col gap-3">
                {groupedMatches[date].map(match => (
                  <MatchCard 
                      key={match.id} 
                      match={match}
                      status={match.status}
                      displayTime={match.displayTime}
                      isSelected={selectedMatch?.id === match.id}
                      onSelect={() => handleSelectMatch(match)}
                    />
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
  );

  const PlayerPanel = (
       <main className="w-full flex-1 flex items-center justify-center p-0 lg:p-4 bg-background h-screen">
          {selectedMatch?.status === 'upcoming' ? (
            <UpcomingMatchDisplay match={selectedMatch} onClose={handleClosePlayer} />
          ) : (
            <StreamPlayer 
                match={selectedMatch} 
                streamUrl={activeStreamUrl} 
                onClose={handleClosePlayer} 
                onWatchStream={handleWatchStream}
            />
          )}
        </main>
  );


  return (
    <div className="min-h-screen bg-background font-sans text-text-primary">
      {isDesktop ? (
          <div className="flex flex-row h-screen">
              {PlayerPanel}
              {SchedulePanel}
          </div>
      ) : (
          <div className="h-screen">
              {mobileView === 'schedule' ? SchedulePanel : PlayerPanel}
          </div>
      )}
    </div>
  );
};

export default App;