import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSportsFavorites } from '../../hooks/useSportsFavorites';
import FootballCard from './FootballCard';
import BasketballCard from './BasketballCard';
import Loading from '../common/Loading';

const SportsFavoritesSection = () => {
  const { favorites, loading, clearAllFavorites } = useSportsFavorites();
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('dateAdded');

  const handleClearAll = (sport = null) => {
    const message = sport 
      ? `Are you sure you want to remove all ${sport} favorites?`
      : 'Are you sure you want to remove all sports favorites?';
    
    if (window.confirm(message)) {
      clearAllFavorites(sport);
    }
  };

  // Get all favorites combined
  const allFavorites = useMemo(() => {
    return [
      ...favorites.football.map(item => ({ ...item, sport: 'football' })),
      ...favorites.basketball.map(item => ({ ...item, sport: 'basketball' })),
      ...favorites.formula1.map(item => ({ ...item, sport: 'formula1' }))
    ];
  }, [favorites]);

  // Filter and sort favorites
  const processedFavorites = useMemo(() => {
    let filtered = [];
    
    switch (activeTab) {
      case 'football':
        filtered = favorites.football.map(item => ({ ...item, sport: 'football' }));
        break;
      case 'basketball':
        filtered = favorites.basketball.map(item => ({ ...item, sport: 'basketball' }));
        break;
      case 'formula1':
        filtered = favorites.formula1.map(item => ({ ...item, sport: 'formula1' }));
        break;
      case 'all':
      default:
        filtered = allFavorites;
        break;
    }

    // Sort favorites
    switch (sortBy) {
      case 'dateAdded':
        filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
      case 'sport':
        filtered.sort((a, b) => a.sport.localeCompare(b.sport));
        break;
      default:
        break;
    }

    return filtered;
  }, [favorites, activeTab, sortBy, allFavorites]);

  const totalCount = allFavorites.length;

  const renderSportsCard = (item, index) => {
    switch (item.sport) {
      case 'football':
        return <FootballCard key={item.id} fixture={item} index={index} />;
      case 'basketball':
        return <BasketballCard key={item.id} game={item} index={index} />;
      case 'formula1':
        return (
          <motion.div
            key={item.id}
            className="bg-gray-900 rounded-xl p-6 border border-red-600/30 hover:border-red-600 transition-all duration-300 hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                🏁 F1
              </span>
              <span className="text-gray-400 text-sm">
                {new Date(item.date).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-xl font-bold mb-2 text-red-400">
              {item.raceName}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">🏁</span>
                <span className="text-sm">{item.circuit}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">📍</span>
                <span className="text-sm">{item.location}</span>
              </div>
              {item.round && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">🏆</span>
                  <span className="text-sm">Round {item.round}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Added {new Date(item.dateAdded).toLocaleDateString()}
              </div>
              <div className="text-red-400 text-xl">❤️</div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <Loading text="Loading your sports favorites..." />;
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
              🏆 <span className="text-blue-600">Sports</span> Favorites
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Your collection of favorite sports matches and races
            </motion.p>
            
            {totalCount > 0 && (
              <motion.div 
                className="mt-6 flex flex-wrap items-center justify-center gap-4"
                variants={itemVariants}
              >
                <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg px-4 py-2">
                  <span className="text-blue-400 font-semibold">
                    {totalCount} sports item{totalCount !== 1 ? 's' : ''} saved
                  </span>
                </div>
                
                <div className="bg-green-600/20 border border-green-600/30 rounded-lg px-4 py-2">
                  <span className="text-green-400 font-semibold">
                    ⚽ {favorites.football.length} Football
                  </span>
                </div>
                
                <div className="bg-orange-600/20 border border-orange-600/30 rounded-lg px-4 py-2">
                  <span className="text-orange-400 font-semibold">
                    🏀 {favorites.basketball.length} Basketball
                  </span>
                </div>
                
                <div className="bg-red-600/20 border border-red-600/30 rounded-lg px-4 py-2">
                  <span className="text-red-400 font-semibold">
                    🏁 {favorites.formula1.length} Formula 1
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Controls Section */}
        {totalCount > 0 && (
          <motion.div
            className="mb-8 bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'All Sports', count: totalCount },
                  { id: 'football', label: 'Football', count: favorites.football.length },
                  { id: 'basketball', label: 'Basketball', count: favorites.basketball.length },
                  { id: 'formula1', label: 'Formula 1', count: favorites.formula1.length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {/* Sort and Clear */}
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="dateAdded">Recently Added</option>
                    <option value="sport">Sport Type</option>
                  </select>
                </div>

                <motion.button
                  onClick={() => handleClearAll(activeTab === 'all' ? null : activeTab)}
                  className="bg-red-600/20 hover:bg-red-600 border border-red-600/30 hover:border-red-600 text-red-400 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear {activeTab === 'all' ? 'All' : activeTab}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {totalCount === 0 ? (
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
                <div className="text-8xl mb-4">🏆</div>
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-300">No sports favorites yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Start building your sports collection by clicking the heart icon on any match or race you want to follow!
              </p>
              
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 max-w-lg mx-auto"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="text-lg font-semibold mb-2">🚀 Get Started</h4>
                <p className="text-sm text-gray-200">
                  Explore Football matches, NBA games, and Formula 1 races to add your favorites!
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
              {/* Sports Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                layout
              >
                {processedFavorites.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    layout
                  >
                    {renderSportsCard(item, index)}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SportsFavoritesSection;
