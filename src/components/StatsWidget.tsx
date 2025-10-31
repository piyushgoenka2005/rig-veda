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
      className="card hover:border-vedic-gold/50 transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-vedic-gold/20 rounded-lg group-hover:bg-vedic-gold/30 transition-colors">
          <Icon className="h-6 w-6 text-vedic-gold" />
        </div>
        {link && (
          <ArrowRight className="h-5 w-5 text-vedic-gold/50 group-hover:text-vedic-gold group-hover:translate-x-1 transition-all" />
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-3xl font-bold text-vedic-gold">
          {typeof value === 'number' ? displayValue.toLocaleString() : value}
        </p>
        <p className="text-sm font-medium text-vedic-light/90">{label}</p>
        {description && (
          <p className="text-xs text-vedic-light/60 mt-2">{description}</p>
        )}
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
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-vedic-gold mb-3">
            Explore the Numbers
          </h2>
          <p className="text-vedic-light/70 max-w-2xl mx-auto">
            Discover the scale and depth of the Rig Veda collection
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

