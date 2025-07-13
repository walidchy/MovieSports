// API Keys
export const API_KEYS = {
  OMDB: '213c58c7',
  SPORTS: '00c4fc2ac0816d7876aa580cfbf8e219'
};

// API Base URLs
export const API_URLS = {
  OMDB: 'http://www.omdbapi.com',
  FOOTBALL: 'https://v3.football.api-sports.io',
  BASKETBALL: 'https://v1.basketball.api-sports.io',
  FORMULA1: 'https://v1.formula-1.api-sports.io'
};

// Movie Categories
export const MOVIE_CATEGORIES = [
  { id: 'trending', title: 'Trending Now', search: 'popular' },
  { id: 'top_rated', title: 'Top Rated', search: 'top' },
  { id: 'action', title: 'Action Movies', search: 'action' },
  { id: 'comedy', title: 'Comedy Movies', search: 'comedy' },
  { id: 'horror', title: 'Horror Movies', search: 'horror' }
];

// Sports Leagues
export const SPORTS_LEAGUES = {
  FOOTBALL: {
    PREMIER_LEAGUE: 39,
    LA_LIGA: 140,
    BUNDESLIGA: 78,
    SERIE_A: 135,
    LIGUE_1: 61
  },
  BASKETBALL: {
    NBA: 12
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  FAVORITES: 'movie_favorites',
  SPORTS_FAVORITES: 'sports_favorites'
};
