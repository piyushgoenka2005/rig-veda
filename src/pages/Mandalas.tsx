import React from 'react';
import SectionOverlay from '../components/SectionOverlay';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Flame, Sun, Sparkles, Feather, Leaf, Cloud, Star, Compass, Crown } from 'lucide-react';

const Mandalas: React.FC = () => {
  const mandalas = Array.from({ length: 10 }, (_, i) => i + 1);
  const icons = [BookOpen, Flame, Sun, Sparkles, Feather, Leaf, Cloud, Star, Compass, Crown];

  return (
    <div className="min-h-screen bg-transparent relative">
      <SectionOverlay opacity={48} blur="sm" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-4xl md:text-5xl font-bold text-vedic-gold mb-10 text-glow"
        >
          <span className="inline-block px-4 py-2 rounded-xl bg-black/40 backdrop-blur-sm">Mandalas</span>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mandalas.map((num, idx) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <Link to={`/mandala/${num}`} className="block group">
                <div className="card relative flex items-center justify-between px-6 py-6 border border-vedic-gold/20 transition-all duration-300
                  hover:border-vedic-gold/50 hover:shadow-xl hover:shadow-vedic-gold/10 hover:-translate-y-0.5">
                  {/* sheen */}
                  <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r from-vedic-gold to-transparent" />
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-300 to-vedic-gold/80 shadow-inner flex items-center justify-center">
                      {(() => {
                        const Icon = icons[(num - 1) % icons.length];
                        return <Icon className="h-6 w-6 text-vedic-deep" />;
                      })()}
                    </div>
                    <span className="text-2xl font-semibold text-vedic-gold">Mandala {num}</span>
                  </div>
                  <div className="text-vedic-gold/50 text-3xl leading-none transform group-hover:translate-x-1 transition-transform">›</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mandalas;


