import { useState, useEffect } from 'react';
import { 
  getFootballFixtures, 
  getFootballStandings,
  getNBAGames,
  getNBAStandings,
  getF1Races,
  getF1Results,
  getF1Standings
} from '../services/sportsApi';

export const useFootball = () => {
  const [fixtures, setFixtures] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFixtures = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getFootballFixtures();
      setFixtures(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStandings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getFootballStandings();
      setStandings(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixtures();
  }, []);

  return {
    fixtures,
    standings,
    loading,
    error,
    fetchFixtures,
    fetchStandings
  };
};

export const useBasketball = () => {
  const [games, setGames] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGames = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getNBAGames();
      setGames(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStandings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getNBAStandings();
      setStandings(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return {
    games,
    standings,
    loading,
    error,
    fetchGames,
    fetchStandings
  };
};

export const useFormula1 = () => {
  const [races, setRaces] = useState([]);
  const [standings, setStandings] = useState([]);
  const [raceResults, setRaceResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRaces = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getF1Races();
      setRaces(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStandings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getF1Standings();
      setStandings(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRaceResults = async (raceId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getF1Results(raceId);
      setRaceResults(prev => ({
        ...prev,
        [raceId]: result
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRaces();
    fetchStandings();
  }, []);

  return {
    races,
    standings,
    raceResults,
    loading,
    error,
    fetchRaces,
    fetchStandings,
    fetchRaceResults
  };
};
