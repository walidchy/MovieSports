import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../../hooks/useFavorites';

const FeaturedCarousel = ({ movies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(1);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  // Filter movies that have posters for better visual experience
  const featuredMovies = movies.filter(movie => movie.Poster && movie.Poster !== 'N/A').slice(0, 8);

  const nextSlide = useCallback(() => {
    if (featuredMovies.length === 0) return;
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredMovies.length);
  }, [featuredMovies.length]);

  const prevSlide = useCallback(() => {
    if (featuredMovies.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredMovies.length) % featuredMovies.length);
  }, [featuredMovies.length]);

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || featuredMovies.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying, nextSlide, featuredMovies.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, prevSlide, isPlaying]);

  if (featuredMovies.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-800 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-gray-400">Loading featured movies...</p>
        </div>
      </div>
    );
  }

  const currentMovie = featuredMovies[currentIndex];
  const isFavorite = favorites.some(fav => fav.imdbID === currentMovie?.imdbID);

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFavorite(currentMovie.imdbID);
    } else {
      addFavorite(currentMovie);
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden bg-gray-900 shadow-2xl">
      {/* Main Carousel */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              nextSlide();
            } else if (swipe > swipeConfidenceThreshold) {
              prevSlide();
            }
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={currentMovie.Poster}
              alt={currentMovie.Title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Movie Info */}
                <motion.div
                  className="text-white space-y-6"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {/* Featured Badge */}
                  <motion.div
                    className="inline-flex items-center space-x-2 bg-red-600 px-4 py-2 rounded-full text-sm font-semibold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <span>⭐</span>
                    <span>Featured Movie</span>
                  </motion.div>

                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    {currentMovie.Title}
                  </h2>

                  {/* Movie Details */}
                  <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                    <span className="bg-gray-700/80 px-3 py-1 rounded-full">
                      {currentMovie.Year}
                    </span>
                    {currentMovie.Rated && currentMovie.Rated !== 'N/A' && (
                      <span className="bg-blue-600/80 px-3 py-1 rounded-full">
                        {currentMovie.Rated}
                      </span>
                    )}
                    {currentMovie.Runtime && currentMovie.Runtime !== 'N/A' && (
                      <span className="bg-gray-700/80 px-3 py-1 rounded-full">
                        {currentMovie.Runtime}
                      </span>
                    )}
                    {currentMovie.imdbRating && currentMovie.imdbRating !== 'N/A' && (
                      <div className="flex items-center space-x-1 bg-yellow-600/80 px-3 py-1 rounded-full">
                        <span>⭐</span>
                        <span>{currentMovie.imdbRating}</span>
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  {currentMovie.Genre && currentMovie.Genre !== 'N/A' && (
                    <div className="flex flex-wrap gap-2">
                      {currentMovie.Genre.split(',').slice(0, 3).map((genre, index) => (
                        <span
                          key={index}
                          className="bg-purple-600/80 px-3 py-1 rounded-full text-sm"
                        >
                          {genre.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Plot */}
                  {currentMovie.Plot && currentMovie.Plot !== 'N/A' && (
                    <p className="text-gray-200 text-base md:text-lg leading-relaxed max-w-2xl">
                      {currentMovie.Plot.length > 200 
                        ? currentMovie.Plot.substring(0, 200) + '...'
                        : currentMovie.Plot
                      }
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4">
                    <motion.button
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>▶️</span>
                      <span>Watch Now</span>
                    </motion.button>

                    <motion.button
                      onClick={handleFavoriteClick}
                      className={`p-3 rounded-lg font-semibold transition-all ${
                        isFavorite 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-700/80 text-gray-300 hover:bg-red-600 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-xl">
                        {isFavorite ? '❤️' : '🤍'}
                      </span>
                    </motion.button>

                    <motion.button
                      onClick={async () => {
                        try {
                          const { getEnhancedMovieDetails } = await import('../../services/movieApi');
                          const fullDetails = await getEnhancedMovieDetails(currentMovie.imdbID);
                          // You can add a modal state here or trigger a movie overlay
                          console.log('Full movie details:', fullDetails);
                        } catch (error) {
                          console.error('Failed to fetch movie details:', error);
                        }
                      }}
                      className="bg-gray-700/80 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>ℹ️</span>
                      <span>More Info</span>
                    </motion.button>
                  </div>
                </motion.div>

                {/* Movie Poster (Hidden on mobile) */}
                <motion.div
                  className="hidden lg:flex justify-center"
                  initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <div className="relative">
                    <img
                      src={currentMovie.Poster}
                      alt={currentMovie.Title}
                      className="w-64 h-96 object-cover rounded-lg shadow-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10"
        aria-label="Previous movie"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10"
        aria-label="Next movie"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
        aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1" />
          </svg>
        )}
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700/50">
        <motion.div
          className="h-full bg-red-600"
          initial={{ width: "0%" }}
          animate={{ width: isPlaying ? "100%" : "0%" }}
          transition={{ duration: 5, ease: "linear", repeat: Infinity }}
          key={`${currentIndex}-${isPlaying}`}
        />
      </div>
    </div>
  );
};

export default FeaturedCarousel;
