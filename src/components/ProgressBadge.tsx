import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, TrendingUp, Calendar } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const ACHIEVEMENTS: Record<string, { name: string; description: string; icon: string }> = {
  'first-hymn': { name: 'First Steps', description: 'Read your first hymn', icon: '🎯' },
  'hymn-reader': { name: 'Devoted Reader', description: 'Read 10 hymns', icon: '📚' },
  'all-mandalas': { name: 'Complete Explorer', description: 'Explored all 10 Mandalas', icon: '🌟' },
  'week-streak': { name: 'Dedicated Student', description: '7-day reading streak', icon: '🔥' }
};

const ProgressBadge: React.FC = () => {
  const { progress, hymns, markHymnRead, updateReadingStreak } = useAppStore();
  const location = useLocation();
  const [showAchievement, setShowAchievement] = React.useState<string | null>(null);

  useEffect(() => {
    // Update streak on mount
    updateReadingStreak();
  }, [updateReadingStreak]);

  // Track when viewing a hymn
  useEffect(() => {
    const hymnMatch = location.pathname.match(/\/hymn\/(.+)/);
    if (hymnMatch && !progress.readHymns.has(hymnMatch[1])) {
      // Mark as read after a delay (user has viewed it)
      const timer = setTimeout(() => {
        markHymnRead(hymnMatch[1]);
        
        // Check if this unlocked an achievement (with a small delay to get updated state)
        setTimeout(() => {
          const newProgress = useAppStore.getState().progress;
          const newAchievement = newProgress.achievements
            .filter(a => !progress.achievements.includes(a))
            .pop();
          
          if (newAchievement && ACHIEVEMENTS[newAchievement]) {
            setShowAchievement(newAchievement);
            toast.success(`Achievement Unlocked: ${ACHIEVEMENTS[newAchievement].name}!`, {
              duration: 5000,
              icon: ACHIEVEMENTS[newAchievement].icon || '🏆'
            });
          }
        }, 100);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname, progress.readHymns, markHymnRead, progress.achievements]);

  const mandalasCount = progress.mandalasExplored.size;
  const totalHymnsRead = progress.readHymns.size;
  const totalHymns = hymns.length;

  return (
    <>
      {/* Progress Badge in Header */}
      <div className="hidden md:flex items-center space-x-2 lg:space-x-4 flex-wrap gap-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center space-x-1.5 px-2 py-1 bg-vedic-gold/10 border border-vedic-gold/30 rounded-full"
          title="Mandalas Explored"
        >
          <Award className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-vedic-gold flex-shrink-0" />
          <span className="text-xs lg:text-sm font-medium text-vedic-gold whitespace-nowrap">
            {mandalasCount}/10
          </span>
        </motion.div>
        
        {progress.readingStreak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-1.5 px-2 py-1 bg-vedic-saffron/10 border border-vedic-saffron/30 rounded-full"
            title={`${progress.readingStreak} day reading streak`}
          >
            <Calendar className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-vedic-saffron flex-shrink-0" />
            <span className="text-xs lg:text-sm font-medium text-vedic-saffron whitespace-nowrap">
              {progress.readingStreak}
            </span>
          </motion.div>
        )}
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center space-x-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full"
          title="Hymns Read"
        >
          <TrendingUp className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-blue-400 flex-shrink-0" />
          <span className="text-xs lg:text-sm font-medium text-blue-400 whitespace-nowrap">
            {totalHymnsRead}/{totalHymns}
          </span>
        </motion.div>
      </div>

      {/* Achievement Toast */}
      <AnimatePresence>
        {showAchievement && ACHIEVEMENTS[showAchievement] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
            onAnimationComplete={() => {
              setTimeout(() => setShowAchievement(null), 3000);
            }}
          >
            <div className="card border-2 border-vedic-gold bg-gradient-to-r from-vedic-gold/20 to-vedic-saffron/20 p-6 max-w-sm">
              <div className="text-center">
                <div className="text-5xl mb-2">{ACHIEVEMENTS[showAchievement].icon}</div>
                <h3 className="text-xl font-bold text-vedic-gold mb-1">
                  {ACHIEVEMENTS[showAchievement].name}
                </h3>
                <p className="text-sm text-vedic-light/80">
                  {ACHIEVEMENTS[showAchievement].description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProgressBadge;

