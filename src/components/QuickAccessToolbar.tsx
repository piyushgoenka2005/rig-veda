import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Shuffle, 
  Volume2, 
  Settings, 
  X,
  Plus
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import toast from 'react-hot-toast';

const QuickAccessToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { hymns } = useAppStore();

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleRandomHymn = () => {
    if (hymns.length === 0) return;
    const randomHymn = hymns[Math.floor(Math.random() * hymns.length)];
    navigate(`/hymn/${randomHymn.id}`);
    setIsOpen(false);
    toast.success(`Exploring ${randomHymn.id} - ${randomHymn.devata}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Simple search - find first matching hymn
    const found = hymns.find(h => 
      h.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.devata.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.rishi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.themes.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (found) {
      navigate(`/hymn/${found.id}`);
      setIsOpen(false);
      setShowSearch(false);
      setSearchQuery('');
      toast.success(`Found: ${found.id}`);
    } else {
      toast.error('No hymn found matching your search');
    }
  };

  const toggleToolbar = () => {
    setIsOpen(!isOpen);
    if (!isOpen && showSearch) {
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const menuItems = [
    {
      icon: Search,
      label: 'Quick Search',
      action: () => setShowSearch(!showSearch),
      color: 'text-blue-400'
    },
    {
      icon: Shuffle,
      label: 'Random Hymn',
      action: handleRandomHymn,
      color: 'text-purple-400'
    },
    {
      icon: Volume2,
      label: 'Audio Settings',
      action: () => {
        navigate('/study');
        setIsOpen(false);
      },
      color: 'text-green-400'
    },
    {
      icon: Settings,
      label: 'Settings',
      action: () => {
        // Could open settings modal
        setIsOpen(false);
        toast.success('Settings (coming soon)');
      },
      color: 'text-gray-400'
    }
  ];

  return (
    <>
      {/* Search Input Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 sm:bottom-32 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-80 max-w-sm"
          >
            <form onSubmit={handleSearch} className="card">
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-vedic-gold" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hymns, deities, themes..."
                  className="flex-1 bg-transparent border-none outline-none text-vedic-light placeholder:text-vedic-light/50"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  className="p-1 hover:text-vedic-gold transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40">
        {/* Menu Items */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-16 sm:bottom-20 right-0 mb-2 space-y-2 sm:space-y-3 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide"
            >
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={item.action}
                    className="flex items-center space-x-3 card hover:border-vedic-gold/50 group"
                  >
                    <Icon className={`h-5 w-5 ${item.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-sm font-medium text-vedic-light whitespace-nowrap">
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          onClick={toggleToolbar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`w-14 h-14 rounded-full bg-vedic-gold text-vedic-deep shadow-2xl 
                     flex items-center justify-center transition-all duration-300
                     hover:bg-vedic-saffron hover:shadow-vedic-gold/50`}
          aria-label="Quick Access"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Plus className="h-6 w-6" />
          </motion.div>
        </motion.button>
      </div>
    </>
  );
};

export default QuickAccessToolbar;

