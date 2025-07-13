import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBasketball } from '../hooks/useSports';
import BasketballCard from '../components/sports/BasketballCard';
import Loading, { SkeletonCard } from '../components/common/Loading';
import ErrorMessage, { NoDataMessage } from '../components/common/ErrorMessage';
import SearchBar from '../components/common/SearchBar';

const Basketball = () => {
  const { games, loading, error, fetchGames } = useBasketball();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  // Filter games based on search query
  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return games;
    
    const query = searchQuery.toLowerCase();
    return games.filter(game => 
      game.teams?.home?.name?.toLowerCase().includes(query) ||
      game.teams?.visitors?.name?.toLowerCase().includes(query) ||
      game.teams?.home?.code?.toLowerCase().includes(query) ||
      game.teams?.visitors?.code?.toLowerCase().includes(query) ||
      game.arena?.name?.toLowerCase().includes(query) ||
      game.arena?.city?.toLowerCase().includes(query) ||
      game.arena?.state?.toLowerCase().includes(query)
    );
  }, [games, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Identify hot/famous games (live games, popular teams, high scores)
  const getGamePriority = (game) => {
    let priority = 0;
    
    // Live games get highest priority
    if (game.status?.short === 2) {
      priority += 100;
    }
    
    // Popular teams get higher priority
    const popularTeams = ['Lakers', 'Warriors', 'Celtics', 'Heat', 'Nets', 'Knicks', 'Bulls', 'Mavericks', 'Clippers', 'Nuggets'];
    if (popularTeams.some(team => 
      game.teams?.home?.name?.includes(team) || 
      game.teams?.visitors?.name?.includes(team)
    )) {
      priority += 50;
    }
    
    // High-scoring games get priority
    const totalScore = (game.scores?.home?.points || 0) + (game.scores?.visitors?.points || 0);
    if (totalScore > 220) {
      priority += 25;
    }
    
    // Close games get priority
    const scoreDiff = Math.abs((game.scores?.home?.points || 0) - (game.scores?.visitors?.points || 0));
    if (scoreDiff <= 5 && game.status?.short === 3) {
      priority += 30;
    }
    
    return priority;
  };

  // Sort games by priority (hot games first)
  const sortedGames = useMemo(() => {
    return [...filteredGames].sort((a, b) => getGamePriority(b) - getGamePriority(a));
  }, [filteredGames]);

  // Get paginated games from sorted list
  const paginatedGames = sortedGames.slice(startIndex, endIndex);

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
        className="relative bg-gradient-to-b from-orange-900 to-black py-16"
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
              🏀 <span className="text-orange-400">NBA</span> Central
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Follow the latest NBA games, scores, and basketball action from all your favorite teams
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
              placeholder="Search teams, arenas, cities, or states..."
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
              {searchQuery ? 'Search Results' : "Today's NBA Games"}
            </h2>
            <div className="flex items-center space-x-4 text-gray-400">
              <span>
                {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} 
                {searchQuery ? ` found for "${searchQuery}"` : ' available'}
              </span>
              {searchQuery && (
                <motion.button
                  onClick={() => handleSearch('')}
                  className="text-orange-400 hover:text-orange-300 transition-colors text-sm flex items-center space-x-1"
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
            <div className="flex items-center space-x-2 bg-orange-600/20 border border-orange-600/30 rounded-lg px-3 py-2">
              <motion.div
                className="w-2 h-2 bg-orange-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-orange-400 text-sm font-medium">Live Scores</span>
            </div>

            <motion.button
              onClick={fetchGames}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
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
        {!searchQuery && paginatedGames.length > 0 && (
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
              {paginatedGames.slice(0, 4).filter(game => getGamePriority(game) > 0).map((game, index) => (
                <div key={game.id || index} className="relative">
                  {getGamePriority(game) >= 100 && (
                    <div className="absolute -top-2 -right-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      LIVE
                    </div>
                  )}
                  {getGamePriority(game) >= 50 && getGamePriority(game) < 100 && (
                    <div className="absolute -top-2 -right-2 z-10 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      HOT
                    </div>
                  )}
                  {getGamePriority(game) >= 25 && getGamePriority(game) < 50 && (
                    <div className="absolute -top-2 -right-2 z-10 bg-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      HIGH SCORE
                    </div>
                  )}
                  <BasketballCard
                    game={game}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Games Grid */}
        {error ? (
          <ErrorMessage
            message={error}
            onRetry={fetchGames}
          />
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(16)].map((_, index) => (
              <SkeletonCard key={index} className="h-80" />
            ))}
          </div>
        ) : paginatedGames.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {paginatedGames.map((game, index) => (
                <BasketballCard
                  key={game.id || index}
                  game={game}
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
                            ? 'bg-orange-600 text-white'
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
              Showing {startIndex + 1}-{Math.min(endIndex, filteredGames.length)} of {filteredGames.length} games
            </motion.div>
          </>
        ) : (
          <NoDataMessage
            message={searchQuery ? `No NBA games found for "${searchQuery}"` : "No NBA games today"}
            icon="🏀"
            suggestion={searchQuery ? "Try searching for different teams, arenas, or cities" : "Check back later for upcoming games"}
          />
        )}

        {/* NBA Information Cards */}
        <motion.div
          className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Game Features Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <span>🏀</span>
              <span>Game Features</span>
            </h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Live game scores and real-time updates</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Advanced search through teams and arenas</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Quarter-by-quarter score breakdowns</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Team logos and detailed information</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Arena locations and venue details</span>
              </div>
            </div>
          </div>

          {/* Game Status Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <span>📊</span>
              <span>Game Status Guide</span>
            </h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span><strong>Final</strong> - Game completed</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                <span><strong>Live</strong> - Game in progress</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span><strong>Scheduled</strong> - Upcoming game</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span><strong>Postponed</strong> - Delayed game</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span><strong>Cancelled</strong> - Game cancelled</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Season Info Banner */}
        <motion.div
          className="mt-8 bg-gradient-to-r from-orange-900 via-red-900 to-purple-900 rounded-xl p-8 border border-orange-600/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-3xl">🏆</span>
                <h3 className="text-2xl font-bold">2023-2024 NBA Season</h3>
              </div>
              <p className="text-gray-200 max-w-2xl">
                Follow all the action from the current NBA season with real-time scores, 
                game updates, and comprehensive match information. Use the search feature to find specific teams, arenas, or games.
              </p>
            </div>
            <div className="flex flex-col items-center text-center bg-black/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-400 mb-1">30</div>
              <div className="text-gray-300 text-sm">NBA Teams</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Basketball;
