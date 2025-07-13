import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Simulate live notifications
  useEffect(() => {
    const notifications = [
      {
        type: 'live',
        title: '🔴 LIVE MATCH',
        message: 'Manchester United vs Liverpool - 2-1',
        color: 'from-red-600 to-red-700'
      },
      {
        type: 'score',
        title: '🏀 NBA UPDATE',
        message: 'Lakers lead Warriors 98-92 in Q4',
        color: 'from-orange-600 to-orange-700'
      },
      {
        type: 'race',
        title: '🏁 F1 QUALIFYING',
        message: 'Verstappen takes pole position!',
        color: 'from-red-700 to-red-800'
      },
      {
        type: 'movie',
        title: '🎬 NEW RELEASE',
        message: 'Top Gun: Maverick now trending!',
        color: 'from-blue-600 to-blue-700'
      }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < notifications.length) {
        addNotification(notifications[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`bg-gradient-to-r ${notification.color} text-white p-4 rounded-lg shadow-lg border border-white/20 backdrop-blur-sm`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">{notification.title}</h4>
                <p className="text-xs opacity-90">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Progress bar */}
            <motion.div
              className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
            >
              <div className="h-full bg-white/60 rounded-full" />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;
