import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, ArrowRight, Sparkles } from 'lucide-react';
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
      className="relative max-w-4xl mx-auto"
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="inline-flex items-center space-x-2 bg-vedic-gold/20 border border-vedic-gold/40 rounded-full px-4 py-2 mb-6"
      >
        <Sparkles className="h-4 w-4 text-vedic-gold animate-pulse" />
        <span className="text-sm font-medium text-vedic-gold">Hymn of the Day</span>
        <span className="hidden sm:inline text-xs text-vedic-light/60">• Mandala {featuredHymn.mandala} • {featuredHymn.devata}</span>
      </motion.div>

      {/* Hymn Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="card border-2 border-vedic-gold/30 hover:border-vedic-gold/60 transition-all duration-300 backdrop-blur-lg"
      >
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
              <p className="sanskrit-text text-2xl sm:text-3xl md:text-4xl text-vedic-gold text-center leading-relaxed mb-4 break-words">
                {currentVerse.sanskrit}
              </p>
              {showTransliteration && (
                <p className="transliteration text-base sm:text-lg md:text-xl text-center text-vedic-light/70 italic mb-2 break-words">
                  {currentVerse.transliteration}
                </p>
              )}
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
              {showTranslation && translationText && (
                <p className="text-base sm:text-lg md:text-xl text-vedic-light/90 text-center leading-relaxed font-serif break-words px-2">
                  "{translationText}"
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          {/* Audio Button */}
          <button
            onClick={isPlaying ? stopAudio : playAudio}
            disabled={!voicesLoaded}
            className="group flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-vedic-gold/20 hover:bg-vedic-gold/30 border border-vedic-gold/40 hover:border-vedic-gold/60 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isPlaying ? (
              <>
                <Pause className="h-5 w-5 text-vedic-gold group-hover:scale-110 transition-transform" />
                <span className="text-vedic-gold font-medium">Pause</span>
              </>
            ) : (
              <>
                <Volume2 className="h-5 w-5 text-vedic-gold group-hover:scale-110 transition-transform" />
                <span className="text-vedic-gold font-medium">Listen</span>
              </>
            )}
          </button>

          {/* Explore Button */}
          <Link
            to={`/hymn/${featuredHymn.id}`}
            className="group flex items-center space-x-2 btn-primary"
          >
            <span>Explore Full Hymn</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Hymn Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 pt-6 border-t border-vedic-gold/20 flex flex-wrap items-center justify-center gap-4 text-sm text-vedic-light/60"
        >
          <span>Rishi: <span className="text-vedic-gold">{featuredHymn.rishi}</span></span>
          <span>•</span>
          <span>Meter: <span className="text-vedic-gold">{featuredHymn.meter}</span></span>
          {featuredHymn.themes.length > 0 && (
            <>
              <span>•</span>
              <span>Themes: <span className="text-vedic-gold">{featuredHymn.themes.join(', ')}</span></span>
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FeaturedHymn;

