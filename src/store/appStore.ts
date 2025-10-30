import { create } from 'zustand';
import { AppState, Hymn, Playlist, StudyCard } from '../types/vedic';
import { sampleHymns } from '../data/sample-data';

interface AppStore extends AppState {
  // State
  hymns: Hymn[];
  playlists: Playlist[];
  studyCards: StudyCard[];
  showOnboarding: boolean;
  
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

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  hymns: sampleHymns,
  playlists: [],
  studyCards: [],
  showOnboarding: false,
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
