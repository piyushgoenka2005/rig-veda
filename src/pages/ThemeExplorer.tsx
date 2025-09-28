import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Sliders, 
  Filter, 
  Eye,
  EyeOff
} from 'lucide-react';
import { sampleThemes, sampleHymns } from '../data/sample-data';
import { Theme, Hymn } from '../types/vedic';

interface ThemeSliderProps {
  theme: Theme;
  value: number;
  onChange: (value: number) => void;
  isActive: boolean;
  onToggle: () => void;
}

const ThemeSlider: React.FC<ThemeSliderProps> = ({ theme, value, onChange, isActive, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg transition-colors ${
              isActive 
                ? 'bg-vedic-gold text-vedic-deep' 
                : 'bg-vedic-deep/50 text-vedic-light/70 hover:text-vedic-gold'
            }`}
          >
            {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <div>
            <h3 className="font-semibold text-vedic-gold">{theme.name}</h3>
            <p className="text-sm text-vedic-light/70">{theme.description}</p>
          </div>
        </div>
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: theme.color }}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-vedic-light/70">Intensity</span>
          <span className="text-sm font-medium text-vedic-gold">{Math.round(value * 100)}%</span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-vedic-deep/30 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, ${theme.color} 0%, ${theme.color} ${value * 100}%, #2C1810 ${value * 100}%, #2C1810 100%)`
            }}
          />
        </div>

        <div className="flex flex-wrap gap-1">
          {theme.keywords.map(keyword => (
            <span key={keyword} className="text-xs bg-vedic-gold/20 text-vedic-gold px-2 py-1 rounded">
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

interface HymnCardProps {
  hymn: Hymn;
  matchingThemes: string[];
  themeIntensities: { [key: string]: number };
}

const HymnCard: React.FC<HymnCardProps> = ({ hymn, matchingThemes, themeIntensities }) => {
  const totalIntensity = matchingThemes.reduce((sum, theme) => sum + themeIntensities[theme], 0);
  const maxIntensity = Math.max(...Object.values(themeIntensities));
  const intensity = totalIntensity / matchingThemes.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="card cursor-pointer hover:border-vedic-gold/40 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-vedic-gold">{hymn.id} - {hymn.devata}</h3>
          <p className="text-sm text-vedic-light/70">by {hymn.rishi}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-vedic-gold">
            {Math.round(intensity * 100)}% match
          </div>
          <div className="text-xs text-vedic-light/50">
            {hymn.verses.length} verses
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm text-vedic-light/70">Matching themes:</span>
          <div className="flex space-x-1">
            {matchingThemes.map(theme => (
              <div
                key={theme}
                className="w-3 h-3 rounded-full"
                style={{ 
                  backgroundColor: sampleThemes.find(t => t.id === theme)?.color || '#D4AF37',
                  opacity: themeIntensities[theme]
                }}
                title={theme}
              />
            ))}
          </div>
        </div>
        
        <div className="w-full bg-vedic-deep/30 rounded-full h-2">
          <div 
            className="bg-vedic-gold h-2 rounded-full transition-all duration-300"
            style={{ width: `${(intensity / maxIntensity) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {hymn.themes.map(theme => (
          <span key={theme} className="text-xs bg-vedic-gold/20 text-vedic-gold px-2 py-1 rounded">
            {theme}
          </span>
        ))}
      </div>

      <div className="text-sm text-vedic-light/80 line-clamp-2">
        {hymn.verses[0]?.translations.wilson || hymn.verses[0]?.translations.griffith || 'No translation available'}
      </div>
    </motion.div>
  );
};

const ThemeExplorer: React.FC = () => {
  const [themeIntensities, setThemeIntensities] = useState<{ [key: string]: number }>(() => {
    const initial: { [key: string]: number } = {};
    sampleThemes.forEach(theme => {
      initial[theme.id] = theme.intensity;
    });
    return initial;
  });
  
  const [activeThemes, setActiveThemes] = useState<string[]>(sampleThemes.map(t => t.id));
  const [viewMode, setViewMode] = useState<'grid' | 'chart'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'hymn' | 'intensity'>('relevance');

  const filteredHymns = useMemo(() => {
    let filtered = sampleHymns.filter(hymn => {
      return hymn.themes.some(theme => 
        activeThemes.includes(theme) && themeIntensities[theme] > 0
      );
    });

    // Sort hymns
    filtered.sort((a, b) => {
      const aIntensity = a.themes
        .filter(theme => activeThemes.includes(theme))
        .reduce((sum, theme) => sum + themeIntensities[theme], 0) / a.themes.length;
      
      const bIntensity = b.themes
        .filter(theme => activeThemes.includes(theme))
        .reduce((sum, theme) => sum + themeIntensities[theme], 0) / b.themes.length;

      switch (sortBy) {
        case 'relevance':
          return bIntensity - aIntensity;
        case 'hymn':
          return a.id.localeCompare(b.id);
        case 'intensity':
          return bIntensity - aIntensity;
        default:
          return 0;
      }
    });

    return filtered;
  }, [themeIntensities, activeThemes, sortBy]);

  const handleThemeIntensityChange = (themeId: string, value: number) => {
    setThemeIntensities(prev => ({
      ...prev,
      [themeId]: value
    }));
  };

  const toggleTheme = (themeId: string) => {
    setActiveThemes(prev => 
      prev.includes(themeId) 
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    );
  };

  const resetThemes = () => {
    const reset: { [key: string]: number } = {};
    sampleThemes.forEach(theme => {
      reset[theme.id] = theme.intensity;
    });
    setThemeIntensities(reset);
    setActiveThemes(sampleThemes.map(t => t.id));
  };

  const getThemeStats = () => {
    const totalHymns = sampleHymns.length;
    const activeHymnCount = filteredHymns.length;
    const avgIntensity = Object.values(themeIntensities).reduce((sum, val) => sum + val, 0) / Object.keys(themeIntensities).length;
    
    return {
      totalHymns,
      activeHymnCount,
      avgIntensity: Math.round(avgIntensity * 100),
      activeThemes: activeThemes.length
    };
  };

  const stats = getThemeStats();

  return (
    <div className="min-h-screen bg-vedic-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-vedic-gold mb-2">Theme Explorer</h1>
              <p className="text-vedic-light/70">Discover patterns across the Rig Veda corpus with interactive theme mapping</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={resetThemes}
                className="btn-secondary"
              >
                Reset
              </button>
              
              <div className="flex items-center space-x-2 bg-vedic-deep/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-vedic-gold text-vedic-deep' 
                      : 'text-vedic-light/70 hover:text-vedic-gold'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                    viewMode === 'chart' 
                      ? 'bg-vedic-gold text-vedic-deep' 
                      : 'text-vedic-light/70 hover:text-vedic-gold'
                  }`}
                >
                  Chart
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card text-center">
              <div className="text-2xl font-bold text-vedic-gold">{stats.totalHymns}</div>
              <div className="text-sm text-vedic-light/70">Total Hymns</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-vedic-gold">{stats.activeHymnCount}</div>
              <div className="text-sm text-vedic-light/70">Matching Hymns</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-vedic-gold">{stats.activeThemes}</div>
              <div className="text-sm text-vedic-light/70">Active Themes</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-vedic-gold">{stats.avgIntensity}%</div>
              <div className="text-sm text-vedic-light/70">Avg Intensity</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Theme Controls */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <div className="flex items-center space-x-2 mb-6">
                <Sliders className="h-5 w-5 text-vedic-gold" />
                <h2 className="text-xl font-bold text-vedic-gold">Theme Controls</h2>
              </div>
              
              <div className="space-y-4">
                {sampleThemes.map(theme => (
                  <ThemeSlider
                    key={theme.id}
                    theme={theme}
                    value={themeIntensities[theme.id]}
                    onChange={(value) => handleThemeIntensityChange(theme.id, value)}
                    isActive={activeThemes.includes(theme.id)}
                    onToggle={() => toggleTheme(theme.id)}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-vedic-gold">
                  Matching Hymns ({filteredHymns.length})
                </h2>
                
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-vedic-gold" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 bg-vedic-deep/50 border border-vedic-gold/20 rounded-lg text-vedic-light focus:outline-none focus:border-vedic-gold"
                  >
                    <option value="relevance">Sort by Relevance</option>
                    <option value="hymn">Sort by Hymn</option>
                    <option value="intensity">Sort by Intensity</option>
                  </select>
                </div>
              </div>

              {filteredHymns.length === 0 ? (
                <div className="card text-center py-12">
                  <Palette className="h-16 w-16 text-vedic-gold mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-vedic-gold mb-2">No Hymns Found</h3>
                  <p className="text-vedic-light/70">
                    Adjust the theme sliders to find hymns that match your criteria.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHymns.map(hymn => {
                    const matchingThemes = hymn.themes.filter(theme => 
                      activeThemes.includes(theme) && themeIntensities[theme] > 0
                    );
                    
                    return (
                      <HymnCard
                        key={hymn.id}
                        hymn={hymn}
                        matchingThemes={matchingThemes}
                        themeIntensities={themeIntensities}
                      />
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeExplorer;
