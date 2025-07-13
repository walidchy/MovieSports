import { useState, useEffect } from 'react';
import { 
  getSportsFavorites, 
  addToSportsFavorites, 
  removeFromSportsFavorites, 
  isSportsFavorite, 
  clearSportsFavorites,
  getAllSportsFavorites
} from '../services/sportsLocalStorage';

export const useSportsFavorites = (sport = null) => {
  const [favorites, setFavorites] = useState({
    football: [],
    basketball: [],
    formula1: []
  });
  const [loading, setLoading] = useState(false);

  // Load favorites on mount
  useEffect(() => {
    setLoading(true);
    const savedFavorites = getSportsFavorites();
    setFavorites(savedFavorites);
    setLoading(false);
  }, []);

  const addFavorite = async (item, sportType) => {
    setLoading(true);
    try {
      const updatedFavorites = addToSportsFavorites(item, sportType);
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error adding sports favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (itemId, sportType) => {
    setLoading(true);
    try {
      const updatedFavorites = removeFromSportsFavorites(itemId, sportType);
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error removing sports favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (item, sportType) => {
    if (isSportsFavorite(item, sportType)) {
      const itemId = generateSportsId(item, sportType);
      removeFavorite(itemId, sportType);
    } else {
      addFavorite(item, sportType);
    }
  };

  const clearAllFavorites = (sportType = null) => {
    setLoading(true);
    try {
      const updatedFavorites = clearSportsFavorites(sportType);
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error clearing sports favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIsFavorite = (item, sportType) => {
    return isSportsFavorite(item, sportType);
  };

  // Helper function to generate sports ID (same as in localStorage service)
  const generateSportsId = (item, sportType) => {
    switch (sportType) {
      case 'football':
        return `football_${item.fixture?.id || item.id || `${item.teams?.home?.name}_${item.teams?.away?.name}_${item.fixture?.date}`}`;
      case 'basketball':
        return `basketball_${item.id || `${item.teams?.home?.name}_${item.teams?.visitors?.name}_${item.date?.start}`}`;
      case 'formula1':
        return `formula1_${item.round || item.raceName}_${item.season}_${item.Circuit?.circuitId || item.Circuit?.circuitName}`;
      default:
        return `${sportType}_${Date.now()}_${Math.random()}`;
    }
  };

  // Get favorites for specific sport or all
  const getFavoritesBySport = (sportType) => {
    return favorites[sportType] || [];
  };

  const getAllFavorites = () => {
    return getAllSportsFavorites();
  };

  // Get total count of favorites
  const getTotalCount = () => {
    return favorites.football.length + favorites.basketball.length + favorites.formula1.length;
  };

  // If a specific sport is provided, return only that sport's data
  if (sport) {
    return {
      favorites: favorites[sport] || [],
      loading,
      addFavorite: (item) => addFavorite(item, sport),
      removeFavorite: (itemId) => removeFavorite(itemId, sport),
      toggleFavorite: (item) => toggleFavorite(item, sport),
      clearAllFavorites: () => clearAllFavorites(sport),
      checkIsFavorite: (item) => checkIsFavorite(item, sport),
      totalCount: (favorites[sport] || []).length
    };
  }

  // Return all sports data
  return {
    favorites,
    allFavorites: getAllFavorites(),
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearAllFavorites,
    checkIsFavorite,
    isFavorite: checkIsFavorite,
    addToFavorites: addFavorite,
    removeFromFavorites: removeFavorite,
    getFavoritesBySport,
    getAllFavorites,
    totalCount: getTotalCount()
  };
};
