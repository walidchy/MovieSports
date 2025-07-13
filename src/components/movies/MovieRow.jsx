import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard from './MovieCard';
import { SkeletonCard } from '../common/Loading';

const MovieRow = ({ title, movies, loading, onLoadMore }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );

    // Load more when near the end
    if (onLoadMore && container.scrollLeft > container.scrollWidth - container.clientWidth - 200) {
      onLoadMore();
    }
  };

  return (
    <div className="mb-8 group">
      {/* Row Title */}
      <motion.h2
        className="text-xl md:text-2xl font-bold text-white mb-4 px-4 md:px-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>

      {/* Movies Container */}
      <div className="relative">
        {/* Left Arrow */}
        <AnimatePresence>
          {showLeftArrow && (
            <motion.button
              onClick={() => scroll('left')}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-all duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right Arrow */}
        <AnimatePresence>
          {showRightArrow && (
            <motion.button
              onClick={() => scroll('right')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-all duration-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Movies Scroll Container */}
        <motion.div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto hide-scrollbar px-4 md:px-8 py-2"
          onScroll={handleScroll}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {loading && (!movies || movies.length === 0) ? (
            // Loading Skeletons
            [...Array(8)].map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} className="flex-shrink-0 w-48 h-80" />
            ))
          ) : movies && movies.length > 0 ? (
            // Movie Cards
            movies.map((movie, index) => (
              <MovieCard
                key={`${movie.imdbID}-${index}`}
                movie={movie}
                index={index}
              />
            ))
          ) : !loading ? (
            // No Movies Message
            <motion.div
              className="flex-shrink-0 w-full flex items-center justify-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <span className="text-6xl mb-4 block">🎬</span>
                <p className="text-gray-400">No movies found</p>
              </div>
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
};

export default MovieRow;
