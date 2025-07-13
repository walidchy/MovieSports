import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../../hooks/useFavorites';
import { getEnhancedMovieDetails } from '../../services/movieApi';
import MovieOverlay from './MovieOverlay';

const MovieCard = memo(({ movie, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [fullMovieData, setFullMovieData] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite(movie);
    }
  };

  const handleMoreInfoClick = async (e) => {
    e.stopPropagation();
    setLoadingDetails(true);
    
    try {
      console.log('🎬 Fetching full details for:', movie.Title);
      const fullDetails = await getEnhancedMovieDetails(movie.imdbID);
      setFullMovieData(fullDetails);
      setShowOverlay(true);
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
      // Fallback to basic movie data
      setFullMovieData(movie);
      setShowOverlay(true);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCardClick = () => {
    handleMoreInfoClick({ stopPropagation: () => {} });
  };

  // Get rating color based on IMDB rating
  const getRatingColor = (rating) => {
    const numRating = parseFloat(rating);
    if (numRating >= 8) return 'text-green-400';
    if (numRating >= 7) return 'text-yellow-400';
    if (numRating >= 6) return 'text-orange-400';
    return 'text-red-400';
  };

  // Truncate text helper
  const truncateText = (text, maxLength) => {
    if (!text || text === 'N/A') return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
        className="relative flex-shrink-0 w-48 h-80 cursor-pointer group"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleCardClick}
        layout={false}
      >
        {/* Movie Poster */}
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-800 shadow-xl">
          {movie.Poster && movie.Poster !== 'N/A' ? (
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700">
              <span className="text-6xl">🎬</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* Movie Info - Always visible */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            {/* Title */}
            <h3 className="font-bold text-sm mb-2 line-clamp-2 leading-tight">
              {movie.Title}
            </h3>
            
            {/* Year and Rating Row */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-300 bg-black/50 px-2 py-1 rounded">
                {movie.Year}
              </span>
              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <div className="flex items-center space-x-1 bg-black/50 px-2 py-1 rounded">
                  <span className="text-yellow-400 text-xs">⭐</span>
                  <span className={`text-xs font-medium ${getRatingColor(movie.imdbRating)}`}>
                    {movie.imdbRating}
                  </span>
                </div>
              )}
            </div>

            {/* Genre badges */}
            {movie.Genre && movie.Genre !== 'N/A' && (
              <div className="flex flex-wrap gap-1 mb-2">
                {movie.Genre.split(',').slice(0, 2).map((genre, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-600/80 px-2 py-0.5 rounded-full text-white font-medium"
                  >
                    {genre.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Runtime and Director */}
            <div className="space-y-1 text-xs text-gray-300">
              {movie.Runtime && movie.Runtime !== 'N/A' && (
                <div className="flex items-center space-x-1">
                  <span>⏱️</span>
                  <span>{movie.Runtime}</span>
                </div>
              )}
              {movie.Director && movie.Director !== 'N/A' && (
                <div className="flex items-center space-x-1">
                  <span>🎬</span>
                  <span>{truncateText(movie.Director, 20)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Favorite Heart Icon */}
          <motion.button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 z-20 ${
              isFavorite 
                ? 'bg-red-600 text-white shadow-lg' 
                : 'bg-black/60 text-gray-300 hover:text-red-400 hover:bg-red-600/30'
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
              {isFavorite ? '❤️' : '🤍'}
            </motion.span>
          </motion.button>

          {/* More Info Button - Only visible on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.button
                className="absolute top-3 left-3 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors z-20 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
                onClick={handleMoreInfoClick}
                disabled={loadingDetails}
              >
                {loadingDetails ? (
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </motion.button>
            )}
          </AnimatePresence>

          {/* Hover Overlay with Plot */}
          <AnimatePresence>
            {isHovered && movie.Plot && movie.Plot !== 'N/A' && (
              <motion.div
                className="absolute inset-0 bg-black/95 flex flex-col justify-center p-4 text-white z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center space-y-3">
                  <h3 className="font-bold text-lg line-clamp-2">
                    {movie.Title}
                  </h3>

                  {/* Movie Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-300">
                      <span className="text-yellow-400">Year:</span> {movie.Year}
                    </div>
                    {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                      <div className="text-gray-300">
                        <span className="text-yellow-400">Rating:</span> 
                        <span className={`ml-1 ${getRatingColor(movie.imdbRating)}`}>
                          {movie.imdbRating}
                        </span>
                      </div>
                    )}
                    {movie.Runtime && movie.Runtime !== 'N/A' && (
                      <div className="text-gray-300">
                        <span className="text-yellow-400">Runtime:</span> {movie.Runtime}
                      </div>
                    )}
                    {movie.Rated && movie.Rated !== 'N/A' && (
                      <div className="text-gray-300">
                        <span className="text-yellow-400">Rated:</span> {movie.Rated}
                      </div>
                    )}
                  </div>

                  {/* Plot */}
                  <p className="text-gray-300 text-xs line-clamp-4 leading-relaxed">
                    {truncateText(movie.Plot, 120)}
                  </p>

                  {/* Actors */}
                  {movie.Actors && movie.Actors !== 'N/A' && (
                    <div className="text-xs text-gray-400">
                      <span className="text-yellow-400">Cast:</span> {truncateText(movie.Actors, 50)}
                    </div>
                  )}

                  <motion.div
                    className="mt-3 text-xs text-blue-400 font-medium"
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

      {/* Movie Details Modal */}
      <AnimatePresence>
        {showOverlay && fullMovieData && (
          <MovieOverlay
            movie={fullMovieData}
            onClose={() => {
              setShowOverlay(false);
              setFullMovieData(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;
