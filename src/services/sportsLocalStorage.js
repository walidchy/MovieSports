import { STORAGE_KEYS } from '../utils/constants';

// Get sports favorites from localStorage
export const getSportsFavorites = () => {
  try {
    const favorites = localStorage.getItem(STORAGE_KEYS.SPORTS_FAVORITES);
    return favorites ? JSON.parse(favorites) : {
      football: [],
      basketball: [],
      formula1: []
    };
  } catch (error) {
    console.error('Error getting sports favorites:', error);
    return {
      football: [],
      basketball: [],
      formula1: []
    };
  }
};

// Add sports item to favorites
export const addToSportsFavorites = (item, sport) => {
  try {
    const favorites = getSportsFavorites();
    const sportFavorites = favorites[sport] || [];
    
    // Create unique ID for sports items
    const itemId = generateSportsId(item, sport);
    const isAlreadyFavorite = sportFavorites.some(fav => fav.id === itemId);
    
    if (!isAlreadyFavorite) {
      const favoriteItem = {
        ...item,
        id: itemId,
        sport: sport,
        dateAdded: new Date().toISOString()
      };
      
      const updatedSportFavorites = [...sportFavorites, favoriteItem];
      const updatedFavorites = {
        ...favorites,
        [sport]: updatedSportFavorites
      };
      
      localStorage.setItem(STORAGE_KEYS.SPORTS_FAVORITES, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    }
    
    return favorites;
  } catch (error) {
    console.error('Error adding to sports favorites:', error);
    return getSportsFavorites();
  }
};

// Remove sports item from favorites
export const removeFromSportsFavorites = (itemId, sport) => {
  try {
    const favorites = getSportsFavorites();
    const sportFavorites = favorites[sport] || [];
    const updatedSportFavorites = sportFavorites.filter(item => item.id !== itemId);
    
    const updatedFavorites = {
      ...favorites,
      [sport]: updatedSportFavorites
    };
    
    localStorage.setItem(STORAGE_KEYS.SPORTS_FAVORITES, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  } catch (error) {
    console.error('Error removing from sports favorites:', error);
    return getSportsFavorites();
  }
};

// Check if sports item is in favorites
export const isSportsFavorite = (item, sport) => {
  try {
    const favorites = getSportsFavorites();
    const sportFavorites = favorites[sport] || [];
    const itemId = generateSportsId(item, sport);
    return sportFavorites.some(fav => fav.id === itemId);
  } catch (error) {
    console.error('Error checking sports favorite status:', error);
    return false;
  }
};

// Clear all sports favorites
export const clearSportsFavorites = (sport = null) => {
  try {
    if (sport) {
      // Clear specific sport
      const favorites = getSportsFavorites();
      const updatedFavorites = {
        ...favorites,
        [sport]: []
      };
      localStorage.setItem(STORAGE_KEYS.SPORTS_FAVORITES, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    } else {
      // Clear all sports
      const emptyFavorites = {
        football: [],
        basketball: [],
        formula1: []
      };
      localStorage.setItem(STORAGE_KEYS.SPORTS_FAVORITES, JSON.stringify(emptyFavorites));
      return emptyFavorites;
    }
  } catch (error) {
    console.error('Error clearing sports favorites:', error);
    return getSportsFavorites();
  }
};

// Generate unique ID for sports items
const generateSportsId = (item, sport) => {
  switch (sport) {
    case 'football':
      return `football_${item.fixture?.id || item.id || `${item.teams?.home?.name}_${item.teams?.away?.name}_${item.fixture?.date}`}`;
    case 'basketball':
      return `basketball_${item.id || `${item.teams?.home?.name}_${item.teams?.visitors?.name}_${item.date?.start}`}`;
    case 'formula1':
      return `formula1_${item.round || item.raceName}_${item.season}_${item.Circuit?.circuitId || item.Circuit?.circuitName}`;
    default:
      return `${sport}_${Date.now()}_${Math.random()}`;
  }
};

// Get all sports favorites (combined)
export const getAllSportsFavorites = () => {
  const favorites = getSportsFavorites();
  return [
    ...favorites.football.map(item => ({ ...item, sport: 'football' })),
    ...favorites.basketball.map(item => ({ ...item, sport: 'basketball' })),
    ...favorites.formula1.map(item => ({ ...item, sport: 'formula1' }))
  ];
};
