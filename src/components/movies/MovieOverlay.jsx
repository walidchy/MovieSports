import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../../hooks/useFavorites';

const MovieOverlay = ({ movie, onClose }) => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite(movie);
    }
  };

  // Get rating icon and color
  const getRatingInfo = (source) => {
    switch (source) {
      case 'Internet Movie Database':
        return { icon: '🎬', color: 'text-yellow-400', bg: 'bg-yellow-900/30' };
      case 'Rotten Tomatoes':
        return { icon: '🍅', color: 'text-red-400', bg: 'bg-red-900/30' };
      case 'Metacritic':
        return { icon: '📊', color: 'text-green-400', bg: 'bg-green-900/30' };
      default:
        return { icon: '⭐', color: 'text-blue-400', bg: 'bg-blue-900/30' };
    }
  };

  // Format runtime
  const formatRuntime = (runtime) => {
    if (!runtime || runtime === 'N/A') return null;
    const minutes = parseInt(runtime);
    if (isNaN(minutes)) return runtime;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotateX: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeOut",
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 30,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-700"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          style={{ perspective: 1000 }}
        >
          {/* Header with Close Button */}
          <div className="relative">
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close movie details"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[95vh] custom-scrollbar">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="p-6 lg:p-8"
            >
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Poster */}
                <motion.div 
                  className="lg:col-span-1"
                  variants={itemVariants}
                >
                  <div className="sticky top-6">
                    {movie.Poster && movie.Poster !== 'N/A' ? (
                      <motion.img
                        src={movie.Poster}
                        alt={movie.Title}
                        className="w-full rounded-xl shadow-2xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-gray-800 rounded-xl flex items-center justify-center">
                        <span className="text-6xl">🎬</span>
                      </div>
                    )}

                    {/* Favorite Button */}
                    <motion.button
                      onClick={handleFavoriteClick}
                      className={`mt-4 w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                        isFavorite 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-xl">
                        {isFavorite ? '❤️' : '🤍'}
                      </span>
                      <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                    </motion.button>
                  </div>
                </motion.div>

                {/* Right Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Title and Year */}
                  <motion.div variants={itemVariants}>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
                      {movie.Title}
                    </h1>
                    <p className="text-xl text-gray-400">({movie.Year})</p>
                  </motion.div>

                  {/* Basic Info Row */}
                  <motion.div 
                    className="flex flex-wrap items-center gap-3"
                    variants={itemVariants}
                  >
                    {movie.Rated && movie.Rated !== 'N/A' && (
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                        {movie.Rated}
                      </span>
                    )}
                    {movie.Runtime && movie.Runtime !== 'N/A' && (
                      <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1">
                        <span>⏱️</span>
                        <span>{formatRuntime(movie.Runtime)}</span>
                      </span>
                    )}
                    {movie.Released && movie.Released !== 'N/A' && (
                      <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1">
                        <span>📅</span>
                        <span>{movie.Released}</span>
                      </span>
                    )}
                  </motion.div>

                  {/* Genres */}
                  {movie.Genre && movie.Genre !== 'N/A' && (
                    <motion.div variants={itemVariants}>
                      <h3 className="text-lg font-semibold text-white mb-3">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {movie.Genre.split(',').map((genre, index) => (
                          <motion.span
                            key={index}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                          >
                            {genre.trim()}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Plot */}
                  {movie.Plot && movie.Plot !== 'N/A' && (
                    <motion.div 
                      className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                      variants={itemVariants}
                    >
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                        <span>📖</span>
                        <span>Plot Summary</span>
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-base">
                        {movie.Plot}
                      </p>
                    </motion.div>
                  )}

                  {/* Ratings */}
                  {movie.Ratings && movie.Ratings.length > 0 && (
                    <motion.div variants={itemVariants}>
                      <h3 className="text-lg font-semibold text-white mb-4">Ratings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {movie.Ratings.map((rating, index) => {
                          const { icon, color, bg } = getRatingInfo(rating.Source);
                          return (
                            <motion.div
                              key={index}
                              className={`${bg} rounded-xl p-4 border border-gray-600`}
                              whileHover={{ scale: 1.02, y: -2 }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                            >
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-xl">{icon}</span>
                                <span className="text-gray-400 text-sm font-medium">
                                  {rating.Source}
                                </span>
                              </div>
                              <div className={`text-2xl font-bold ${color}`}>
                                {rating.Value}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Cast & Crew */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={itemVariants}
                  >
                    {/* Director */}
                    {movie.Director && movie.Director !== 'N/A' && (
                      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                          <span>🎬</span>
                          <span>Director</span>
                        </h4>
                        <p className="text-gray-300">{movie.Director}</p>
                      </div>
                    )}

                    {/* Writer */}
                    {movie.Writer && movie.Writer !== 'N/A' && (
                      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                          <span>✍️</span>
                          <span>Writer</span>
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{movie.Writer}</p>
                      </div>
                    )}
                  </motion.div>

                  {/* Actors */}
                  {movie.Actors && movie.Actors !== 'N/A' && (
                    <motion.div 
                      className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                      variants={itemVariants}
                    >
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <span>🎭</span>
                        <span>Cast</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {movie.Actors.split(',').map((actor, index) => (
                          <motion.div
                            key={index}
                            className="bg-gray-700/50 rounded-lg p-3 text-center border border-gray-600"
                            whileHover={{ scale: 1.02 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + index * 0.05 }}
                          >
                            <div className="text-gray-300 font-medium text-sm">
                              {actor.trim()}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Additional Information */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={itemVariants}
                  >
                    {/* Production Details */}
                    <div className="space-y-4">
                      {movie.Awards && movie.Awards !== 'N/A' && (
                        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                            <span>🏆</span>
                            <span>Awards</span>
                          </h4>
                          <p className="text-gray-300 text-sm leading-relaxed">{movie.Awards}</p>
                        </div>
                      )}

                      {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                            <span>💰</span>
                            <span>Box Office</span>
                          </h4>
                          <p className="text-gray-300 font-mono text-lg">{movie.BoxOffice}</p>
                        </div>
                      )}

                      {movie.Production && movie.Production !== 'N/A' && (
                        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                            <span>🏭</span>
                            <span>Production</span>
                          </h4>
                          <p className="text-gray-300">{movie.Production}</p>
                        </div>
                      )}
                    </div>

                    {/* Technical Details */}
                    <div className="space-y-4">
                      {movie.Language && movie.Language !== 'N/A' && (
                        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                            <span>🌍</span>
                            <span>Language</span>
                          </h4>
                          <p className="text-gray-300">{movie.Language}</p>
                        </div>
                      )}

                      {movie.Country && movie.Country !== 'N/A' && (
                        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                            <span>🏳️</span>
                            <span>Country</span>
                          </h4>
                          <p className="text-gray-300">{movie.Country}</p>
                        </div>
                      )}

                      {movie.Website && movie.Website !== 'N/A' && (
                        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                            <span>🌐</span>
                            <span>Official Website</span>
                          </h4>
                          <motion.a
                            href={movie.Website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                          >
                            <span>Visit Website</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </motion.a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MovieOverlay;
