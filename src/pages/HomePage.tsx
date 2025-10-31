import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Network, 
  Search, 
  Brain, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Zap,
  Heart
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import MantraParticles from '../components/MantraParticles';
import StatsWidget from '../components/StatsWidget';

const HomePage: React.FC = () => {
  const {} = useAppStore();

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Hymn Viewer",
      description: "Read Sanskrit, transliteration, and translations side by side with audio sync",
      link: "/mandalas",
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      bgGradient: "from-orange-500/10 via-amber-500/10 to-yellow-500/10",
      emoji: "📖"
    },
    {
      icon: Network,
      title: "Deity Network",
      description: "Explore relationships between gods, epithets, and their connections",
      link: "/deities",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      bgGradient: "from-purple-500/10 via-pink-500/10 to-rose-500/10",
      emoji: "🌌"
    },
    {
      icon: Search,
      title: "Concordance",
      description: "Search n-grams, epithets, and explore word relationships",
      link: "/concordance",
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      bgGradient: "from-cyan-500/10 via-blue-500/10 to-indigo-500/10",
      emoji: "🔍"
    },
    {
      icon: Brain,
      title: "Study Mode",
      description: "Create flashcards and spaced repetition for learning",
      link: "/study",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bgGradient: "from-emerald-500/10 via-teal-500/10 to-cyan-500/10",
      emoji: "🧠"
    },
    {
      icon: BookOpen,
      title: "3D Temple Landscape",
      description: "Explore 17 Rigvedic temples in an immersive 3D world",
      link: "/landscape",
      gradient: "from-amber-500 via-orange-500 to-red-500",
      bgGradient: "from-amber-500/10 via-orange-500/10 to-red-500/10",
      emoji: "🏛️"
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Video overlay for better text readability */}
      <div className="fixed inset-0 bg-gradient-to-br from-vedic-deep/48 via-vedic-deep/48 to-vedic-deep/94 -z-[9] pointer-events-none" />
      {/* Hero Section - Redesigned for Gen Z */}
      <section className="relative min-h-[95vh] pt-24 pb-12 overflow-hidden flex items-center z-10">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-orange-900/30 animate-gradient-xy" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-900/20 to-transparent animate-gradient-x" />
        
        {/* Mantra Particles Background */}
        <MantraParticles />
        
        {/* Glowing Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-vedic-gold/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-vedic-saffron/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 mb-8 px-6 py-3 rounded-full 
                       bg-gradient-to-r from-vedic-gold/20 via-vedic-saffron/20 to-vedic-gold/20 
                       border border-vedic-gold/40 backdrop-blur-xl shadow-lg shadow-vedic-gold/20"
            >
              <Sparkles className="h-5 w-5 text-vedic-gold animate-pulse" />
              <span className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-vedic-gold to-vedic-saffron">
                Experience the Rig Veda in 30 seconds
              </span>
              <Zap className="h-5 w-5 text-vedic-saffron" />
            </motion.div>
            
            {/* Main Title with Gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight"
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-vedic-gold via-vedic-saffron to-vedic-gold animate-gradient-x">
                Rig Veda
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mt-2 animate-gradient-x" style={{ animationDelay: '1s' }}>
                Explorer
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-2xl md:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            >
              From <span className="font-bold text-vedic-gold">ancient wisdom</span> to{' '}
              <span className="font-bold text-cyan-400">modern understanding</span> in one click
            </motion.p>

            {/* Quick Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-6 mb-12"
            >
              <div className="px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  <span className="text-white/80 font-medium">10K+ Verses</span>
                </div>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <span className="text-white/80 font-medium">33 Deities</span>
                </div>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-400" />
                  <span className="text-white/80 font-medium">Free Forever</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Widget */}
      <StatsWidget />

      {/* Features Section - Modernized */}
      <section className="relative py-24">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-vedic-deep/90 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-orange-900/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <h2 className="text-5xl md:text-7xl font-black mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                  Explore the
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-vedic-gold via-vedic-saffron to-orange-400">
                  Vedic Universe
                </span>
              </h2>
            </motion.div>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Discover the Rig Veda through multiple <span className="font-bold text-vedic-gold">interactive dimensions</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              // Use full page reload for Interactive Hymn Viewer (Mandalas)
              const useFullReload = feature.link === "/mandalas";
              
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {useFullReload ? (
                    <a href="/mandalas.html" className="group block h-full">
                      <div className={`
                        relative h-full rounded-3xl p-8
                        bg-gradient-to-br ${feature.bgGradient}
                        border border-white/10 backdrop-blur-xl
                        transition-all duration-500
                        group-hover:border-white/30
                        group-hover:scale-[1.02]
                        group-hover:shadow-2xl
                        overflow-hidden
                      `}>
                        {/* Animated gradient overlay on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                        
                        {/* Glow effect */}
                        <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-6">
                            <div className={`
                              w-20 h-20 rounded-2xl
                              bg-gradient-to-br ${feature.gradient}
                              flex items-center justify-center
                              shadow-lg group-hover:scale-110 group-hover:rotate-6
                              transition-all duration-500
                            `}>
                              <span className="text-4xl">{feature.emoji}</span>
                            </div>
                            <div className={`
                              w-12 h-12 rounded-xl
                              bg-white/5 border border-white/10
                              flex items-center justify-center
                              group-hover:bg-white/10
                              transition-all duration-300
                            `}>
                              <ArrowRight className={`h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient} group-hover:translate-x-2 transition-transform`} />
                            </div>
                          </div>
                          
                          <h3 className={`
                            text-2xl font-bold mb-4
                            text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient}
                            group-hover:scale-105 transition-transform duration-300
                          `}>
                            {feature.title}
                          </h3>
                          
                          <p className="text-white/70 mb-6 leading-relaxed text-lg">
                            {feature.description}
                          </p>
                          
                          <div className={`
                            inline-flex items-center gap-2
                            text-sm font-semibold
                            text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient}
                            group-hover:gap-3 transition-all duration-300
                          `}>
                            <span>Explore Now</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <Link to={feature.link} className="group block h-full">
                      <div className={`
                        relative h-full rounded-3xl p-8
                        bg-gradient-to-br ${feature.bgGradient}
                        border border-white/10 backdrop-blur-xl
                        transition-all duration-500
                        group-hover:border-white/30
                        group-hover:scale-[1.02]
                        group-hover:shadow-2xl
                        overflow-hidden
                      `}>
                        {/* Animated gradient overlay on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                        
                        {/* Glow effect */}
                        <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-6">
                            <div className={`
                              w-20 h-20 rounded-2xl
                              bg-gradient-to-br ${feature.gradient}
                              flex items-center justify-center
                              shadow-lg group-hover:scale-110 group-hover:rotate-6
                              transition-all duration-500
                            `}>
                              <span className="text-4xl">{feature.emoji}</span>
                            </div>
                            <div className={`
                              w-12 h-12 rounded-xl
                              bg-white/5 border border-white/10
                              flex items-center justify-center
                              group-hover:bg-white/10
                              transition-all duration-300
                            `}>
                              <ArrowRight className={`h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient} group-hover:translate-x-2 transition-transform`} />
                            </div>
                          </div>
                          
                          <h3 className={`
                            text-2xl font-bold mb-4
                            text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient}
                            group-hover:scale-105 transition-transform duration-300
                          `}>
                            {feature.title}
                          </h3>
                          
                          <p className="text-white/70 mb-6 leading-relaxed text-lg">
                            {feature.description}
                          </p>
                          
                          <div className={`
                            inline-flex items-center gap-2
                            text-sm font-semibold
                            text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient}
                            group-hover:gap-3 transition-all duration-300
                          `}>
                            <span>Explore Now</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="relative py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black" />
        <div className="absolute inset-0 bg-gradient-radial from-vedic-gold/10 via-transparent to-transparent" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Glowing circle behind text */}
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-vedic-gold/10 rounded-full blur-3xl" />
            
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-vedic-gold via-vedic-saffron to-cyan-400 animate-gradient-x">
                  Ready to Begin
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
                  Your Journey?
                </span>
              </h2>
              
              <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                Start with the first hymn to Agni, explore deity relationships, 
                or dive into theme mapping. <span className="font-bold text-vedic-gold">The ancient wisdom awaits.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  to="/hymn/1.1.1" 
                  className="
                    group relative px-10 py-5 rounded-2xl
                    bg-gradient-to-r from-vedic-gold to-vedic-saffron
                    text-vedic-deep font-bold text-lg
                    shadow-2xl shadow-vedic-gold/50
                    hover:shadow-vedic-gold/70
                    hover:scale-110
                    active:scale-95
                    transition-all duration-300
                    overflow-hidden
                  "
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <BookOpen className="h-6 w-6" />
                    Read First Hymn
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-vedic-saffron to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                
                <Link 
                  to="/deities" 
                  className="
                    group px-10 py-5 rounded-2xl
                    bg-white/5 backdrop-blur-xl
                    border-2 border-white/20
                    text-white font-bold text-lg
                    hover:border-white/40
                    hover:bg-white/10
                    hover:scale-110
                    active:scale-95
                    transition-all duration-300
                  "
                >
                  <span className="flex items-center gap-3">
                    <Network className="h-6 w-6" />
                    Explore Deities
                  </span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
