import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Plus, 
  Check, 
  X, 
  Star,
  BookOpen,
  Shuffle
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { StudyCard } from '../types/vedic';

const StudyMode: React.FC = () => {
  const { studyCards, addStudyCard, updateStudyCard } = useAppStore();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState<'review' | 'new' | 'all'>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [newCard, setNewCard] = useState({
    type: 'verse' as StudyCard['type'],
    front: '',
    back: '',
    difficulty: 3
  });

  const filteredCards = useMemo(() => {
    const now = new Date();
    
    switch (studyMode) {
      case 'review':
        return studyCards.filter(card => 
          card.lastReviewed && 
          new Date(card.lastReviewed.getTime() + card.interval * 24 * 60 * 60 * 1000) <= now
        );
      case 'new':
        return studyCards.filter(card => !card.lastReviewed);
      default:
        return studyCards;
    }
  }, [studyCards, studyMode]);

  const currentCard = filteredCards[currentCardIndex];

  const handleAnswer = (correct: boolean) => {
    if (!currentCard) return;

    const now = new Date();
    let newInterval = currentCard.interval;
    let newDifficulty = currentCard.difficulty;

    if (correct) {
      newInterval = Math.min(newInterval * 2, 30); // Max 30 days
      newDifficulty = Math.max(newDifficulty - 1, 1);
    } else {
      newInterval = 1; // Review tomorrow
      newDifficulty = Math.min(newDifficulty + 1, 5);
    }

    updateStudyCard(currentCard.id, {
      lastReviewed: now,
      interval: newInterval,
      difficulty: newDifficulty
    });

    setShowAnswer(false);
    setCurrentCardIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const createCard = () => {
    if (!newCard.front.trim() || !newCard.back.trim()) return;

    const card: StudyCard = {
      id: Date.now().toString(),
      type: newCard.type,
      front: newCard.front,
      back: newCard.back,
      difficulty: newCard.difficulty,
      interval: 1,
      lastReviewed: undefined
    };

    addStudyCard(card);
    setNewCard({
      type: 'verse',
      front: '',
      back: '',
      difficulty: 3
    });
    setIsCreating(false);
  };

  const shuffleCards = () => {
    setCurrentCardIndex(0);
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-green-400';
      case 2: return 'text-blue-400';
      case 3: return 'text-yellow-400';
      case 4: return 'text-orange-400';
      case 5: return 'text-red-400';
      default: return 'text-vedic-gold';
    }
  };

  const getNextReviewDate = (card: StudyCard) => {
    if (!card.lastReviewed) return 'New';
    const nextReview = new Date(card.lastReviewed.getTime() + card.interval * 24 * 60 * 60 * 1000);
    return nextReview.toLocaleDateString();
  };

  const getStats = () => {
    const total = studyCards.length;
    const reviewed = studyCards.filter(card => card.lastReviewed).length;
    const due = filteredCards.length;
    const avgDifficulty = studyCards.length > 0 
      ? studyCards.reduce((sum, card) => sum + card.difficulty, 0) / studyCards.length 
      : 0;

    return { total, reviewed, due, avgDifficulty };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-vedic-deep">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-vedic-gold mb-2">Study Mode</h1>
              <p className="text-vedic-light/70">Master the Rig Veda with spaced repetition flashcards</p>
            </div>
            
            <button
              onClick={() => setIsCreating(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Card</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card text-center">
              <div className="text-2xl font-bold text-vedic-gold">{stats.total}</div>
              <div className="text-sm text-vedic-light/70">Total Cards</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-vedic-gold">{stats.reviewed}</div>
              <div className="text-sm text-vedic-light/70">Reviewed</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-vedic-gold">{stats.due}</div>
              <div className="text-sm text-vedic-light/70">Due Today</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-vedic-gold">
                {Math.round(stats.avgDifficulty * 10) / 10}
              </div>
              <div className="text-sm text-vedic-light/70">Avg Difficulty</div>
            </div>
          </div>
        </motion.div>

        {/* Study Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-2 bg-vedic-deep/50 rounded-lg p-1">
            <button
              onClick={() => setStudyMode('all')}
              className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                studyMode === 'all' 
                  ? 'bg-vedic-gold text-vedic-deep' 
                  : 'text-vedic-light/70 hover:text-vedic-gold'
              }`}
            >
              All Cards
            </button>
            <button
              onClick={() => setStudyMode('review')}
              className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                studyMode === 'review' 
                  ? 'bg-vedic-gold text-vedic-deep' 
                  : 'text-vedic-light/70 hover:text-vedic-gold'
              }`}
            >
              Review Due
            </button>
            <button
              onClick={() => setStudyMode('new')}
              className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                studyMode === 'new' 
                  ? 'bg-vedic-gold text-vedic-deep' 
                  : 'text-vedic-light/70 hover:text-vedic-gold'
              }`}
            >
              New Cards
            </button>
          </div>
        </motion.div>

        {/* Study Interface */}
        {filteredCards.length > 0 ? (
          <motion.div
            key={currentCardIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-8"
          >
            <div className="card">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-vedic-gold" />
                    <span className="text-sm text-vedic-light/70">
                      Card {currentCardIndex + 1} of {filteredCards.length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className={`h-4 w-4 ${getDifficultyColor(currentCard.difficulty)}`} />
                    <span className="text-sm text-vedic-light/70">
                      Difficulty: {currentCard.difficulty}/5
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={shuffleCards}
                    className="p-2 text-vedic-light/70 hover:text-vedic-gold transition-colors"
                    title="Shuffle"
                  >
                    <Shuffle className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-vedic-light/70">
                    Next: {getNextReviewDate(currentCard)}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="min-h-[300px] flex flex-col justify-center">
                <div className="text-center mb-8">
                  <div className="text-lg font-medium text-vedic-gold mb-4">
                    {currentCard.type.charAt(0).toUpperCase() + currentCard.type.slice(1)}
                  </div>
                  <div className="text-2xl font-semibold text-vedic-light mb-6">
                    {currentCard.front}
                  </div>
                  
                  {!showAnswer ? (
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="btn-primary"
                    >
                      Show Answer
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-xl text-vedic-light/90 leading-relaxed">
                        {currentCard.back}
                      </div>
                      
                      <div className="flex items-center justify-center space-x-4">
                        <button
                          onClick={() => handleAnswer(false)}
                          className="flex items-center space-x-2 px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          <X className="h-5 w-5" />
                          <span>Incorrect</span>
                        </button>
                        <button
                          onClick={() => handleAnswer(true)}
                          className="flex items-center space-x-2 px-6 py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                        >
                          <Check className="h-5 w-5" />
                          <span>Correct</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-12"
          >
            <Brain className="h-16 w-16 text-vedic-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold text-vedic-gold mb-2">No Cards Available</h3>
            <p className="text-vedic-light/70 mb-6">
              {studyMode === 'review' 
                ? "No cards are due for review. Great job!"
                : studyMode === 'new'
                ? "No new cards to study. Create some cards to get started!"
                : "No study cards created yet. Create your first card to begin learning."
              }
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="btn-primary"
            >
              Create First Card
            </button>
          </motion.div>
        )}

        {/* Create Card Modal */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-2xl mx-4 bg-vedic-deep border border-vedic-gold/20 rounded-2xl shadow-2xl"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-vedic-gold mb-6">Create Study Card</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-vedic-gold mb-2">
                        Card Type
                      </label>
                      <select
                        value={newCard.type}
                        onChange={(e) => setNewCard(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full px-4 py-3 bg-vedic-deep/50 border border-vedic-gold/20 rounded-lg text-vedic-light focus:outline-none focus:border-vedic-gold"
                      >
                        <option value="verse">Verse</option>
                        <option value="epithet">Epithet</option>
                        <option value="meter">Meter</option>
                        <option value="deity">Deity</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-vedic-gold mb-2">
                        Front (Question)
                      </label>
                      <textarea
                        value={newCard.front}
                        onChange={(e) => setNewCard(prev => ({ ...prev, front: e.target.value }))}
                        placeholder="Enter the question or prompt..."
                        className="w-full px-4 py-3 bg-vedic-deep/50 border border-vedic-gold/20 rounded-lg text-vedic-light placeholder-vedic-light/50 focus:outline-none focus:border-vedic-gold h-24 resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-vedic-gold mb-2">
                        Back (Answer)
                      </label>
                      <textarea
                        value={newCard.back}
                        onChange={(e) => setNewCard(prev => ({ ...prev, back: e.target.value }))}
                        placeholder="Enter the answer or explanation..."
                        className="w-full px-4 py-3 bg-vedic-deep/50 border border-vedic-gold/20 rounded-lg text-vedic-light placeholder-vedic-light/50 focus:outline-none focus:border-vedic-gold h-24 resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-vedic-gold mb-2">
                        Initial Difficulty (1-5)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={newCard.difficulty}
                        onChange={(e) => setNewCard(prev => ({ ...prev, difficulty: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-vedic-light/70 mt-1">
                        <span>Easy</span>
                        <span className="text-vedic-gold font-medium">{newCard.difficulty}</span>
                        <span>Hard</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-4 mt-8">
                    <button
                      onClick={() => setIsCreating(false)}
                      className="px-6 py-3 text-vedic-light/70 hover:text-vedic-gold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createCard}
                      disabled={!newCard.front.trim() || !newCard.back.trim()}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Card
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudyMode;
