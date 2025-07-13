import { useEffect } from 'react';

const SoundEffects = () => {
  useEffect(() => {
    // Create audio context for sound effects
    let audioContext;
    
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio API not supported');
      return;
    }

    // Sound effect functions
    const playClickSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    };

    const playHoverSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    };

    const playSuccessSound = () => {
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator1.frequency.setValueAtTime(523, audioContext.currentTime); // C5
      oscillator2.frequency.setValueAtTime(659, audioContext.currentTime); // E5
      
      oscillator1.frequency.setValueAtTime(784, audioContext.currentTime + 0.1); // G5
      oscillator2.frequency.setValueAtTime(1047, audioContext.currentTime + 0.1); // C6
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator1.start(audioContext.currentTime);
      oscillator2.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.3);
      oscillator2.stop(audioContext.currentTime + 0.3);
    };

    const playNotificationSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    // Add event listeners for sound effects
    const addSoundToElements = () => {
      // Click sounds for buttons
      const buttons = document.querySelectorAll('button, .cursor-pointer');
      buttons.forEach(button => {
        button.addEventListener('click', playClickSound);
      });

      // Hover sounds for cards
      const cards = document.querySelectorAll('[class*="Card"], .movie-card, .sports-card');
      cards.forEach(card => {
        card.addEventListener('mouseenter', playHoverSound);
      });

      // Success sound for favorites
      const favoriteButtons = document.querySelectorAll('[class*="favorite"], [class*="heart"]');
      favoriteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          playSuccessSound();
        });
      });
    };

    // Initial setup
    addSoundToElements();

    // Re-add sounds when new elements are added (for dynamic content)
    const observer = new MutationObserver(() => {
      addSoundToElements();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Global sound effects
    window.playSoundEffect = {
      click: playClickSound,
      hover: playHoverSound,
      success: playSuccessSound,
      notification: playNotificationSound
    };

    // Play notification sound for new notifications
    const notificationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.classList && 
                (node.classList.contains('notification') || 
                 node.querySelector && node.querySelector('.notification'))) {
              playNotificationSound();
            }
          });
        }
      });
    });

    const notificationContainer = document.querySelector('.notification-container');
    if (notificationContainer) {
      notificationObserver.observe(notificationContainer, {
        childList: true,
        subtree: true
      });
    }

    return () => {
      observer.disconnect();
      notificationObserver.disconnect();
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default SoundEffects;
