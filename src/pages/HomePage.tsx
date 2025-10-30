import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Network, 
  Search, 
  Brain, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
// import BookAnimation from '../components/BookAnimation';

const HomePage: React.FC = () => {
  const {} = useAppStore();

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Hymn Viewer",
      description: "Read Sanskrit, transliteration, and translations side by side with audio sync",
      link: "/mandalas",
      color: "from-vedic-gold to-vedic-saffron"
    },
    {
      icon: Network,
      title: "Deity Network",
      description: "Explore relationships between gods, epithets, and their connections",
      link: "/deities",
      color: "from-vedic-saffron to-vedic-crimson"
    },
    {
      icon: Search,
      title: "Concordance",
      description: "Search n-grams, epithets, and explore word relationships",
      link: "/concordance",
      color: "from-pink-500 to-purple-500"
    },
    {
      icon: Brain,
      title: "Study Mode",
      description: "Create flashcards and spaced repetition for learning",
      link: "/study",
      color: "from-purple-500 to-blue-500"
    },
  ];

  // Stats removed temporarily for a cleaner hero with background video

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] pt-32 pb-20 overflow-hidden flex items-center">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        {/* Additional dark layer to improve text contrast over bright video areas */}
        <div className="absolute inset-0 bg-black/60 md:bg-black/55" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-vedic-gold/10 border border-vedic-gold/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-vedic-gold" />
              <span className="text-sm font-medium text-vedic-gold">Another way to explore the RigVeda</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-vedic-gold mb-6 text-glow">
              Rig Veda Explorer
            </h1>
            
            <p className="text-xl md:text-2xl text-vedic-light/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Journey through the ancient wisdom of the Rig Veda with interactive visualizations, 
              deity networks, and immersive hymn exploration.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/mandalas" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 whitespace-nowrap">
                <span>Start Exploring</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-black/45" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-vedic-gold mb-6">
              Explore the Vedic Universe
            </h2>
            <p className="text-xl text-vedic-light/80 max-w-3xl mx-auto">
              Discover the Rig Veda through multiple interactive dimensions, 
              from individual hymns to cosmic themes and divine relationships.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={feature.link} className="group block">
                    <div className="card hover:border-vedic-gold/40 transition-all duration-300 group-hover:scale-105">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-vedic-gold mb-3 group-hover:text-vedic-saffron transition-colors">
                        {feature.title}
                      </h3>
                      
                      <p className="text-vedic-light/70 mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      
                      <div className="flex items-center text-vedic-gold group-hover:text-vedic-saffron transition-colors">
                        <span className="font-medium">Explore</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-black/38" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-vedic-gold mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-vedic-light/80 mb-8">
              Start with the first hymn to Agni, explore deity relationships, 
              or dive into theme mapping. The ancient wisdom awaits.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/hymn/1.1.1" className="btn-primary text-lg px-8 py-4">
                Read First Hymn
              </Link>
              <Link to="/deities" className="btn-secondary text-lg px-8 py-4">
                Explore Deities
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
