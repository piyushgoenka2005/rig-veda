import { create } from 'zustand';
import { AppState, Hymn, Playlist, StudyCard } from '../types/vedic';
import { sampleHymns } from '../data/sample-data';

interface ProgressState {
  readHymns: Set<string>;
  mandalasExplored: Set<number>;
  deitiesExplored: Set<string>;
  readingStreak: number;
  lastReadDate: string | null;
  achievements: string[];
}

interface AppStore extends AppState {
  // State
  hymns: Hymn[];
  playlists: Playlist[];
  studyCards: StudyCard[];
  showOnboarding: boolean;
  progress: ProgressState;
  
  // Actions
  setCurrentHymn: (hymn: Hymn | null) => void;
  setSelectedDeities: (deities: string[]) => void;
  setActiveThemes: (themes: string[]) => void;
  setViewMode: (mode: AppState['viewMode']) => void;
  toggleSanskrit: () => void;
  toggleTransliteration: () => void;
  toggleTranslation: () => void;
  toggleAudio: () => void;
  setCurrentPlaylist: (playlist: Playlist | null) => void;
  setStudyMode: (enabled: boolean) => void;
  setShowOnboarding: (show: boolean) => void;
  
  // Progress actions
  markHymnRead: (hymnId: string) => void;
  updateReadingStreak: () => void;
  unlockAchievement: (achievement: string) => void;
  
  // Data actions
  addPlaylist: (playlist: Playlist) => void;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
  addStudyCard: (card: StudyCard) => void;
  updateStudyCard: (id: string, updates: Partial<StudyCard>) => void;
  
  // Utility actions
  getHymnById: (id: string) => Hymn | undefined;
  getHymnsByDeity: (deity: string) => Hymn[];
  getHymnsByTheme: (theme: string) => Hymn[];
  searchHymns: (query: string) => Hymn[];
}

// Load progress from localStorage
const loadProgress = (): ProgressState => {
  try {
    const saved = localStorage.getItem('rigveda-progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        readHymns: new Set(parsed.readHymns || []),
        mandalasExplored: new Set(parsed.mandalasExplored || []),
        deitiesExplored: new Set(parsed.deitiesExplored || []),
        readingStreak: parsed.readingStreak || 0,
        lastReadDate: parsed.lastReadDate || null,
        achievements: parsed.achievements || []
      };
    }
  } catch (e) {
    console.error('Error loading progress:', e);
  }
  return {
    readHymns: new Set(),
    mandalasExplored: new Set(),
    deitiesExplored: new Set(),
    readingStreak: 0,
    lastReadDate: null,
    achievements: []
  };
};

// Save progress to localStorage
const saveProgress = (progress: ProgressState) => {
  try {
    localStorage.setItem('rigveda-progress', JSON.stringify({
      readHymns: Array.from(progress.readHymns),
      mandalasExplored: Array.from(progress.mandalasExplored),
      deitiesExplored: Array.from(progress.deitiesExplored),
      readingStreak: progress.readingStreak,
      lastReadDate: progress.lastReadDate,
      achievements: progress.achievements
    }));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
};

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  hymns: sampleHymns,
  playlists: [],
  studyCards: [],
  showOnboarding: false,
  progress: loadProgress(),
  currentHymn: null,
  selectedDeities: [],
  activeThemes: [],
  viewMode: 'parallel',
  showSanskrit: true,
  showTransliteration: true,
  showTranslation: true,
  audioEnabled: true,
  currentPlaylist: null,
  studyMode: false,
  
  // Actions
  setCurrentHymn: (hymn) => set({ currentHymn: hymn }),
  setSelectedDeities: (deities) => set({ selectedDeities: deities }),
  setActiveThemes: (themes) => set({ activeThemes: themes }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleSanskrit: () => set((state) => ({ showSanskrit: !state.showSanskrit })),
  toggleTransliteration: () => set((state) => ({ showTransliteration: !state.showTransliteration })),
  toggleTranslation: () => set((state) => ({ showTranslation: !state.showTranslation })),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
  setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),
  setStudyMode: (enabled) => set({ studyMode: enabled }),
  setShowOnboarding: (show) => set({ showOnboarding: show }),
  
  // Progress actions
  markHymnRead: (hymnId) => {
    const hymn = get().getHymnById(hymnId);
    if (!hymn) return;
    
    set((state) => {
      const newProgress = {
        ...state.progress,
        readHymns: new Set([...state.progress.readHymns, hymnId]),
        mandalasExplored: new Set([...state.progress.mandalasExplored, hymn.mandala]),
        deitiesExplored: new Set([...state.progress.deitiesExplored, ...hymn.deities])
      };
      
      // Update reading streak
      const today = new Date().toISOString().split('T')[0];
      if (newProgress.lastReadDate !== today) {
        const lastDate = newProgress.lastReadDate ? new Date(newProgress.lastReadDate) : null;
        const todayDate = new Date(today);
        
        if (lastDate) {
          const diffTime = todayDate.getTime() - lastDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            // Consecutive day
            newProgress.readingStreak += 1;
          } else if (diffDays > 1) {
            // Streak broken
            newProgress.readingStreak = 1;
          }
        } else {
          newProgress.readingStreak = 1;
        }
        
        newProgress.lastReadDate = today;
      }
      
      saveProgress(newProgress);
      return { progress: newProgress };
    });
    
    // Check for achievements
    const progress = get().progress;
    const achievements = [...progress.achievements];
    
    if (progress.readHymns.size === 1 && !achievements.includes('first-hymn')) {
      get().unlockAchievement('first-hymn');
    }
    if (progress.readHymns.size === 10 && !achievements.includes('hymn-reader')) {
      get().unlockAchievement('hymn-reader');
    }
    if (progress.mandalasExplored.size === 10 && !achievements.includes('all-mandalas')) {
      get().unlockAchievement('all-mandalas');
    }
    if (progress.readingStreak === 7 && !achievements.includes('week-streak')) {
      get().unlockAchievement('week-streak');
    }
  },
  
  updateReadingStreak: () => {
    // Called on app load to update streak
    set((state) => {
      const today = new Date().toISOString().split('T')[0];
      const lastDate = state.progress.lastReadDate ? new Date(state.progress.lastReadDate) : null;
      const todayDate = new Date(today);
      
      if (lastDate && lastDate.toISOString().split('T')[0] !== today) {
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
          const newProgress = {
            ...state.progress,
            readingStreak: 0
          };
          saveProgress(newProgress);
          return { progress: newProgress };
        }
      }
      return state;
    });
  },
  
  unlockAchievement: (achievement) => {
    set((state) => {
      if (state.progress.achievements.includes(achievement)) return state;
      
      const newProgress = {
        ...state.progress,
        achievements: [...state.progress.achievements, achievement]
      };
      saveProgress(newProgress);
      return { progress: newProgress };
    });
  },
  
  // Data actions
  addPlaylist: (playlist) => set((state) => ({ 
    playlists: [...state.playlists, playlist] 
  })),
  updatePlaylist: (id, updates) => set((state) => ({
    playlists: state.playlists.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  deletePlaylist: (id) => set((state) => ({
    playlists: state.playlists.filter(p => p.id !== id)
  })),
  addStudyCard: (card) => set((state) => ({
    studyCards: [...state.studyCards, card]
  })),
  updateStudyCard: (id, updates) => set((state) => ({
    studyCards: state.studyCards.map(c => c.id === id ? { ...c, ...updates } : c)
  })),
  
  // Utility actions
  getHymnById: (id) => get().hymns.find(h => h.id === id),
  getHymnsByDeity: (deity) => get().hymns.filter(h => h.deities.includes(deity)),
  getHymnsByTheme: (theme) => get().hymns.filter(h => h.themes.includes(theme)),
  searchHymns: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return get().hymns.filter(hymn => 
      hymn.id.toLowerCase().includes(lowercaseQuery) ||
      hymn.rishi.toLowerCase().includes(lowercaseQuery) ||
      hymn.devata.toLowerCase().includes(lowercaseQuery) ||
      hymn.meter.toLowerCase().includes(lowercaseQuery) ||
      hymn.themes.some(theme => theme.toLowerCase().includes(lowercaseQuery)) ||
      hymn.deities.some(deity => deity.toLowerCase().includes(lowercaseQuery)) ||
      hymn.verses.some(verse => 
        verse.sanskrit.toLowerCase().includes(lowercaseQuery) ||
        verse.transliteration.toLowerCase().includes(lowercaseQuery) ||
        Object.values(verse.translations).some(trans => 
          trans?.toLowerCase().includes(lowercaseQuery)
        )
      )
    );
  }
}));
