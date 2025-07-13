import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '🎬 Movies', icon: '🎬' },
    { path: '/football', label: '⚽ Football', icon: '⚽' },
    { path: '/basketball', label: '🏀 Basketball', icon: '🏀' },
    { path: '/formula1', label: '🏁 Formula 1', icon: '🏁' },
    { path: '/favorites', label: '❤️ Movie Favorites', icon: '❤️' },
    { path: '/sports-favorites', label: '🏆 Sports Favorites', icon: '🏆' }
  ];

  return (
    <motion.header 
      className="bg-black bg-opacity-95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <Logo size="medium" showText={true} />
          </Link>

          {/* Navigation - Always visible */}
          <nav className="flex items-center space-x-4 md:space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 rounded-lg transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span className="text-sm md:text-lg">{item.icon}</span>
                  <span className="font-medium text-xs md:text-base hidden sm:block">{item.label.split(' ')[1]}</span>
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
