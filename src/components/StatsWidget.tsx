import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/appStore';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  description?: string;
  link?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, description, link, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (typeof value === 'number') {
      const duration = 1500;
      const steps = 60;
      const increment = value / steps;
      const stepDuration = duration / steps;

      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value as any);
    }
  }, [value]);

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="
        relative rounded-2xl p-6
        bg-gradient-to-br from-white/5 via-white/5 to-white/0
        border border-white/10 backdrop-blur-xl
        hover:border-white/30
        hover:scale-105
        transition-all duration-300 
        group cursor-pointer
        overflow-hidden
      "
    >
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
            <Icon className="h-7 w-7 text-white" />
          </div>
          {link && (
            <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:border-white/30 transition-all">
              <ArrowRight className="h-5 w-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            {typeof value === 'number' ? displayValue.toLocaleString() : value}
          </p>
          <p className="text-base font-bold text-white/90">{label}</p>
          {description && (
            <p className="text-sm text-white/60 mt-2">{description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (link) {
    return (
      <Link to={link} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

const StatsWidget: React.FC = () => {
  const { hymns } = useAppStore();

  // Calculate stats
  const totalHymns = hymns.length;
  const uniqueDeities = new Set(hymns.flatMap(h => h.deities)).size;
  
  // Estimate reading time (assuming 2 minutes per hymn on average)
  const estimatedReadingTime = Math.round(totalHymns * 2);
  
  // Most popular hymn (for demo, use first hymn - in real app, track views)
  const mostPopularHymn = hymns[0];

  const stats = [
    {
      icon: BookOpen,
      label: 'Total Hymns',
      value: totalHymns,
      description: 'Available for exploration',
      link: '/mandalas',
      delay: 0
    },
    {
      icon: Users,
      label: 'Deities Covered',
      value: uniqueDeities,
      description: 'Divine beings explored',
      link: '/deities',
      delay: 0.1
    },
    {
      icon: Clock,
      label: 'Reading Time',
      value: `${estimatedReadingTime} min`,
      description: 'Estimated total reading time',
      delay: 0.2
    },
    {
      icon: TrendingUp,
      label: 'Popular Today',
      value: mostPopularHymn?.id || 'N/A',
      description: mostPopularHymn ? `Mandala ${mostPopularHymn.mandala} - ${mostPopularHymn.devata}` : 'Start exploring',
      link: mostPopularHymn ? `/hymn/${mostPopularHymn.id}` : undefined,
      delay: 0.3
    }
  ];

  return (
    <section className="relative py-12">  
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              Explore the Numbers
            </span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Discover the <span className="font-bold text-vedic-gold">scale and depth</span> of the Rig Veda collection
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsWidget;

