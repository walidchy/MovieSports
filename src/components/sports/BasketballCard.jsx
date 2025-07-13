import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSportsFavorites } from '../../hooks/useSportsFavorites';

const BasketballDetailsModal = ({ game, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Game Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Game Info */}
        <div className="space-y-6">
          {/* Teams Section */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-4">Teams</h3>
            <div className="space-y-4">
              {/* Home Team */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {game.teams?.home?.logo ? (
                    <img src={game.teams.home.logo} alt={game.teams.home.name} className="w-10 h-10 object-contain" />
                  ) : (
                    <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">H</span>
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium">{game.teams?.home?.name || 'Home Team'}</p>
                    <p className="text-gray-400 text-sm">Home • {game.teams?.home?.code || 'HOM'}</p>
                  </div>
                </div>
                <span className="text-3xl font-bold text-white">
                  {game.scores?.home?.points ?? '-'}
                </span>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {game.teams?.visitors?.logo ? (
                      <img src={game.teams.visitors.logo} alt={game.teams.visitors.name} className="w-10 h-10 object-contain" />
                    ) : (
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">V</span>
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{game.teams?.visitors?.name || 'Visitors'}</p>
                      <p className="text-gray-400 text-sm">Away • {game.teams?.visitors?.code || 'VIS'}</p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-white">
                    {game.scores?.visitors?.points ?? '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Game Information */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-4">Game Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-white font-medium">
                  {game.status?.long || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Date & Time</p>
                <p className="text-white font-medium">
                  {new Date(game.date?.start).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Season</p>
                <p className="text-white font-medium">
                  {game.season || '2023-24'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Arena</p>
                <p className="text-white font-medium">
                  {game.arena?.name || 'Arena TBD'}
                </p>
              </div>
            </div>
          </div>

          {/* Quarter Scores */}
          {game.scores?.home?.linescore && (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-4">Quarter by Quarter</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left text-gray-400 py-2">Team</th>
                      <th className="text-center text-gray-400 py-2">Q1</th>
                      <th className="text-center text-gray-400 py-2">Q2</th>
                      <th className="text-center text-gray-400 py-2">Q3</th>
                      <th className="text-center text-gray-400 py-2">Q4</th>
                      <th className="text-center text-gray-400 py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700">
                      <td className="text-white font-medium py-2">{game.teams?.home?.code || 'HOME'}</td>
                      {game.scores.home.linescore.map((score, index) => (
                        <td key={index} className="text-center text-white py-2">{score || '-'}</td>
                      ))}
                      <td className="text-center text-white font-bold py-2">{game.scores.home.points}</td>
                    </tr>
                    <tr>
                      <td className="text-white font-medium py-2">{game.teams?.visitors?.code || 'AWAY'}</td>
                      {game.scores.visitors.linescore.map((score, index) => (
                        <td key={index} className="text-center text-white py-2">{score || '-'}</td>
                      ))}
                      <td className="text-center text-white font-bold py-2">{game.scores.visitors.points}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const BasketballCard = ({ game, index = 0 }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { checkIsFavorite, toggleFavorite } = useSportsFavorites('basketball');

  const isFavorite = checkIsFavorite(game);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(game);
  };

  const getStatusColor = (status) => {
    switch (status?.short) {
      case 3:
        return 'bg-green-600';
      case 2:
        return 'bg-red-600 animate-pulse';
      case 1:
        return 'bg-blue-600';
      case 0:
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status?.short) {
      case 3:
        return 'Final';
      case 2:
        return 'Live';
      case 1:
        return 'Scheduled';
      case 0:
        return 'TBD';
      default:
        return status?.long || 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <motion.div
        className="relative flex-shrink-0 w-full h-80 cursor-pointer group"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setShowDetails(true)}
      >
        {/* Main Card */}
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl border border-gray-700">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-10">
            <motion.span
              className={`${getStatusColor(game.status)} text-white text-xs font-bold px-3 py-1 rounded-full`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {getStatusText(game.status)}
            </motion.span>
          </div>

          {/* Favorite Heart Icon */}
          <motion.button
            onClick={handleFavoriteClick}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-200 z-20 ${
              isFavorite 
                ? 'bg-orange-600 text-white shadow-lg' 
                : 'bg-black/60 text-gray-300 hover:text-orange-400 hover:bg-orange-600/30'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <motion.span
              className="text-lg"
              animate={{ 
                scale: isFavorite ? [1, 1.2, 1] : 1,
                rotate: isFavorite ? [0, 10, -10, 0] : 0
              }}
              transition={{ duration: 0.4 }}
            >
              {isFavorite ? '🧡' : '🤍'}
            </motion.span>
          </motion.button>

          {/* More Info Button */}
          <AnimatePresence>
            {isHovered && (
              <motion.button
                className="absolute top-4 left-4 bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full shadow-lg z-20"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(true);
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-6 text-white">
            {/* Header */}
            <div className="space-y-2">
              <div className="text-gray-400 text-sm">
                {formatDate(game.date?.start)}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-400">🏀</span>
                <span className="text-gray-300 text-sm font-medium">
                  NBA Game
                </span>
              </div>
            </div>

            {/* Teams Section */}
            <div className="space-y-4">
              {/* Home Team */}
              <motion.div
                className="flex items-center justify-between"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  {game.teams?.home?.logo ? (
                    <img 
                      src={game.teams.home.logo} 
                      alt={game.teams.home.name} 
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {game.teams?.home?.code?.charAt(0) || 'H'}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-white font-medium text-sm">
                      {game.teams?.home?.name || 'Home Team'}
                    </span>
                    <div className="text-gray-400 text-xs">
                      {game.teams?.home?.code || 'HOME'}
                    </div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-white">
                  {game.scores?.home?.points ?? '-'}
                </span>
              </motion.div>

              {/* VS Divider */}
              <div className="flex items-center justify-center">
                <div className="w-full h-px bg-gray-600"></div>
                <span className="px-3 text-gray-500 text-xs font-medium">VS</span>
                <div className="w-full h-px bg-gray-600"></div>
              </div>

              {/* Away Team */}
              <motion.div
                className="flex items-center justify-between"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  {game.teams?.visitors?.logo ? (
                    <img 
                      src={game.teams.visitors.logo} 
                      alt={game.teams.visitors.name} 
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {game.teams?.visitors?.code?.charAt(0) || 'V'}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-white font-medium text-sm">
                      {game.teams?.visitors?.name || 'Visitors'}
                    </span>
                    <div className="text-gray-400 text-xs">
                      {game.teams?.visitors?.code || 'AWAY'}
                    </div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-white">
                  {game.scores?.visitors?.points ?? '-'}
                </span>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-center space-x-2 text-gray-400 text-xs">
                <span>🏟️</span>
                <span>{game.arena?.name || 'Arena TBD'}</span>
              </div>
              {game.arena?.city && (
                <div className="flex items-center space-x-2 text-gray-500 text-xs">
                  <span>📍</span>
                  <span>{game.arena.city}, {game.arena.state || 'USA'}</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Hover Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center text-white z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center space-y-3">
                  <div className="text-lg font-bold">
                    {game.teams?.home?.code || 'HOME'} vs {game.teams?.visitors?.code || 'AWAY'}
                  </div>
                  <div className="text-3xl font-bold">
                    {game.scores?.home?.points ?? '-'} - {game.scores?.visitors?.points ?? '-'}
                  </div>
                  <div className="text-sm text-gray-300">
                    NBA Game
                  </div>
                  {game.status?.short === 2 && (
                    <div className="text-red-400 text-sm font-medium animate-pulse">
                      🔴 LIVE
                    </div>
                  )}
                  <motion.div
                    className="mt-4 text-xs text-orange-400 font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Click for full details →
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <BasketballDetailsModal
            game={game}
            onClose={() => setShowDetails(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default BasketballCard;
