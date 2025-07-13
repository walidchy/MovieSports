import React from 'react';
import { motion } from 'framer-motion';

const ErrorMessage = ({ 
  message = 'Something went wrong', 
  onRetry = null, 
  type = 'error' 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'warning':
        return 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-300';
      case 'info':
        return 'border-blue-500 bg-blue-500 bg-opacity-10 text-blue-300';
      default:
        return 'border-red-500 bg-red-500 bg-opacity-10 text-red-300';
    }
  };

  return (
    <motion.div
      className={`border rounded-lg p-6 text-center max-w-md mx-auto ${getColorClasses()}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="text-4xl mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        {getIcon()}
      </motion.div>
      
      <h3 className="text-lg font-semibold mb-2">
        {type === 'warning' ? 'Warning' : type === 'info' ? 'Information' : 'Error'}
      </h3>
      
      <p className="text-sm opacity-90 mb-4">
        {message}
      </p>
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

// Inline error for smaller spaces
export const InlineError = ({ message, className = '' }) => {
  return (
    <motion.div
      className={`flex items-center space-x-2 text-red-400 text-sm ${className}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span>⚠️</span>
      <span>{message}</span>
    </motion.div>
  );
};

// No data message
export const NoDataMessage = ({ 
  message = 'No data available', 
  icon = '📭',
  suggestion = null 
}) => {
  return (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-6xl mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        {icon}
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-300 mb-2">
        {message}
      </h3>
      
      {suggestion && (
        <p className="text-gray-500 text-sm">
          {suggestion}
        </p>
      )}
    </motion.div>
  );
};

export default ErrorMessage;
