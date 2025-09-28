import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Layers, 
  FileText, 
  Hash,
  Users,
  Star,
  Clock,
  ArrowRight,
  Plus,
  Minus
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface MindMapNode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  stats?: {
    count: number;
    label: string;
  };
  children?: MindMapNode[];
  route?: string;
  color: string;
  position: {
    angle: number;
    distance: number;
  };
}

const mindMapData: MindMapNode[] = [
  {
    id: 'rigveda',
    name: 'Rig Veda',
    description: 'Oldest Veda with 1028 hymns',
    icon: <BookOpen className="h-6 w-6" />,
    stats: { count: 1028, label: 'Hymns' },
    color: 'from-red-500 to-orange-500',
    position: { angle: 0, distance: 200 },
    children: [
      {
        id: 'mandalas',
        name: 'Mandalas',
        description: '10 books of hymns',
        icon: <Layers className="h-5 w-5" />,
        stats: { count: 10, label: 'Books' },
        color: 'from-orange-500 to-yellow-500',
        position: { angle: 0, distance: 120 },
        children: [
          {
            id: 'mandala-1',
            name: 'Mandala 1',
            description: '191 hymns, 2006 verses',
            icon: <Hash className="h-4 w-4" />,
            stats: { count: 191, label: 'Hymns' },
            color: 'from-yellow-500 to-green-500',
            position: { angle: -30, distance: 80 },
            route: '/hymns?mandala=1'
          },
          {
            id: 'mandala-2',
            name: 'Mandala 2',
            description: '43 hymns, 429 verses',
            icon: <Hash className="h-4 w-4" />,
            stats: { count: 43, label: 'Hymns' },
            color: 'from-yellow-500 to-green-500',
            position: { angle: -15, distance: 80 },
            route: '/hymns?mandala=2'
          },
          {
            id: 'mandala-3',
            name: 'Mandala 3',
            description: '62 hymns, 617 verses',
            icon: <Hash className="h-4 w-4" />,
            stats: { count: 62, label: 'Hymns' },
            color: 'from-yellow-500 to-green-500',
            position: { angle: 0, distance: 80 },
            route: '/hymns?mandala=3'
          },
          {
            id: 'mandala-4',
            name: 'Mandala 4',
            description: '58 hymns, 589 verses',
            icon: <Hash className="h-4 w-4" />,
            stats: { count: 58, label: 'Hymns' },
            color: 'from-yellow-500 to-green-500',
            position: { angle: 15, distance: 80 },
            route: '/hymns?mandala=4'
          },
          {
            id: 'mandala-5',
            name: 'Mandala 5',
            description: '87 hymns, 727 verses',
            icon: <Hash className="h-4 w-4" />,
            stats: { count: 87, label: 'Hymns' },
            color: 'from-yellow-500 to-green-500',
            position: { angle: 30, distance: 80 },
            route: '/hymns?mandala=5'
          }
        ]
      },
      {
        id: 'total-stats',
        name: 'Statistics',
        description: 'Complete Rig Veda stats',
        icon: <Star className="h-5 w-5" />,
        color: 'from-purple-500 to-pink-500',
        position: { angle: 45, distance: 120 },
        children: [
          {
            id: 'total-hymns',
            name: 'Total Hymns',
            description: 'All hymns combined',
            icon: <FileText className="h-4 w-4" />,
            stats: { count: 1028, label: 'Hymns' },
            color: 'from-pink-500 to-red-500',
            position: { angle: 30, distance: 80 }
          },
          {
            id: 'total-verses',
            name: 'Total Verses',
            description: 'All verses combined',
            icon: <Hash className="h-4 w-4" />,
            stats: { count: 10552, label: 'Verses' },
            color: 'from-red-500 to-orange-500',
            position: { angle: 60, distance: 80 }
          }
        ]
      }
    ]
  },
  {
    id: 'yajurveda',
    name: 'Yajur Veda',
    description: 'Veda of sacrificial formulas',
    icon: <FileText className="h-6 w-6" />,
    stats: { count: 2, label: 'Recensions' },
    color: 'from-blue-500 to-cyan-500',
    position: { angle: 90, distance: 200 },
    children: [
      {
        id: 'krishna-yajurveda',
        name: 'Krishna Yajur Veda',
        description: 'Black Yajur Veda',
        icon: <BookOpen className="h-4 w-4" />,
        stats: { count: 4, label: 'Brahmanas' },
        color: 'from-cyan-500 to-teal-500',
        position: { angle: 75, distance: 80 }
      },
      {
        id: 'shukla-yajurveda',
        name: 'Shukla Yajur Veda',
        description: 'White Yajur Veda',
        icon: <BookOpen className="h-4 w-4" />,
        stats: { count: 2, label: 'Brahmanas' },
        color: 'from-teal-500 to-green-500',
        position: { angle: 105, distance: 80 }
      }
    ]
  },
  {
    id: 'samaveda',
    name: 'Sama Veda',
    description: 'Veda of melodies and chants',
    icon: <Star className="h-6 w-6" />,
    stats: { count: 1875, label: 'Verses' },
    color: 'from-green-500 to-emerald-500',
    position: { angle: 180, distance: 200 },
    children: [
      {
        id: 'archika',
        name: 'Archika',
        description: 'Collection of verses',
        icon: <FileText className="h-4 w-4" />,
        stats: { count: 585, label: 'Verses' },
        color: 'from-emerald-500 to-teal-500',
        position: { angle: 165, distance: 80 }
      },
      {
        id: 'gana',
        name: 'Gana',
        description: 'Musical arrangements',
        icon: <Star className="h-4 w-4" />,
        stats: { count: 1290, label: 'Verses' },
        color: 'from-teal-500 to-cyan-500',
        position: { angle: 195, distance: 80 }
      }
    ]
  },
  {
    id: 'atharvaveda',
    name: 'Atharva Veda',
    description: 'Veda of spells and charms',
    icon: <Users className="h-6 w-6" />,
    stats: { count: 20, label: 'Books' },
    color: 'from-purple-500 to-violet-500',
    position: { angle: 270, distance: 200 },
    children: [
      {
        id: 'kandas',
        name: 'Kandas',
        description: '20 books of spells',
        icon: <BookOpen className="h-4 w-4" />,
        stats: { count: 20, label: 'Books' },
        color: 'from-violet-500 to-purple-500',
        position: { angle: 255, distance: 80 }
      },
      {
        id: 'verses',
        name: 'Total Verses',
        description: 'All verses combined',
        icon: <Hash className="h-4 w-4" />,
        stats: { count: 5987, label: 'Verses' },
        color: 'from-purple-500 to-pink-500',
        position: { angle: 285, distance: 80 }
      }
    ]
  }
];

interface MindMapNodeProps {
  node: MindMapNode;
  centerX: number;
  centerY: number;
  isExpanded: boolean;
  onToggle: () => void;
  onNodeClick: (node: MindMapNode) => void;
  level: number;
}

const MindMapNodeComponent: React.FC<MindMapNodeProps> = ({ 
  node, 
  centerX, 
  centerY, 
  isExpanded, 
  onToggle, 
  onNodeClick,
  level 
}) => {
  const x = centerX + Math.cos((node.position.angle * Math.PI) / 180) * node.position.distance;
  const y = centerY + Math.sin((node.position.angle * Math.PI) / 180) * node.position.distance;
  
  const hasChildren = node.children && node.children.length > 0;
  const isClickable = node.route || !hasChildren;

  const nodeSize = level === 0 ? 80 : level === 1 ? 60 : 40;
  const fontSize = level === 0 ? 'text-lg' : level === 1 ? 'text-base' : 'text-sm';

  return (
    <g>
      {/* Connection Line */}
      {level > 0 && (
        <motion.line
          x1={centerX}
          y1={centerY}
          x2={x}
          y2={y}
          stroke="#D4AF37"
          strokeWidth="2"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: level * 0.1 }}
        />
      )}
      
      {/* Node Circle */}
      <motion.circle
        cx={x}
        cy={y}
        r={nodeSize / 2}
        fill={`url(#gradient-${node.id})`}
        stroke="#D4AF37"
        strokeWidth="2"
        className="cursor-pointer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: level * 0.1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => {
          if (hasChildren) {
            onToggle();
          } else if (isClickable) {
            onNodeClick(node);
          }
        }}
      />
      
      {/* Node Content */}
      <foreignObject
        x={x - nodeSize / 2}
        y={y - nodeSize / 2}
        width={nodeSize}
        height={nodeSize}
        className="pointer-events-none"
      >
        <div className="flex items-center justify-center w-full h-full text-white">
          {node.icon}
        </div>
      </foreignObject>
      
      {/* Node Label */}
      <motion.text
        x={x}
        y={y + nodeSize / 2 + 20}
        textAnchor="middle"
        className={`fill-vedic-gold font-semibold ${fontSize}`}
        initial={{ opacity: 0, y: y + nodeSize / 2 + 10 }}
        animate={{ opacity: 1, y: y + nodeSize / 2 + 20 }}
        transition={{ duration: 0.5, delay: level * 0.1 + 0.3 }}
      >
        {node.name}
      </motion.text>
      
      {/* Stats Badge */}
      {node.stats && (
        <motion.text
          x={x}
          y={y + nodeSize / 2 + 40}
          textAnchor="middle"
          className="fill-vedic-light/80 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: level * 0.1 + 0.5 }}
        >
          {node.stats.count} {node.stats.label}
        </motion.text>
      )}
      
      {/* Expand/Collapse Indicator */}
      {hasChildren && (
        <motion.foreignObject
          x={x + nodeSize / 2 - 10}
          y={y - nodeSize / 2 - 10}
          width={20}
          height={20}
          className="pointer-events-none"
        >
          <div className="flex items-center justify-center w-full h-full bg-vedic-gold rounded-full">
            {isExpanded ? (
              <Minus className="h-3 w-3 text-vedic-deep" />
            ) : (
              <Plus className="h-3 w-3 text-vedic-deep" />
            )}
          </div>
        </motion.foreignObject>
      )}
      
      {/* Children */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <>
            {node.children!.map((child) => (
              <MindMapNodeComponent
                key={child.id}
                node={child}
                centerX={x}
                centerY={y}
                isExpanded={false}
                onToggle={() => {}}
                onNodeClick={onNodeClick}
                level={level + 1}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </g>
  );
};

const Roadmap: React.FC = () => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [svgSize, setSvgSize] = useState({ width: 800, height: 600 });

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleNodeClick = (node: MindMapNode) => {
    if (node.route) {
      window.location.href = node.route;
    }
  };

  const centerX = svgSize.width / 2;
  const centerY = svgSize.height / 2;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-vedic-gold mb-4">📚 Vedic Literature Mind Map</h2>
        <p className="text-xl text-vedic-light/80 max-w-3xl mx-auto">
          Explore the complete structure of the four Vedas. Click on any node to expand and discover the ancient wisdom.
        </p>
      </div>
      
      <div className="bg-vedic-deep/30 rounded-xl p-8 border border-vedic-gold/20">
        <div className="relative overflow-hidden rounded-lg">
          <svg
            width={svgSize.width}
            height={svgSize.height}
            viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
            className="w-full h-auto"
          >
            {/* Gradient Definitions */}
            <defs>
              {mindMapData.map((node) => (
                <linearGradient key={node.id} id={`gradient-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={node.color.split(' ')[1]} />
                  <stop offset="100%" stopColor={node.color.split(' ')[3]} />
                </linearGradient>
              ))}
              {mindMapData.flatMap(node => 
                node.children?.map(child => (
                  <linearGradient key={child.id} id={`gradient-${child.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={child.color.split(' ')[1]} />
                    <stop offset="100%" stopColor={child.color.split(' ')[3]} />
                  </linearGradient>
                )) || []
              )}
            </defs>
            
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Central Node */}
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={60}
              fill="url(#gradient-center)"
              stroke="#D4AF37"
              strokeWidth="3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
              className="cursor-pointer"
            />
            
            <defs>
              <linearGradient id="gradient-center" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#FF9933" />
              </linearGradient>
            </defs>
            
            <foreignObject
              x={centerX - 30}
              y={centerY - 30}
              width={60}
              height={60}
              className="pointer-events-none"
            >
              <div className="flex items-center justify-center w-full h-full text-white">
                <BookOpen className="h-8 w-8" />
              </div>
            </foreignObject>
            
            <motion.text
              x={centerX}
              y={centerY + 50}
              textAnchor="middle"
              className="fill-vedic-gold font-bold text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Vedic Literature
            </motion.text>
            
            {/* Main Branches */}
            {mindMapData.map((node) => (
              <MindMapNodeComponent
                key={node.id}
                node={node}
                centerX={centerX}
                centerY={centerY}
                isExpanded={expandedNodes.has(node.id)}
                onToggle={() => toggleNode(node.id)}
                onNodeClick={handleNodeClick}
                level={1}
              />
            ))}
          </svg>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-vedic-light/60 text-sm">
            💡 <strong>Tip:</strong> Click on any node to expand and explore its contents. 
            The mind map shows the complete hierarchical structure of Vedic literature.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;