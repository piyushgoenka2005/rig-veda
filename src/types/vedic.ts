export interface Hymn {
  id: string;
  mandala: number;
  sukta: number;
  rishi: string;
  devata: string;
  meter: string;
  verses: Verse[];
  themes: string[];
  deities: string[];
  epithets: string[];
  places: string[];
  ritualContext?: string;
}

export interface Verse {
  id: string;
  number: number;
  sanskrit: string;
  transliteration: string;
  translations: {
    wilson?: string;
    griffith?: string;
    jamison?: string;
    sayana?: string;
  };
  meter: string;
  syllables: number[];
  audioUrl?: string;
  commentary?: string;
}

export interface Deity {
  id: string;
  name: string;
  epithets: string[];
  hymns: string[];
  frequency: number;
  relationships: DeityRelationship[];
  description: string;
  icon?: string;
}

export interface DeityRelationship {
  target: string;
  type: 'partnership' | 'familial' | 'alliance' | 'complementary' | 'ritual';
  strength: number;
  verses: string[];
}

export interface Theme {
  id: string;
  name: string;
  keywords: string[];
  hymns: string[];
  intensity: number;
  color: string;
  description: string;
}

export interface Meter {
  id: string;
  name: string;
  pattern: string;
  syllables: number;
  description: string;
  examples: string[];
}

export interface Rishi {
  id: string;
  name: string;
  family: string;
  hymns: string[];
  period?: string;
  description: string;
}

export interface Place {
  id: string;
  name: string;
  type: 'river' | 'mountain' | 'region' | 'tribe';
  hymns: string[];
  coordinates?: [number, number];
  uncertainty?: boolean;
  description: string;
}

export interface ConcordanceResult {
  term: string;
  frequency: number;
  contexts: ConcordanceContext[];
  collocations: { [key: string]: number };
}

export interface ConcordanceContext {
  hymnId: string;
  verseNumber: number;
  text: string;
  position: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  hymns: string[];
  theme: string;
  createdBy: string;
  createdAt: Date;
}

export interface StudyCard {
  id: string;
  type: 'verse' | 'epithet' | 'meter' | 'deity';
  front: string;
  back: string;
  difficulty: number;
  lastReviewed?: Date;
  interval: number;
}

export interface AppState {
  currentHymn: Hymn | null;
  selectedDeities: string[];
  activeThemes: string[];
  viewMode: 'parallel' | 'layered' | 'network' | 'concordance';
  showSanskrit: boolean;
  showTransliteration: boolean;
  showTranslation: boolean;
  audioEnabled: boolean;
  currentPlaylist: Playlist | null;
  studyMode: boolean;
}
