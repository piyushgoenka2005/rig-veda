import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Volume2, ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { Hymn, Verse } from '../types/vedic';

const FeaturedHymn: React.FC = () => {
  const { hymns, showSanskrit, showTransliteration, showTranslation } = useAppStore();
  const [featuredHymn, setFeaturedHymn] = useState<Hymn | null>(null);
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [revealState, setRevealState] = useState<'sanskrit' | 'translation' | 'complete'>('sanskrit');
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoicesLoaded(true);
      }
    };
    
    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Get hymn of the day based on date (consistent selection)
  useEffect(() => {
    if (hymns.length === 0) return;
    
    // Use day of year to select a hymn consistently
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const hymnIndex = dayOfYear % hymns.length;
    const selectedHymn = hymns[hymnIndex];
    
    setFeaturedHymn(selectedHymn);
    setCurrentVerse(selectedHymn.verses[0] || null);
    
    // Auto-reveal sequence
    const timer1 = setTimeout(() => setRevealState('translation'), 1500);
    const timer2 = setTimeout(() => setRevealState('complete'), 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [hymns]);

  const playAudio = () => {
    if (!currentVerse) return;

    // Stop any current speech
    if (currentUtterance) {
      window.speechSynthesis.cancel();
    }

    const translationText = currentVerse.translations.wilson || 
                           currentVerse.translations.griffith || 
                           currentVerse.translations.jamison || 
                           '';

    // Build text to speak
    let textToSpeak = '';
    if (showSanskrit && currentVerse.sanskrit) {
      textToSpeak += currentVerse.sanskrit + '. ';
    }
    if (showTranslation && translationText) {
      textToSpeak += translationText;
    } else if (showTransliteration && currentVerse.transliteration) {
      textToSpeak += currentVerse.transliteration;
    }

    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Try to find Sanskrit voice, fallback to English
    const voices = window.speechSynthesis.getVoices();
    const sanskritVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('sa'));
    const englishVoice = voices.find(v => v.lang.includes('en'));
    
    utterance.voice = sanskritVoice || englishVoice || null;
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentUtterance(null);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentUtterance(null);
    };

    window.speechSynthesis.speak(utterance);
    setCurrentUtterance(utterance);
  };

  const stopAudio = () => {
    if (currentUtterance) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
    }
  };

  useEffect(() => {
    return () => {
      if (currentUtterance) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentUtterance]);

  if (!featuredHymn || !currentVerse) return null;

  const translationText = currentVerse.translations.wilson || 
                         currentVerse.translations.griffith || 
                         currentVerse.translations.jamison || 
                         '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative max-w-5xl mx-auto"
    >
      {/* Badge - Modernized */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="inline-flex items-center space-x-3 mb-8 px-6 py-3 rounded-full 
                   bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 
                   border border-white/20 backdrop-blur-xl shadow-lg"
      >
        <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
        <span className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Hymn of the Day
        </span>
        <span className="hidden sm:inline text-sm text-white/60">• Mandala {featuredHymn.mandala} • {featuredHymn.devata}</span>
      </motion.div>

      {/* Hymn Content Card - Modernized */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative rounded-3xl p-8 md:p-12
                   bg-gradient-to-br from-white/5 via-white/5 to-white/0
                   border border-white/20 backdrop-blur-2xl
                   shadow-2xl shadow-purple-500/10
                   hover:shadow-purple-500/20
                   hover:border-white/30
                   transition-all duration-500
                   overflow-hidden
                   group"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
        {/* Sanskrit Text */}
        <AnimatePresence mode="wait">
          {(revealState === 'sanskrit' || revealState === 'translation' || revealState === 'complete') && (
            <motion.div
              key="sanskrit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="relative z-10">
                <p className="sanskrit-text text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-vedic-gold via-vedic-saffron to-orange-400 text-center leading-relaxed mb-4 break-words font-bold drop-shadow-lg">
                  {currentVerse.sanskrit}
                </p>
                {showTransliteration && (
                  <p className="text-base sm:text-lg md:text-xl text-center text-white/60 italic mb-2 break-words font-light">
                    {currentVerse.transliteration}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Translation */}
        <AnimatePresence mode="wait">
          {(revealState === 'translation' || revealState === 'complete') && (
            <motion.div
              key="translation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <div className="relative z-10">
                {showTranslation && translationText && (
                  <p className="text-lg sm:text-xl md:text-2xl text-white/90 text-center leading-relaxed break-words px-2 font-light italic">
                    <span className="text-vedic-gold text-4xl">"</span>
                    {translationText}
                    <span className="text-vedic-gold text-4xl">"</span>
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
            {/* Audio Button - Modernized */}
            <button
              onClick={isPlaying ? stopAudio : playAudio}
              disabled={!voicesLoaded}
              className="
                group relative flex items-center space-x-3 px-8 py-4 
                bg-gradient-to-r from-cyan-500/20 to-purple-500/20
                border border-white/20 rounded-2xl
                backdrop-blur-xl
                hover:from-cyan-500/30 hover:to-purple-500/30
                hover:border-white/40
                hover:scale-110
                active:scale-95
                transition-all duration-300 
                disabled:opacity-50 disabled:cursor-not-allowed
                overflow-hidden
              "
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {isPlaying ? (
                <>
                  <Pause className="h-6 w-6 text-cyan-400 relative z-10 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-bold relative z-10">Pause</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-6 w-6 text-cyan-400 relative z-10 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-bold relative z-10">Listen</span>
                </>
              )}
            </button>

            {/* Explore Button - Modernized */}
            <Link
              to={`/hymn/${featuredHymn.id}`}
              className="
                group relative flex items-center space-x-3 px-10 py-4
                bg-gradient-to-r from-vedic-gold to-vedic-saffron
                text-vedic-deep font-bold text-lg
                rounded-2xl
                shadow-2xl shadow-vedic-gold/50
                hover:shadow-vedic-gold/70
                hover:scale-110
                active:scale-95
                transition-all duration-300
                overflow-hidden
              "
            >
              <span className="relative z-10">Explore Full Hymn</span>
              <ArrowRight className="h-6 w-6 relative z-10 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-vedic-saffron to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
        </motion.div>

        {/* Hymn Info - Modernized */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="relative z-10 mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-sm"
        >
          <div className="px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <span className="text-white/60">Rishi: </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold">{featuredHymn.rishi}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <span className="text-white/60">Meter: </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold">{featuredHymn.meter}</span>
          </div>
          {featuredHymn.themes.length > 0 && (
            <div className="px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <span className="text-white/60">Themes: </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 font-bold">{featuredHymn.themes.join(', ')}</span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FeaturedHymn;

