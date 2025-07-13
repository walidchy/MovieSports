import { useState, useEffect } from 'react';
import { 
  getFavorites, 
  addToFavorites, 
  removeFromFavorites, 
  isFavorite, 
  clearFavorites 
} from '../services/localStorage';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load favorites on mount
  useEffect(() => {
    setLoading(true);
    const savedFavorites = getFavorites();
    setFavorites(savedFavorites);
    setLoading(false);
  }, []);

  const addFavorite = async (movie) => {
    setLoading(true);
    try {
      const updatedFavorites = await addToFavorites(movie);
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error adding favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (imdbID) => {
    setLoading(true);
    const updatedFavorites = removeFromFavorites(imdbID);
    setFavorites(updatedFavorites);
    setLoading(false);
  };

  const toggleFavorite = (movie) => {
    if (isFavorite(movie.imdbID)) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite(movie);
    }
  };

  const clearAllFavorites = () => {
    setLoading(true);
    const updatedFavorites = clearFavorites();
    setFavorites(updatedFavorites);
    setLoading(false);
  };

  const checkIsFavorite = (imdbID) => {
    return isFavorite(imdbID);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearAllFavorites,
    checkIsFavorite
  };
};
