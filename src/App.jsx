import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/common/Header';
import Movies from './pages/Movies';
import Football from './pages/Football';
import Basketball from './pages/Basketball';
import Favorites from './pages/Favorites';
import SportsFavorites from './pages/SportsFavorites';
import F1DashboardPage from './pages/F1Dashboard';
import FloatingActionButton from './components/common/FloatingActionButton';
import Logo from './components/common/Logo';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Header />
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<Movies />} />
            <Route path="/football" element={<Football />} />
            <Route path="/basketball" element={<Basketball />} />
            <Route path="/formula1" element={<F1DashboardPage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/sports-favorites" element={<SportsFavorites />} />
          </Routes>
        </motion.main>

        {/* Simplified Footer */}
        <motion.footer
          className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 py-8 mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="container mx-auto px-4">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              {/* Brand Section */}
              <div>
                <div className="mb-4">
                  <Logo size="medium" showText={true} />
                </div>
                <p className="text-gray-400 text-sm">
                  Your ultimate destination for movies and sports entertainment. Experience the best of both worlds in one platform.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Created by <span className="text-blue-400 font-medium">Walid Chyboub</span>
                </p>
              </div>

              {/* Features Section */}
              <div>
                <h4 className="text-white font-semibold mb-4">Features</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    <span>Netflix-style Movie Browser</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                    <span>Live Sports Updates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                    <span>Advanced Search</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                    <span>Favorites Collection</span>
                  </li>
                </ul>
              </div>

              {/* Sports Section */}
              <div>
                <h4 className="text-white font-semibold mb-4">Sports Coverage</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-center space-x-2">
                    <span>⚽</span>
                    <span>Football Matches</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>🏀</span>
                    <span>NBA Games</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>🏁</span>
                    <span>Formula 1 Races</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>🏆</span>
                    <span>Live Standings</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.footer>

        {/* Floating Action Button */}
        <FloatingActionButton />
      </div>
    </Router>
  );
}

export default App;
