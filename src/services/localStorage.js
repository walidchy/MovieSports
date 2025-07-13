import { STORAGE_KEYS } from '../utils/constants';
import { getEnhancedMovieDetails } from './movieApi';

// Get favorites from localStorage
export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

// Add movie to favorites with enhanced details
export const addToFavorites = async (movie) => {
  try {
    const favorites = getFavorites();
    const isAlreadyFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);
    
    if (!isAlreadyFavorite) {
      // Try to get enhanced movie details if we don't have them
      let movieToAdd = movie;
      
      // Check if movie has essential data for statistics
      const hasEssentialData = movie.imdbRating && movie.Runtime && movie.Genre;
      
      if (!hasEssentialData) {
        try {
          console.log('🎬 Fetching enhanced details for favorites:', movie.Title);
          movieToAdd = await getEnhancedMovieDetails(movie.imdbID);
        } catch (error) {
          console.warn('Could not fetch enhanced details, using basic movie data:', error);
          // Use the original movie data as fallback
        }
      }
      
      const updatedFavorites = [...favorites, movieToAdd];
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    }
    
    return favorites;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return getFavorites();
  }
};

// Remove movie from favorites
export const removeFromFavorites = (imdbID) => {
  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return getFavorites();
  }
};

// Check if movie is in favorites
export const isFavorite = (imdbID) => {
  try {
    const favorites = getFavorites();
    return favorites.some(movie => movie.imdbID === imdbID);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// Clear all favorites
export const clearFavorites = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    return [];
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return getFavorites();
  }
};
