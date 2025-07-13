import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      name: 'dark',
      label: 'Dark Mode',
      icon: '🌙',
      colors: {
        primary: 'from-gray-900 to-black',
        accent: 'from-red-600 to-red-700',
        text: 'text-white'
      }
    },
    {
      name: 'neon',
      label: 'Neon Glow',
      icon: '⚡',
      colors: {
        primary: 'from-purple-900 to-black',
        accent: 'from-cyan-400 to-purple-600',
        text: 'text-cyan-100'
      }
    },
    {
      name: 'sunset',
      label: 'Sunset',
      icon: '🌅',
      colors: {
        primary: 'from-orange-900 to-red-900',
        accent: 'from-yellow-500 to-orange-600',
        text: 'text-orange-100'
      }
    },
    {
      name: 'ocean',
      label: 'Ocean Blue',
      icon: '🌊',
      colors: {
        primary: 'from-blue-900 to-indigo-900',
        accent: 'from-blue-500 to-teal-500',
        text: 'text-blue-100'
      }
    }
  ];

  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    switch (theme.name) {
      case 'neon':
        root.style.setProperty('--bg-primary', 'linear-gradient(to bottom, #581c87, #000000)');
        root.style.setProperty('--bg-accent', 'linear-gradient(to right, #22d3ee, #a855f7)');
        root.style.setProperty('--text-primary', '#e0f2fe');
        root.style.setProperty('--glow-color', '#22d3ee');
        document.body.style.background = 'linear-gradient(to bottom, #581c87, #000000)';
        break;
      case 'sunset':
        root.style.setProperty('--bg-primary', 'linear-gradient(to bottom, #ea580c, #991b1b)');
        root.style.setProperty('--bg-accent', 'linear-gradient(to right, #eab308, #ea580c)');
        root.style.setProperty('--text-primary', '#fed7aa');
        root.style.setProperty('--glow-color', '#f59e0b');
        document.body.style.background = 'linear-gradient(to bottom, #ea580c, #991b1b)';
        break;
      case 'ocean':
        root.style.setProperty('--bg-primary', 'linear-gradient(to bottom, #1e3a8a, #312e81)');
        root.style.setProperty('--bg-accent', 'linear-gradient(to right, #3b82f6, #14b8a6)');
        root.style.setProperty('--text-primary', '#dbeafe');
        root.style.setProperty('--glow-color', '#3b82f6');
        document.body.style.background = 'linear-gradient(to bottom, #1e3a8a, #312e81)';
        break;
      default: // dark
        root.style.setProperty('--bg-primary', 'linear-gradient(to bottom, #111827, #000000)');
        root.style.setProperty('--bg-accent', 'linear-gradient(to right, #dc2626, #991b1b)');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--glow-color', '#dc2626');
        document.body.style.background = 'linear-gradient(to bottom, #111827, #000000)';
        break;
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('movieSportsTheme') || 'dark';
    const theme = themes.find(t => t.name === savedTheme) || themes[0];
    setCurrentTheme(savedTheme);
    applyTheme(theme);
  }, []);

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme.name);
    applyTheme(theme);
    localStorage.setItem('movieSportsTheme', theme.name);
    setIsOpen(false);
  };

  const currentThemeObj = themes.find(t => t.name === currentTheme);

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full border border-white/20 hover:bg-black/70 transition-all duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <span className="text-xl">{currentThemeObj?.icon}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-14 right-0 bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 p-4 min-w-[200px]"
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-white font-semibold mb-3 text-sm">Choose Theme</h3>
            <div className="space-y-2">
              {themes.map((theme) => (
                <motion.button
                  key={theme.name}
                  onClick={() => handleThemeChange(theme)}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                    currentTheme === theme.name
                      ? 'bg-white/20 border border-white/30'
                      : 'hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-lg">{theme.icon}</span>
                  <span className="text-white text-sm font-medium">{theme.label}</span>
                  {currentTheme === theme.name && (
                    <motion.div
                      className="ml-auto w-2 h-2 bg-green-400 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
