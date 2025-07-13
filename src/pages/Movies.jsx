import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMovies, useMovieSearch } from '../hooks/useMovies';
import { MOVIE_CATEGORIES } from '../utils/constants';
import SearchBar from '../components/common/SearchBar';
import MovieRow from '../components/movies/MovieRow';
import MovieCard from '../components/movies/MovieCard';
import FeaturedCarousel from '../components/movies/FeaturedCarousel';
import Loading, { SkeletonMovieRow } from '../components/common/Loading';
import ErrorMessage, { NoDataMessage } from '../components/common/ErrorMessage';

const Movies = () => {
  const { movies, loading, error, fetchMoviesByCategory } = useMovies();
  const { searchResults, loading: searchLoading, search, clearSearch } = useMovieSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [loadedCategories, setLoadedCategories] = useState(new Set());

  // Memoize categories to prevent unnecessary re-renders
  const movieCategories = useMemo(() => MOVIE_CATEGORIES, []);

  // Load initial movie categories only once
  useEffect(() => {
    if (!initialLoadComplete) {
      const loadCategories = async () => {
        console.log('🎬 Loading movie categories...');
        for (const category of movieCategories) {
          if (!loadedCategories.has(category.id)) {
            try {
              await fetchMoviesByCategory(category.id);
              setLoadedCategories(prev => new Set([...prev, category.id]));
            } catch (error) {
              console.error(`Failed to load category ${category.id}:`, error);
            }
          }
        }
        setInitialLoadComplete(true);
      };
      loadCategories();
    }
  }, [fetchMoviesByCategory, movieCategories, initialLoadComplete, loadedCategories]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      search(query);
    } else {
      setIsSearching(false);
      clearSearch();
    }
  }, [search, clearSearch]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearching(false);
    clearSearch();
  }, [clearSearch]);

  const handleRetry = useCallback(() => {
    setLoadedCategories(new Set());
    setInitialLoadComplete(false);
  }, []);

  // Memoize movie rows to prevent unnecessary re-renders
  const movieRows = useMemo(() => {
    return movieCategories.map((category) => {
      const categoryMovies = movies[category.id] || [];
      const isLoading = loading && !loadedCategories.has(category.id);
      
      return (
        <MovieRow
          key={`movie-row-${category.id}`}
          title={category.title}
          movies={categoryMovies}
          loading={isLoading}
        />
      );
    });
  }, [movieCategories, movies, loading, loadedCategories]);

  // Memoize search results grid
  const searchResultsGrid = useMemo(() => {
    if (!searchResults.length) return null;
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-4 md:px-8">
        {searchResults.map((movie, index) => (
          <MovieCard 
            key={`search-${movie.imdbID}-${index}`} 
            movie={movie} 
            index={index} 
          />
        ))}
      </div>
    );
  }, [searchResults]);

  // Get featured movies for carousel (combine trending and top rated)
  const featuredMovies = useMemo(() => {
    const trending = movies.trending || [];
    const topRated = movies.topRated || [];
    const action = movies.action || [];
    
    // Combine and deduplicate movies for featured carousel
    const combined = [...trending, ...topRated, ...action];
    const unique = combined.filter((movie, index, self) => 
      index === self.findIndex(m => m.imdbID === movie.imdbID)
    );
    
    return unique.slice(0, 8); // Limit to 8 featured movies
  }, [movies]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.div
        className="relative bg-gradient-to-b from-gray-900 to-black py-12"
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
              🎬 <span className="text-red-600">Movie</span>Flix
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Discover amazing movies, save your favorites, and explore the world of cinema
            </p>
          </motion.div>

          {/* Featured Carousel - Right under the heading */}
          <motion.div
            className="mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {featuredMovies.length > 0 ? (
              <FeaturedCarousel movies={featuredMovies} />
            ) : (
              <div className="w-full h-96 md:h-[500px] lg:h-[600px] bg-gray-800 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🎬
                  </motion.div>
                  <p className="text-gray-400 text-lg">Loading featured movies...</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for movies..."
              className="w-full"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="container mx-auto py-8">
        <AnimatePresence mode="wait">
          {isSearching ? (
            /* Search Results */
            <motion.div
              key="search-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6 px-4 md:px-8">
                <h2 className="text-2xl font-bold">
                  Search Results for "{searchQuery}"
                </h2>
                <motion.button
                  onClick={handleClearSearch}
                  className="text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>✕</span>
                  <span>Clear Search</span>
                </motion.button>
              </div>

              {searchLoading ? (
                <div className="px-4 md:px-8">
                  <Loading text="Searching movies..." />
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="mb-4 px-4 md:px-8 text-gray-400">
                    Found {searchResults.length} movie{searchResults.length !== 1 ? 's' : ''}
                  </div>
                  {searchResultsGrid}
                </>
              ) : (
                <NoDataMessage
                  message="No movies found"
                  icon="🔍"
                  suggestion="Try searching with different keywords"
                />
              )}
            </motion.div>
          ) : (
            /* Movie Categories */
            <motion.div
              key="movie-categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {error ? (
                <div className="px-4 md:px-8">
                  <ErrorMessage
                    message={error}
                    onRetry={handleRetry}
                  />
                </div>
              ) : !initialLoadComplete ? (
                <div className="space-y-8">
                  {movieCategories.map((category, index) => (
                    <SkeletonMovieRow key={`skeleton-${category.id}`} />
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="space-y-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {/* Section Header */}
                  <div className="px-4 md:px-8">
                    <motion.h2 
                      className="text-3xl font-bold mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      Browse Movies
                    </motion.h2>
                    <motion.p 
                      className="text-gray-400"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      Explore our curated collection of movies across different genres
                    </motion.p>
                  </div>

                  {/* Movie Rows */}
                  {movieRows}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Movies;
