import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFootball } from '../hooks/useSports';
import FootballCard from '../components/sports/FootballCard';
import Loading, { SkeletonCard } from '../components/common/Loading';
import ErrorMessage, { NoDataMessage } from '../components/common/ErrorMessage';
import SearchBar from '../components/common/SearchBar';

const Football = () => {
  const { fixtures, loading, error, fetchFixtures } = useFootball();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  // Filter fixtures based on search query
  const filteredFixtures = useMemo(() => {
    if (!searchQuery.trim()) return fixtures;
    
    const query = searchQuery.toLowerCase();
    return fixtures.filter(fixture => 
      fixture.teams?.home?.name?.toLowerCase().includes(query) ||
      fixture.teams?.away?.name?.toLowerCase().includes(query) ||
      fixture.league?.name?.toLowerCase().includes(query) ||
      fixture.fixture?.venue?.name?.toLowerCase().includes(query) ||
      fixture.fixture?.venue?.city?.toLowerCase().includes(query)
    );
  }, [fixtures, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredFixtures.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFixtures = filteredFixtures.slice(startIndex, endIndex);

  // Identify hot/famous games (live games, big leagues, high-profile teams)
  const getGamePriority = (fixture) => {
    let priority = 0;
    
    // Live games get highest priority
    if (fixture.fixture?.status?.short === 'LIVE' || 
        fixture.fixture?.status?.short === '1H' || 
        fixture.fixture?.status?.short === '2H') {
      priority += 100;
    }
    
    // Big leagues get higher priority
    const bigLeagues = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'Champions League'];
    if (bigLeagues.some(league => fixture.league?.name?.includes(league))) {
      priority += 50;
    }
    
    // Popular teams get higher priority
    const popularTeams = ['Manchester United', 'Real Madrid', 'Barcelona', 'Liverpool', 'Chelsea', 'Arsenal', 'Manchester City', 'Bayern Munich', 'PSG', 'Juventus'];
    if (popularTeams.some(team => 
      fixture.teams?.home?.name?.includes(team) || 
      fixture.teams?.away?.name?.includes(team)
    )) {
      priority += 25;
    }
    
    return priority;
  };

  // Sort fixtures by priority (hot games first)
  const sortedFixtures = useMemo(() => {
    return [...filteredFixtures].sort((a, b) => getGamePriority(b) - getGamePriority(a));
  }, [filteredFixtures]);

  // Get paginated fixtures from sorted list
  const paginatedFixtures = sortedFixtures.slice(startIndex, endIndex);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.div
        className="relative bg-gradient-to-b from-green-900 to-black py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              ⚽ <span className="text-green-400">Football</span> Central
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Stay updated with the latest football fixtures, scores, and match results from top leagues worldwide
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search teams, leagues, venues, or cities..."
              className="w-full"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header with Stats */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {searchQuery ? 'Search Results' : "Today's Fixtures"}
            </h2>
            <div className="flex items-center space-x-4 text-gray-400">
              <span>
                {filteredFixtures.length} match{filteredFixtures.length !== 1 ? 'es' : ''} 
                {searchQuery ? ` found for "${searchQuery}"` : ' available'}
              </span>
              {searchQuery && (
                <motion.button
                  onClick={() => handleSearch('')}
                  className="text-green-400 hover:text-green-300 transition-colors text-sm flex items-center space-x-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <span>✕</span>
                  <span>Clear search</span>
                </motion.button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Live indicator */}
            <div className="flex items-center space-x-2 bg-green-600/20 border border-green-600/30 rounded-lg px-3 py-2">
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-green-400 text-sm font-medium">Live Updates</span>
            </div>

            <motion.button
              onClick={fetchFixtures}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              <motion.svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={loading ? { rotate: 360 } : {}}
                transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </motion.svg>
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Hot Games Section */}
        {!searchQuery && paginatedFixtures.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🔥</span>
              <h3 className="text-xl font-bold text-white">Hot Games</h3>
              <div className="flex items-center space-x-1 bg-red-600/20 border border-red-600/30 rounded-lg px-2 py-1">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-red-400 text-xs font-medium">LIVE & FEATURED</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedFixtures.slice(0, 4).filter(fixture => getGamePriority(fixture) > 0).map((fixture, index) => (
                <div key={fixture.fixture?.id || index} className="relative">
                  {getGamePriority(fixture) >= 100 && (
                    <div className="absolute -top-2 -right-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      LIVE
                    </div>
                  )}
                  {getGamePriority(fixture) >= 50 && getGamePriority(fixture) < 100 && (
                    <div className="absolute -top-2 -right-2 z-10 bg-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      HOT
                    </div>
                  )}
                  <FootballCard
                    fixture={fixture}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Fixtures Grid */}
        {error ? (
          <ErrorMessage
            message={error}
            onRetry={fetchFixtures}
          />
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(16)].map((_, index) => (
              <SkeletonCard key={index} className="h-80" />
            ))}
          </div>
        ) : paginatedFixtures.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {paginatedFixtures.map((fixture, index) => (
                <FootballCard
                  key={fixture.fixture?.id || index}
                  fixture={fixture}
                  index={index}
                />
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                className="flex items-center justify-center space-x-2 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;
                    const showPage = page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2);
                    
                    if (!showPage) {
                      if (page === currentPage - 3 || page === currentPage + 3) {
                        return <span key={page} className="text-gray-500">...</span>;
                      }
                      return null;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          isCurrentPage
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </motion.div>
            )}

            {/* Page Info */}
            <motion.div
              className="text-center text-gray-400 text-sm mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Showing {startIndex + 1}-{Math.min(endIndex, filteredFixtures.length)} of {filteredFixtures.length} matches
            </motion.div>
          </>
        ) : (
          <NoDataMessage
            message={searchQuery ? `No football matches found for "${searchQuery}"` : "No football matches today"}
            icon="⚽"
            suggestion={searchQuery ? "Try searching for different teams, leagues, or venues" : "Check back later for upcoming fixtures"}
          />
        )}

        {/* Football Stats & Info */}
        <motion.div
          className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Features Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <span>⚡</span>
              <span>Features</span>
            </h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Live match scores and real-time updates</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Advanced search through teams, leagues & venues</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Team logos and detailed match information</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Match status tracking and venue details</span>
              </div>
            </div>
          </div>

          {/* Leagues Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <span>🏆</span>
              <span>Top Leagues</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 text-gray-300">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                <span>Premier League</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🇪🇸</span>
                <span>La Liga</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🇩🇪</span>
                <span>Bundesliga</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🇮🇹</span>
                <span>Serie A</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🇫🇷</span>
                <span>Ligue 1</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🌍</span>
                <span>Champions League</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Football;
