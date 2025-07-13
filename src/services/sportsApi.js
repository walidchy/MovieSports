import axios from 'axios';

const API_KEY = '00c4fc2ac0816d7876aa580cfbf8e219';

// Create axios instances for each sport
const footballApi = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-apisports-key': API_KEY,
    'Content-Type': 'application/json'
  }
});

const basketballApi = axios.create({
  baseURL: 'https://v1.basketball.api-sports.io',
  headers: {
    'x-apisports-key': API_KEY,
    'Content-Type': 'application/json'
  }
});

const formulaOneApi = axios.create({
  baseURL: 'https://api.jolpi.ca/ergast/f1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper function to get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Helper function to get current year
const getCurrentYear = () => {
  return new Date().getFullYear();
};

// Football Functions
export const getFootballFixtures = async (date = getCurrentDate()) => {
  try {
    console.log('🏈 Fetching Football fixtures for date:', date);
    const response = await footballApi.get(`/fixtures?date=${date}`);
    console.log('🏈 Football API Response:', response.data);
    
    if (response.data && response.data.response && response.data.response.length > 0) {
      const fixtures = response.data.response; // Show all fixtures
      console.log(`🏈 Football fixtures loaded: ${fixtures.length} matches`);
      return fixtures;
    }
    
    console.log('🏈 No football fixtures found for today, using fallback date');
    // Fallback to a different date if no fixtures today
    const fallbackDate = '2024-12-15'; // Use a date with known fixtures
    const fallbackResponse = await footballApi.get(`/fixtures?date=${fallbackDate}`);
    const fallbackFixtures = fallbackResponse.data.response || [];
    console.log(`🏈 Football fallback fixtures loaded: ${fallbackFixtures.length} matches`);
    return fallbackFixtures;
  } catch (error) {
    console.error('🏈 Football API Error:', error);
    // Return empty array on error
    return [];
  }
};

export const getFootballStandings = async () => {
  try {
    const response = await footballApi.get('/standings', {
      params: {
        league: 39, // Premier League
        season: 2024
      }
    });
    return response.data.response?.[0]?.league?.standings?.[0] || [];
  } catch (error) {
    console.error('Football Standings Error:', error);
    return [];
  }
};

// Basketball Functions
export const getNBAGames = async (date = getCurrentDate()) => {
  try {
    console.log('🏀 Fetching NBA games for date:', date);
    const response = await basketballApi.get(`/games?date=${date}`);
    console.log('🏀 Basketball API Response:', response.data);
    
    if (response.data && response.data.response && response.data.response.length > 0) {
      const games = response.data.response; // Show all games
      console.log(`🏀 NBA games loaded: ${games.length} games`);
      return games;
    }
    
    console.log('🏀 No NBA games found for today, using fallback date');
    // Fallback to a different date if no games today
    const fallbackDate = '2024-12-15'; // Use a date with known games
    const fallbackResponse = await basketballApi.get(`/games?date=${fallbackDate}`);
    const fallbackGames = fallbackResponse.data.response || [];
    console.log(`🏀 NBA fallback games loaded: ${fallbackGames.length} games`);
    return fallbackGames;
  } catch (error) {
    console.error('🏀 Basketball API Error:', error);
    return [];
  }
};

export const getNBAStandings = async () => {
  try {
    const response = await basketballApi.get('/standings', {
      params: {
        league: 12, // NBA
        season: '2024-2025'
      }
    });
    return response.data.response || [];
  } catch (error) {
    console.error('NBA Standings Error:', error);
    return [];
  }
};

// Formula 1 Functions using Ergast API
export const getF1Races = async (season = 'current') => {
  try {
    console.log('🏎️ Fetching F1 races for season:', season);
    const endpoint = season === 'current' ? '/current.json' : `/${season}.json`;
    const response = await formulaOneApi.get(endpoint);
    console.log('🏎️ Formula 1 API Response:', response.data);
    
    if (response.data && response.data.data && response.data.data.MRData && response.data.data.MRData.RaceTable && response.data.data.MRData.RaceTable.Races) {
      const races = response.data.data.MRData.RaceTable.Races; // Show all races
      console.log(`🏎️ F1 races loaded: ${races.length} races`);
      
      // For each race, try to get results if available
      const racesWithResults = await Promise.all(
        races.map(async (race) => {
          try {
            const resultsResponse = await formulaOneApi.get(`/${race.season}/${race.round}/results.json`);
            if (resultsResponse.data && resultsResponse.data.data && resultsResponse.data.data.MRData && resultsResponse.data.data.MRData.RaceTable && resultsResponse.data.data.MRData.RaceTable.Races[0]) {
              const raceResults = resultsResponse.data.data.MRData.RaceTable.Races[0].Results;
              race.Results = raceResults ? raceResults.slice(0, 3) : []; // Top 3 results
            }
          } catch (error) {
            console.log(`🏎️ No results found for race ${race.season}/${race.round}`);
            race.Results = [];
          }
          return race;
        })
      );
      
      return racesWithResults;
    }
    
    console.log('🏎️ No F1 races found for current season, using fallback');
    // Fallback to previous season
    const fallbackSeason = getCurrentYear() - 1;
    const fallbackResponse = await formulaOneApi.get(`/${fallbackSeason}.json`);
    const fallbackRaces = fallbackResponse.data?.data?.MRData?.RaceTable?.Races?.slice(0, 10) || [];
    console.log(`🏎️ F1 fallback races loaded: ${fallbackRaces.length} races`);
    return fallbackRaces;
  } catch (error) {
    console.error('🏎️ Formula 1 API Error:', error);
    return [];
  }
};

export const getF1Results = async (season, round) => {
  try {
    console.log('🏎️ Fetching race results for race:', season, round);
    const response = await formulaOneApi.get(`/${season}/${round}/results.json`);
    console.log('🏎️ Race Results Response:', response.data);
    
    if (response.data && response.data.data && response.data.data.MRData && response.data.data.MRData.RaceTable && response.data.data.MRData.RaceTable.Races[0]) {
      return response.data.data.MRData.RaceTable.Races[0].Results || [];
    }
    return [];
  } catch (error) {
    console.error('🏎️ Race Results API Error:', error);
    return [];
  }
};

export const getF1Standings = async (season = 'current') => {
  try {
    console.log('🏎️ Fetching F1 driver standings for season:', season);
    const endpoint = season === 'current' ? '/current/driverStandings.json' : `/${season}/driverStandings.json`;
    const response = await formulaOneApi.get(endpoint);
    console.log('🏎️ Driver Standings Response:', response.data);
    
    if (response.data && response.data.data && response.data.data.MRData && response.data.data.MRData.StandingsTable && response.data.data.MRData.StandingsTable.StandingsLists[0]) {
      return response.data.data.MRData.StandingsTable.StandingsLists[0].DriverStandings || [];
    }
    return [];
  } catch (error) {
    console.error('F1 Standings Error:', error);
    return [];
  }
};

// Export default object for compatibility
export default {
  getFootballFixtures,
  getFootballStandings,
  getNBAGames,
  getNBAStandings,
  getF1Races,
  getF1Results,
  getF1Standings
};
