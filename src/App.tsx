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
  const [showUpdateToast, setShowUpdateToast] = useState(false);

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
        setAllMatches(data);

        if (!isInitialLoad) {
          setShowUpdateToast(true);
          setTimeout(() => setShowUpdateToast(false), 3000); // Toast visible for 3 seconds
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
  }, []);

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
        <div className="flex-grow overflow-y-auto p-4 space-y-8">
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

      {/* Toast Notification */}
      {showUpdateToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in-out">
          <div className="bg-accent text-background font-semibold px-4 py-2 rounded-lg shadow-lg">
            Jadwal telah diperbarui.
          </div>
        </div>
      )}
    </div>
  );
};

export default App;