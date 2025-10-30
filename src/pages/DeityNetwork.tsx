import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import SectionOverlay from '../components/SectionOverlay';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Info, 
  X,
  Star,
  Users,
  Zap,
  Network
} from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { sampleDeities } from '../data/sample-data';
import { Deity } from '../types/vedic';
import { Link } from 'react-router-dom';
import { computeForceLayout, loadPersistedPositions, persistPositions, GraphNode, GraphLink } from '../utils/forceLayout';

interface NodeProps {
  deity: Deity;
  position: [number, number, number];
  isSelected: boolean;
  isDimmed: boolean;
  isHovered: boolean;
  showLabel: boolean;
  onClick: () => void;
  onHover: (id: string | null) => void;
}

const Node: React.FC<NodeProps> = ({ deity, position, isSelected, isDimmed, isHovered, showLabel, onClick, onHover }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const getDeityColor = () => {
    // Color coding based on deity type
    if (deity.name === 'Indra' || deity.name === 'Maruts' || deity.name === 'Rudra') {
      return '#F44336'; // Red - Warrior/storm deities
    } else if (deity.name === 'Surya' || deity.name === 'Mitra' || deity.name === 'Ushas') {
      return '#D4AF37'; // Gold - Solar deities
    } else if (deity.name === 'Varuna' || deity.name === 'Saraswati') {
      return '#2196F3'; // Blue - Water/cosmic deities
    } else if (deity.name === 'Soma') {
      return '#9C27B0'; // Purple - Sacred plant
    } else if (deity.name === 'Ashvins' || deity.name === 'Vishnu') {
      return '#4CAF50'; // Green - Healing/protective
    } else if (deity.name === 'Agni') {
      return '#FF6B35'; // Orange-red - Fire
    } else {
      return '#D4AF37'; // Default gold
    }
  };

  const baseColor = getDeityColor();
  const color = isSelected ? '#FF9933' : baseColor;
  const size = isSelected ? 0.8 : Math.max(0.3, Math.min(0.7, deity.frequency / 400));

  // Gentle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position}>
      {/* Glow effect */}
      <Sphere args={[size + 0.2]} position={[0, 0, 0]}>
        <meshBasicMaterial color={color} transparent opacity={isSelected ? 0.5 : 0.2} />
      </Sphere>
      
      {/* Main sphere */}
      <Sphere 
        ref={meshRef} 
        args={[size]} 
        position={[0, 0, 0]}
        onClick={onClick}
        onPointerOver={(e) => { e.stopPropagation(); onHover(deity.id); }}
        onPointerOut={(e) => { e.stopPropagation(); onHover(null); }}
      >
        <meshStandardMaterial 
          color={color} 
          metalness={0.3} 
          roughness={0.4}
          emissive={color}
          emissiveIntensity={isSelected || isHovered ? 0.4 : 0.1}
          transparent
          opacity={isDimmed ? 0.35 : 1}
        />
      </Sphere>
      
      {/* Deity name */}
      {showLabel && (
        <Text
          position={[0, size + 0.3, 0]}
          fontSize={0.14}
          color="#D4AF37"
          anchorX="center"
          anchorY="middle"
        >
          {deity.name}
        </Text>
      )}
      
      {/* Frequency indicator */}
      {!isDimmed && (
        <Text
          position={[0, -size - 0.2, 0]}
          fontSize={0.08}
          color="#FF9933"
          anchorX="center"
          anchorY="middle"
        >
          {deity.frequency} hymns
        </Text>
      )}

      {/* Tooltip */}
      {isHovered && (
        <Html distanceFactor={10} position={[0, size + 0.6, 0]}>
          <div className="px-3 py-2 bg-vedic-deep/90 border border-vedic-gold/30 rounded-lg text-xs text-vedic-light shadow-lg">
            <div className="font-semibold text-vedic-gold">{deity.name}</div>
            <div>Frequency: {deity.frequency}</div>
            <div className="opacity-80">{deity.epithets.slice(0, 3).join(', ')}</div>
          </div>
        </Html>
      )}
    </group>
  );
};

interface EdgeProps {
  start: [number, number, number];
  end: [number, number, number];
  strength: number;
  type: string;
  dimmed: boolean;
  highlighted: boolean;
}

const Edge: React.FC<EdgeProps> = ({ start, end, strength, type, dimmed, highlighted }) => {
  const getColor = () => {
    switch (type) {
      case 'partnership': return '#FF9800'; // Orange - Mythological partnerships
      case 'familial': return '#D4AF37'; // Gold - Familial/hierarchical
      case 'alliance': return '#4CAF50'; // Green - Functional alliances
      case 'complementary': return '#2196F3'; // Blue - Cosmic complementarity
      case 'ritual': return '#9C27B0'; // Purple - Ritual associations
      default: return '#9E9E9E'; // Gray - Unknown
    }
  };

  const points = [start, end];
  const baseOpacity = 0.25 + strength * 0.6;
  const opacity = dimmed ? 0.15 : highlighted ? 1 : baseOpacity;
  const lineWidth = highlighted ? Math.max(2.5, strength * 5) : Math.max(1, strength * 3);

  return (
    <Line
      points={points}
      color={getColor()}
      opacity={opacity}
      lineWidth={lineWidth}
    />
  );
};

const DeityNetwork: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeity, setSelectedDeity] = useState<Deity | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeTypes, setActiveTypes] = useState<string[]>(['partnership', 'familial', 'alliance', 'complementary', 'ritual']);
  const [minStrength, setMinStrength] = useState(0);
  const [topN, setTopN] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedDeity(null); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const filteredDeities = useMemo(() => {
    const base = sampleDeities.filter(deity => {
      const matchesSearch = deity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deity.epithets.some(epithet => epithet.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch && deity.relationships.some(rel => activeTypes.includes(rel.type) && rel.strength >= (minStrength / 100));
    });
    if (topN && topN > 0) {
      return [...base].sort((a, b) => b.frequency - a.frequency).slice(0, topN);
    }
    return base;
  }, [searchTerm, activeTypes, minStrength, topN]);

  // Graph nodes & force layout
  const categoryOf = (d: Deity) => {
    if (['Indra', 'Maruts', 'Rudra'].includes(d.name)) return 'storm';
    if (['Surya', 'Mitra', 'Ushas'].includes(d.name)) return 'solar';
    if (['Varuna', 'Saraswati'].includes(d.name)) return 'water';
    if (['Soma'].includes(d.name)) return 'elixir';
    if (['Ashvins', 'Vishnu'].includes(d.name)) return 'protector';
    if (['Agni'].includes(d.name)) return 'fire';
    return 'other';
  };

  const graphNodes: GraphNode[] = useMemo(() => {
    return filteredDeities.map((d) => ({ id: d.id, category: categoryOf(d), size: Math.max(5, Math.min(18, d.frequency / 10)) }));
  }, [filteredDeities]);

  const graphLinks: GraphLink[] = useMemo(() => {
    const map: { [key: string]: { source: string; target: string; strength: number } } = {};
    filteredDeities.forEach((d) => {
      d.relationships.forEach((r) => {
        if (!activeTypes.includes(r.type) || r.strength < (minStrength / 100)) return;
        if (!filteredDeities.find(fd => fd.id === r.target)) return;
        const a = d.id; const b = r.target; const key = a < b ? `${a}__${b}` : `${b}__${a}`;
        const ex = map[key];
        map[key] = { source: a, target: b, strength: Math.max(ex?.strength || 0, r.strength) };
      });
    });
    return Object.values(map);
  }, [filteredDeities, activeTypes, minStrength]);

  const persisted = useMemo(() => loadPersistedPositions('deity-layout-v1'), []);
  const nodePositions = useMemo(() => {
    const pos = computeForceLayout(graphNodes, graphLinks, persisted || undefined, 200);
    const out: { [key: string]: [number, number, number] } = {};
    Object.entries(pos).forEach(([id, p]) => { out[id] = [p.x, p.y, p.z]; });
    return out;
  }, [graphNodes, graphLinks, persisted]);

  useEffect(() => {
    const flat = Object.fromEntries(Object.entries(nodePositions).map(([id, arr]) => [id, { x: arr[0], y: arr[1], z: arr[2] }]));
    persistPositions('deity-layout-v1', flat);
  }, [nodePositions]);

  const edges = useMemo(() => {
    const list: Array<{ start: [number, number, number]; end: [number, number, number]; strength: number; type: string; pair: string }>[] = [] as any;
    const pushEdge = (a: string, b: string, strength: number, type: string) => {
      const start = nodePositions[a];
      const end = nodePositions[b];
      if (!start || !end) return;
      (list as any).push({ start, end, strength, type, pair: a < b ? `${a}__${b}` : `${b}__${a}` });
    };
    filteredDeities.forEach((d) => d.relationships.forEach((r) => {
      if (!activeTypes.includes(r.type) || r.strength < (minStrength / 100)) return;
      if (!filteredDeities.find(fd => fd.id === r.target)) return;
      pushEdge(d.id, r.target, r.strength, r.type);
    }));
    const dedup: Record<string, { start: [number, number, number]; end: [number, number, number]; strength: number; type: string }> = {};
    (list as any).forEach((e: any) => {
      const ex = dedup[e.pair];
      if (!ex || e.strength > ex.strength) dedup[e.pair] = { start: e.start, end: e.end, strength: e.strength, type: e.type };
    });
    return Object.values(dedup);
  }, [filteredDeities, nodePositions, activeTypes, minStrength]);

  const handleNodeClick = (deity: Deity) => {
    setSelectedDeity(selectedDeity?.id === deity.id ? null : deity);
  };

  const neighbors = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    filteredDeities.forEach((d) => {
      map[d.id] = map[d.id] || new Set<string>();
      d.relationships.forEach((r) => {
        if (!filteredDeities.find(fd => fd.id === r.target)) return;
        (map[d.id] = map[d.id] || new Set()).add(r.target);
        (map[r.target] = map[r.target] || new Set()).add(d.id);
      });
    });
    return map;
  }, [filteredDeities]);

  const fitToSelection = useCallback(() => {
    if (!selectedDeity || !controlsRef.current) return;
    const pos = nodePositions[selectedDeity.id];
    if (!pos) return;
    const controls = controlsRef.current;
    controls.target.set(pos[0], pos[1], pos[2]);
    const cam = controls.object;
    cam.position.set(pos[0] + 0, pos[1] + 0, pos[2] + 8);
    controls.update();
  }, [selectedDeity, nodePositions]);

  const getRelationshipStats = () => {
    const stats = {
      total: 0,
      partnerships: 0,
      familial: 0,
      alliances: 0,
      complementary: 0,
      ritual: 0
    };
    
    sampleDeities.forEach(deity => {
      deity.relationships.forEach(rel => {
        stats.total++;
        if (rel.type in stats) {
          stats[rel.type as keyof typeof stats]++;
        }
      });
    });
    
    return stats;
  };

  const stats = getRelationshipStats();

  return (
    <div className="min-h-screen bg-transparent relative" role="application" aria-label="Vedic Deity Network Graph">
      <SectionOverlay opacity={48} blur="sm" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div aria-live="polite" className="sr-only">{selectedDeity ? `Selected ${selectedDeity.name}` : ''}</div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-vedic-gold mb-4">Vedic Deity Network</h1>
            <p className="text-xl text-vedic-light/80 mb-6 max-w-3xl mx-auto">
              Discover how the ancient Vedic gods are connected through mythology, rituals, and cosmic relationships
            </p>
            
            {/* Quick Start Guide */}
            <div className="bg-vedic-gold/10 border border-vedic-gold/20 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-vedic-gold mb-4">🎯 How to Explore</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-vedic-gold text-vedic-deep rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold text-vedic-gold mb-1">Click on any deity</h3>
                    <p className="text-sm text-vedic-light/70">Learn about their role, epithets, and relationships</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-vedic-gold text-vedic-deep rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold text-vedic-gold mb-1">Follow the colored lines</h3>
                    <p className="text-sm text-vedic-light/70">See how gods are connected through different types of relationships</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-vedic-gold text-vedic-deep rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold text-vedic-gold mb-1">Use filters</h3>
                    <p className="text-sm text-vedic-light/70">Focus on specific types of relationships or search for deities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-vedic-deep/30 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-vedic-gold mb-4">🔍 Explore & Filter</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-vedic-gold mb-2">
                    Search for a deity
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-vedic-light/50" />
                    <input
                      type="text"
                      placeholder="Try: Indra, Agni, Soma..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-vedic-deep/50 border border-vedic-gold/20 rounded-lg text-vedic-light placeholder-vedic-light/50 focus:outline-none focus:border-vedic-gold"
                    />
                  </div>
                </div>
                <div className="md:w-64">
                  <label className="block text-sm font-medium text-vedic-gold mb-2">Relationship types</label>
                  <div className="relative pl-8">
                    <Filter className="absolute left-0 top-1 h-5 w-5 text-vedic-gold" />
                    <div className="grid grid-cols-2 gap-2">
                      {['partnership','familial','alliance','complementary','ritual'].map(t => (
                        <label key={t} className="flex items-center space-x-2 text-vedic-light/80">
                          <input
                            type="checkbox"
                            checked={activeTypes.includes(t)}
                            onChange={(e) => setActiveTypes(s => e.target.checked ? [...s, t] : s.filter(x => x !== t))}
                          />
                          <span className="capitalize">{t}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-vedic-gold mb-2">Min. strength: {minStrength}%</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={minStrength}
                    onChange={(e) => setMinStrength(parseInt(e.target.value))}
                    className="w-full slider"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-vedic-gold mb-2">Top N by frequency (0 = all)</label>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={topN}
                    onChange={(e) => setTopN(parseInt(e.target.value || '0'))}
                    className="w-full px-3 py-2 bg-vedic-deep/50 border border-vedic-gold/20 rounded-lg text-vedic-light focus:outline-none focus:border-vedic-gold"
                  />
                </div>
                <div className="flex items-end gap-3">
                  <button onClick={() => setAutoRotate(v => !v)} className="px-4 py-2 bg-vedic-gold/10 border border-vedic-gold/20 rounded-lg text-vedic-gold">
                    {autoRotate ? 'Disable' : 'Enable'} Auto-rotate
                  </button>
                  <button onClick={() => { setSearchTerm(''); setActiveTypes(['partnership','familial','alliance','complementary','ritual']); setMinStrength(0); setTopN(0); setSelectedDeity(null); }} className="px-4 py-2 bg-vedic-gold/10 border border-vedic-gold/20 rounded-lg text-vedic-gold">
                    Reset
                  </button>
                  <button onClick={fitToSelection} className="px-4 py-2 bg-vedic-gold text-vedic-deep rounded-lg">Fit to selection</button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-vedic-gold/20 to-vedic-saffron/20 border border-vedic-gold/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-vedic-gold mb-1">{filteredDeities.length}</div>
              <div className="text-vedic-light/80 font-medium">Vedic Deities</div>
              <div className="text-xs text-vedic-light/60 mt-1">Click any sphere to explore</div>
            </div>
            <div className="bg-gradient-to-r from-vedic-saffron/20 to-vedic-crimson/20 border border-vedic-saffron/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-vedic-saffron mb-1">{stats.total}</div>
              <div className="text-vedic-light/80 font-medium">Mythological Connections</div>
              <div className="text-xs text-vedic-light/60 mt-1">See the colored lines</div>
            </div>
            <div className="bg-gradient-to-r from-vedic-crimson/20 to-pink-500/20 border border-vedic-crimson/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-vedic-crimson mb-1">{Math.max(...Object.values(stats).slice(1))}</div>
              <div className="text-vedic-light/80 font-medium">Most Common Type</div>
              <div className="text-xs text-vedic-light/60 mt-1">Partnerships & alliances</div>
            </div>
          </div>
        </motion.div>

        {/* 3D Network Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="bg-vedic-deep/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-vedic-gold">🌐 3D Deity Network Map</h3>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="flex items-center space-x-2 px-4 py-2 bg-vedic-gold/10 border border-vedic-gold/20 rounded-lg text-vedic-gold hover:bg-vedic-gold/20 transition-colors"
              >
                <Info className="h-4 w-4" />
                <span className="text-sm">Legend</span>
              </button>
            </div>
            
            <div className="relative h-96 md:h-[600px] rounded-lg overflow-hidden bg-vedic-deep/50 border border-vedic-gold/20">
              <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={0.6} />
                <pointLight position={[-10, -10, -10]} intensity={0.3} />
                
                {/* Controls */}
                <OrbitControls 
                  ref={controlsRef}
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  autoRotate={autoRotate}
                  autoRotateSpeed={0.4}
                  minDistance={5}
                  maxDistance={20}
                />
                
                {/* Edges */}
                {edges.map((edge, index) => {
                  const a = selectedDeity?.id;
                  const dimmed = a ? false : false;
                  // Simple highlight: if selected, highlight edges connected to neighbors
                  let highlighted = false;
                  if (a) {
                    const selPos = nodePositions[a];
                    highlighted = (edge.start === selPos || edge.end === selPos);
                  }
                  return (
                    <Edge
                      key={index}
                      start={edge.start}
                      end={edge.end}
                      strength={edge.strength}
                      type={edge.type}
                      dimmed={a ? !highlighted : false}
                      highlighted={!!highlighted}
                    />
                  );
                })}
                
                {/* Nodes */}
                {filteredDeities.map(deity => {
                  const pos = nodePositions[deity.id];
                  if (!pos) return null;
                  const isSel = selectedDeity?.id === deity.id;
                  const neighborSet = selectedDeity ? neighbors[selectedDeity.id] : undefined;
                  const isNeighbor = selectedDeity ? neighborSet?.has(deity.id) : false;
                  const isDimmed = selectedDeity ? !(isSel || isNeighbor) : false;
                  const showLabel = isSel || hoveredId === deity.id;
                  return (
                    <Node
                      key={deity.id}
                      deity={deity}
                      position={pos}
                      isSelected={isSel}
                      isDimmed={!!isDimmed}
                      isHovered={hoveredId === deity.id}
                      showLabel={!!showLabel}
                      onHover={(id) => setHoveredId(id)}
                      onClick={() => handleNodeClick(deity)}
                    />
                  );
                })}
              </Canvas>
              {/* Floating legend overlay */}
              <div className="absolute top-3 left-3 bg-vedic-deep/70 border border-vedic-gold/30 rounded-lg px-3 py-2 text-xs text-vedic-light flex items-center gap-2">
                {['partnership','familial','alliance','complementary','ritual'].map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTypes(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t])}
                    className={`px-2 py-1 rounded ${activeTypes.includes(t) ? 'bg-vedic-gold text-vedic-deep' : 'bg-transparent border border-vedic-gold/30 text-vedic-light'}`}
                    title={`Toggle ${t}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quick Legend */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-vedic-light/80">Partnerships</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-vedic-light/80">Familial</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-vedic-light/80">Alliances</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-vedic-light/80">Complementary</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-vedic-light/80">Ritual</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Selected Deity Info */}
        {selectedDeity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-vedic-deep/30 rounded-xl p-6 border border-vedic-gold/20"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-vedic-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-vedic-gold">{selectedDeity.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-vedic-gold">{selectedDeity.name}</h2>
                    <p className="text-vedic-light/60">Featured in {selectedDeity.frequency} hymns</p>
                  </div>
                </div>
                <p className="text-vedic-light/80 leading-relaxed text-lg">{selectedDeity.description}</p>
              </div>
              <button
                onClick={() => setSelectedDeity(null)}
                className="p-3 bg-vedic-gold/10 border border-vedic-gold/20 rounded-lg text-vedic-gold hover:bg-vedic-gold/20 transition-colors"
                title="Close details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Epithets */}
              <div>
                <h3 className="text-xl font-semibold text-vedic-gold mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Sacred Names & Titles
                </h3>
                <p className="text-sm text-vedic-light/60 mb-4">These are the special names and titles used to invoke this deity</p>
                <div className="space-y-2">
                  {selectedDeity.epithets.map(epithet => (
                    <div key={epithet} className="p-3 bg-vedic-deep/50 rounded-lg border border-vedic-gold/10">
                      <span className="text-vedic-light font-medium">{epithet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relationships */}
              <div>
                <h3 className="text-xl font-semibold text-vedic-gold mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Divine Connections
                </h3>
                <p className="text-sm text-vedic-light/60 mb-4">How this deity relates to other gods in the Vedic pantheon</p>
                <div className="space-y-3">
                  {selectedDeity.relationships.map((rel, index) => {
                    const targetDeity = sampleDeities.find(d => d.id === rel.target);
                    return (
                      <div key={index} className="p-4 bg-vedic-deep/50 rounded-lg border border-vedic-gold/10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-vedic-light text-lg">{targetDeity?.name || rel.target}</span>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            rel.type === 'partnership' ? 'bg-orange-500/20 text-orange-400' :
                            rel.type === 'familial' ? 'bg-yellow-500/20 text-yellow-400' :
                            rel.type === 'alliance' ? 'bg-green-500/20 text-green-400' :
                            rel.type === 'complementary' ? 'bg-blue-500/20 text-blue-400' :
                            rel.type === 'ritual' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {rel.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-vedic-light/60">Connection strength:</span>
                          <div className="flex-1 bg-vedic-deep/30 rounded-full h-3">
                            <div 
                              className="bg-vedic-gold h-3 rounded-full transition-all duration-300"
                              style={{ width: `${rel.strength * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-vedic-gold">{Math.round(rel.strength * 100)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Hymns */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-vedic-gold mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Featured in {selectedDeity.frequency} Hymns
              </h3>
              <p className="text-sm text-vedic-light/60 mb-4">This deity appears in these specific hymns of the Rig Veda</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {selectedDeity.hymns.map(hymnId => (
                  <Link key={hymnId} to={`/hymn/${hymnId}`} className="p-3 bg-vedic-deep/50 rounded-lg text-center hover:bg-vedic-gold/10 transition-colors border border-vedic-gold/10">
                    <span className="text-vedic-gold font-medium">{hymnId}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Info Panel */}
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-vedic-deep/30 rounded-xl p-6 mt-8 border border-vedic-gold/20"
          >
            <h3 className="text-2xl font-bold text-vedic-gold mb-6">📚 Understanding the 3D Vedic Deity Network</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-vedic-gold mb-4 flex items-center">
                  <Network className="h-5 w-5 mr-2" />
                  How to Explore in 3D
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-vedic-gold text-vedic-deep rounded-full flex items-center justify-center font-bold text-xs">1</div>
                    <div>
                      <p className="font-medium text-vedic-light">Click and drag to rotate</p>
                      <p className="text-sm text-vedic-light/70">View the network from any angle</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-vedic-gold text-vedic-deep rounded-full flex items-center justify-center font-bold text-xs">2</div>
                    <div>
                      <p className="font-medium text-vedic-light">Scroll to zoom in/out</p>
                      <p className="text-sm text-vedic-light/70">Get closer or see the big picture</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-vedic-gold text-vedic-deep rounded-full flex items-center justify-center font-bold text-xs">3</div>
                    <div>
                      <p className="font-medium text-vedic-light">Right-click and drag to pan</p>
                      <p className="text-sm text-vedic-light/70">Move around the 3D space</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-vedic-gold text-vedic-deep rounded-full flex items-center justify-center font-bold text-xs">4</div>
                    <div>
                      <p className="font-medium text-vedic-light">Click on any sphere</p>
                      <p className="text-sm text-vedic-light/70">Learn about that deity</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-vedic-gold mb-4">🌈 Relationship Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-vedic-light">Partnerships</p>
                      <p className="text-sm text-vedic-light/70">Gods who work together (Indra & Maruts)</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-vedic-light">Familial</p>
                      <p className="text-sm text-vedic-light/70">Family relationships (Surya & Ushas)</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-vedic-light">Alliances</p>
                      <p className="text-sm text-vedic-light/70">Battle partnerships (Indra & Vishnu)</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-vedic-light">Complementary</p>
                      <p className="text-sm text-vedic-light/70">Opposite but related (Sun & Fire)</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-vedic-light">Ritual</p>
                      <p className="text-sm text-vedic-light/70">Connected in ceremonies (Agni & Soma)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DeityNetwork;