import React, { useState, useEffect } from 'react';
import SectionOverlay from '../components/SectionOverlay';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  BookOpen,
  User,
  Clock,
  Star,
  Share2
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { Hymn } from '../types/vedic';
import ShareButton from '../components/ShareButton';

const HymnViewer: React.FC = () => {
  const { hymnId } = useParams<{ hymnId: string }>();
  const { 
    getHymnById, 
    hymns, 
    showSanskrit, 
    showTransliteration, 
    showTranslation,
    audioEnabled,
    toggleAudio,
    toggleSanskrit,
    toggleTransliteration,
    toggleTranslation
  } = useAppStore();
  
  const [currentHymn, setCurrentHymn] = useState<Hymn | null>(null);
  const [currentVerse, setCurrentVerse] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [lockedVoice, setLockedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (hymnId) {
      const hymn = getHymnById(hymnId);
      setCurrentHymn(hymn || null);
      setCurrentVerse(0);
    }
  }, [hymnId, getHymnById]);

  useEffect(() => {
    if (currentUtterance) {
      window.speechSynthesis.cancel();
      setCurrentUtterance(null);
    }
  }, [currentVerse]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentUtterance) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentUtterance]);

  const playAudio = () => {
    if (!currentHymn || !currentHymn.verses[currentVerse]) return;
    
    // Stop any current speech
    if (currentUtterance) {
      window.speechSynthesis.cancel();
    }
    
    const currentVerseData = currentHymn.verses[currentVerse];
    
    // Build the queue of segments to read in order
    type Segment = { text: string; type: 'sa' | 'en' | 'iasta' };
    const segments: Segment[] = [];

    const translationText = currentVerseData.translations.wilson || currentVerseData.translations.griffith || currentVerseData.translations.jamison || '';

    if (showSanskrit && showTranslation) {
      if (currentVerseData.sanskrit) segments.push({ text: currentVerseData.sanskrit, type: 'sa' });
      if (translationText) segments.push({ text: translationText, type: 'en' });
    } else if (showSanskrit) {
      if (currentVerseData.sanskrit) segments.push({ text: currentVerseData.sanskrit, type: 'sa' });
    } else if (showTransliteration && !showTranslation) {
      if (currentVerseData.transliteration) segments.push({ text: currentVerseData.transliteration, type: 'en' });
    } else if (showTranslation) {
      if (translationText) segments.push({ text: translationText, type: 'en' });
    }

    if (segments.length === 0) return;

    const selectPreferredVoice = (voices: SpeechSynthesisVoice[], prefs: string[]) => {
      for (const pref of prefs) {
        const byExact = voices.find(v => v.lang.toLowerCase() === pref.toLowerCase());
        if (byExact) return byExact;
        const byPrefix = voices.find(v => v.lang.toLowerCase().startsWith(pref.split('-')[0].toLowerCase()));
        if (byPrefix) return byPrefix;
      }
      return undefined;
    };

    const speakSegmentAt = (index: number) => {
      if (index >= segments.length) {
        setIsPlaying(false);
        setCurrentUtterance(null);
        return;
      }

      const segment = segments[index];
      const utterance = new SpeechSynthesisUtterance(segment.text);

      const voices = window.speechSynthesis.getVoices();
      let languagePreferences: string[] = [];
      if (segment.type === 'sa') {
        languagePreferences = ['sa-IN', 'sa', 'hi-IN', 'hi', 'en-US'];
      } else {
        languagePreferences = ['en-US', 'en-GB', 'en'];
      }

      let preferredVoice = selectPreferredVoice(voices, languagePreferences);
      if (segment.type !== 'sa' && lockedVoice) {
        preferredVoice = lockedVoice;
      }
      if (segment.type === 'sa' && preferredVoice) {
        setLockedVoice(preferredVoice);
      }

      utterance.lang = (preferredVoice?.lang) || languagePreferences[0] || 'en-US';
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onend = () => {
        setCurrentUtterance(null);
        speakSegmentAt(index + 1);
      };
      utterance.onerror = () => {
        setCurrentUtterance(null);
        speakSegmentAt(index + 1);
      };

      setCurrentUtterance(utterance);
      window.speechSynthesis.speak(utterance);
    };

    const startSpeaking = () => {
      setIsPlaying(true);
      speakSegmentAt(0);
    };

    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices && availableVoices.length > 0) {
      startSpeaking();
    } else {
      const handleVoicesChanged = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        startSpeaking();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    }
  };

  const pauseAudio = () => {
    if (currentUtterance) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
    }
  };

  const nextVerse = () => {
    if (currentHymn && currentVerse < currentHymn.verses.length - 1) {
      setCurrentVerse(currentVerse + 1);
    }
  };

  const prevVerse = () => {
    if (currentVerse > 0) {
      setCurrentVerse(currentVerse - 1);
    }
  };

  const getCurrentHymnIndex = () => {
    return hymns.findIndex(h => h.id === currentHymn?.id);
  };

  const getNextHymn = () => {
    const currentIndex = getCurrentHymnIndex();
    return currentIndex < hymns.length - 1 ? hymns[currentIndex + 1] : null;
  };

  const getPrevHymn = () => {
    const currentIndex = getCurrentHymnIndex();
    return currentIndex > 0 ? hymns[currentIndex - 1] : null;
  };

  if (!currentHymn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-vedic-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-vedic-gold mb-2">Hymn Not Found</h2>
          <p className="text-vedic-light/70 mb-6">The requested hymn could not be found.</p>
          <Link to="/" className="btn-primary">Return Home</Link>
        </div>
      </div>
    );
  }

  const currentVerseData = currentHymn.verses[currentVerse];
  const nextHymn = getNextHymn();
  const prevHymn = getPrevHymn();

  return (
    <div className="min-h-screen bg-transparent relative">
      <SectionOverlay opacity={48} blur="sm" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-vedic-light/70 hover:text-vedic-gold transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-vedic-gold">
                  {currentHymn.id} - {currentHymn.devata}
                </h1>
                <p className="text-vedic-light/70">Mandala {currentHymn.mandala}, Sukta {currentHymn.sukta}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleAudio}
                className={`p-2 rounded-lg transition-colors ${
                  audioEnabled 
                    ? 'bg-vedic-gold text-vedic-deep' 
                    : 'bg-vedic-deep/50 text-vedic-light/70 hover:text-vedic-gold'
                }`}
              >
                {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </button>
              
              <ShareButton hymn={currentHymn} verse={currentVerseData} />
            </div>
          </div>

          {/* Hymn Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="card">
              <div className="flex items-center space-x-2 mb-2">
                <User className="h-4 w-4 text-vedic-gold" />
                <span className="text-sm font-medium text-vedic-gold">Rishi</span>
              </div>
              <p className="text-vedic-light">{currentHymn.rishi}</p>
            </div>
            
            <div className="card">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-4 w-4 text-vedic-gold" />
                <span className="text-sm font-medium text-vedic-gold">Meter</span>
              </div>
              <p className="text-vedic-light">{currentHymn.meter}</p>
            </div>
            
            <div className="card">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-vedic-gold" />
                <span className="text-sm font-medium text-vedic-gold">Verses</span>
              </div>
              <p className="text-vedic-light">{currentHymn.verses.length}</p>
            </div>
            
            <div className="card">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="h-4 w-4 text-vedic-gold" />
                <span className="text-sm font-medium text-vedic-gold">Themes</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {currentHymn.themes.map(theme => (
                  <span key={theme} className="text-xs bg-vedic-gold/20 text-vedic-gold px-2 py-1 rounded">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Verse Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevVerse}
            disabled={currentVerse === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-vedic-deep/50 text-vedic-light/70 hover:text-vedic-gold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-vedic-gold font-semibold">
              Verse {currentVerse + 1} of {currentHymn.verses.length}
            </span>
            
            {audioEnabled && (
              <button
                onClick={isPlaying ? pauseAudio : playAudio}
                className="p-2 bg-vedic-gold text-vedic-deep rounded-full hover:bg-vedic-saffron transition-colors"
                title={isPlaying ? "Pause audio" : "Play audio"}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
            )}
          </div>
          
          <button
            onClick={nextVerse}
            disabled={currentVerse === currentHymn.verses.length - 1}
            className="flex items-center space-x-2 px-4 py-2 bg-vedic-deep/50 text-vedic-light/70 hover:text-vedic-gold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Display Controls */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2 bg-vedic-deep/50 rounded-lg p-2">
            <span className="text-sm font-medium text-vedic-gold mr-2">Display:</span>
            <button
              onClick={toggleSanskrit}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                showSanskrit 
                  ? 'bg-vedic-gold text-vedic-deep' 
                  : 'text-vedic-light/70 hover:text-vedic-gold'
              }`}
            >
              Sanskrit
            </button>
            <button
              onClick={toggleTransliteration}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                showTransliteration 
                  ? 'bg-vedic-gold text-vedic-deep' 
                  : 'text-vedic-light/70 hover:text-vedic-gold'
              }`}
            >
              IAST
            </button>
            <button
              onClick={toggleTranslation}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                showTranslation 
                  ? 'bg-vedic-gold text-vedic-deep' 
                  : 'text-vedic-light/70 hover:text-vedic-gold'
              }`}
            >
              Translation
            </button>
          </div>
        </div>

        {/* Verse Display */}
        <motion.div
          key={currentVerse}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="card">
            <div className="space-y-6">
              {/* Sanskrit */}
              {showSanskrit && (
                <div>
                  <h3 className="text-lg font-semibold text-vedic-gold mb-3">Sanskrit</h3>
                  <div className="sanskrit-text text-2xl leading-relaxed text-vedic-light">
                    {currentVerseData.sanskrit}
                  </div>
                </div>
              )}

              {/* Transliteration */}
              {showTransliteration && (
                <div>
                  <h3 className="text-lg font-semibold text-vedic-gold mb-3">Transliteration (IAST)</h3>
                  <div className="transliteration text-xl leading-relaxed">
                    {currentVerseData.transliteration}
                  </div>
                </div>
              )}

              {/* Translations */}
              {showTranslation && (
                <div>
                  <h3 className="text-lg font-semibold text-vedic-gold mb-3">Translations</h3>
                  <div className="space-y-4">
                    {currentVerseData.translations.wilson && (
                      <div>
                        <h4 className="text-sm font-medium text-vedic-gold mb-2">Wilson</h4>
                        <p className="text-vedic-light/90 leading-relaxed">
                          {currentVerseData.translations.wilson}
                        </p>
                      </div>
                    )}
                    {currentVerseData.translations.griffith && (
                      <div>
                        <h4 className="text-sm font-medium text-vedic-gold mb-2">Griffith</h4>
                        <p className="text-vedic-light/90 leading-relaxed">
                          {currentVerseData.translations.griffith}
                        </p>
                      </div>
                    )}
                    {currentVerseData.translations.jamison && (
                      <div>
                        <h4 className="text-sm font-medium text-vedic-gold mb-2">Jamison & Brereton</h4>
                        <p className="text-vedic-light/90 leading-relaxed">
                          {currentVerseData.translations.jamison}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Meter Visualization */}
              <div>
                <h3 className="text-lg font-semibold text-vedic-gold mb-3">Meter: {currentVerseData.meter}</h3>
                <div className="bg-vedic-deep/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-vedic-light/70">Syllable Pattern:</span>
                    <span className="font-mono text-vedic-gold">{currentVerseData.syllables.join('-')}</span>
                  </div>
                  <div className="flex space-x-1">
                    {currentVerseData.syllables.map((count, index) => (
                      <div key={index} className="flex space-x-1">
                        {Array.from({ length: count }, (_, i) => (
                          <div
                            key={i}
                            className="w-2 h-4 bg-vedic-gold/60 rounded-sm"
                            title={`Syllable ${i + 1}`}
                          />
                        ))}
                        {index < currentVerseData.syllables.length - 1 && (
                          <div className="w-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation to Other Hymns */}
        <div className="flex items-center justify-between">
          {prevHymn ? (
            <Link
              to={`/hymn/${prevHymn.id}`}
              className="flex items-center space-x-2 px-6 py-3 bg-vedic-deep/50 text-vedic-light/70 hover:text-vedic-gold rounded-lg transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <div className="text-left">
                <div className="text-sm text-vedic-light/50">Previous</div>
                <div className="font-medium">{prevHymn.id} - {prevHymn.devata}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextHymn && (
            <Link
              to={`/hymn/${nextHymn.id}`}
              className="flex items-center space-x-2 px-6 py-3 bg-vedic-deep/50 text-vedic-light/70 hover:text-vedic-gold rounded-lg transition-colors"
            >
              <div className="text-right">
                <div className="text-sm text-vedic-light/50">Next</div>
                <div className="font-medium">{nextHymn.id} - {nextHymn.devata}</div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HymnViewer;
