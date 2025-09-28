import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  BookOpen, 
  TrendingUp, 
  Hash,
  BarChart3,
  Eye,
  Copy
} from 'lucide-react';
import { sampleHymns } from '../data/sample-data';
import { ConcordanceResult } from '../types/vedic';

const Concordance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'word' | 'phrase' | 'epithet'>('word');
  const [sortBy, setSortBy] = useState<'frequency' | 'alphabetical' | 'context'>('frequency');
  const [selectedResult, setSelectedResult] = useState<ConcordanceResult | null>(null);

  const concordanceResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const results: { [key: string]: ConcordanceResult } = {};
    const lowercaseSearch = searchTerm.toLowerCase();

    sampleHymns.forEach(hymn => {
      hymn.verses.forEach(verse => {
        // Search in Sanskrit
        if (verse.sanskrit.toLowerCase().includes(lowercaseSearch)) {
          const matches = verse.sanskrit.match(new RegExp(searchTerm, 'gi'));
          if (matches) {
            matches.forEach(match => {
              if (!results[match]) {
                results[match] = {
                  term: match,
                  frequency: 0,
                  contexts: [],
                  collocations: {}
                };
              }
              results[match].frequency++;
              results[match].contexts.push({
                hymnId: hymn.id,
                verseNumber: verse.number,
                text: verse.sanskrit,
                position: verse.sanskrit.toLowerCase().indexOf(match.toLowerCase())
              });
            });
          }
        }

        // Search in transliteration
        if (verse.transliteration.toLowerCase().includes(lowercaseSearch)) {
          const matches = verse.transliteration.match(new RegExp(searchTerm, 'gi'));
          if (matches) {
            matches.forEach(match => {
              if (!results[match]) {
                results[match] = {
                  term: match,
                  frequency: 0,
                  contexts: [],
                  collocations: {}
                };
              }
              results[match].frequency++;
              results[match].contexts.push({
                hymnId: hymn.id,
                verseNumber: verse.number,
                text: verse.transliteration,
                position: verse.transliteration.toLowerCase().indexOf(match.toLowerCase())
              });
            });
          }
        }

        // Search in translations
        Object.values(verse.translations).forEach(translation => {
          if (translation && translation.toLowerCase().includes(lowercaseSearch)) {
            const matches = translation.match(new RegExp(searchTerm, 'gi'));
            if (matches) {
              matches.forEach(match => {
                if (!results[match]) {
                  results[match] = {
                    term: match,
                    frequency: 0,
                    contexts: [],
                    collocations: {}
                  };
                }
                results[match].frequency++;
                results[match].contexts.push({
                  hymnId: hymn.id,
                  verseNumber: verse.number,
                  text: translation,
                  position: translation.toLowerCase().indexOf(match.toLowerCase())
                });
              });
            }
          }
        });
      });

      // Search in epithets
      if (searchType === 'epithet') {
        hymn.epithets.forEach(epithet => {
          if (epithet.toLowerCase().includes(lowercaseSearch)) {
            if (!results[epithet]) {
              results[epithet] = {
                term: epithet,
                frequency: 0,
                contexts: [],
                collocations: {}
              };
            }
            results[epithet].frequency++;
            results[epithet].contexts.push({
              hymnId: hymn.id,
              verseNumber: 1,
              text: `${hymn.devata} - ${epithet}`,
              position: 0
            });
          }
        });
      }
    });

    // Calculate collocations
    Object.values(results).forEach(result => {
      result.contexts.forEach(context => {
        const words = context.text.split(/\s+/);
        words.forEach((word) => {
          if (word.toLowerCase() !== result.term.toLowerCase()) {
            const normalizedWord = word.toLowerCase().replace(/[^\w]/g, '');
            if (normalizedWord.length > 2) {
              result.collocations[normalizedWord] = (result.collocations[normalizedWord] || 0) + 1;
            }
          }
        });
      });
    });

    return Object.values(results);
  }, [searchTerm, searchType]);

  const sortedResults = useMemo(() => {
    const sorted = [...concordanceResults];
    
    switch (sortBy) {
      case 'frequency':
        return sorted.sort((a, b) => b.frequency - a.frequency);
      case 'alphabetical':
        return sorted.sort((a, b) => a.term.localeCompare(b.term));
      case 'context':
        return sorted.sort((a, b) => a.contexts.length - b.contexts.length);
      default:
        return sorted;
    }
  }, [concordanceResults, sortBy]);

  const getTopCollocations = (result: ConcordanceResult) => {
    return Object.entries(result.collocations)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
  };

  const highlightTerm = (text: string, term: string) => {
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark class="bg-vedic-gold/30 text-vedic-gold px-1 rounded">$1</mark>');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

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
              <h1 className="text-4xl font-bold text-vedic-gold mb-2">Concordance</h1>
              <p className="text-vedic-light/70">Search n-grams, epithets, and explore word relationships across the Rig Veda</p>
            </div>
          </div>

          {/* Search Controls */}
          <div className="card">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-vedic-light/50" />
                  <input
                    type="text"
                    placeholder="Search for words, phrases, or epithets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-vedic-deep/50 border border-vedic-gold/20 rounded-lg text-vedic-light placeholder-vedic-light/50 focus:outline-none focus:border-vedic-gold"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-vedic-gold" />
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as any)}
                    className="px-3 py-3 bg-vedic-deep/50 border border-vedic-gold/20 rounded-lg text-vedic-light focus:outline-none focus:border-vedic-gold"
                  >
                    <option value="word">Word</option>
                    <option value="phrase">Phrase</option>
                    <option value="epithet">Epithet</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-vedic-gold" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-3 bg-vedic-deep/50 border border-vedic-gold/20 rounded-lg text-vedic-light focus:outline-none focus:border-vedic-gold"
                  >
                    <option value="frequency">By Frequency</option>
                    <option value="alphabetical">Alphabetical</option>
                    <option value="context">By Context</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Results List */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-vedic-gold">
                  Results ({sortedResults.length})
                </h2>
                {sortedResults.length > 0 && (
                  <div className="text-sm text-vedic-light/70">
                    Total: {sortedResults.reduce((sum, r) => sum + r.frequency, 0)} occurrences
                  </div>
                )}
              </div>

              {sortedResults.length === 0 ? (
                <div className="card text-center py-8">
                  <Search className="h-12 w-12 text-vedic-gold mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-vedic-gold mb-2">No Results Found</h3>
                  <p className="text-vedic-light/70">
                    Try searching for different terms or adjust your search type.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
                  {sortedResults.map((result, index) => (
                    <motion.div
                      key={result.term}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedResult(result)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedResult?.term === result.term
                          ? 'bg-vedic-gold text-vedic-deep'
                          : 'bg-vedic-deep/50 hover:bg-vedic-gold/10 text-vedic-light'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{result.term}</div>
                          <div className="text-sm opacity-70">
                            {result.frequency} occurrence{result.frequency !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{result.contexts.length}</div>
                          <div className="text-xs opacity-70">contexts</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Context Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {selectedResult ? (
                <div className="space-y-6">
                  {/* Term Header */}
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-vedic-gold mb-2">
                          "{selectedResult.term}"
                        </h2>
                        <div className="flex items-center space-x-4 text-sm text-vedic-light/70">
                          <div className="flex items-center space-x-1">
                            <Hash className="h-4 w-4" />
                            <span>{selectedResult.frequency} occurrences</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{selectedResult.contexts.length} contexts</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => copyToClipboard(selectedResult.term)}
                        className="p-2 bg-vedic-gold/10 border border-vedic-gold/20 rounded-lg text-vedic-gold hover:bg-vedic-gold/20 transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Collocations */}
                  {Object.keys(selectedResult.collocations).length > 0 && (
                    <div className="card">
                      <h3 className="text-lg font-semibold text-vedic-gold mb-4 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Top Collocations
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {getTopCollocations(selectedResult).map(([word, count]) => (
                          <div key={word} className="flex items-center justify-between p-2 bg-vedic-deep/50 rounded">
                            <span className="text-vedic-light">{word}</span>
                            <span className="text-sm text-vedic-gold font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contexts */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-vedic-gold mb-4 flex items-center">
                      <Eye className="h-5 w-5 mr-2" />
                      Contexts
                    </h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
                      {selectedResult.contexts.map((context, index) => (
                        <div key={index} className="p-4 bg-vedic-deep/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-vedic-gold">
                                {context.hymnId}
                              </span>
                              <span className="text-xs text-vedic-light/70">
                                Verse {context.verseNumber}
                              </span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(context.text)}
                              className="p-1 text-vedic-light/70 hover:text-vedic-gold transition-colors"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                          <div 
                            className="text-vedic-light leading-relaxed"
                            dangerouslySetInnerHTML={{ 
                              __html: highlightTerm(context.text, selectedResult.term) 
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card text-center py-12">
                  <BookOpen className="h-16 w-16 text-vedic-gold mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-vedic-gold mb-2">Select a Term</h3>
                  <p className="text-vedic-light/70">
                    Choose a term from the results to see detailed context and collocations.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Concordance;
