import { useState, useEffect, useCallback } from 'react';
import { searchMovies, getMoviesByCategory, getTrendingMovies, getMovieDetails } from '../services/movieApi';

export const useMovies = () => {
  const [movies, setMovies] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesByCategory = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      if (category === 'trending') {
        result = await getTrendingMovies();
      } else {
        result = await getMoviesByCategory(category);
      }
      
      setMovies(prev => ({
        ...prev,
        [category]: result.Search || []
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchMoviesByQuery = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await searchMovies(query);
      return result.Search || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetails = async (imdbID) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMovieDetails(imdbID);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    movies,
    loading,
    error,
    fetchMoviesByCategory,
    searchMoviesByQuery,
    fetchMovieDetails
  };
};

export const useMovieSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await searchMovies(query);
      setSearchResults(result.Search || []);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setError(null);
  };

  return {
    searchResults,
    loading,
    error,
    search,
    clearSearch
  };
};
