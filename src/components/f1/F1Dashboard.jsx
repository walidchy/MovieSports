import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useSportsFavorites } from '../../hooks/useSportsFavorites';

const F1Dashboard = () => {
  const [races, setRaces] = useState([]);
  const [driverStandings, setDriverStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('races');
  const { addFavorite, removeFavorite, checkIsFavorite } = useSportsFavorites();

  useEffect(() => {
    fetchF1Data();
  }, []);

  const fetchF1Data = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current season races
      const racesResponse = await axios.get('https://api.jolpi.ca/ergast/f1/current.json');
      const racesData = racesResponse.data.MRData.RaceTable.Races;

      // Fetch current driver standings
      const standingsResponse = await axios.get('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
      const standingsData = standingsResponse.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

      setRaces(racesData);
      setDriverStandings(standingsData);
    } catch (err) {
      setError('Failed to fetch F1 data. Please try again.');
      console.error('F1 API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString, timeString) => {
    if (!dateString) return 'TBD';
    const date = new Date(`${dateString}T${timeString || '00:00:00'}`);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: timeString ? '2-digit' : undefined,
      minute: timeString ? '2-digit' : undefined,
    });
  };

  const getUpcomingRace = () => {
    const now = new Date();
    return races.find(race => new Date(race.date) > now);
  };

  const isUpcomingRace = (race) => {
    const upcomingRace = getUpcomingRace();
    return upcomingRace && race.round === upcomingRace.round;
  };

  const handleFavoriteToggle = (race) => {
    const raceItem = {
      id: `f1-${race.round}-${race.season}`,
      type: 'formula1',
      raceName: race.raceName,
      circuit: race.Circuit.circuitName,
      location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
      date: race.date,
      time: race.time,
      round: race.round,
      season: race.season,
      Circuit: race.Circuit
    };

    if (checkIsFavorite(raceItem, 'formula1')) {
      removeFavorite(raceItem.id, 'formula1');
    } else {
      addFavorite(raceItem, 'formula1');
    }
  };

  const getPositionColor = (position) => {
    switch (position) {
      case '1': return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case '2': return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case '3': return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default: return 'bg-gradient-to-r from-gray-600 to-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading F1 Data...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={fetchF1Data}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-red-900 to-red-700 py-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
            🏁 <span className="text-red-400">Formula 1</span> Dashboard
          </h1>
          <p className="text-center text-gray-300 text-lg">
            Current Season • {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('races')}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === 'races'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🗓️ Race Calendar
            </button>
            <button
              onClick={() => setActiveTab('standings')}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === 'standings'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🏆 Driver Standings
            </button>
          </div>
        </div>

        {/* Race Calendar Tab */}
        {activeTab === 'races' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">
              {new Date().getFullYear()} Race Calendar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {races.map((race, index) => (
                <motion.div
                  key={race.round}
                  className={`bg-gray-900 rounded-xl p-6 border-2 transition-all duration-300 hover:scale-105 ${
                    isUpcomingRace(race)
                      ? 'border-red-500 shadow-lg shadow-red-500/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {isUpcomingRace(race) && (
                    <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block animate-pulse">
                      🔥 NEXT RACE
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      Round {race.round}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {formatDate(race.date, race.time)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-red-400">
                    {race.raceName}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">🏁</span>
                      <span className="text-sm">{race.Circuit.circuitName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">📍</span>
                      <span className="text-sm">
                        {race.Circuit.Location.locality}, {race.Circuit.Location.country}
                      </span>
                    </div>
                  </div>

                  {/* Sessions */}
                  <div className="space-y-2 mb-4">
                    {race.FirstPractice && (
                      <div className="text-xs text-gray-400">
                        FP1: {formatDate(race.FirstPractice.date, race.FirstPractice.time)}
                      </div>
                    )}
                    {race.SecondPractice && (
                      <div className="text-xs text-gray-400">
                        FP2: {formatDate(race.SecondPractice.date, race.SecondPractice.time)}
                      </div>
                    )}
                    {race.ThirdPractice && (
                      <div className="text-xs text-gray-400">
                        FP3: {formatDate(race.ThirdPractice.date, race.ThirdPractice.time)}
                      </div>
                    )}
                    {race.Qualifying && (
                      <div className="text-xs text-gray-400">
                        Qualifying: {formatDate(race.Qualifying.date, race.Qualifying.time)}
                      </div>
                    )}
                    {race.Sprint && (
                      <div className="text-xs text-yellow-400">
                        Sprint: {formatDate(race.Sprint.date, race.Sprint.time)}
                      </div>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <a
                        href={race.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
                      >
                        Race Info
                      </a>
                      <a
                        href={race.Circuit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded transition-colors"
                      >
                        Circuit Info
                      </a>
                    </div>
                    
                    {/* Favorite Heart Icon */}
                    <motion.button
                      onClick={() => handleFavoriteToggle(race)}
                      className="text-2xl hover:scale-110 transition-transform"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {checkIsFavorite({
                        id: `f1-${race.round}-${race.season}`,
                        round: race.round,
                        season: race.season,
                        Circuit: race.Circuit
                      }, 'formula1') ? '❤️' : '🤍'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Driver Standings Tab */}
        {activeTab === 'standings' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">
              {new Date().getFullYear()} Driver Championship
            </h2>
            <div className="max-w-4xl mx-auto">
              {driverStandings.map((standing, index) => (
                <motion.div
                  key={standing.Driver.driverId}
                  className={`${getPositionColor(standing.position)} rounded-xl p-6 mb-4 text-white`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl font-bold">
                        {standing.position === '1' && '🥇'}
                        {standing.position === '2' && '🥈'}
                        {standing.position === '3' && '🥉'}
                        {parseInt(standing.position) > 3 && `#${standing.position}`}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">
                          {standing.Driver.givenName} {standing.Driver.familyName}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm opacity-90">
                          <span>🏎️ {standing.Constructors[0].name}</span>
                          <span>🏁 {standing.nationality}</span>
                          <span>🏆 {standing.wins} wins</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{standing.points}</div>
                      <div className="text-sm opacity-90">points</div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <a
                      href={standing.Driver.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black/20 hover:bg-black/40 text-white text-xs px-3 py-1 rounded transition-colors"
                    >
                      Driver Info
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default F1Dashboard;
