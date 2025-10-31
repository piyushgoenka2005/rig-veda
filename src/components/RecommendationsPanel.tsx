import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, TrendingUp, Sparkles, ArrowRight, X } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { Hymn } from '../types/vedic';

interface Recommendation {
  type: 'popular' | 'beginner' | 'similar' | 'daily';
  title: string;
  hymns: Hymn[];
  icon: React.ElementType;
  description: string;
}

const RecommendationsPanel: React.FC = () => {
  const { hymns } = useAppStore();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (hymns.length === 0) return;

    // Generate recommendations
    const popularHymns: Hymn[] = [hymns[0]]; // First hymn is most popular (in demo)
    
    // Beginner's Journey - first hymns of different mandalas
    const beginnerHymns = hymns
      .filter(h => h.mandala <= 3)
      .slice(0, 3);

    // Daily Meditation - peaceful/contemplative hymns (Agni, Soma themes)
    const dailyHymns = hymns
      .filter(h => h.themes.includes('fire') || h.themes.includes('elixir'))
      .slice(0, 2);

    // Similar hymns - based on deity or theme
    const similarHymns = hymns
      .filter(h => h.devata === hymns[0].devata && h.id !== hymns[0].id)
      .slice(0, 2);

    setRecommendations([
      {
        type: 'popular',
        title: 'Popular This Week',
        hymns: popularHymns,
        icon: TrendingUp,
        description: 'Most explored hymns'
      },
      {
        type: 'beginner',
        title: "Beginner's Journey",
        hymns: beginnerHymns,
        icon: Sparkles,
        description: 'Start your exploration here'
      },
      {
        type: 'daily',
        title: 'Daily Meditation',
        hymns: dailyHymns,
        icon: BookOpen,
        description: 'Peaceful hymns for contemplation'
      },
      {
        type: 'similar',
        title: 'Similar Hymns',
        hymns: similarHymns.length > 0 ? similarHymns : hymns.slice(1, 3),
        icon: ArrowRight,
        description: 'Based on your interests'
      }
    ]);
  }, [hymns]);

  if (recommendations.length === 0) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isCollapsed ? 'calc(100% - 60px)' : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed right-0 top-20 bottom-20 sm:bottom-6 w-full sm:w-80 z-30 max-h-[calc(100vh-6rem)] hidden lg:block"
    >
      <div className="h-full bg-vedic-deep/95 backdrop-blur-md border-l border-vedic-gold/20 rounded-l-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-vedic-gold/20">
          <h3 className="text-lg font-bold text-vedic-gold">Recommendations</h3>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:text-vedic-gold transition-colors"
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <X className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-6"
            >
              {recommendations.map((rec, index) => {
                const Icon = rec.icon;
                const isExpanded = selectedCategory === rec.type;

                return (
                  <motion.div
                    key={rec.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card hover:border-vedic-gold/40 transition-all"
                  >
                    <button
                      onClick={() => setSelectedCategory(isExpanded ? null : rec.type)}
                      className="w-full flex items-start justify-between text-left group"
                    >
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="p-2 bg-vedic-gold/20 rounded-lg group-hover:bg-vedic-gold/30 transition-colors">
                          <Icon className="h-4 w-4 text-vedic-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-vedic-gold mb-1">
                            {rec.title}
                          </h4>
                          <p className="text-xs text-vedic-light/60">{rec.description}</p>
                        </div>
                      </div>
                      <ArrowRight
                        className={`h-4 w-4 text-vedic-gold/50 transition-transform flex-shrink-0 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </button>

                    {/* Expanded Hymns List */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 space-y-2 overflow-hidden"
                        >
                          {rec.hymns.map((hymn) => (
                            <Link
                              key={hymn.id}
                              to={`/hymn/${hymn.id}`}
                              className="block p-2 rounded-lg bg-vedic-deep/50 hover:bg-vedic-gold/10 
                                       transition-colors group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-vedic-light truncate group-hover:text-vedic-gold transition-colors">
                                    {hymn.id}
                                  </p>
                                  <p className="text-xs text-vedic-light/60 truncate">
                                    {hymn.devata} • Mandala {hymn.mandala}
                                  </p>
                                </div>
                                <ArrowRight className="h-3 w-3 text-vedic-gold/50 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RecommendationsPanel;

