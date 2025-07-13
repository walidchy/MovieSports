import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../../hooks/useFavorites';
import MovieCard from './MovieCard';
import { NoDataMessage } from '../common/ErrorMessage';
import Loading from '../common/Loading';

const FavoritesSection = () => {
  const { favorites, loading, clearAllFavorites } = useFavorites();
  const [sortBy, setSortBy] = useState('dateAdded'); // dateAdded, title, year, rating
  const [filterBy, setFilterBy] = useState('all'); // all, decade, genre
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all favorites? This action cannot be undone.')) {
      clearAllFavorites();
    }
  };

  // Sort and filter favorites
  const processedFavorites = useMemo(() => {
    let processed = [...favorites];

    // Apply sorting
    switch (sortBy) {
      case 'title':
        processed.sort((a, b) => a.Title.localeCompare(b.Title));
        break;
      case 'year':
        processed.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
        break;
      case 'rating':
        processed.sort((a, b) => {
          const ratingA = parseFloat(a.imdbRating) || 0;
          const ratingB = parseFloat(b.imdbRating) || 0;
          return ratingB - ratingA;
        });
        break;
      case 'dateAdded':
      default:
        // Keep original order (most recently added first)
        processed.reverse();
        break;
    }

    return processed;
  }, [favorites, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (favorites.length === 0) return null;

    console.log('📊 Calculating stats for favorites:', favorites);

    // Parse years more robustly
    const years = favorites
      .map(movie => {
        if (!movie.Year || movie.Year === 'N/A') return null;
        const year = parseInt(movie.Year.toString().replace(/[^\d]/g, ''));
        return (year >= 1800 && year <= new Date().getFullYear() + 5) ? year : null;
      })
      .filter(year => year !== null);

    // Parse ratings more robustly
    const ratings = favorites
      .map(movie => {
        if (!movie.imdbRating || movie.imdbRating === 'N/A') return null;
        const rating = parseFloat(movie.imdbRating.toString());
        return (rating >= 0 && rating <= 10) ? rating : null;
      })
      .filter(rating => rating !== null);

    // Parse genres more robustly
    const genres = favorites
      .flatMap(movie => {
        if (!movie.Genre || movie.Genre === 'N/A') return [];
        return movie.Genre.split(',').map(g => g.trim()).filter(g => g.length > 0);
      })
      .filter(genre => genre && genre.length > 0);

    const genreCount = genres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});

    const topGenre = Object.entries(genreCount).sort(([,a], [,b]) => b - a)[0];

    // Calculate total runtime more carefully
    const totalMinutes = favorites.reduce((total, movie) => {
      if (!movie.Runtime || movie.Runtime === 'N/A') return total;
      
      const runtimeStr = movie.Runtime.toString().toLowerCase();
      let minutes = 0;
      
      // Handle different runtime formats
      if (runtimeStr.includes('h') && runtimeStr.includes('m')) {
        // Format: "2h 30m" or "2h30m"
        const hours = parseInt(runtimeStr.match(/(\d+)h/)?.[1] || '0');
        const mins = parseInt(runtimeStr.match(/(\d+)m/)?.[1] || '0');
        minutes = (hours * 60) + mins;
      } else if (runtimeStr.includes('h')) {
        // Format: "2h" or "2 hours"
        const hours = parseInt(runtimeStr.match(/(\d+)/)?.[1] || '0');
        minutes = hours * 60;
      } else if (runtimeStr.includes('min')) {
        // Format: "120 min"
        minutes = parseInt(runtimeStr.match(/(\d+)/)?.[1] || '0');
      } else {
        // Format: "120" (assume minutes)
        minutes = parseInt(runtimeStr.replace(/[^\d]/g, '')) || 0;
      }
      
      return total + (minutes > 0 && minutes < 1000 ? minutes : 0); // Sanity check
    }, 0);

    const calculatedStats = {
      total: favorites.length,
      latestYear: years.length > 0 ? Math.max(...years) : 'N/A',
      oldestYear: years.length > 0 ? Math.min(...years) : 'N/A',
      avgRating: ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 'N/A',
      topGenre: topGenre ? topGenre[0] : 'N/A',
      totalRuntime: totalMinutes
    };

    console.log('📊 Calculated stats:', calculatedStats);
    return calculatedStats;
  }, [favorites]);

  if (loading) {
    return <Loading text="Loading your favorite movies..." />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.div
        className="relative bg-gradient-to-b from-gray-900 to-black py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4"
              variants={itemVariants}
            >
              ❤️ <span className="text-red-600">My</span> Favorites
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Your personal collection of amazing movies
            </motion.p>
            
            {favorites.length > 0 && (
              <motion.div 
                className="mt-6 flex flex-wrap items-center justify-center gap-4"
                variants={itemVariants}
              >
                <div className="bg-red-600/20 border border-red-600/30 rounded-lg px-4 py-2">
                  <span className="text-red-400 font-semibold">
                    {favorites.length} movie{favorites.length !== 1 ? 's' : ''} saved
                  </span>
                </div>
                
                {stats && stats.totalRuntime > 0 && (
                  <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg px-4 py-2">
                    <span className="text-blue-400 font-semibold">
                      {Math.round(stats.totalRuntime / 60)}h {stats.totalRuntime % 60}m total runtime
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Controls Section */}
        {favorites.length > 0 && (
          <motion.div
            className="mb-8 bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Sort and Filter Controls */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Sort By */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="dateAdded">Recently Added</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="year">Year (Newest)</option>
                    <option value="rating">Rating (Highest)</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm font-medium">View:</span>
                  <div className="flex bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-red-600 text-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-red-600 text-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Clear All Button */}
              <motion.button
                onClick={handleClearAll}
                className="bg-red-600/20 hover:bg-red-600 border border-red-600/30 hover:border-red-600 text-red-400 hover:text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear All</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {favorites.length === 0 ? (
            <motion.div
              key="no-favorites"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <motion.div
                className="mb-8"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="text-8xl mb-4">💔</div>
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-300">No favorite movies yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Start building your personal movie collection by clicking the heart icon on any movie you love!
              </p>
              
              <motion.div
                className="bg-gradient-to-r from-red-600 to-pink-600 rounded-lg p-6 max-w-lg mx-auto"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="text-lg font-semibold mb-2">💡 Pro Tip</h4>
                <p className="text-sm text-gray-200">
                  Browse through our movie categories and add your favorites to create your own personalized watchlist!
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="favorites-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Movies Grid/List */}
              <motion.div
                className={
                  viewMode === 'grid'
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-12"
                    : "space-y-4 mb-12"
                }
                layout
              >
                {processedFavorites.map((movie, index) => (
                  <motion.div
                    key={movie.imdbID}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    layout
                    className={viewMode === 'list' ? 'w-full max-w-sm mx-auto' : ''}
                  >
                    <MovieCard movie={movie} index={index} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Statistics Section */}
              {stats && (
                <motion.div
                  className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-center">
                    📊 Your Collection Stats
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <motion.div 
                      className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-600"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="text-3xl font-bold text-red-400 mb-2">
                        {stats.total}
                      </div>
                      <div className="text-gray-400 text-sm">Total Movies</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-600"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="text-3xl font-bold text-yellow-400 mb-2">
                        {stats.avgRating}
                      </div>
                      <div className="text-gray-400 text-sm">Avg Rating</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-600"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        {stats.latestYear}
                      </div>
                      <div className="text-gray-400 text-sm">Latest Year</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-600"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="text-3xl font-bold text-blue-400 mb-2">
                        {stats.oldestYear}
                      </div>
                      <div className="text-gray-400 text-sm">Oldest Year</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-600"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="text-2xl font-bold text-purple-400 mb-2">
                        {stats.topGenre}
                      </div>
                      <div className="text-gray-400 text-sm">Top Genre</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-600"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="text-2xl font-bold text-orange-400 mb-2">
                        {Math.round(stats.totalRuntime / 60)}h
                      </div>
                      <div className="text-gray-400 text-sm">Total Runtime</div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FavoritesSection;
