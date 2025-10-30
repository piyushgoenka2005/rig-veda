import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Network, 
  Search, 
  Brain,
  Menu,
  X,
  Sparkles,
  Settings
} from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';

const Header: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setShowOnboarding } = useAppStore();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/hymn/1.1.1', label: 'Hymn Viewer', icon: BookOpen },
    { path: '/deities', label: 'Deity Network', icon: Network },
    { path: '/concordance', label: 'Concordance', icon: Search },
    { path: '/study', label: 'Study Mode', icon: Brain },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-vedic-deep/95 backdrop-blur-md border-b border-vedic-gold/20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <BookOpen className="h-8 w-8 text-vedic-gold group-hover:text-vedic-saffron transition-colors" />
                <Sparkles className="h-4 w-4 text-vedic-saffron absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-vedic-gold group-hover:text-vedic-saffron transition-colors">
                  Rig Veda Explorer
                </h1>
                <p className="text-xs text-vedic-light/70">Interactive Vedic Journey</p>
              </div>
            </Link>

            {/* Navigation Items */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-vedic-gold text-vedic-deep shadow-lg'
                        : 'text-vedic-light/70 hover:text-vedic-gold hover:bg-vedic-gold/10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowOnboarding(true)}
                className="p-2 text-vedic-light/70 hover:text-vedic-gold transition-colors"
                title="Show Tutorial"
              >
                <Settings className="h-5 w-5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-vedic-light/70 hover:text-vedic-gold transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 z-50 lg:hidden">
          <div className="mx-4 bg-vedic-deep/95 backdrop-blur-md border border-vedic-gold/20 rounded-xl shadow-2xl">
            <div className="py-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-vedic-gold text-vedic-deep'
                        : 'text-vedic-light/70 hover:text-vedic-gold hover:bg-vedic-gold/10'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
