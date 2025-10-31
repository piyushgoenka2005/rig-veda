import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import toast from 'react-hot-toast';

const KeyboardShortcuts: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { hymns, getHymnById } = useAppStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Press '?' to show shortcuts
      if (e.key === '?' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        // Only if not typing in an input
        if (document.activeElement?.tagName !== 'INPUT' && 
            document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setShowModal(true);
        }
      }

      // Press '/' to focus search (if QuickAccessToolbar is visible)
      if (e.key === '/' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        if (document.activeElement?.tagName !== 'INPUT' && 
            document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          // Trigger search in QuickAccessToolbar (this would need ref forwarding)
          toast.success('Press the + button to search');
        }
      }

      // Escape to close modals
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }

      // Number keys 1-4 for quick navigation
      if (e.key >= '1' && e.key <= '4' && !e.ctrlKey && !e.metaKey) {
        if (document.activeElement?.tagName !== 'INPUT' && 
            document.activeElement?.tagName !== 'TEXTAREA') {
          const key = parseInt(e.key);
          const routes = ['/', '/mandalas', '/deities', '/study'];
          if (routes[key - 1]) {
            navigate(routes[key - 1]);
          }
        }
      }

      // Random hymn: R key
      if (e.key === 'r' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        if (document.activeElement?.tagName !== 'INPUT' && 
            document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          if (hymns.length > 0) {
            const randomHymn = hymns[Math.floor(Math.random() * hymns.length)];
            navigate(`/hymn/${randomHymn.id}`);
            toast.success(`Exploring ${randomHymn.id}`);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, hymns, showModal]);

  const shortcuts = [
    { keys: ['?'], description: 'Show keyboard shortcuts' },
    { keys: ['1'], description: 'Go to Home' },
    { keys: ['2'], description: 'Go to Mandalas' },
    { keys: ['3'], description: 'Go to Deities' },
    { keys: ['4'], description: 'Go to Study Mode' },
    { keys: ['R'], description: 'Random hymn' },
    { keys: ['Esc'], description: 'Close modals/dialogs' },
  ];

  return (
    <>
      {/* Keyboard Shortcut Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-40 p-3 bg-vedic-deep/80 backdrop-blur-sm border border-vedic-gold/30 rounded-full hover:bg-vedic-gold/20 transition-all hover:scale-110"
        aria-label="Keyboard Shortcuts"
        title="Press ? for shortcuts"
      >
        <Keyboard className="h-5 w-5 text-vedic-gold" />
      </button>

      {/* Shortcuts Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4"
            >
              <div className="card border-2 border-vedic-gold/40">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-vedic-gold flex items-center space-x-2">
                    <Keyboard className="h-6 w-6" />
                    <span>Keyboard Shortcuts</span>
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:text-vedic-gold transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {shortcuts.map((shortcut, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-vedic-deep/50 rounded-lg"
                    >
                      <span className="text-vedic-light/80">{shortcut.description}</span>
                      <div className="flex items-center space-x-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="px-2 py-1 bg-vedic-deep border border-vedic-gold/40 rounded text-sm font-mono text-vedic-gold">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-vedic-light/40">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-vedic-gold/20 text-sm text-vedic-light/60 text-center">
                  Press <kbd className="px-1.5 py-0.5 bg-vedic-deep border border-vedic-gold/40 rounded text-vedic-gold">Esc</kbd> to close
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcuts;

