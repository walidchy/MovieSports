import axios from 'axios';
import { API_KEYS, API_URLS } from '../utils/constants';

const movieApi = axios.create({
  baseURL: API_URLS.OMDB,
  params: {
    apikey: API_KEYS.OMDB
  }
});

// Search movies by title
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await movieApi.get('/', {
      params: {
        s: query,
        page,
        type: 'movie'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to search movies');
  }
};

// Get movie details by ID
export const getMovieDetails = async (imdbID) => {
  try {
    console.log('🎬 Fetching full movie details for:', imdbID);
    const response = await movieApi.get('/', {
      params: {
        i: imdbID,
        plot: 'full' // Get full plot instead of short
      }
    });
    
    if (response.data.Response === 'True') {
      console.log('🎬 Full movie details loaded:', response.data.Title);
      return response.data;
    } else {
      throw new Error(response.data.Error || 'Movie not found');
    }
  } catch (error) {
    console.error('🎬 Movie Details API Error:', error);
    throw new Error('Failed to get movie details');
  }
};

// Get enhanced movie details with additional data processing
export const getEnhancedMovieDetails = async (imdbID) => {
  try {
    console.log('🎬 Fetching enhanced movie details for:', imdbID);
    
    // Get the full movie details
    const movieDetails = await getMovieDetails(imdbID);
    
    // Add any additional processing or data enhancement
    return {
      ...movieDetails,
      // Ensure we have proper data structure
      Ratings: movieDetails.Ratings || [],
      // Parse numeric ratings for better display
      imdbRatingNum: movieDetails.imdbRating !== 'N/A' ? parseFloat(movieDetails.imdbRating) : null,
      MetascoreNum: movieDetails.Metascore !== 'N/A' ? parseInt(movieDetails.Metascore) : null,
      // Ensure plot is full
      Plot: movieDetails.Plot || 'Plot information not available.',
    };
  } catch (error) {
    console.error('🎬 Enhanced Movie Details Error:', error);
    throw error;
  }
};

// Get movies by category (using popular search terms)
export const getMoviesByCategory = async (category, page = 1) => {
  const categorySearchTerms = {
    trending: ['avengers', 'batman', 'spider', 'star wars', 'marvel'],
    top_rated: ['godfather', 'shawshank', 'dark knight', 'pulp fiction', 'inception'],
    action: ['action', 'fast furious', 'mission impossible', 'john wick', 'terminator'],
    comedy: ['comedy', 'hangover', 'anchorman', 'dumb dumber', 'step brothers'],
    horror: ['horror', 'conjuring', 'halloween', 'friday 13th', 'nightmare elm']
  };

  try {
    const searchTerms = categorySearchTerms[category] || ['movie'];
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    
    const response = await movieApi.get('/', {
      params: {
        s: randomTerm,
        page,
        type: 'movie'
      }
    });
    
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get ${category} movies`);
  }
};

// Get popular movies (trending)
export const getTrendingMovies = async () => {
  try {
    const searches = ['2023', '2022', '2021', 'marvel', 'action'];
    const promises = searches.map(term => 
      movieApi.get('/', {
        params: {
          s: term,
          type: 'movie',
          y: '2020'
        }
      })
    );
    
    const responses = await Promise.all(promises);
    const allMovies = responses.flatMap(response => 
      response.data.Search || []
    );
    
    // Remove duplicates and return first 20
    const uniqueMovies = allMovies.filter((movie, index, self) => 
      index === self.findIndex(m => m.imdbID === movie.imdbID)
    ).slice(0, 20);
    
    return { Search: uniqueMovies, totalResults: uniqueMovies.length };
  } catch (error) {
    throw new Error('Failed to get trending movies');
  }
};
