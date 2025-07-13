import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSportsFavorites } from '../../hooks/useSportsFavorites';

const FootballDetailsModal = ({ fixture, onClose }) => {
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
          <h2 className="text-2xl font-bold text-white">Match Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Match Info */}
        <div className="space-y-6">
          {/* Teams Section */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-4">Teams</h3>
            <div className="space-y-4">
              {/* Home Team */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {fixture.teams?.home?.logo ? (
                    <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} className="w-10 h-10 object-contain" />
                  ) : (
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">H</span>
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium">{fixture.teams?.home?.name || 'Home Team'}</p>
                    <p className="text-gray-400 text-sm">Home</p>
                  </div>
                </div>
                <span className="text-3xl font-bold text-white">
                  {fixture.goals?.home ?? '-'}
                </span>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {fixture.teams?.away?.logo ? (
                      <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} className="w-10 h-10 object-contain" />
                    ) : (
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">A</span>
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{fixture.teams?.away?.name || 'Away Team'}</p>
                      <p className="text-gray-400 text-sm">Away</p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-white">
                    {fixture.goals?.away ?? '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Match Information */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-4">Match Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-white font-medium">
                  {fixture.fixture?.status?.long || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Date & Time</p>
                <p className="text-white font-medium">
                  {new Date(fixture.fixture?.date).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">League</p>
                <p className="text-white font-medium">
                  {fixture.league?.name || 'League TBD'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Venue</p>
                <p className="text-white font-medium">
                  {fixture.fixture?.venue?.name || 'Stadium TBD'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FootballCard = ({ fixture, index = 0 }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { checkIsFavorite, toggleFavorite } = useSportsFavorites('football');

  const isFavorite = checkIsFavorite(fixture);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(fixture);
  };

  const getStatusColor = (status) => {
    switch (status?.short) {
      case 'FT':
        return 'bg-green-600';
      case 'LIVE':
      case '1H':
      case '2H':
      case 'HT':
        return 'bg-red-600 animate-pulse';
      case 'NS':
        return 'bg-blue-600';
      case 'PST':
      case 'CANC':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status?.short) {
      case 'FT':
        return 'FT';
      case 'LIVE':
        return 'LIVE';
      case '1H':
        return '1H';
      case '2H':
        return '2H';
      case 'HT':
        return 'HT';
      case 'NS':
        return 'Scheduled';
      case 'PST':
        return 'Postponed';
      case 'CANC':
        return 'Cancelled';
      default:
        return 'TBD';
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
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-10">
            <motion.span
              className={`${getStatusColor(fixture.fixture?.status)} text-white text-xs font-bold px-3 py-1 rounded-full`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {getStatusText(fixture.fixture?.status)}
            </motion.span>
          </div>

          {/* Favorite Heart Icon */}
          <motion.button
            onClick={handleFavoriteClick}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-200 z-20 ${
              isFavorite 
                ? 'bg-green-600 text-white shadow-lg' 
                : 'bg-black/60 text-gray-300 hover:text-green-400 hover:bg-green-600/30'
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
              {isFavorite ? '💚' : '🤍'}
            </motion.span>
          </motion.button>

          {/* More Info Button */}
          <AnimatePresence>
            {isHovered && (
              <motion.button
                className="absolute top-4 left-4 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg z-20"
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
                {formatDate(fixture.fixture?.date)}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">⚽</span>
                <span className="text-gray-300 text-sm font-medium">
                  {fixture.league?.name || 'Football Match'}
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
                  {fixture.teams?.home?.logo ? (
                    <img 
                      src={fixture.teams.home.logo} 
                      alt={fixture.teams.home.name} 
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">H</span>
                    </div>
                  )}
                  <div>
                    <span className="text-white font-medium text-sm">
                      {fixture.teams?.home?.name || 'Home Team'}
                    </span>
                    <div className="text-gray-400 text-xs">Home</div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-white">
                  {fixture.goals?.home ?? '-'}
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
                  {fixture.teams?.away?.logo ? (
                    <img 
                      src={fixture.teams.away.logo} 
                      alt={fixture.teams.away.name} 
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">A</span>
                    </div>
                  )}
                  <div>
                    <span className="text-white font-medium text-sm">
                      {fixture.teams?.away?.name || 'Away Team'}
                    </span>
                    <div className="text-gray-400 text-xs">Away</div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-white">
                  {fixture.goals?.away ?? '-'}
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
                <span>{fixture.fixture?.venue?.name || 'Stadium TBD'}</span>
              </div>
              {fixture.fixture?.venue?.city && (
                <div className="flex items-center space-x-2 text-gray-500 text-xs">
                  <span>📍</span>
                  <span>{fixture.fixture.venue.city}</span>
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
                    {fixture.teams?.home?.name || 'Home'} vs {fixture.teams?.away?.name || 'Away'}
                  </div>
                  <div className="text-3xl font-bold">
                    {fixture.goals?.home ?? '-'} - {fixture.goals?.away ?? '-'}
                  </div>
                  <div className="text-sm text-gray-300">
                    {fixture.league?.name || 'Football Match'}
                  </div>
                  <motion.div
                    className="mt-4 text-xs text-green-400 font-medium"
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
          <FootballDetailsModal
            fixture={fixture}
            onClose={() => setShowDetails(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FootballCard;
