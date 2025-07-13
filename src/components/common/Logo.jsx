import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ size = 'medium', showText = true, className = '' }) => {
  const sizes = {
    small: { icon: 'w-8 h-8', text: 'text-lg' },
    medium: { icon: 'w-10 h-10', text: 'text-2xl' },
    large: { icon: 'w-12 h-12', text: 'text-3xl' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl' }
  };

  const currentSize = sizes[size];

  return (
    <motion.div 
      className={`flex items-center space-x-3 ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {/* Animated Movie Clapper Board */}
      <motion.div
        className={`${currentSize.icon} relative`}
        animate={{ 
          rotateY: [0, 15, -15, 0],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="clapperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
            <linearGradient id="stripesGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1F2937" />
              <stop offset="50%" stopColor="#374151" />
              <stop offset="100%" stopColor="#1F2937" />
            </linearGradient>
          </defs>

          {/* Clapper Board Base */}
          <rect
            x="15"
            y="35"
            width="70"
            height="50"
            rx="4"
            fill="url(#clapperGradient)"
            stroke="#6B21A8"
            strokeWidth="2"
          />

          {/* Clapper Board Top (Animated) */}
          <motion.g
            animate={{ 
              rotateX: [0, -15, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            style={{ transformOrigin: "50px 35px" }}
          >
            <rect
              x="15"
              y="20"
              width="70"
              height="20"
              rx="4"
              fill="url(#stripesGradient)"
              stroke="#374151"
              strokeWidth="2"
            />
            
            {/* Black and White Stripes */}
            <rect x="20" y="22" width="8" height="16" fill="#000000" />
            <rect x="28" y="22" width="8" height="16" fill="#FFFFFF" />
            <rect x="36" y="22" width="8" height="16" fill="#000000" />
            <rect x="44" y="22" width="8" height="16" fill="#FFFFFF" />
            <rect x="52" y="22" width="8" height="16" fill="#000000" />
            <rect x="60" y="22" width="8" height="16" fill="#FFFFFF" />
            <rect x="68" y="22" width="8" height="16" fill="#000000" />
            <rect x="76" y="22" width="6" height="16" fill="#FFFFFF" />
          </motion.g>

          {/* Clapper Board Details */}
          <rect x="25" y="45" width="50" height="3" fill="#FFFFFF" opacity="0.8" />
          <rect x="25" y="55" width="35" height="2" fill="#FFFFFF" opacity="0.6" />
          <rect x="25" y="65" width="40" height="2" fill="#FFFFFF" opacity="0.6" />
          
          {/* Small circles for screws */}
          <circle cx="22" cy="42" r="2" fill="#374151" />
          <circle cx="78" cy="42" r="2" fill="#374151" />
          <circle cx="22" cy="78" r="2" fill="#374151" />
          <circle cx="78" cy="78" r="2" fill="#374151" />
        </svg>
      </motion.div>

      {/* Brand Name */}
      {showText && (
        <motion.div 
          className={`font-bold ${currentSize.text}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.span 
            className="text-red-500"
            animate={{ 
              textShadow: [
                "0 0 5px rgba(239, 68, 68, 0.5)",
                "0 0 10px rgba(239, 68, 68, 0.8)",
                "0 0 5px rgba(239, 68, 68, 0.5)"
              ]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Movie
          </motion.span>
          <motion.span 
            className="text-white ml-1"
            animate={{ 
              textShadow: [
                "0 0 5px rgba(255, 255, 255, 0.3)",
                "0 0 8px rgba(255, 255, 255, 0.6)",
                "0 0 5px rgba(255, 255, 255, 0.3)"
              ]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            Sports
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Logo;
