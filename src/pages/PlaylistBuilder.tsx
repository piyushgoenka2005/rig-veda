import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  List, 
  Plus, 
  Search, 
  Play,
  Trash2,
  Edit,
  Share2,
  BookOpen,
  Star,
  Clock,
  Users
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { sampleHymns } from '../data/sample-data';
import { Playlist as PlaylistType } from '../types/vedic';

const PlaylistBuilder: React.FC = () => {
  const { playlists, addPlaylist, updatePlaylist, deletePlaylist } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    description: '',
    theme: '',
    hymns: [] as string[]
  });
  const [isEditing, setIsEditing] = useState(false);

  const filteredHymns = useMemo(() => {
    if (!searchTerm.trim()) return sampleHymns;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return sampleHymns.filter(hymn => 
      hymn.id.toLowerCase().includes(lowercaseSearch) ||
      hymn.rishi.toLowerCase().includes(lowercaseSearch) ||
      hymn.devata.toLowerCase().includes(lowercaseSearch) ||
      hymn.meter.toLowerCase().includes(lowercaseSearch) ||
      hymn.themes.some(theme => theme.toLowerCase().includes(lowercaseSearch)) ||
      hymn.deities.some(deity => deity.toLowerCase().includes(lowercaseSearch))
    );
  }, [searchTerm]);

  const createPlaylist = () => {
    if (!newPlaylist.name.trim() || newPlaylist.hymns.length === 0) return;

    const playlist: PlaylistType = {
      id: Date.now().toString(),
      name: newPlaylist.name,
      description: newPlaylist.description,
      hymns: newPlaylist.hymns,
      theme: newPlaylist.theme,
      createdBy: 'User',
      createdAt: new Date()
    };

    addPlaylist(playlist);
    setNewPlaylist({
      name: '',
      description: '',
      theme: '',
      hymns: []
    });
    setIsCreating(false);
    setSelectedPlaylist(playlist);
  };

  const updatePlaylistData = () => {
    if (!selectedPlaylist) return;

    updatePlaylist(selectedPlaylist.id, {
      name: newPlaylist.name,
      description: newPlaylist.description,
      theme: newPlaylist.theme,
      hymns: newPlaylist.hymns
    });

    setIsEditing(false);
  };

  const addHymnToPlaylist = (hymnId: string) => {
    if (!newPlaylist.hymns.includes(hymnId)) {
      setNewPlaylist(prev => ({
        ...prev,
        hymns: [...prev.hymns, hymnId]
      }));
    }
  };

  const removeHymnFromPlaylist = (hymnId: string) => {
    setNewPlaylist(prev => ({
      ...prev,
      hymns: prev.hymns.filter(id => id !== hymnId)
    }));
  };

  const getHymnById = (id: string) => {
    return sampleHymns.find(h => h.id === id);
  };

  const startEditing = (playlist: PlaylistType) => {
    setSelectedPlaylist(playlist);
    setNewPlaylist({
      name: playlist.name,
      description: playlist.description,
      theme: playlist.theme,
      hymns: playlist.hymns
    });
    setIsEditing(true);
  };

  const getPlaylistStats = () => {
    const totalHymns = playlists.reduce((sum, p) => sum + p.hymns.length, 0);
    const avgHymnsPerPlaylist = playlists.length > 0 ? totalHymns / playlists.length : 0;
    
    return {
      totalPlaylists: playlists.length,
      totalHymns,
      avgHymnsPerPlaylist: Math.round(avgHymnsPerPlaylist * 10) / 10
    };
  };

  const stats = getPlaylistStats();

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
              <h1 className="text-4xl font-bold text-vedic-gold mb-2">Playlist Builder</h1>
              <p className="text-vedic-light/70">Create and share curated collections of Rig Veda hymns</p>
            </div>
            
            <button
              onClick={() => setIsCreating(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Playlist</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card text-center">
              <div className="text-2xl font-bold text-vedic-gold">{stats.totalPlaylists}</div>
              <div className="text-sm text-vedic-light/70">Total Playlists</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-vedic-gold">{stats.totalHymns}</div>
              <div className="text-sm text-vedic-light/70">Total Hymns</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-vedic-gold">{stats.avgHymnsPerPlaylist}</div>
              <div className="text-sm text-vedic-light/70">Avg Hymns/Playlist</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Playlists List */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl font-bold text-vedic-gold mb-4">Your Playlists</h2>
              
              {playlists.length === 0 ? (
                <div className="card text-center py-8">
                  <List className="h-12 w-12 text-vedic-gold mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-vedic-gold mb-2">No Playlists Yet</h3>
                  <p className="text-vedic-light/70 mb-4">
                    Create your first playlist to organize your favorite hymns.
                  </p>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="btn-primary"
                  >
                    Create Playlist
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {playlists.map((playlist, index) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedPlaylist(playlist)}
                      className={`card cursor-pointer transition-all duration-300 ${
                        selectedPlaylist?.id === playlist.id
                          ? 'border-vedic-gold bg-vedic-gold/10'
                          : 'hover:border-vedic-gold/40'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-vedic-gold mb-1">{playlist.name}</h3>
                          <p className="text-sm text-vedic-light/70 line-clamp-2">
                            {playlist.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(playlist);
                            }}
                            className="p-1 text-vedic-light/70 hover:text-vedic-gold transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePlaylist(playlist.id);
                              if (selectedPlaylist?.id === playlist.id) {
                                setSelectedPlaylist(null);
                              }
                            }}
                            className="p-1 text-vedic-light/70 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-vedic-light/70">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{playlist.hymns.length} hymns</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{playlist.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4" />
                          <span>{playlist.theme}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Playlist Editor/Viewer */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {selectedPlaylist && !isCreating && !isEditing ? (
                <div className="space-y-6">
                  {/* Playlist Header */}
                  <div className="card">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-vedic-gold mb-2">
                          {selectedPlaylist.name}
                        </h2>
                        <p className="text-vedic-light/80 leading-relaxed">
                          {selectedPlaylist.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEditing(selectedPlaylist)}
                          className="p-2 bg-vedic-gold/10 border border-vedic-gold/20 rounded-lg text-vedic-gold hover:bg-vedic-gold/20 transition-colors"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button className="p-2 bg-vedic-gold/10 border border-vedic-gold/20 rounded-lg text-vedic-gold hover:bg-vedic-gold/20 transition-colors">
                          <Share2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-vedic-light/70">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{selectedPlaylist.hymns.length} hymns</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>by {selectedPlaylist.createdBy}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{selectedPlaylist.createdAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4" />
                        <span>{selectedPlaylist.theme}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hymns List */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-vedic-gold mb-4">Hymns in this Playlist</h3>
                    <div className="space-y-3">
                      {selectedPlaylist.hymns.map((hymnId, index) => {
                        const hymn = getHymnById(hymnId);
                        if (!hymn) return null;
                        
                        return (
                          <div key={hymnId} className="flex items-center justify-between p-3 bg-vedic-deep/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-vedic-gold/20 text-vedic-gold rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium text-vedic-gold">{hymn.id} - {hymn.devata}</div>
                                <div className="text-sm text-vedic-light/70">by {hymn.rishi}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-vedic-light/70 hover:text-vedic-gold transition-colors">
                                <Play className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Playlist Form */}
                  <div className="card">
                    <h2 className="text-2xl font-bold text-vedic-gold mb-6">
                      {isCreating ? 'Create New Playlist' : 'Edit Playlist'}
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-vedic-gold mb-2">
                          Playlist Name
                        </label>
                        <input
                          type="text"
                          value={newPlaylist.name}
                          onChange={(e) => setNewPlaylist(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter playlist name..."
                          className="w-full px-4 py-3 bg-vedic-deep/50 border border-vedic-gold/20 rounded-lg text-vedic-light placeholder-vedic-light/50 focus:outline-none focus:border-vedic-gold"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-vedic-gold mb-2">
                          Description
                        </label>
                        <textarea
                          value={newPlaylist.description}
                          onChange={(e) => setNewPlaylist(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your playlist..."
                          className="w-full px-4 py-3 bg-vedic-deep/50 border border-vedic-gold/20 rounded-lg text-vedic-light placeholder-vedic-light/50 focus:outline-none focus:border-vedic-gold h-24 resize-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-vedic-gold mb-2">
                          Theme
                        </label>
                        <input
                          type="text"
                          value={newPlaylist.theme}
                          onChange={(e) => setNewPlaylist(prev => ({ ...prev, theme: e.target.value }))}
                          placeholder="e.g., Fire, Dawn, Battle..."
                          className="w-full px-4 py-3 bg-vedic-deep/50 border border-vedic-gold/20 rounded-lg text-vedic-light placeholder-vedic-light/50 focus:outline-none focus:border-vedic-gold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hymn Search */}
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-vedic-gold">Add Hymns</h3>
                      <div className="text-sm text-vedic-light/70">
                        {newPlaylist.hymns.length} hymns selected
                      </div>
                    </div>
                    
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-vedic-light/50" />
                      <input
                        type="text"
                        placeholder="Search hymns..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-vedic-deep/50 border border-vedic-gold/20 rounded-lg text-vedic-light placeholder-vedic-light/50 focus:outline-none focus:border-vedic-gold"
                      />
                    </div>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                      {filteredHymns.map(hymn => (
                        <div key={hymn.id} className="flex items-center justify-between p-3 bg-vedic-deep/50 rounded-lg">
                          <div>
                            <div className="font-medium text-vedic-gold">{hymn.id} - {hymn.devata}</div>
                            <div className="text-sm text-vedic-light/70">by {hymn.rishi} • {hymn.meter}</div>
                          </div>
                          <button
                            onClick={() => 
                              newPlaylist.hymns.includes(hymn.id)
                                ? removeHymnFromPlaylist(hymn.id)
                                : addHymnToPlaylist(hymn.id)
                            }
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              newPlaylist.hymns.includes(hymn.id)
                                ? 'bg-vedic-gold text-vedic-deep'
                                : 'bg-vedic-deep/50 text-vedic-light/70 hover:text-vedic-gold'
                            }`}
                          >
                            {newPlaylist.hymns.includes(hymn.id) ? 'Remove' : 'Add'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-4">
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setIsEditing(false);
                        setSelectedPlaylist(null);
                        setNewPlaylist({
                          name: '',
                          description: '',
                          theme: '',
                          hymns: []
                        });
                      }}
                      className="px-6 py-3 text-vedic-light/70 hover:text-vedic-gold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={isCreating ? createPlaylist : updatePlaylistData}
                      disabled={!newPlaylist.name.trim() || newPlaylist.hymns.length === 0}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreating ? 'Create Playlist' : 'Update Playlist'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistBuilder;
