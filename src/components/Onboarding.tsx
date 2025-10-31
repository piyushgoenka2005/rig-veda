import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, BookOpen, Eye, Volume2, Sparkles, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';

interface OnboardingProps {
  onClose: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { 
    showSanskrit, 
    showTransliteration, 
    showTranslation,
    toggleSanskrit,
    toggleTransliteration,
    toggleTranslation
  } = useAppStore();

  const steps = [
    {
      title: "Welcome to Rig Veda Explorer",
      content: (
        <div className="text-center">
          <div className="mb-6">
            <BookOpen className="h-16 w-16 text-vedic-gold mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-vedic-gold mb-2">Explore the Ancient Wisdom</h2>
            <p className="text-vedic-light/80">
              Discover the Rig Veda through interactive visualizations, deity networks, and immersive hymn exploration.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="card">
              <h3 className="font-semibold text-vedic-gold mb-2">Interactive Hymns</h3>
              <p className="text-sm text-vedic-light/70">Read Sanskrit, transliteration, and translations side by side</p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-vedic-gold mb-2">Deity Networks</h3>
              <p className="text-sm text-vedic-light/70">Explore relationships between gods and their epithets</p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-vedic-gold mb-2">Theme Mapping</h3>
              <p className="text-sm text-vedic-light/70">Discover patterns across the entire corpus</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Understanding the Hymn Panel",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Eye className="h-12 w-12 text-vedic-gold mx-auto mb-3" />
            <h2 className="text-xl font-bold text-vedic-gold">How to Read a Hymn</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-vedic-gold text-vedic-deep rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h3 className="font-semibold text-vedic-gold">Sanskrit Text</h3>
                <p className="text-sm text-vedic-light/70">Original Devanagari script with proper typography</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-vedic-gold text-vedic-deep rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h3 className="font-semibold text-vedic-gold">Transliteration (IAST)</h3>
                <p className="text-sm text-vedic-light/70">Roman script for pronunciation and study</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-vedic-gold text-vedic-deep rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h3 className="font-semibold text-vedic-gold">Translations</h3>
                <p className="text-sm text-vedic-light/70">Multiple scholarly translations for comparison</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-vedic-gold text-vedic-deep rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <h3 className="font-semibold text-vedic-gold">Meter & Context</h3>
                <p className="text-sm text-vedic-light/70">Poetic structure and ritual information</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "What is Meter?",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Volume2 className="h-12 w-12 text-vedic-gold mx-auto mb-3" />
            <h2 className="text-xl font-bold text-vedic-gold">Understanding Vedic Meters</h2>
          </div>
          
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold text-vedic-gold mb-2">Gayatri (8-8-8)</h3>
              <p className="text-sm text-vedic-light/70 mb-2">The most sacred meter, 24 syllables total</p>
              <div className="text-xs font-mono bg-vedic-deep/50 p-2 rounded">
                ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ | ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ | ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰
              </div>
            </div>
            
            <div className="card">
              <h3 className="font-semibold text-vedic-gold mb-2">Anushtubh (8-8-8-8)</h3>
              <p className="text-sm text-vedic-light/70 mb-2">Four lines of eight syllables each</p>
              <div className="text-xs font-mono bg-vedic-deep/50 p-2 rounded">
                ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ | ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ | ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ | ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰
              </div>
            </div>
            
            <div className="card">
              <h3 className="font-semibold text-vedic-gold mb-2">Tristubh (11-11-11-11)</h3>
              <p className="text-sm text-vedic-light/70 mb-2">Longer meter for extended compositions</p>
              <div className="text-xs font-mono bg-vedic-deep/50 p-2 rounded">
                ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ | ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ | ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ | ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰ ⏰
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Display Controls",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Settings className="h-12 w-12 text-vedic-gold mx-auto mb-3" />
            <h2 className="text-xl font-bold text-vedic-gold">Customize Your View</h2>
            <p className="text-vedic-light/80 mt-2">
              Toggle between different text formats to suit your reading preference
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold text-vedic-gold mb-3">Display Options</h3>
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={toggleSanskrit}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                    showSanskrit 
                      ? 'bg-vedic-gold text-vedic-deep' 
                      : 'text-vedic-light/70 hover:text-vedic-gold border border-vedic-gold/20'
                  }`}
                >
                  Sanskrit
                </button>
                <button
                  onClick={toggleTransliteration}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                    showTransliteration 
                      ? 'bg-vedic-gold text-vedic-deep' 
                      : 'text-vedic-light/70 hover:text-vedic-gold border border-vedic-gold/20'
                  }`}
                >
                  IAST
                </button>
                <button
                  onClick={toggleTranslation}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                    showTranslation 
                      ? 'bg-vedic-gold text-vedic-deep' 
                      : 'text-vedic-light/70 hover:text-vedic-gold border border-vedic-gold/20'
                  }`}
                >
                  Translation
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="card">
                <h4 className="font-semibold text-vedic-gold mb-2">Sanskrit</h4>
                <p className="text-sm text-vedic-light/70">Original Devanagari script</p>
              </div>
              <div className="card">
                <h4 className="font-semibold text-vedic-gold mb-2">IAST</h4>
                <p className="text-sm text-vedic-light/70">Roman transliteration</p>
              </div>
              <div className="card">
                <h4 className="font-semibold text-vedic-gold mb-2">Translation</h4>
                <p className="text-sm text-vedic-light/70">English translation</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Explore!",
      content: (
        <div className="text-center space-y-6">
          <div className="mb-6">
            <Sparkles className="h-16 w-16 text-vedic-gold mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-vedic-gold mb-2">You're All Set!</h2>
            <p className="text-vedic-light/80">
              Start your journey through the Rig Veda. Try different features and discover the ancient wisdom.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="card">
              <h3 className="font-semibold text-vedic-gold mb-2">🎯 Quick Start</h3>
              <p className="text-sm text-vedic-light/70">Begin with the first hymn (1.1.1) to Agni</p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-vedic-gold mb-2">🌐 Deity Network</h3>
              <p className="text-sm text-vedic-light/70">Visualize relationships between gods</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-4xl mx-4 bg-vedic-deep border border-vedic-gold/20 rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-vedic-gold/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-vedic-gold text-vedic-deep rounded-full flex items-center justify-center font-bold">
              {currentStep + 1}
            </div>
            <h1 className="text-xl font-bold text-vedic-gold">
              {steps[currentStep].title}
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-vedic-light/70 hover:text-vedic-gold transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[currentStep].content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-vedic-gold/20">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-vedic-light/70 hover:text-vedic-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-vedic-gold' : 'bg-vedic-light/30'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="flex items-center space-x-2 btn-primary"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
